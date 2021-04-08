import REGL from 'regl';

import Evented from './evented';
import Context from './context';
import createDrawCall from './drawCall';
import { LngLat, Pix, DrawCalls, ShapeConfig, Modes, FeatureType, Features } from './types';
import { base64ToUint8Array } from '../util/util';

import { pick } from './common';
import Line from './line';
import Node from './node';
import Point from './point';
import Polygon from './polygon';
import Shape from './shape';

import img from '../assets/texture.png';

type Feature = Polygon | Line | Point;

// 要素类型对应的要素类
const featureClasses = {
    [FeatureType.POLYGON]: Polygon,
    [FeatureType.BORDER]: Line,
    [FeatureType.LINE]: Line,
    [FeatureType.NODE]: Node,
    [FeatureType.POINT]: Point,
};

/**
 * 编辑器类，
 * TODO:后期如果性能不佳，需要考虑将坐标进行视野内裁切，做接边处理
 */
class Editor extends Evented{
    // 该配置主要是为了适配不同的地图API
    config: ShapeConfig;
    // 环境上下文
    context: Context;
    // webgl绘制实例
    regl: REGL.Regl;
    // 绘制图形的命令
    drawCalls: DrawCalls;
    // 正在绘制的要素
    drawingFeature: Shape;
    // 当前被选中的要素
    selectedFeature: Shape;
    // 要素集合
    features: Features;
    // 是否需要重新设置webgl的viewport，解决改变地图容器的大小，引起坐标偏移的问题
    isRefresh: boolean = false;
    // 纹理对象
    texture: REGL.TextureImageData;
    // 鼠标按下时的位置
    downPix: Pix;
    // 鼠标抬起时的位置
    upPix: Pix;

    constructor (gl:WebGLRenderingContext, config:ShapeConfig) {
        super ();
        // 生成环境上下文，主要处理一些全局上的
        this.context = new Context ({ gl });
        // regl 实例，处理图形渲染
        this.regl = REGL(gl);
        // editor 将代理config中的方法和属性
        this.config = config;
        // 创建绘制点线面的渲染器
        this.drawCalls = createDrawCall (this.regl);
        // 加载纹理
        base64ToUint8Array(img, (data) => {
            this.texture = data;
            this.fire('load');
        });
        // 编辑器初始化
        this.init ();
        // 事件监听注册
        this.registerEvent ();
    }

    /**
     * 编辑器初始化
     */
    init () {
        this.features = {
            [FeatureType.POLYGON]: [] as Polygon[],
            [FeatureType.LINE]: [] as Line[],
            [FeatureType.POINT]: [] as Point[],
        };
        this.drawingFeature = null;
        this.selectedFeature = null;
        this.isRefresh = false;
    }

    /**
     * 事件监听
     */
    registerEvent () {
        // 鼠标按下事件
        this.regl._gl.canvas.addEventListener('mousedown', this.mousedown.bind(this));
        // 鼠标抬起事件
        this.regl._gl.canvas.addEventListener('mouseup', this.mouseup.bind(this));
        // 鼠标移动事件，拾取要素
        this.regl._gl.canvas.addEventListener('mousemove', this.pickHover.bind(this));
        // 画布点击事件，进行要素拾取
        this.regl._gl.canvas.addEventListener('click', this.pickClick.bind(this));
    }

    /**
     * 鼠标按下记录鼠标所在的位置
     * @param event 
     */
    mousedown (event) {
        const evt = event as PointerEvent;
        const { clientX, clientY } = evt;

        this.downPix = {
            x: clientX,
            y: clientY
        }
    }

    /**
     * 鼠标抬起，记录鼠标位置，前后作比较，相同即为点击事件
     * 不同则是鼠标拖动事件
     * @param event 
     */
    mouseup (event) {
        const evt = event as PointerEvent;
        const { clientX, clientY } = evt;

        this.upPix = {
            x: clientX,
            y: clientY
        }
    }

