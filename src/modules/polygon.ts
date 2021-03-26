import earcut from 'earcut';
import { LngLat, Modes } from "./types";
import Shape from "./shape";

import Context from "./context";
import Line from "./line";
import Node from './node';

const DEFAULT_INFO = { id: '0', lngLats: [], style: { color: [255, 0, 0, 120] } };

class Polygon extends Shape {
    _line: Line; // 线

    nodes: Node[] = [];

    /**
     * 
     * @param context 
     * @param info  { id: '0', lngLats: [], style: { color: [255, 0, 0, 120] }}
     */
    constructor (context: Context, info:any = DEFAULT_INFO) {
        super(context, info);

        this.featureType = 'polygon';
        const lineId = `${this._id}_border`;
        this._line = new Line(context, { id:lineId, lngLats:this._lngLats, style:{ width:2, color:this.style.color}});
        // 初始化事件监听
        this._initEvent();
        // 初始化绘制配置
        this._initDraw();
    }

    _initDraw () {
        const { _regl } = this._context;

        this.positionBuffer = _regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });
        
        this.elements = _regl.elements({
            primitive: 'triangles',
            usage: 'dynamic',
            type: 'uint16',
            count: 0,
            length: 0,
        });
    }

    /**
     * 标线处于等待标绘的状态
     * @param register 注册鼠标点击和移动
     */
    waiting (register) {
        
        // 地图点击事件
        const mapClick = (lngLat: LngLat, finish) => {
            // 进入编辑模式
            this._context.enter(Modes.EDITING);

            let len = this._lngLats.length;

            if (len > 1) {
                // 最后一个点
                const lastLngLat = this._lngLats[len - 3];
                // 最后一个点点击的位置相同即完成绘制
                // 之后需要添加缓冲区，只要点击到缓冲区内，就代表绘制结束
                const lastPoint = this.project(lastLngLat);
                const currentPoint = this.project(lngLat);
                const xDis = Math.abs(lastPoint[0] - currentPoint[0]);
                const yDis = Math.abs(lastPoint[1] - currentPoint[1]);

                if ( xDis <= this._context.pixDis && yDis <= this._context.pixDis) {
                    // 移除移动点
                    this._lngLats.splice(len - 2, 1);
                    // 更新边框坐标
                    this._line.setLngLats(this._lngLats);
                    // 完成绘制的回调函数
                    finish();
                    // 通知外层接口
                    this._context.fire('draw-finish', this);
                    return;
                }
            } else {
                // 首次绘制，需要为面添加三个点
                // 移动点
                this._lngLats.push(lngLat);
                // 末尾点
                this._lngLats.push(lngLat);
            }

            len = this._lngLats.length;

            // 本次需要插入的点
            this._lngLats.splice(len - 2, 0, lngLat);
            this._line.setLngLats(this._lngLats);
        }

        // 鼠标在地图上移动事件
        const mapMove = (lngLat: LngLat) => {
            const len = this._lngLats.length;

            if (len === 0) {
                return;
            }

            this._lngLats[len - 2] = lngLat;
            this._line.setLngLats(this._lngLats);
        }

        // 注册监听函数
        register(mapClick, mapMove);
    }

    repaint () {
        if (this._lngLats.length < 2) {
            return;
        } else if (this._lngLats.length === 3) {
            // 三点重合
            if (this._lngLats[0] === this._lngLats[1] 
                 && this._lngLats[1] === this._lngLats[2]) {
                return;
            }
        }

        // 经纬度转屏幕像素坐标
        const points = this.project(this._lngLats);

        // 顶点位置平铺成一维的
        const positions = [];
        for (let p = 0; p < points.length; p++) {
            const point = points[p];
            positions.push(...point);
        }

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

    unselect () {
        
    }

    select () {

    }
}

export default Polygon;
