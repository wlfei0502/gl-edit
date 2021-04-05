
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
    // 当前所处的编辑模式：空闲|标点|标线|标面|选中
    mode: string = Modes.IDLE;
    // 记录地图当前所处的状态，用来处理地图移动过程中不触发拾取动作
    mapStatus: string = '';

    constructor({ gl }) {
        super();
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

    /**
     * 地图操作状态
     * @param mapStatus 
     */
    setMapStatus (mapStatus) {
        this.mapStatus = mapStatus;
    }
}

export default Context;