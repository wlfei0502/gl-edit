import REGL from 'regl';

import { FeatureType, PointProps, LineProps, PolygonProps, NodeProps, DrawCalls } from './types';

import pointVert from '../shaders/point.vertex.glsl';
import pointFrag from '../shaders/point.fragment.glsl';
import lineVert from '../shaders/line.vertex.glsl';
import lineFrag from '../shaders/line.fragment.glsl';
import polygonVert from '../shaders/polygon.vertex.glsl';
import polygonFrag from '../shaders/polygon.fragment.glsl';
import nodeVert from '../shaders/node.vertex.glsl';
import nodeFrag from '../shaders/node.fragment.glsl';

const FLOAT_BYTES = Float32Array.BYTES_PER_ELEMENT;

/**
 * 创建标面绘制命令
 */
function createPolygonDrawCommand (regl:REGL.Regl): REGL.DrawCommand {
    const uniforms = {
        model: regl.prop<PolygonProps, 'modelMatrix'>('modelMatrix'),
        color: regl.prop<PolygonProps, 'color'>('color') || [ 255, 0, 102, 127],
    }

    const attributes = {
        aPosition: {
            buffer: regl.prop<PolygonProps, 'positionBuffer'>('positionBuffer'),
            offset: 0
        }
    }

    // 标面预编译着色器程序
    return regl({
        vert: polygonVert,
        frag: polygonFrag,
        uniforms,
        attributes,
        elements: regl.prop<PolygonProps, 'elements'>('elements')
    });
}

/**
 * 创建标线绘制命令
 */
function createLineDrawCommand (regl:REGL.Regl): REGL.DrawCommand {
    const uniforms = {
        model: regl.prop<LineProps, 'modelMatrix'>('modelMatrix'),
        color: regl.prop<LineProps, 'color'>('color') || [ 255, 255, 255, 255],
        thickness: regl.prop<LineProps, 'width'>('width') || 3,
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
            buffer: regl.prop<LineProps, 'positionBuffer'>('positionBuffer'),
            offset: 0
        },
        currPosition: {
            buffer: regl.prop<LineProps, 'positionBuffer'>('positionBuffer'),
            offset: FLOAT_BYTES * 2 * 2
        },
        nextPosition: {
            buffer: regl.prop<LineProps, 'positionBuffer'>('positionBuffer'),
            offset: FLOAT_BYTES * 2 * 4
        },
        offsetScale: regl.prop<LineProps, 'offsetBuffer'>('offsetBuffer')
    }
    
    // 预编译着色器程序
    return regl({
        vert: lineVert,
        frag: lineFrag,
        uniforms,
        attributes,
        elements: regl.prop<LineProps, 'elements'>('elements')
    });
}

/**
     * 创建标点绘制命令
     */
function createPointDrawCommand (regl:REGL.Regl): REGL.DrawCommand {
    const uniforms = {
        model: regl.prop<PointProps, 'modelMatrix'>('modelMatrix'),
        texture: regl.prop<PointProps, 'texture'>('texture'),
        color: regl.prop<PointProps, 'color'>('color'),
        fbo: regl.prop<PointProps, 'fbo'>('fbo'),
    }

    const attributes = {
        aPosition: {
            buffer: regl.prop<PointProps, 'positionBuffer'>('positionBuffer'),
        },
        aTexCoord: {
            buffer: regl.prop<PointProps, 'texCoordBuffer'>('texCoordBuffer'),
        }
    }

    // 标点预编译着色器程序
    return regl({
        vert: pointVert,
        frag: pointFrag,
        uniforms,
        attributes,
        elements: regl.prop<PointProps, 'elements'>('elements')
    });
}

function creatNodeDrawCommand(regl:REGL.Regl): REGL.DrawCommand{
    const uniforms = {
        model: regl.prop<NodeProps, 'modelMatrix'>('modelMatrix'),
        color: regl.prop<NodeProps, 'color'>('color'),
        size: regl.prop<NodeProps, 'size'>('size'),
    }

    const attributes = {
        aPosition: {
            buffer: regl.prop<NodeProps, 'positionBuffer'>('positionBuffer'),
            offset: 0
        }
    }

    // 标面预编译着色器程序
    return regl({
        vert: nodeVert,
        frag: nodeFrag,
        uniforms,
        attributes,
        primitive: 'points',
        count: 1
    });
}

const commands = {
    [FeatureType.POLYGON]: createPolygonDrawCommand,
    [FeatureType.BORDER]: createLineDrawCommand,
    [FeatureType.LINE]: createLineDrawCommand,
    [FeatureType.POINT]:  createPointDrawCommand,
    [FeatureType.NODE]:  creatNodeDrawCommand
}

function createDrawCall(regl:REGL.Regl): DrawCalls {
    let drawCalls:any = {};

    for (const command in commands) {
        drawCalls[command] = commands[command](regl);
    }

    return drawCalls;
}

export default createDrawCall;