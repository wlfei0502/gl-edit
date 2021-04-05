import REGL from 'regl';
import { generateUUID } from '../util/util.js';

import Context from "./context";

import { LngLat, Point } from './types';

abstract class Shape {
    _context: Context;                    // 上下文环境
    _id: string;                          // 唯一Id
    _lngLats: LngLat[];                   // 地理坐标
    _drawCommand: REGL.DrawCommand;       // 绘制命令
    _pickColor: number [];                // 负责拾取的功能的颜色
    positionBuffer: REGL.Buffer;          // 顶点位置缓存
    elements: REGL.Elements;              // 顶点索引
    style: any;                           // 样式：宽度、颜色
    featureType: string;

    constructor (context:Context, featureInfo:any, defaultInfo = {}) {
        this._context = context;
        featureInfo = { ...defaultInfo, ...featureInfo };
        const { id = '0', lngLats = [], style = {} } = featureInfo;

        this._id = id === '0' ? generateUUID() : id;
        this._lngLats = this.clone(lngLats);
        this._pickColor = this._context.color.getColor(this._id); 
        this.style = style;
    }

    _initEvent () {
        // 等待拾取
        this._context.on('pick-start', this._pickStart, this);
    }

    /**
     * 拾取
     * @param pickInfo 拾取所需要的信息, 鼠标所在位置坐标和帧缓冲区
     */
    _pickStart (pickInfo) {
        if (this._lngLats.length === 0) {
            return;
        }

        const { uuid, type } = pickInfo;

        // uuid与当前要素id相同，说明拾取到当前要素了
        if (uuid === this._id) {
            this._context.fire(`picked:${type}`, {
                type,
                feature:this
            });
        }
    }

    getId () {
        return this._id;
    }

    project (lngLats:LngLat | Array<LngLat>): Point | Array<Point> {
        let isArray = true;

        // 不是数组先转成数组，统一处理
        if (!Array.isArray(lngLats)) {
            lngLats = [ lngLats ];
            isArray = false;
        }

        const points:Point[] = lngLats.map(geo => {
            return this._context._shapeConfig.lngLatsToPoints(geo);
        });

        if(!isArray){
            return points.length === 0? null: points[0];
        }

        return points;
    }

    clone (lngLats) {
        if (!Array.isArray(lngLats)) {
            lngLats = [ lngLats ];
        }

        return lngLats.map(lngLat => {
            return {
                ...lngLat
            }
        });
    }

    abstract repaint (param?: any): void
    abstract waiting(register: any): void
    abstract unselect (): void
    abstract select (): void

    add () {

    }

    delete () {

    }

    update () {

    }

    /**
     * 坐标克隆返回，防止上层应用修改该值
     */
    getLngLats () {
        return this.clone(this._lngLats);
    }

    setLngLats (lngLats) {
        if (!Array.isArray(lngLats)) {
            lngLats = [ lngLats ];
        }

        this._lngLats = this.clone(lngLats);
        this.repaint();
    }

    setStyle (style, isRepaint = true) {
        this.style = {
            ...this.style,
            ...style
        };

        isRepaint && this._context.fire('repaint');
    }

    setId (id) {
        // 目前只针对新标绘的要素进行id重设
        if (this._id.indexOf('id_') === -1) {
            return;
        }

        const oldId = this._id;
        const ids = this._id.split('_');

        let suffix = '_';

        if (ids.length > 2) {
            suffix = suffix + ids.slice(2).join('_');
        } else {
            suffix = '';
        }

        this._id = `${id}${suffix}`;

        // 改变颜色与id的对应关系
        this._context.color.changeUuid(oldId, this._id);
    }

    /**
     * 移除该要素
     */
    destroy () {
        this._lngLats = [];
        this._context.off('pick-start', this._pickStart, this);
    }
}

export default Shape;