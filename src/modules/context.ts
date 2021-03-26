
import REGL from 'regl';
import Evented from './evented';
import Color from './color';
import { ShapeConfig, Modes } from "./types";

import drawCursor from '../assets/cursors/cursor-draw.png';
import pointCursor from '../assets/cursors/cursor-select-point.png';
import lineCursor from '../assets/cursors/cursor-select-line.png';
import polygonCursor from '../assets/cursors/cursor-select-area.png';

const cursors = {
    waiting: drawCursor,
    editing: drawCursor,
    point: pointCursor,
    node: pointCursor,
    line: lineCursor,
    polygon: polygonCursor,
}

/**
 * 图形绘制上下文，用来管理图形编辑的全局状态
 */
class Context extends Evented{
    mode: string = '';      // 当前所处的编辑模式：无|标点|标线|标面
    mapStatus: string = '';
    history: any[];    // 用户操作的历史记录栈，时光旅行，处理撤销和前进
    color: Color;      // 颜色集，处理拾取
    pixDis = 3;        // 用户选中要素的缓存区大小
    _gl: WebGLRenderingContext;
    _regl: REGL.Regl;
    _shapeConfig: ShapeConfig;
    _hover = false;

    constructor({ gl , shapeConfig }) {
        super();
        this._gl = gl;
        this._regl = REGL(this._gl);
        this._shapeConfig = shapeConfig;
        this.color = new Color();
    }

    /**
     * 编辑模式切换
     * @param mode 要素类型
     */
    enter (mode) {
        this.mode = mode;
        this.hover (this.mode, false);
    }

    exit () {
        this.mode = Modes.IDLE;
        this.hover (this.mode, false);
    }

    hover (type, isHover) {
        const cursor = cursors[type];

        if (!cursor) {
            (this._gl.canvas as HTMLElement).style.cursor = 'inherit';
            return;
        }

        this._hover = isHover;
        (this._gl.canvas as HTMLElement).style.cursor = `url(${cursor}) 9 9,auto`;
    }

    out () {
        if (!this._hover) {
            return;
        }

        this.hover (this.mode, false);
    }

    /**
     * 地图操作状态
     * @param mapStatus 
     */
    setMapStatus (mapStatus) {
        this.mapStatus = mapStatus;
    }
}

export default Context;