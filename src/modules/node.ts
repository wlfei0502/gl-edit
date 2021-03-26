import Shape from './shape';
import Context from "./context";

class Node extends Shape {
    // 依附的要素ID集合
    attachIds: string[] = [];

    constructor (context: Context, info:any) {
        super(context, info);

        this.featureType = 'node';

        this.attachIds.push(info.attachId);

        // 初始化绘制配置
        this._initDraw();

        // 初始化事件监听
        this._initEvent();
    }

    _initDraw () {
        this.positionBuffer = this._context._regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });
    }

    waiting () {}

    repaint () {
        if (this._lngLats.length < 1) {
            return;
        }

        // 经纬度转屏幕像素坐标
        const points = this.project(this._lngLats);

        // 顶点位置平铺成一维的
        const positions = [];
        for (let p = 0; p < points.length; p++) {
            const point = points[p];
            positions.push(...point);
        }

        // 更新缓冲区
        // 顶点更新
        this.positionBuffer(positions);
    }

    unselect () {
        
    }

    select () {

    }
}

export default Node;