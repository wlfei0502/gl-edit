import REGL from "regl";
import { LngLat, Modes } from "./types";

import json from '../assets/texture.json';

import Shape from "./shape";

import Context from "./context";

const DEFAULT_INFO = {
    id: '0',
    lngLats: [], 
    style: {
        code: 0,
        color: [0, 0, 0, 0]
    }
}

const imgWidth = 512, imgHeight = 128;

let textureData = null;

class Point extends Shape {
    texture: REGL.Texture;
    texCoordBuffer: REGL.Buffer;

    constructor (context: Context, info:any = DEFAULT_INFO) {
        super(context, info, DEFAULT_INFO);
        this.featureType = 'point';

        // 初始化绘制配置
        this._initDraw();

        // 初始化事件监听
        this._initEvent();
    }

    _initDraw () {
        const { _regl } = this._context;
        this.texture = _regl.texture({
            width: imgWidth,
            height: imgHeight,
            data: this._context._texture
        });
        
        this.positionBuffer = _regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });

        this.texCoordBuffer = _regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });

        this.elements = _regl.elements({
            primitive: 'triangles',
            usage: 'dynamic',
            type: 'uint16',
            count: 0,
            length: 0
        });
    }

    waiting (register) {
        // 地图点击事件
        const mapClick = ( lngLat: LngLat, finish) => {
            // 进入编辑模式
            this._context.enter(Modes.EDITING);
            this._lngLats = [ lngLat ];
            finish();
            this._context.fire('repaint');
            this._context.fire('draw-finish', this);
        }

        // 鼠标在地图上移动事件
        const mapMove = (lngLat: LngLat) => {
        }

        register(mapClick, mapMove);
    }

    repaint () {
        if (this._lngLats.length < 1) {
            return;
        }

        // 经纬度转屏幕像素坐标
        const points = this.project(this._lngLats);
        const { code = '0' } = this.style;
        const { width, height, x:texCoordX, y:texCoordY } = json[code];

        const ratio = window.devicePixelRatio;

        const halfWidth = width / 2;

        // 顶点位置平铺成一维的
        const positions = [];
        const point = points[0];

        // 推算出四角点坐标，使得经纬度位置正好处于图标的正中下方
        for (let p = 0; p < 4; p++) {
            const cornerX = point[0] + ((-1) * Math.pow(-1, p % 2)) * (halfWidth / ratio);
            const cornerY = point[1] + (Math.floor(p / 2) - 1) * (height / ratio);
            positions.push(cornerX, cornerY);
        }
        
        // 更新缓冲区
        // 顶点更新
        this.positionBuffer(positions);

        // 纹理坐标更新
        const texCoords = [];

        for (let t = 0; t < 4; t++) {
            const x = texCoordX + width * (t % 2);
            const y = texCoordY + height * Math.floor(t / 2);
            texCoords.push(x / imgWidth, y / imgHeight);
        }

        this.texCoordBuffer(texCoords);

        // 索引更新
        const indices = [0, 1, 2, 2, 1, 3];
        this.elements(indices);
    }

    select () {
        
    }

    unselect () {

    }
}

export default Point;