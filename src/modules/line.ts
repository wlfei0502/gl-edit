import REGL from "regl";
import { LngLat, Modes } from "./types";
import Shape from "./shape";
import Node from './node';

import Context from "./context";

import { links, buffer } from '../util/util.js';

const DEFAULT_INFO = {
    id: '0',
    lngLats: [], 
    style: {
        width: 3,
        color: [255, 0, 0, 255]
    }
}

class Line extends Shape {
    offsetBuffer: REGL.Buffer;           // 顶点向两侧偏移方向缓存
    nodes: Node [] = [];

    constructor (context: Context, info: any = DEFAULT_INFO) {
        super(context, info, DEFAULT_INFO);
        
        this.featureType = 'line';

        // 初始化绘制配置
        this._initDraw();

        // 初始化事件监听
        this._initEvent();
    }

    _initDraw () {
        const { _regl } = this._context;

        this.positionBuffer = _regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });

        this.offsetBuffer = _regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });
        
        this.elements = _regl.elements({
            primitive: 'triangles',
            usage: 'dynamic',
            type: 'uint16',
            count: 0,
            length: 0
        });
    }

    /**
     * 标线处于等待标绘的状态
     * @param register 注册鼠标点击和移动
     */
    waiting (register) {
        // 地图点击事件
        const mapClick = ( lngLat: LngLat, finish) => {
            // 进入编辑模式
            this._context.enter(Modes.EDITING);

            const len = this._lngLats.length;
            if (len > 1) {
                const lastLngLat = this._lngLats[len - 2];

                const lastPoint = this.project(lastLngLat);
                const currentPoint = this.project(lngLat);
                const xDis = Math.abs(lastPoint[0] - currentPoint[0]);
                const yDis = Math.abs(lastPoint[1] - currentPoint[1]);
                // 最后一个点点击的位置相同即完成绘制
                // 之后需要添加缓冲区，只要点击到缓冲区内，就代表绘制结束
                if (xDis <= this._context.pixDis && yDis <= this._context.pixDis) {
                    // 移除最后一个移动点
                    this._lngLats.splice(len - 1, 1);
                    this.nodes.splice(len - 1, 1);
                    this.nodes[this.nodes.length - 1].style.size = 18;
                    // 完成绘制的回调函数
                    finish();
                    this._context.fire('draw-finish', this);
                    return;
                } else {
                    this._lngLats[len - 1] = lngLat;
                    this.nodes[len - 1].setLngLats(lngLat);
                }
            } else {
                // 首次绘制，需要为线添加两个点
                this._lngLats.push(lngLat);
                // 节点
                const lastIndex = this._lngLats.length - 1;
                this.createNode (lngLat, lastIndex);
            }

            // 添加移动点
            this._lngLats.push(lngLat);
            // 节点
            const lastIndex = this._lngLats.length - 1;
            this.createNode (lngLat, lastIndex);
        }

        // 鼠标在地图上移动事件
        const mapMove = (lngLat: LngLat) => {
            const len = this._lngLats.length;

            if (len === 0) {
                return;
            }

            this._lngLats[len - 1] = lngLat;
            this.nodes[len - 1].setLngLats(lngLat);
        }

        // 注册监听函数
        register(mapClick, mapMove);
    }

    createNode (lngLat, index):Node {
        // 节点
        const node = new Node(this._context, {
            id: `${this._id}_node_${index}`,
            attachId: this._id,
            lngLats: [lngLat],
            style:{
                color: [255, 255, 255, 255],
                size: 14.0
            }
        });

        this.nodes.push(node);

        return node;
    }

    nodeRestyle () {
        const lastIndex = this.nodes.length - 1;

        // 重新计算node的size
        this.nodes.forEach((node, index) => {
            let size = 14.0;

            if (index === 0 || index === lastIndex) {
                size = 18.0;
            }

            node.setStyle({
                size
            }, false);
        });
    }

    repaint () {
        if (this._lngLats.length < 2) {
            return;
        } else if (this._lngLats.length === 2) {
            if (this._lngLats[0] === this._lngLats[1]) {
                return;
            }
        }

        // 经纬度转屏幕像素坐标
        const points = this.project(this._lngLats);
        const len = points.length;

        // 顶点位置平铺成一维的
        const positions = [];
        for (let p = 0; p < points.length; p++) {
            const point = points[p];
            positions.push(...point);
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

        // 重新设置每个节点的样式
        this.nodeRestyle();
    }
    
    /**
     * 点击的是空白区域, 只保留首尾节点
     */
    unselect () {
        if (this.nodes.length < 2) {
            return;
        }

        this.nodesDestroy();

        const first = this._lngLats[0];
        const last = this._lngLats[this._lngLats.length - 1];

        this.nodes = [first, last].map((lngLat, index) => {
            const node = this.createNode(lngLat, index);
            node.setStyle({
                size: 18
            }, false);

            return node;
        });

        // 重绘
        this._context.fire('repaint');
    }

    /**
     * 要素被选中
     */
    select () {
        this.nodesDestroy();

        this._lngLats.forEach((lngLat, index) => {
            const node = this.createNode (lngLat, index);

            if (index === 0 || index === this._lngLats.length - 1) {
                node.setStyle({
                    size: 18
                }, false);
            }
        });

        // 重绘
        this._context.fire('repaint');
    }

    nodesDestroy () {
        this.nodes.forEach(node => {
            node.destroy();
        });

        this.nodes = [];
    }

    destroy () {
        // 节点销毁
        this.nodesDestroy ();
        // 线销毁
        super.destroy();
    }
}

export default Line;
 