import REGL from 'regl';

import Editor from './editor';
import Shape from './shape';
import { FeatureType, LngLat, Modes, Pix } from './types';
import { links, buffer } from '../util/util.js';

/**
 * 线要素的默认信息
 */
const DEFAULT_INFO = {
    id: '0',
    lngLats: [], 
    style: {
        width: 3,
        color: [26, 255, 255, 255]
    }
}

class Line extends Shape{
    // 顶点向两侧偏移方向缓存
    offsetBuffer: REGL.Buffer;

    constructor (editor:Editor, featureInfo?:any) {
        super (editor, featureInfo, DEFAULT_INFO);

        this.featureType = FeatureType.LINE;

        // 初始化绘制线需要的buffer和element
        this.initDraw ();
    }

    /**
     * 初始化绘制图形所需要的顶点缓存
     */
    initDraw () {
        const { regl } = this.editor;

        this.positionBuffer = regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });

        this.offsetBuffer = regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });
        
        this.elements = regl.elements({
            primitive: 'triangles',
            usage: 'dynamic',
            type: 'uint16',
            count: 0,
            length: 0
        });
    }

    /**
     * 等待标绘
     * @param register 注册点击和鼠标移动函数
     */
    waiting (register) {
        const lngLats = (this.lngLats as LngLat[]);
        const { bufferPixes } = this.editor;

        // 地图点击事件
        const mapClick = (lngLat: LngLat, drawFinish) => {
            const len = lngLats.length;
            // 首次绘制，需要为线添加两个点：起始点，移动点
            if (len < 1) {
                lngLats.push(lngLat);
                // 设置当前模式为正在标绘模式
                this.editor.context.enter(Modes.EDITING);
            } else {
                // 当前鼠标点击的位置
                const currentPoint = this.project(lngLat) as Pix;
                // 上一次最后绘制的点位置
                const lastLngLat = lngLats[len - 2];
                const lastPoint = this.project(lastLngLat) as Pix;
                // 计算两者的坐标差
                const xDis = Math.abs(lastPoint.x - currentPoint.x);
                const yDis = Math.abs(lastPoint.y - currentPoint.y);
                // 最后一个点点击的位置在缓冲区内即完成绘制
                if (xDis <= bufferPixes && yDis <= bufferPixes) {
                    // 将移动点移除
                    lngLats.splice(len - 1, 1);
                    // 完成绘制的回调函数，该函数会注销鼠标点击事件和鼠标移动事件
                    drawFinish();
                    // 完成绘制的要素会加入到编辑器的要素集中
                    this.editor.drawFinish(this);
                    return;
                } else {
                    lngLats[len - 1] = lngLat;
                }
            }

            // 添加移动点
            lngLats.push(lngLat);
            // 重绘
            this.editor.repaint();
        }

        // 鼠标在地图上移动事件
        const mapMove = (lngLat: LngLat) => {
            const len = lngLats.length;

            // 还未开始绘制
            if (len === 0) {
                return;
            }

            lngLats[len - 1] = lngLat;

            // 重绘
            this.editor.repaint();
        }

        // 注册监听函数
        register(mapClick, mapMove);
    }

    /**
     * 线重绘，重绘会将坐标重新计算
     */
    repaint () {
        const lngLats = (this.lngLats as LngLat[]);

        // 坐标不存在或只有一个点（线只有两个点，并且这两个点重复）
        if (lngLats.length <= 1) {
            return;
        }

        // 经纬度转屏幕像素坐标
        const pixes = (this.project(lngLats) as Pix[]);
        const len = pixes.length;

        // 顶点位置平铺成一维的
        const positions:number[] = [];
        for (let p = 0; p < len; p++) {
            const pix = pixes[p];
            positions.push(pix.x, pix.y);
        }

        // 以 1，2，3三个顶点为例
        // 复制最后一个顶点，放到最后面：1，2，3，3
        buffer.pushElement(positions, len - 1, 2);
        // 复制第一个顶点，放到最前面：1，1，2，3，3
        buffer.unshiftElement(positions, 0, 2);
        // 所有顶点挨个复制，1，1，2，3，3 -> 1，1，1，1，2，2，3，3，3，3
        const positionsDup = new Float32Array(buffer.duplicate(positions, 2));

        // 法向量两侧反向
        const offset = new Array(len).fill(1);
        const offsetDup = buffer.duplicate(offset, 1, -1)
        const indices = links.lineMesh([], len, 0);

        // 更新缓冲区
        // 顶点更新
        this.positionBuffer(positionsDup);
        // 法向量方向更新
        this.offsetBuffer(offsetDup);
        // 索引更新
        this.elements(indices);
    }
}

export default Line;