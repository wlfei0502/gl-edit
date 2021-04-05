import { Modes, FeatureType, ShapeConfig, PointProps, LineProps, PolygonProps, NodeProps } from './types';

import Context from './context';

import { base64ToUint8Array } from '../util/util';

import img from '../assets/texture.png';

import Point from './Point';
import Line from './line';
import Polygon from './polygon';
import Node from './node';

import pointVert from '../shaders/point.vertex.glsl';
import pointFrag from '../shaders/point.fragment.glsl';
import lineVert from '../shaders/line.vertex.glsl';
import lineFrag from '../shaders/line.fragment.glsl';
import polygonVert from '../shaders/polygon.vertex.glsl';
import polygonFrag from '../shaders/polygon.fragment.glsl';
import nodeVert from '../shaders/node.vertex.glsl';
import nodeFrag from '../shaders/node.fragment.glsl';

// 要素类型对应的要素类
const featureClasses = {
    [FeatureType.POLYGON]: Polygon,
    [FeatureType.BORDER]: Line,
    [FeatureType.LINE]: Line,
    [FeatureType.NODE]: Node,
    [FeatureType.POINT]: Point,
};

const FLOAT_BYTES = Float32Array.BYTES_PER_ELEMENT;

class Editor {
    _context: Context;
    _isPoll: boolean;
    _newFeature: any;
    _features = {};
    _featureProps = {};
    _fboFeatureProps = {};

    _drawCommand = {
        [FeatureType.POLYGON]: null,
        [FeatureType.BORDER]: null,
        [FeatureType.LINE]: null,
        [FeatureType.NODE]: null,
        [FeatureType.POINT]: null,
    }

    // 当前被选中的要素
    _pickedFeature = null;
    // 重绘
    _tick = null;
    // 拾取定时器，防止频繁拾取
    _pickTick = null;

    _mapContainer: HTMLElement;

    constructor (gl: WebGLRenderingContext, shapeConfig:ShapeConfig, mapContainer:HTMLElement) {
        this._context = new Context({
            gl,
            shapeConfig
        });

        this._mapContainer = mapContainer;

        // 初始化变量
        this._init ();

        // 事件监听初始化
        this._initializeEvent();

        // 预编译图形绘制命令
        this._initializeDrawCommand();
    }

    /**
     * 初始化变量
     */
    _init () {
        Object.values(FeatureType).forEach(featureType => {
            this._features[featureType] = [];
            this._featureProps[featureType] = [];
            this._fboFeatureProps[featureType] = [];
        });

        this._newFeature = null;
    }

    /**
     * 事件监听
     */
    _initializeEvent (): void {
        // 重绘
        this._context.on('repaint', this.repaint, this);

        // 绘制完成
        this._context.on('draw-finish', this._drawFinish, this);

        this._context.on('picked:click', this._pickedClick, this);

        // 悬浮拾取到元素
        this._context.on('picked:mousemove', this._pickedHover, this);

        // 未拾取到元素
        this._context.on('picked:mouseout', this._pickedOut, this);

        // 点击的是画布空白区域
        this._context.on('picked:clickout', this._pickedClickout, this);

        // 画布点击事件
        this._context._gl.canvas.addEventListener('click', this.pickEvent.bind(this));

        // 悬浮高亮拾取
        this._context._gl.canvas.addEventListener('mousemove', (event) => {
            if (this._pickTick) {
                clearTimeout(this._pickTick);
            }

            this._pickTick = setTimeout(() => {
                this.pickEvent(event);
                this._pickTick = null;
            }, 60);
        });

        // 纹理加载
        base64ToUint8Array(img, (data) => {
            this._context._texture = data;
            this._context.fire('textured');
        });
    }

