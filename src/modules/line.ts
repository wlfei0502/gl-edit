import REGL from "regl";
import { LngLat, LineStyle, ShapeConfig, FeatureType, EditorStatus } from "./types";
import Shape from "./shape";

import { links, buffer, generateUUID } from '../util/util.js';

import vert from '../shaders/line.vertex.glsl';
import frag from '../shaders/line.fragment.glsl';
import Context from "./context";

const FLOAT_BYTES = Float32Array.BYTES_PER_ELEMENT;

class Line extends Shape {
    _id: string;                          // 唯一ID
    _context: Context                     // 上下文环境
    _lngLats: LngLat[];                   // 线条地理坐标
    _style: LineStyle;                    // 线条样式：宽度、颜色
    _drawCommand: REGL.DrawCommand;       // 绘制命令
    _positionBuffer: REGL.Buffer;         // 顶点位置缓存
    _offsetBuffer: REGL.Buffer;           // 顶点向两侧偏移方向缓存
    _elements: REGL.Elements;             // 顶点索引
    _pickColor: number [];                // 负责拾取的功能的颜色

    constructor (
        context:Context, 
        regl: REGL.Regl,
        info = {
            id: '0',
            lngLats: [], 
            style: {
                width: 3,
                color: [255, 255, 255, 255]
            }
        }, 
        options: ShapeConfig
    ) {
        super(regl, options);
        
        this._context = context;
        this._id = info.id === '0' ? generateUUID() : info.id;
        this._lngLats = info.lngLats;
        this._style = info.style;
        this._pickColor = this._context.color.getColor(this._id); 

        // 初始化绘制配置
        this._initDraw();

        // 初始化事件监听
        this._initEvent();
    }

    _initDraw () {
        this._positionBuffer = this._regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });

        this._offsetBuffer = this._regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });

        const uniforms = {
            model: (context, props) => props.modelMatrix,
            color: (context, props) => props.color,
            thickness: (context, props) => props.width,
            miter: 1,
            aspect: ({ viewportWidth, viewportHeight }) => {
                return viewportWidth / viewportHeight;
            },
            height: ({ viewportHeight, pixelRatio }) => {
                return viewportHeight / pixelRatio;
            }
        }

        const attributes = {
            prevPosition: {
                buffer: this._positionBuffer,
                offset: 0
            },
            currPosition: {
                buffer: this._positionBuffer,
                offset: FLOAT_BYTES * 2 * 2
            },
            nextPosition: {
                buffer: this._positionBuffer,
                offset: FLOAT_BYTES * 2 * 4
            },
            offsetScale: this._offsetBuffer
        }
        
        const elements = this._elements = this._regl.elements({
            primitive: 'triangles',
            usage: 'dynamic',
            type: 'uint16',
        })

        // 预编译着色器程序
        this._drawCommand = this._regl({
            vert,
            frag,
            uniforms,
            attributes,
            elements,
        });
    }

    _initEvent () {
        // 拾取事件
        this._context.on('pick-start', this._pick, this);
    }

    /**
     * 拾取
     * @param pickInfo 拾取所需要的信息, 鼠标所在位置坐标和帧缓冲区
     */
    _pick (pickInfo) {
        if (this._lngLats.length === 0) {
            return;
        }

        const { x, y, fbo } = pickInfo;

        // 在帧缓冲区上绘制，拾取
        this._regl({ framebuffer: fbo })(() => {
            // 清除缓冲区
            this._regl.clear({
                color: [0, 0, 0, 0],
                depth: 1
            });

            // 绘制到缓冲区
            this._draw({ color: this._pickColor });

            // 拾取鼠标点击位置的颜色
            const rgba = this._regl.read({
                x,
                y,
                width: 1,
                height: 1
            });

            // 颜色分量组成的key
            const colorKey = rgba.join('-');
            // 颜色key对应的uuid
            const uuid = this._context.color.getUUID(colorKey);
            // uuid存在，说明拾取到对象了
            if (uuid) {
                this._context.fire('picked', uuid);
            }
        });
    }

    /**
     * 标线处于等待标绘的状态
     * @param register 注册鼠标点击和移动
     */
    waiting (register) {
        
        // 地图点击事件
        const mapClick = ( lngLat: LngLat, finish) => {
            const len = this._lngLats.length;

            if (len > 1) {
                const lastLngLat = this._lngLats[len - 2];
                // 最后一个点点击的位置相同即完成绘制
                // 之后需要添加缓冲区，只要点击到缓冲区内，就代表绘制结束
                if (lastLngLat.lng === lngLat.lng && lastLngLat.lat === lngLat.lat) {
                    // 移除最后一个移动点
                    this._lngLats.splice(len - 1, 1);

                    // 完成绘制的回调函数
                    finish({
                        id: this._id,
                        lngLats:this._clone()
                    });

                    this._context.fire('draw-finish');
                    return;
                } else {
                    this._lngLats[len - 1] = lngLat;
                }
            } else {
                // 首次绘制，需要为线添加两个点
                this._lngLats.push(lngLat);
            }

            // 添加移动点
            this._lngLats.push(lngLat);

            // 重绘
            this._context.fire('redraw');
        }

        // 鼠标在地图上移动事件
        const mapMove = (lngLat: LngLat) => {
            const len = this._lngLats.length;

            if (len === 0) {
                return;
            } else if (len === 1) {
                this._lngLats.push(lngLat);
            }

            this._lngLats[len - 1] = lngLat;
            this._context.fire('redraw');
        }

        // 注册监听函数
        register(mapClick, mapMove);
    }

    _draw (props) {
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
        let positions = [];
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
        this._positionBuffer(positionsDup);
        // 法向量方向更新
        this._offsetBuffer(offsetDup);
        // 索引更新
        this._elements(indices);

        // 模型变换矩阵
        const modelMatrix = this.getModelMatrix();
    
        this._drawCommand({
            modelMatrix,
            width: this._style.width,
            ...props
        });
    }

    /**
     * 重绘
     */
    repaint () {
        this._draw(this._style);
    }
    
    get () {
        return this._lngLats;
    }

    add () {

    }

    delete () {

    }

    update () {

    }

    /**
     * 移除该要素
     */
    destroy () {
        this._lngLats = [];
        this._context.fire('redraw');
    }

    /**
     * 坐标克隆返回，防止上层应用修改该值
     */
    _clone () {
        return this._lngLats.map(lngLat => {
            return {
                ...lngLat
            }
        });
    }
}

export default Line;
