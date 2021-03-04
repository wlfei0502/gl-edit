import REGL from "regl";
import { LngLat, LineStyle, ShapeConfig } from "./types";
import Shape from "./shape";

import { links, buffer } from '../util/util.js';

import vert from '../shaders/line.vertex.glsl';
import frag from '../shaders/line.fragment.glsl';

const FLOAT_BYTES = Float32Array.BYTES_PER_ELEMENT;

class Line extends Shape {
    _lngLats: LngLat[];
    _style: LineStyle;
    _drawCommand: REGL.DrawCommand;

    constructor (regl: REGL.Regl, lngLats: LngLat[], style: LineStyle, options: ShapeConfig) {
        super(regl, options);

        this._lngLats = lngLats;
        this._style = style;

        this._init();
    }

    _init () {
        // 预编译着色器程序
        this._drawCommand = this._regl({
            vert,
            frag,
        });
    }

    /**
     * 重绘
     */
    repaint () {
        // 获取线的gl
        const points = this.project(this._lngLats);
        const len = points.length;

        let positions = [];
        for (let p = 0; p < points.length; p++) {
            const point = points[p];
            positions.push(...point);
        }

        buffer.pushElement(positions, len - 1, 2);
        buffer.unshiftElement(positions, 0, 2);

        const offset = new Array(len).fill(1);

        const positionsDup = new Float32Array(buffer.duplicate(positions, 2));
        const offsetDup = buffer.duplicate(offset, 1, -1)
        const indices = links.lineMesh([], len, 0);

        const positionBuffer = this._regl.buffer({
            usage: 'dynamic',
            type: 'float',
            length: (len + 2) * 2 * 2 * FLOAT_BYTES,
            data: positionsDup
        });

        const offsetBuffer = this._regl.buffer({
            usage: 'static',
            type: 'float',
            length: (len + 2) * 2 * 1 * FLOAT_BYTES,
            data: offsetDup
        })
        
        const attributes = {
            prevPosition: {
                buffer: positionBuffer,
                offset: 0,
                stride: 0
            },
            currPosition: {
                buffer: positionBuffer,
                offset: FLOAT_BYTES * 2 * 2,
                stride: 0
            },
            nextPosition: {
                buffer: positionBuffer,
                offset: FLOAT_BYTES * 2 * 4,
                stride: 0
            },
            offsetScale: offsetBuffer
        }
        
        // 模型变换矩阵
        const modelMatrix = this.getModelMatrix();

        const uniforms = {
            model: modelMatrix,
            color: [0.8, 0.5, 0, 1],
            thickness: 10,
            miter: 1,
            aspect: ({ viewportWidth, viewportHeight }) => (
                viewportWidth / viewportHeight
            ),
            height: ({ viewportHeight, pixelRatio }) => (
                viewportHeight / pixelRatio
            )
        }
        
        const elements = this._regl.elements({
            primitive: 'triangles',
            usage: 'static',
            type: 'uint16',
            data: indices
        })
        
        this._drawCommand(() => {
            this._regl({
                uniforms,
                attributes,
                elements
            })();
        });
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
}

export default Line;