    /**
     * 鼠标点击,要素拾取
     */
     pickClick (event) {
        // 是鼠标拖动事件，不是点击事件，不做拾取操作
        if (this.downPix.x !== this.upPix.x 
            || this.downPix.y !== this.upPix.y) {
            return;
        }

        const { mode } = this.context;

        // 等待编辑，正在编辑时，不做点击拾取
        if (mode === Modes.WATING || mode === Modes.EDITING) {
            return;
        }

        const feature = this.pickFeature (event);

        if (feature) {
            this.fire('picked:click', {
                type: 'click',
                feature
            });
        }
    }

    /**
     * 鼠标悬浮拾取要素
     * @param event 
     */
    pickHover (event) {
        const feature = this.pickFeature (event);

        if (feature) {
            this.context.hover (feature.featureType, true);
        } else {
            this.context.out ();
        }
    }

    /**
     * 根据鼠标位置拾取要素
     * @param event 
     * @returns 
     */
    pickFeature (event) {
        const evt = event as PointerEvent;
        const { clientX, clientY } = evt;

        const { mapContainer } = this.config;

        const { left, top } = mapContainer.getBoundingClientRect();

        const pix = {
            x: clientX - left,
            y: clientY - top
        }

        const feature = pick(this.features, pix, this);

        return feature;
    }

    /**
     * 渲染要素信息
     * @param geos
     * @param retain 是否保留新标绘的要素
     */
     render (geos = {}, retain = true){
        // 重绘当前视野的元素
        const featureTypes = [ FeatureType.POLYGON, FeatureType.LINE, FeatureType.POINT ];

        // 刷新当前视野元素的时候，新标绘的要素不删除, 数据库中已经存储的要素需要销毁删除
        for(const featureType of featureTypes){
            let features = this.features[featureType];
            this.features[featureType] = [];
            
            // 保留新标绘的要素
            if (retain) {
                for(const feature of features){
                    if (feature.id.startsWith('id_')) {
                        this.features[featureType].push(feature);
                    }
                } 
            }

            // 融入新的要素，该要素来源于数据中已经存储的要素
            features = geos[featureType] || [];
            const existFeatures = features.map(featureInfo => {
                const feature = new featureClasses[featureType](this, featureInfo);
                return feature;
            });

            this.features[featureType].push(...existFeatures);
        }

        // 重绘
        this.repaint();
    }

    /**
     * 点击标绘按钮，进入等待标绘模式
     * @param featureType 要素类型
     * @param register 注册鼠标点击和移动事件
     */
    start (featureType: FeatureType, register) {
        // 进入等待编辑模式
        this.context.enter(Modes.WATING);

        // 先移除上一次未完成绘制的要素
        if (this.drawingFeature) {
            this.drawingFeature = null;
            this.repaint();
        }

        // 创建新的要素
        this.drawingFeature = new featureClasses[featureType](this);
        // 新要素进入待编辑模式
        this.drawingFeature.waiting(register);
    }

    /**
     * 绘制完成
     */
    drawFinish (feature:Feature) {
        // 退出编辑模式，进入要素选中模式
        this.context.enter(Modes[`${feature.featureType.toUpperCase()}_SELECT`]);

        if (!this.drawingFeature) {
            return;
        }

        // 新标绘的要素加入到要素集合中
        this.addFeature(this.drawingFeature);
        // 新标绘的要素成为被选中的要素
        this.selectedFeature = this.drawingFeature;
        // 通知API，绘制完成
        this.fire('finish', this.drawingFeature);
        this.drawingFeature = null;
        // 重绘
        this.repaint();
    }

    /**
     * 画布重绘
     */
    repaint () {
        const { regl } = this;

        if (!regl) {
            return;
        }

        this.refresh();

        // 面边框
        const borderProps = [];

        // 渲染已有要素，按照面、线、点的顺序绘制
        const featureTypes = [FeatureType.POLYGON, FeatureType.LINE, FeatureType.POINT];
        featureTypes.forEach(featureType => {
            const features = this.features[featureType];

            const featureProps = features.map(feature => {

                // 多边形边框
                if (feature.featureType === FeatureType.POLYGON) {
                    borderProps.push(this.featureMap(feature.border));
                }

                return this.featureMap(feature);
            });

            // 绘制要素
            if (featureProps.length > 0) {
                this.drawBatch (featureType, featureProps);
            }

            // 绘制面的边框
            if (featureType === FeatureType.POLYGON 
                    && borderProps.length > 0) {
                this.drawBatch (FeatureType.BORDER, borderProps);
            }
        });

        // 渲染正在绘制的要素
        if (this.drawingFeature) {
            const featureProps = this.featureMap (this.drawingFeature);
            const { featureType } = this.drawingFeature; 
            this.drawBatch (featureType, featureProps);

            // 多边形边框
            if (featureType === FeatureType.POLYGON) {
                const drawingPolygonFeature = this.drawingFeature as Polygon;
                const borderProps = this.featureMap(drawingPolygonFeature.border);
                this.drawBatch (FeatureType.BORDER, borderProps);
            }
        }
    }