    /**
     * 拾取事件
     * @param event 点击拾取|悬浮拾取
     */
    pickEvent (event) {
        const evt = event as PointerEvent;
        const { clientX, clientY, type } = evt;

        const { _regl, mapStatus, mode } = this._context;

        // 等待，编辑状态，不允许点击拾取
        if ((mode === Modes.WATING || mode === Modes.EDITING) && type === 'click') {
            return;
        }

        // 底图移动，不触发点击拾取动作, 否则选中效果会消失
        if (mapStatus === 'movestart' && type === 'click') {
            this._context.setMapStatus('');
            return;
        }

        // 设备像素比
        const dpr = window.devicePixelRatio;

        // const target = evt.target as HTMLElement;
        const target = this._mapContainer;
        const rect = target.getBoundingClientRect();

        const x = dpr * (clientX - rect.left);
        const y = _regl._gl.drawingBufferHeight - dpr * (clientY - rect.top);

        if (x < 0 || x >= _regl._gl.drawingBufferWidth) {
            return;
        }

        if (y < 0 || y >= _regl._gl.drawingBufferHeight) {
            return;
        }

        // 创建帧缓冲区
        const fbo = _regl.framebuffer({
            width: _regl._gl.drawingBufferWidth,
            height: _regl._gl.drawingBufferHeight,
            depth: false,
            stencil: false,
            depthStencil: false,
        });

        // 使用帧缓冲区
        _regl({ framebuffer: fbo })(()=>{

            // 重绘图形到fbo
            this.repaint({ fbo: true, drawing: false });

            let rgba = new Float32Array([0, 0, 0, 0]);

            try {
                // 拾取鼠标点击位置的颜色
                rgba = _regl.read({
                    x,
                    y,
                    width: 1,
                    height: 1
                });
            } catch (error) {
                console.log(error);
            }

            // 销毁帧缓冲区
            fbo.destroy();

            // 颜色分量组成的key
            const colorKey = rgba.join('-');
            // 颜色key对应的uuid
            const uuid = this._context.color.getUUID(colorKey);

            // 拾取到要素了
            if (uuid) {
                // 去查找拾取到哪个要素了
                this._context.fire('pick-start', { uuid, type });
            } else {
                if (type === 'mousemove') {
                    this._context.fire('picked:mouseout');
                } else if (type === 'click') {
                    this._context.fire('picked:clickout');
                }
            }
        });
    }

    /**
     * 要素悬浮事件
     * @param param0 
     */
    _pickedHover ({ feature }) {
        this._context.hover(feature.featureType, true);
    }

    /**
     * 要素离开事件
     */
    _pickedOut () {
        this._context.out();
    }

    /**
     * 点击要素，拾取
     */
    _pickedClick ({ feature }) {
        // 取消上一个被选中的要素
        this._pickedClickout();
        const featureTypeUpper = feature.featureType.toUpperCase();
        this._context.enter(Modes[`${featureTypeUpper}_SELECT`]);
        this._pickedFeature = feature;
        // 要素被选中
        this._pickedFeature.select();
    }

    /**
     * 点击画布空白区域
     */
    _pickedClickout () {
        if (~this._context.mode.indexOf('_select') === 0 
                && this._context.mode !== Modes.IDLE) {
            return;
        }

        if (this._pickedFeature) {
            this._pickedFeature.unselect();
            this._pickedFeature = null;
        }
    }

    /**
     * 初始化绘制命令
     */
    _initializeDrawCommand () {
        // 创建标面绘制命令
        this.createPolygonDrawCommand ();
        // 创建标线绘制命令
        this.createLineDrawCommand ();
        // 创建节点
        this.creatNodeDrawCommand ();
        // 创建标点绘制命令
        this.createPointDrawCommand ();
    }

    /**
     * 创建标点绘制命令
     */
    createPointDrawCommand () {
        const { _regl } = this._context;

        const uniforms = {
            model: _regl.prop<PointProps, 'modelMatrix'>('modelMatrix'),
            texture: _regl.prop<PointProps, 'texture'>('texture'),
            color: _regl.prop<PointProps, 'color'>('color'),
            fbo: _regl.prop<PointProps, 'fbo'>('fbo'),
        }

        const attributes = {
            aPosition: {
                buffer: _regl.prop<PointProps, 'positionBuffer'>('positionBuffer'),
            },
            aTexCoord: {
                buffer: _regl.prop<PointProps, 'texCoordBuffer'>('texCoordBuffer'),
            }
        }

        // 标点预编译着色器程序
        this._drawCommand[FeatureType.POINT] = _regl({
            vert: pointVert,
            frag: pointFrag,
            uniforms,
            attributes,
            elements: _regl.prop<PointProps, 'elements'>('elements')
        });
    }

