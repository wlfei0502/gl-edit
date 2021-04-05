import REGL from 'regl';

import { LngLat, Pix, FeatureType } from "./types";
import Editor from "./editor";
import Evented from "./evented";

import { generateUUID, deepMerge, deepCopy } from '../util/util';

class Shape extends Evented {
    // 编辑器实例对象
    editor: Editor;
    // 要素ID
    id: string;
    // 图形坐标，线和面为LngLat[]类型，点为LngLat类型
    lngLats: LngLat[] | LngLat;
    // TODO: 要素样式信息，样式确定之后，该处需要使用类型验证
    style: any;
    // 要素类型
    featureType: FeatureType;
    // 顶点缓存
    positionBuffer: REGL.Buffer;
    // 顶点索引
    elements: REGL.Elements;

    constructor (editor:Editor, featureInfo?:any, defaultInfo?:any) {
        super ();
        this.editor = editor;
        this.initFeatureInfo (featureInfo, defaultInfo);
    }

    /**
     * 初始化要素信息
     * @param featureInfo 
     * @param defaultInfo 
     */
    initFeatureInfo (featureInfo = {}, defaultInfo = {}) {
        const { id, style, lngLats } = deepMerge(defaultInfo, featureInfo, []);
        this.id = id === '0'? generateUUID(): id;
        this.lngLats = deepCopy(lngLats);
        this.style = deepCopy(style);
    }

    /**
     * 初始化绘制图形所需要的顶点和索引数据
     */
    initDraw ():void {}

    /**
     * 参与标绘的要素，子类必须要实现该方法
     */
    waiting (register?:any) {}

    /**
     * 重新根据经纬度计算屏幕坐标，重绘图形
     */
    repaint () {}

    /**
     * 经纬度转屏幕像素坐标
     * @param lngLats 
     */
    project (lngLats:LngLat | LngLat[]): Pix | Pix[] {
        let isArray = true;

        // 不是数组先转成数组，统一处理
        if (!Array.isArray(lngLats)) {
            lngLats = [ lngLats ];
            isArray = false;
        }

        const pixes:Pix[] = lngLats.map(geo => {
            return this.editor.lngLatToPix(geo);
        });

        if(!isArray){
            return pixes.length === 0? null: pixes[0];
        }

        return pixes;
    }

    destroy () {

    }
}

export default Shape;