
import Evented from './evented';
import { Modes } from './types';
 
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
    // 当前webgl上下文
    gl: WebGLRenderingContext;
    // 当前所处的编辑模式：空闲|标点|标线|标面|选中
    mode: string = Modes.IDLE;
    // 是否悬浮选中
    isHover: boolean = false;

    constructor({ gl }) {
        super();
        this.gl = gl;
    }

    /**
     * 编辑模式切换
     * @param mode 要素类型
     */
    enter (mode) {
        this.mode = mode;
    }

    exit () {
        this.mode = Modes.IDLE;
    }

    hover (type, isHover) {
        const cursor = cursors[type];

        if (!cursor) {
            (this.gl.canvas as HTMLElement).style.cursor = 'inherit';
            return;
        }

        this.isHover = isHover;
        (this.gl.canvas as HTMLElement).style.cursor = `url(${cursor}) 9 9,auto`;
    }

    out () {
        if (!this.isHover) {
            return;
        }

        this.isHover = false;
        (this.gl.canvas as HTMLElement).style.cursor = 'inherit';
    }
}

export default Context;