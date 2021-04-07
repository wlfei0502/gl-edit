import earcut from 'earcut';

import Editor from "./editor";
import Line from "./line";
import Shape from "./shape";
import { FeatureType, LngLat, Modes, Pix } from "./types";

const DEFAULT_INFO = { 
    id: '0', 
    lngLats: [], 
    style: { 
        color: [255, 0, 0, 125],
        borderColor: [255, 0, 0, 255]
    } 
};

class Polygon extends Shape {
    // 边框
    border: Line;
    // 绘制完成的缓冲区
    bufferPixes: number = 3;

    constructor (editor:Editor, featureInfo?:any) {
        super(editor, featureInfo, DEFAULT_INFO);

        this.featureType = FeatureType.POLYGON;

        this.initDraw();
        this.createBorder (editor);
    }

    initDraw () {
        const { regl } = this.editor;

        this.positionBuffer = regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });
        
        this.elements = regl.elements({
            primitive: 'triangles',
            usage: 'dynamic',
            type: 'uint16',
            count: 0,
            length: 0,
        });
    }

    /**
     * 创建多边形边框
     */
     createBorder (editor) {
        const lineId = `${this.id}_border`;
        this.border = new Line(editor, {
            id: lineId,
            lngLats: this.lngLats,
            style:{
                color: this.style.borderColor
            }
        });
    }

    /**
     * 标面处于等待标绘的状态
     * @param register 注册鼠标点击和移动
     */
     waiting (register) {
        const { context } = this.editor;
        const { bufferPixes } = this;
        const lngLats = this.lngLats as LngLat[];

        // 地图点击事件
        const mapClick = (lngLat: LngLat, drawFinish) => {
            let len = lngLats.length;

            // 开始绘制
            if (len < 1) {
                // 进入编辑模式
                context.enter(Modes.EDITING);
                // 首次绘制，需要为面添加三个点
                // 移动点
                lngLats.push(lngLat);
                // 末尾点
                lngLats.push(lngLat);
            } else {
                // 最后一个点
                const lastLngLat = lngLats[len - 3];
                // 最后一个点点击的位置相同即完成绘制
                // 之后需要添加缓冲区，只要点击到缓冲区内，就代表绘制结束
                const lastPoint = this.project(lastLngLat) as Pix;
                const currentPoint = this.project(lngLat) as Pix;
                const xDis = Math.abs(lastPoint.x - currentPoint.x);
                const yDis = Math.abs(lastPoint.y - currentPoint.y);

                if ( xDis <= bufferPixes && yDis <= bufferPixes) {
                    // 移除移动点
                    lngLats.splice(len - 2, 1);
                    // 更新边框坐标
                    this.border.setLngLats(lngLats);
                    // 完成绘制的回调函数
                    drawFinish();
                    // 通知外层接口
                    this.editor.drawFinish(this);
                    return;
                }
            }

            len = lngLats.length;

            // 本次需要插入的点
            lngLats.splice(len - 2, 0, lngLat);
            this.border.setLngLats(lngLats);
            this.editor.repaint();
        }

        // 鼠标在地图上移动事件
        const mapMove = (lngLat: LngLat) => {
            const len = lngLats.length;

            // 还未开始标绘
            if (len === 0) {
                return;
            }

            lngLats[len - 2] = lngLat;
            this.border.setLngLats(lngLats);
            this.editor.repaint();
        }

        // 注册监听函数
        register(mapClick, mapMove);
    }

    /**
     * 重绘
     * @returns 
     */
    repaint () {
        const lngLats = this.lngLats as LngLat[];

        // 坐标不存在或只有一个点（面有三个点，并且这三个点重复）
        if (lngLats.length <= 1) {
            return;
        }

        // 经纬度转屏幕像素坐标
        const points = this.project(lngLats) as Pix[];

        // 顶点位置平铺成一维的
        const positions = [];
        for (let p = 0; p < points.length; p++) {
            const point = points[p];
            positions.push(point.x, point.y);
        }

        // 利用耳切法进行三角分割：当面是三角形的时候，earcut会返回空索引数组
        let indices = earcut(positions);
        if (indices.length === 0) {
            indices = [0, 1, 2];
        }

        // 更新缓冲区
        // 顶点更新
        this.positionBuffer(positions);
        // 索引更新
        this.elements(indices);
    }
}

export default Polygon;