    /**
     * 创建标线绘制命令
     */
    createLineDrawCommand () {
        const { _regl } = this._context;

        const uniforms = {
            model: _regl.prop<LineProps, 'modelMatrix'>('modelMatrix'),
            color: _regl.prop<LineProps, 'color'>('color') || [ 255, 255, 255, 255],
            thickness: _regl.prop<LineProps, 'width'>('width') || 3,
            miter: 1,
            aspect: ({ viewportWidth, viewportHeight }) => {
                return viewportWidth / viewportHeight;
            },
            height: ({ viewportHeight, pixelRatio }) => {
                return viewportHeight / pixelRatio;
            }
        }

        const attributes = {
            prevPosition: {
                buffer: _regl.prop<LineProps, 'positionBuffer'>('positionBuffer'),
                offset: 0
            },
            currPosition: {
                buffer: _regl.prop<LineProps, 'positionBuffer'>('positionBuffer'),
                offset: FLOAT_BYTES * 2 * 2
            },
            nextPosition: {
                buffer: _regl.prop<LineProps, 'positionBuffer'>('positionBuffer'),
                offset: FLOAT_BYTES * 2 * 4
            },
            offsetScale: _regl.prop<LineProps, 'offsetBuffer'>('offsetBuffer')
        }
        
        // 预编译着色器程序
        this._drawCommand[FeatureType.LINE] = _regl({
            vert: lineVert,
            frag: lineFrag,
            uniforms,
            attributes,
            elements: _regl.prop<LineProps, 'elements'>('elements')
        });

        this._drawCommand[FeatureType.BORDER] = _regl({
            vert: lineVert,
            frag: lineFrag,
            uniforms,
            attributes,
            elements: _regl.prop<LineProps, 'elements'>('elements')
        });
    }

    /**
     * 创建标面绘制命令
     */
    createPolygonDrawCommand () {
        const { _regl } = this._context;

        const uniforms = {
            model: _regl.prop<PolygonProps, 'modelMatrix'>('modelMatrix'),
            color: _regl.prop<PolygonProps, 'color'>('color') || [ 255, 0, 102, 127],
        }

        const attributes = {
            aPosition: {
                buffer: _regl.prop<PolygonProps, 'positionBuffer'>('positionBuffer'),
                offset: 0
            }
        }

        // 标面预编译着色器程序
        this._drawCommand[FeatureType.POLYGON] = _regl({
            vert: polygonVert,
            frag: polygonFrag,
            uniforms,
            attributes,
            elements: _regl.prop<PolygonProps, 'elements'>('elements')
        });
    }

    creatNodeDrawCommand () {
        const { _regl } = this._context;

        const uniforms = {
            model: _regl.prop<NodeProps, 'modelMatrix'>('modelMatrix'),
            color: _regl.prop<NodeProps, 'color'>('color'),
            size: _regl.prop<NodeProps, 'size'>('size'),
        }

        const attributes = {
            aPosition: {
                buffer: _regl.prop<NodeProps, 'positionBuffer'>('positionBuffer'),
                offset: 0
            }
        }

        // 标面预编译着色器程序
        this._drawCommand[FeatureType.NODE] = _regl({
            vert: nodeVert,
            frag: nodeFrag,
            uniforms,
            attributes,
            primitive: 'points',
            count: 1
        });
    }

    /**
     * 渲染要素信息
     * @param geos
     * @param retain 是否保留新标绘的要素
     */
    render (geos = {}){
        // 重绘当前视野的元素
        const featureTypes = [ FeatureType.POLYGON, FeatureType.LINE, FeatureType.POINT ];

        // 刷新当前视野元素的时候，新标绘的要素不删除, 数据库中已经存储的要素需要销毁删除
        featureTypes.forEach(featureType => {
            const features = this._features[featureType];
            this._features[featureType] = [];
            
            for(const feature of features){
                if (feature._id.startsWith('id_')) {
                    this._features[featureType].push(feature);
                } else {
                    feature.destroy();
                }
            }
        });

        // 接受新的要素
        featureTypes.forEach(featureType => {
            const features = geos[featureType] || [];
            const featuresMap = features.map(featureInfo => {
                const feature = new featureClasses[featureType](this._context, featureInfo);
                return feature;
            });

            this._features[featureType] = this._features[featureType].concat(featuresMap);
        });
        // 重绘
        this.repaint();
    }

