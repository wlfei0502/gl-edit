import REGL from 'regl';
import { EditorStatus, FeatureType, ShapeConfig } from './types';

import Context from './context';

import Line from './line';

// 要素类型对应的要素类
const featureClasses = {
    [FeatureType.LINE]: Line
};

let features = [], 
    newFeature = null;  // 正在绘制的要素

class Editor {
    _gl: WebGLRenderingContext;
    _context: Context;
    _regl: REGL.Regl;
    _options: ShapeConfig;
    _isPoll: boolean;

    constructor (gl: WebGLRenderingContext, options:ShapeConfig) {
        this._gl = gl;
        this._options = options;
        this._initialize();
    }

    /**
     * 编辑器初始化
     */
    _initialize (): void {
        this._regl = REGL(this._gl);

        this._context = new Context();

        // 窗口变化，重置viewport
        window.addEventListener('resize', () => {
            this._isPoll = true;
        });

        // 重绘
        this._context.on('redraw', this.repaint, this);

        // 绘制完成
        this._context.on('draw-finish', this._drawFinish, this);

        // 画布点击事件
        this._gl.canvas.addEventListener('click', (event) => {
            // 非编辑模式才能进行拾取
            if (this._context.mode) {
                return;
            }

            const dpr = window.devicePixelRatio;

            const evt = event as PointerEvent;
            const { clientX, clientY } = evt;
            const target = evt.target as HTMLElement;
            const rect = target.getBoundingClientRect();

            const x = dpr * (clientX - rect.left);
            const y = this._gl.drawingBufferHeight - dpr * (clientY - rect.top);

            // 创建帧缓冲区
            const fbo = this._regl.framebuffer({
                width: this._regl._gl.drawingBufferWidth,
                height: this._regl._gl.drawingBufferHeight,
                depth: true,
                stencil: false,
                depthStencil: false,
            });

            this._context.fire('pick-start', {
                x,
                y,
                fbo
            });

            // 销毁帧缓冲区
            fbo.destroy();
        });
    }

    /**
     * 绘制完成
     */
    _drawFinish () {
        // 退出编辑模式
        this._context.exit();
        // 新标绘的要素加入到要素集中
        newFeature && features.push(newFeature);
        newFeature = null;
    }

    /**
     * 启动编辑
     * @param featureType 要素类型
     */
    start (featureType: FeatureType, fn) {
        // 先销毁上一次未完成绘制的要素
        if (newFeature) {
            newFeature.destroy();
        }

        newFeature = new featureClasses[featureType](this._context, this._regl, undefined, this._options);
        // 要素进入待编辑模式
        newFeature.waiting(fn);

        this._context.enter(featureType, EditorStatus.WATING, fn);
        return this;
    }

    /**
     * 数据更新，引起图形重新渲染
     */
    repaint (): void {
        if (!this._regl) {
            return;
        }

        // 窗口尺寸变化，需要重新设置webgl的viewport
        if (this._isPoll) {
            this._regl.poll();
            this._isPoll = false;
        }

        // 重置颜色缓冲区和深度缓存区
        this._regl.clear({
            color: [0, 0, 0, 0],
            depth: 1
        });

        // // 所有元素重绘
        // if (lines.length === 0) {
        //     const lngLatsStr = '116.28273,40.091311;116.282012,40.091028;116.281004,40.090676;116.279992,40.090349;116.278851,40.089986;116.27735,40.089511;116.275946,40.089064;116.274837,40.088705;116.274606,40.088631;116.274258,40.088537;116.273257,40.088217;116.272156,40.087865;116.270763,40.087416;116.270613,40.087369;116.270583,40.087362;116.269882,40.087145;116.270063,40.087023;116.271732,40.086063;116.276693,40.083096;116.278233,40.082157;116.279363,40.081357;116.279924,40.080923;116.280327,40.080611;116.281141,40.079861;116.282208,40.07871;116.28258,40.078425;116.283844,40.076923;116.284016,40.076659;116.285778,40.07395;116.286577,40.072749;116.288505,40.069382;116.288865,40.068827;116.289532,40.067801';

        //     lngLats = lngLatsStr.split(';').map((item) => {
                
        //         const lngLatArray =  item.split(',').map(str => {
        //             return Number(str);
        //         });

        //         return {
        //             lng: lngLatArray[0],
        //             lat: lngLatArray[1],
        //         }
        //     })

        //     let line = new Line(
        //         this._context,
        //         this._regl, 
        //         lngLats, 
        //         { color:[1, 0.7, 0.2, 1], width:6 }, 
        //         this._options,
        //     );

        //     lines.push(line);
        // }

        features.forEach(feature => {
            feature.repaint();
        });

        if (newFeature) {
            newFeature.repaint();
        }
    }
}

export default Editor;