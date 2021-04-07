import REGL from 'regl';

import Shape from "./shape";
import Editor from './editor';
import { FeatureType, LngLat, Modes, Pix } from './types';

import json from '../assets/texture.json';

const DEFAULT_INFO = {
    id: '0',
    lngLats: null, 
    style: {
        code: '0',
        color: [0, 0, 0, 0]
    }
}

const IMG_WIDTH = 512, IMG_HEIGHT = 128;

class Point extends Shape {
    texture: REGL.Texture;
    texCoordBuffer: REGL.Buffer;
    bufferSelected = {
        w: 14,
        h: 42
    }

    constructor (editor:Editor, featureInfo?:any) {
        super(editor, featureInfo, DEFAULT_INFO);

        this.featureType = FeatureType.POINT;

        // 初始化绘制配置
        this.initDraw();
    }

    /**
     * 配置绘制点所需要的数据
     */
    initDraw () {
        const { regl, texture } = this.editor;

        if (!texture) {
            throw new Error("Texture is not loaded.");
        }

        this.texture = regl.texture({
            width: IMG_WIDTH,
            height: IMG_HEIGHT,
            data: texture
        });
        
        this.positionBuffer = regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });

        this.texCoordBuffer = regl.buffer({
            usage: 'dynamic',
            type: 'float',
        });

        this.elements = regl.elements({
            primitive: 'triangles',
            usage: 'dynamic',
            type: 'uint16',
            count: 0,
            length: 0
        });
    }

    /**
     * 等待标点，注册点击事件
     * @param register 
     */
    waiting (register) {
        const { context } = this.editor;

        // 地图点击事件
        const mapClick = (lngLat: LngLat, drawFinish) => {
            // 进入编辑模式
            context.enter(Modes.EDITING);
            this.lngLats = lngLat;
            drawFinish();
            this.editor.drawFinish(this);
        }

        // 鼠标在地图上移动事件
        const mapMove = (lngLat: LngLat) => {}

        register(mapClick, mapMove);
    }

    /**
     * 重绘
     */
    repaint () {
        if (!this.lngLats) {
            return;
        }

        // 经纬度转屏幕像素坐标
        const point = this.project(this.lngLats) as Pix;
        const { code = '0' } = this.style;
        const { width, height, x:texCoordX, y:texCoordY } = json[code];
        const ratio = window.devicePixelRatio;
        const halfWidth = width / 2;

        // 顶点位置平铺成一维的
        const positions = [];

        // 推算出四角点坐标，使得经纬度位置正好处于图标的正中下方
        for (let p = 0; p < 4; p++) {
            const cornerX = point.x + ((-1) * Math.pow(-1, p % 2)) * (halfWidth / ratio);
            const cornerY = point.y + (Math.floor(p / 2) - 1) * (height / ratio);
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
            texCoords.push(x / IMG_WIDTH, y / IMG_HEIGHT);
        }

        this.texCoordBuffer(texCoords);

        // 索引更新
        const indices = [0, 1, 2, 2, 1, 3];
        this.elements(indices);
    }
}

export default Point;