    /**
     * 获取要素的属性信息
     * @param feature 
     */
    featureMap (feature:Shape) {
        // 重新计算顶点的位置，索引，样式
        feature.repaint();

        // 要素属性信息
        const { featureType, positionBuffer, elements, style } = feature;

        // 获得投影矩阵
        const modelMatrix = this.getModelMatrix();

        // 基础属性，点线面都包含
        const props = {
            positionBuffer,
            modelMatrix,
            elements,
            ...style,
        }

        switch(featureType){
            case FeatureType.BORDER:
            case FeatureType.LINE:
                const { offsetBuffer } = feature as Line;
                return {
                    ...props,
                    offsetBuffer
                };
            case FeatureType.POLYGON:
                return props;
            case FeatureType.NODE:
                return props;
            case FeatureType.POINT:
                const { texCoordBuffer, texture } = feature as Point;
                return {
                    ...props,
                    texCoordBuffer,
                    texture
                }
        }
    }

    /**
     * 同类型的要素进行批量绘制
     * @param featureType 要素类型
     * @param featureProps 要素属性
     */
    drawBatch (featureType:FeatureType, featureProps) {
        // 线不需要开启alpha混合
        const blendEnable = featureType !== FeatureType.LINE && featureType !== FeatureType.BORDER;
        // 嵌套 + 批量 绘制
        this.regl({
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
            this.drawCalls[featureType](featureProps);
        });
    }

    /**
     * 刷新画布
     */
    refresh () {
        const { regl, config:{ mapContainer } } = this;

        // 窗口尺寸变化，需要重新设置webgl的viewport
        if (this.isRefresh) {
            const dpr = window.devicePixelRatio;
            const w = mapContainer.clientWidth;
            const h = mapContainer.clientHeight;
            const { canvas } = regl._gl;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            (canvas as HTMLElement).style.width = w + 'px';
            (canvas as HTMLElement).style.height = h + 'px';
            this.isRefresh = false;
            // 重新设置viewport
            regl._refresh();
        }

        // 重置颜色缓冲区和深度缓存区
        regl.clear({
            color: [0, 0, 0, 0],
            depth: 1
        });
    }

    /**
     * 要素加入到要素集中
     * @param feature 
     */
    addFeature (feature:Shape) {
        const { featureType } = feature;
        const features = this.features[featureType];

        if(features.includes(feature)){
            return;
        }

        features.push(feature);
    }

    changeIds (ids = {}) {
        // TODO：修改节点绑定的attachIds
        Object.keys(ids).forEach(oldId => {
            const newId = ids[oldId];
            Object.keys(this.features).forEach(featureType => {
                const features = this.features[featureType];
                const feature = features.find(feature => {
                    return feature.id.indexOf(oldId) > -1;
                });

                if (feature) {
                    feature.setId(newId);
                }
            });
        });
    }

    /**
     * 经纬度转屏幕像素坐标
     * @param lngLat 
     */
    lngLatToPix (lngLat:LngLat): Pix {
        return this.config.lngLatToPix(lngLat);
    }

    /**
     * 模型变换矩阵
     * 该矩阵会将屏幕像素坐标转成webgl裁剪坐标
     */
    getModelMatrix (): number[] {
        return this.config.getModelMatrix ();
    }

    /**
     * 重置编辑器初始值, 清空画布
     */
    clear () {
        this.init ();
        this.repaint ();
    }
}

export default Editor;