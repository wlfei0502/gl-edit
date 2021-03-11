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
 * 标绘信息
 */
export enum FeatureType {
    POINT,
    LINE,
    POLYGON
}

export interface FeatureInfo {
    type: FeatureType,
}

export enum EditorStatus {
    WATING,
    EDITING,
    END
}