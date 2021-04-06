import { subtract, dot, create, equals, negate, length, normalize, scale } from 'gl-matrix/vec2';

import Editor from "./editor";
import Shape from "./shape";
import { Features, FeatureType, LngLat, Pix } from "./types";

/**
 * 计算两点之间的像素差
 * @param target 
 * @param point 
 * @param editor 
 * @returns 
 */
function onPoint(target:LngLat, pix:Pix, editor:Editor):{} {
    const pix1 = editor.lngLatToPix(target);

    if (pix.y > pix1.y) {
        return {
            w: Number.MAX_VALUE,
            h: Number.MAX_VALUE
        };
    }

    const w = Math.abs(pix1.x - pix.x);
    const h = pix.y - pix1.y;

    return {
        w,
        h
    };
}

/**
 * 点到线上的距离
 * @param target 
 * @param point 
 * @param editor 
 */
function onLine(target:LngLat[], pix:Pix, editor:Editor):number {
    let minDistance = Number.MAX_VALUE;

    const pixes = target.map(lngLat => {
        return editor.lngLatToPix(lngLat);
    });

    const len = pixes.length;

    // 创建一个0向量
    const vec0 = create();

    for (let p = 0; p < len; p++) {
        const currentPix = pixes[p];
        const nextIndex = p + 1;

        if (nextIndex >= len) {
            break;
        }

        const nextPix = pixes[nextIndex];

        // currentPix 与 nextPix组成一条线段，求点到线上的距离
        // 线段向量
        const vec1 = subtract([], [nextPix.x, nextPix.y], [currentPix.x, currentPix.y]);

        // 线段两端点距离太近，认为是一个点
        if (equals(vec0, vec1)) {
            continue;
        }

        // 线段首端点与目标点组成的向量
        const vec2 = subtract([], [pix.x, pix.y], [currentPix.x, currentPix.y]);
        // 线段末端点与目标点组成的向量
        const vec3 = subtract([], [pix.x, pix.y], [nextPix.x, nextPix.y]);

        // 向量点乘
        const dotResult1 = dot(vec2, vec1);
        // 向量点乘
        const dotResult2 = dot(vec3, negate([], vec1));

        // 垂足必然在线段之间，求点到线段的距离
        if (dotResult1 > 0 && dotResult2 > 0) {

            // 线段长度
            const len = length(vec1);
            
            // 投影长度
            const projectionLen = dotResult1 / len;

            // 归一化为单位向量
            const normal = normalize([], vec1);

            // 投影向量 = 线段方向的单位向量 * 投影长度
            const projectionVec = scale([], normal, projectionLen);

            // 点到线段向量
            const distanceVec = subtract([], projectionVec, vec2);

            // 向量的长度即是点到线段的距离
            const distance = length(distanceVec);

            // 求点到线上的最小距离
            if (distance < minDistance) {
                minDistance = distance;
            }
        }
    }

    return minDistance;
}

/**
 * 在多边形面上
 */
function onPolygon(target:LngLat[], pix:Pix, editor:Editor) {
    
}

const distanceFns = {
    [FeatureType.POINT]: onPoint,
    [FeatureType.LINE]: onLine,
    [FeatureType.POLYGON]: onPolygon,
}

export function pick(features:Features, pix:Pix, editor:Editor):Shape {
    const featureTypes = [FeatureType.POINT, FeatureType.LINE, FeatureType.POLYGON];

    for (const featureType of featureTypes) {
        const shapeFeatures = features[featureType] as Shape[];
        const distanceFn = distanceFns[featureType];

        for (const feature of shapeFeatures) {
            const { lngLats } = feature;
            const distance = distanceFn(lngLats, pix, editor);

            // 点的缓存是纹理方形
            if (featureType === FeatureType.POINT) {
                if (distance.w < editor.bufferPointSelected.w
                     && distance.h < editor.bufferPointSelected.h) {
                    return feature;
                }
            } else if (featureType === FeatureType.LINE) {
                // 线、面被选中
                if (distance <= editor.bufferSelected) {
                    return feature;
                }
            } else if (featureType === FeatureType.POLYGON) {
                
            }
        }
    }

    return null;
}