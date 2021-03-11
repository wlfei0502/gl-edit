import Evented from './evented';
import Color from './color';

import { FeatureType, EditorStatus } from "./types";


/**
 * 图形绘制上下文，用来管理图形编辑的全局状态
 */
class Context extends Evented{
    mode: string;      // 当前所处的编辑模式：无|标点|标线|标面
    history: any[];    // 用户操作的历史记录栈，时光旅行，处理撤销和前进
    color: Color;      // 颜色集，处理拾取

    constructor() {
        super();

        this.color = new Color();
    }

    /**
     * 编辑模式切换
     * @param type 要素类型
     * @param status 要素处于哪种编辑模式
     * @param fn 要素进入该模式需要执行的函数
     */
    enter (type:FeatureType, status:EditorStatus, fn) {
        this.mode = `${type}_${status}`;
        // this.fire(this.mode, fn);
    }

    exit () {
        this.mode = '';
    }
}

export default Context;