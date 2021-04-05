import REGL from 'regl';
import Line from './line';
import Point from './point';
import Polygon from './polygon';

/**
 * 标绘信息
 */
export enum FeatureType {
    POLYGON='polygon',
    BORDER='border',
    LINE='line',
    NODE='node',
    POINT='point',
}

/**
 * 编辑模式
 */
export enum Modes {
    IDLE='idle',
    WATING='waiting',
    EDITING='editing',
    END='end',
    POINT_SELECT='point_select',
    LINE_SELECT='line_select',
    POLYGON_SELECT='polygon_select',
    NODE_SELECT='node_select',
}

/**
 * 经纬度类型
 */
export interface LngLat {
    lng: number,
    lat: number
}

/**
 * 像素坐标类型
 */
export interface Pix {
    x: number,
    y: number,
}

/**
 * 经纬度转像素坐标
 */
export interface lngLatToPix {
    (lngLat: LngLat): Pix
}

/**
 * 根据地图宽度和高度，得出模型变换矩阵
 */
export interface getModelMatrix {
    (): number[],
}

/**
 * 图形配置信息
 */
export interface ShapeConfig {
    lngLatToPix,
    getModelMatrix,
    mapContainer: HTMLElement
}

/**
 * 线样式
 */
export interface LineStyle {
    width: number,
    color: number[],
}

/**
 * 多边形样式
 */
export interface PolygonStyle {
    color: number[],
}

export interface FeatureInfo {
    type: FeatureType,
}

export interface PointProps {
    positionBuffer: number[],
    texCoordBuffer: number[],
    modelMatrix: number[],
    elements: REGL.Elements
    texture: REGL.Texture,
    color: REGL.Vec4,
    fbo: boolean
}

export interface LineProps {
    positionBuffer: number[],
    offsetBuffer: number[],
    elements: REGL.Elements
    modelMatrix: number[],
    color: REGL.Vec4,
    width: number,
}

export interface PolygonProps {
    positionBuffer: number[],
    modelMatrix: number[],
    elements: REGL.Elements
    color: REGL.Vec4,
}

export interface NodeProps {
    positionBuffer: number[],
    modelMatrix: number[],
    color: REGL.Vec4,
    size: number
}

export interface DrawCalls {
    [FeatureType.POLYGON]: REGL.DrawCommand
    [FeatureType.BORDER]: REGL.DrawCommand
    [FeatureType.LINE]: REGL.DrawCommand
    [FeatureType.NODE]: REGL.DrawCommand
    [FeatureType.POINT]: REGL.DrawCommand
}

export interface Features {
    [FeatureType.POLYGON]: Polygon [],
    [FeatureType.LINE]: Line [],
    [FeatureType.POINT]: Point [],
}