    /**
     * 启动编辑
     * @param featureType 要素类型
     */
    start (featureType: FeatureType, fn) {
        // 已选中的元素要取消选中
        this._pickedClickout ();

        // 进入等待编辑模式
        this._context.enter(Modes.WATING);

        // 先销毁上一次未完成绘制的要素
        if (this._newFeature) {
            this._newFeature.destroy();
        }

        // 创建新的要素
        this._newFeature = new featureClasses[featureType](this._context, undefined);
        // 要素进入待编辑模式
        this._newFeature.waiting(fn);

        if (featureType !== FeatureType.POINT ) {
            this._tick = this._context._regl.frame(() => {
                this.drawing();
            });   
        }
    }

    /**
     * 绘制完成
     */
    _drawFinish (feature) {
        // 退出编辑模式， 进入要素选中模式
        this._context.enter(Modes[`${feature.featureType.toUpperCase()}_SELECT`]);

        if (!this._newFeature) {
            return;
        }

        // 新标绘的要素加入到要素集合中
        this._addFeature(this._newFeature);

        // 新标绘的要素成为被选中的要素
        this._pickedFeature = this._newFeature;

        this._context.fire('finish', this._newFeature);

        this._clearTick();
        this._newFeature = null;

        this.repaint();
    }

    drawBatch (featureType, featureProps, fbo) {
        // 批量绘制，帧缓冲区中的绘制不需要透明度，不然造成拾取颜色不准确
        if (fbo) {
            this._drawCommand[featureType](featureProps);
        } else {
            const blendEnable = featureType !== FeatureType.LINE;

            this._context._regl({
                blend: {
                    enable: blendEnable,
                    func: {
                        src: 'src alpha',
                        dst: 'one minus src alpha'
                    }
                },
                depth: {
                    mask: false
                }
            })(() => {
                // 需要使用α混合，添加透明度
                this._drawCommand[featureType](featureProps);
            });
        }
    }

    /**
     * 数据更新，引起图形重新渲染
     */
    repaint (param = { fbo: false, drawing: false }): void {
        const { _regl } = this._context;

        if (!_regl) {
            return;
        }

        // 窗口尺寸变化，需要重新设置webgl的viewport
        if (this._isPoll) {
            const dpr = window.devicePixelRatio;
            const w = this._mapContainer.clientWidth;
            const h = this._mapContainer.clientHeight;
            const { canvas } = _regl._gl;
            canvas.width = w * dpr ;
            canvas.height = h * dpr;
            (canvas as HTMLElement).style.width = w + 'px';
            (canvas as HTMLElement).style.height = h + 'px';
            this._isPoll = false;
            // 重新设置viewport
            _regl._refresh();
        }

        // 重置颜色缓冲区和深度缓存区
        _regl.clear({
            color: [0, 0, 0, 0],
            depth: 1
        });

        // 是否在帧缓冲区中绘制标识
        const { fbo, drawing } = param;

        const _featureProps = fbo ?  this._fboFeatureProps : this._featureProps;
        let nodeProps = _featureProps[FeatureType.NODE];
        let borderProps = _featureProps[FeatureType.BORDER];

        if (!drawing) {
            nodeProps = [];
            borderProps = [];
        }

        const featureTypes = [FeatureType.POLYGON, FeatureType.LINE, FeatureType.POINT];
        // 已有的面、线、点集合重绘
        for (const featureType of featureTypes) {
            if (!drawing) {
                const featureProps = this._features[featureType].map(feature => {
                    // 多边形边框
                    if (feature.featureType === FeatureType.POLYGON) {
                        borderProps.push(this.featureMap(feature._line, fbo));
                    }

                    // 节点
                    if (feature.featureType === FeatureType.LINE) {
                        feature.nodes.forEach(node => {
                            nodeProps.push(this.featureMap(node, fbo));
                        });
                    }

                    return this.featureMap(feature, fbo);
                });

                _featureProps[featureType] = featureProps;

                if (featureType === FeatureType.POLYGON) {
                    _featureProps[FeatureType.BORDER] = borderProps;
                }

                if (featureType === FeatureType.LINE) {
                    _featureProps[FeatureType.NODE] = nodeProps;
                }
            }

            const featureProps = _featureProps[featureType];
            if (featureProps.length > 0) {
                this.drawBatch (featureType, featureProps, fbo);
            }
            // 绘制多边形边框
            if (featureType === FeatureType.POLYGON) {
                if (_featureProps[FeatureType.BORDER].length > 0) {
                    this.drawBatch (FeatureType.BORDER, _featureProps[FeatureType.BORDER], fbo);
                }
            }   
            // 绘制节点
            if (featureType === FeatureType.LINE) {
                if (_featureProps[FeatureType.NODE].length > 0) {
                    this.drawBatch (FeatureType.NODE, _featureProps[FeatureType.NODE], fbo);
                }
            }
        };

        // 正在绘制的点线面重绘, 并且帧缓冲区不绘制正在绘制的要素
        if (this._newFeature && !fbo) {
            const { featureType } = this._newFeature;
            const newFeatureProps = this.featureMap(this._newFeature, fbo);
            this.drawBatch (featureType, newFeatureProps, fbo);

            if (featureType === FeatureType.POLYGON) {
                const borderFeature = (this._newFeature as Polygon)._line;
                const borderFeatureProps = this.featureMap(borderFeature, fbo);
                this.drawBatch (FeatureType.BORDER, borderFeatureProps, fbo);
            }

            if (featureType === FeatureType.LINE) {
                const nodes = this._newFeature.nodes;

                const featureProps = nodes.map(node => {
                    return this.featureMap(node, fbo);
                });

                this.drawBatch (FeatureType.NODE, featureProps, fbo);
            }
        }
    }

