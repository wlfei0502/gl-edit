import REGL from 'regl';

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
export interface Point {
    x: number,
    y: number,
    length: number
}

/**
 * 经纬度转像素坐标
 */
export interface lngLatsToPoints {
    (lngLat: LngLat): Point
}

/**
 * 像素坐标转经纬度
 */
export interface PointsToLngLats {
    (point: Point): LngLat
}

/**
 * 根据地图宽度和高度，得出模型变换矩阵
 */
export interface GetModelMatrix {
    (): number[],
}

/**
 * 图形配置信息
 */
export interface ShapeConfig {
    lngLatsToPoints: lngLatsToPoints,
    getModelMatrix: GetModelMatrix
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

export interface FeatureInfo {
    type: FeatureType,
}

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