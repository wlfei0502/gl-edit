import REGL from 'regl';

import Evented from './evented';
import Context from './context';
import createDrawCall from './drawCall';
import { LngLat, Pix, DrawCalls, ShapeConfig, Modes, FeatureType, Features } from './types';

import Line from './line';
import Node from './node';
import Point from './point';
import Polygon from './polygon';
import Shape from './shape';

type Feature = Polygon | Line | Point;

// 要素类型对应的要素类
const featureClasses = {
    [FeatureType.POLYGON]: Polygon,
    [FeatureType.BORDER]: Line,
    [FeatureType.LINE]: Line,
    [FeatureType.NODE]: Node,
    [FeatureType.POINT]: Point,
};

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
    drawingFeature: Shape = null;
    // 当前被选中的要素
    selectedFeature: Shape = null;
    // 绘制完成的缓存半径
    bufferPixes:number = 3;
    // 要素集合
    features: Features = {
        [FeatureType.POLYGON]: [] as Polygon[],
        [FeatureType.LINE]: [] as Line[],
        [FeatureType.POINT]: [] as Point[],
    };
    // 是否需要重新设置webgl的viewport，解决改变地图容器的大小，引起坐标偏移的问题
    isRefresh:boolean = false;

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
    }

    /**
     * 点击标绘按钮，进入等待标绘模式
     * @param featureType 要素类型
     * @param register 注册鼠标点击和移动事件
     */
    start (featureType: FeatureType, register) {
        // 进入等待编辑模式
        this.context.enter(Modes.WATING);

        // 先销毁上一次未完成绘制的要素
        if (this.drawingFeature) {
            this.drawingFeature.destroy();
        }

        // 创建新的要素
        this.drawingFeature = new featureClasses[featureType](this);
        // 要素进入待编辑模式
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

        // 渲染已有要素，按照面、线、点的顺序绘制
        const featureTypes = [FeatureType.POLYGON, FeatureType.LINE, FeatureType.POINT];
        featureTypes.forEach(featureType => {
            if (featureType !== FeatureType.LINE) {
                return;
            }

            const features = this.features[featureType];

            const featureProps = features.map(feature => {
                return this.featureMap(feature);
            });

            this.drawBatch (featureType, featureProps);
        });

        // 渲染正在绘制的要素
        if (this.drawingFeature) {
            const featureProps = this.featureMap (this.drawingFeature);
            const { featureType } = this.drawingFeature; 
            this.drawBatch (featureType, featureProps);
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
        const blendEnable = featureType !== FeatureType.LINE;
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
            canvas.width = w * dpr ;
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
}

export default Editor;