    drawing () {
        this.repaint({
            drawing: true,
            fbo: false,
        });
    }

    featureMap (feature, fbo) {
        // 重新计算顶点的位置，索引，样式
        !fbo && feature.repaint();

        const { featureType, positionBuffer, offsetBuffer, texCoordBuffer, texture, elements, _pickColor, style } = feature;

        // 缓冲区中绘制拾取颜色
        const color = fbo ? _pickColor : style.color;

        // 获得投影矩阵
        const modelMatrix = this._context._shapeConfig.getModelMatrix();

        // 基础属性，点线面都包含
        const props = {
            _id: feature._id,
            positionBuffer,
            ...style,
            color,
            modelMatrix,
            elements
        }

        switch(featureType){
            case FeatureType.BORDER:
            case FeatureType.LINE:
                const width = fbo ? 20 : style.width;
                return {
                    ...props,
                    width,
                    offsetBuffer,
                }
            case FeatureType.POLYGON:
                return props;
            case FeatureType.NODE:
                const size = fbo ? 40 : style.size;
                return {
                    ...props,
                    size
                };
            case FeatureType.POINT:
                return {
                    ...props,
                    texCoordBuffer,
                    texture,
                    fbo: !!fbo
                }
        }
    }

    /**
     * 新绘制的要素添加到要素缓存中
     * @param feature 
     */
    _addFeature (feature) {
        const { featureType } = feature;
        this._features[featureType].push(feature);
    }

    /**
     * 根据要素ID查询要素
     * @param featureId 
     */
    getFeature (featureId) {
        let feature = null;

        Object.keys(this._features).forEach(featureType => {
            // 要素已经找到了
            if (feature) {
                return;
            }

            feature = this._features[featureType].find(feature => {
                return feature._id === featureId;
            });
        });

        return feature;
    }

    changeIds (ids = {}) {
        // TODO：修改节点绑定的attachIds
        Object.keys(ids).forEach(oldId => {
            const newId = ids[oldId];
            Object.keys(this._features).forEach(featureType => {
                const features = this._features[featureType];
                const feature = features.find(feature => {
                    return feature._id.indexOf(oldId) > -1;
                });

                if (feature) {
                    feature.setId(newId);
                }
            });
        });
    }

    /**
     * 清空画板
     */
    clear () {
        this._init ();
        this._clearTick ();
        this.repaint();
    }

    _clearTick () {
        if (this._tick) {
            this._tick.cancel();
            this._tick = null;
        }

        if (this._pickTick) {
            clearTimeout(this._pickTick);
            this._pickTick = null;
        }
    }
}

export default Editor;