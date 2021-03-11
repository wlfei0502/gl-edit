import { splitWords } from '../util/util';

function falseFn() { return false; }

/**
 * 实现发布-订阅模式的事件中心
 * 源码修改自leaflet的Event类
 */
class Evented {
    // 事件集合
    _events: object;

    // 事件派发计数
    _firingCount: number;

    constructor () {
        this._events = {};
    }

    /**
     * 事件注册
     * @param types { start:fn, end:fn } || start end
     * @param fn context || function
     * @param context null || context
     */
    on (types, fn, context?): Evented {
        if (typeof types === 'object') {
            for (const type in types) {
                this._on(type, types[type], fn);
            }
        } else {
            types = splitWords(types);

            for (let i = 0, len = types.length; i < len; i++) {
                this._on(types[i], fn, context);
            }
        }

        return this;
    }

    /**
     * 事件注销
     * @param types 
     * @param fn 
     * @param context 
     */
    off (types, fn, context): Evented {

        if (!types) {
            delete this._events;
        } else if (typeof types === 'object') {
            for (const type in types) {
                this._off(type, types[type], fn);
            }
        } else {
            types = splitWords(types);
            for (let i = 0, len = types.length; i < len; i++) {
                this._off(types[i], fn, context);
            }
        }

        return this;
    }

    /**
     * 单个事件注册
     * @param type 
     * @param fn 
     * @param context 
     */
    _on (type, fn, context) {
        this._events = this._events || {};

        let typeListeners = this._events[type];
        if (!typeListeners) {
            typeListeners = [];
            this._events[type] = typeListeners;
        }

        if (!context) {
            context = this;
        }

        const newListener = { fn: fn, ctx: context },
            listeners = typeListeners;

        for (let i = 0, len = listeners.length; i < len; i++) {
            if (listeners[i].fn === fn && listeners[i].ctx === context) {
                return;
            }
        }

        listeners.push(newListener);
    }

    /**
     * 单个事件注销
     * @param type 
     * @param fn 
     * @param context 
     */
    _off (type, fn, context) {
        let listeners, i, len;

        if (!this._events) { return; }

        listeners = this._events[type];

        if (!listeners) {
            return;
        }

        if (!fn) {
            for (i = 0, len = listeners.length; i < len; i++) {
                listeners[i].fn = falseFn;
            }
            delete this._events[type];
            return;
        }

        if (!context) {
            context = this;
        }

        if (listeners) {
            for (i = 0, len = listeners.length; i < len; i++) {
                const l = listeners[i];
                if (l.ctx !== context) { continue; }
                if (l.fn === fn) {

                    l.fn = falseFn;

                    if (this._firingCount) {
                        this._events[type] = listeners = listeners.slice();
                    }

                    listeners.splice(i, 1);

                    return;
                }
            }
        }
    }

    /**
     * 触发事件
     * @param type 事件类型
     * @param data 事件数据
     */
    fire (type, data?:any) {
        if (!this.listens(type)) { return this;}

        if (this._events) {
            const listeners = this._events[type];

            if (listeners) {
                this._firingCount = (this._firingCount + 1) || 1;
                for (var i = 0, len = listeners.length; i < len; i++) {
                    var l = listeners[i];
                    l.fn.call(l.ctx || this, data);
                }

                this._firingCount--;
            }
        }

        return this;
    }

    /**
     * 判断事件是否已经监听过
     * @param type 
     */
    listens (type) {
        var listeners = this._events && this._events[type];
        if (listeners && listeners.length) { return true; }
        return false;
    }
}

export default Evented;