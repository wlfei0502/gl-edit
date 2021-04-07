import { subtract, dot, create, equals, negate, length, normalize, scale, cross } from 'gl-matrix/vec2';

import Editor from "./editor";
import Shape from "./shape";
import { Features, FeatureType, LngLat, Pix } from "./types";

function flipY(pix:Pix):Pix {
    return {
        x: pix.x,
        y: -pix.y
    }
}


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

    const ratio = window.devicePixelRatio;

    const w = Math.abs(pix1.x - pix.x) * ratio;
    const h = Math.abs(pix.y - pix1.y) * ratio;

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

    pix = flipY(pix);

    // 创建一个0向量
    const zero = create();

    for (let p = 0; p < len; p++) {
        const currentPix = flipY(pixes[p]);
        const nextIndex = p + 1;

        if (nextIndex >= len) {
            break;
        }

        const nextPix = flipY(pixes[nextIndex]);

        // currentPix 与 nextPix组成一条线段，求点到线上的距离
        // 线段向量
        const vec1 = subtract([], [nextPix.x, nextPix.y], [currentPix.x, currentPix.y]);

        // 线段两端点距离太近，认为是一个点
        if (equals(zero, vec1)) {
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
 * 在多边形面上，y = pix.y 与 面做相交，判断 x = pix.x 左侧的交点个数是否为奇数
 */
function onPolygon(target:LngLat[], pix:Pix, editor:Editor):boolean {
    const pixes = target.map(lngLat => {
        return editor.lngLatToPix(lngLat);
    });

    pix = flipY(pix);

    // 记录左侧交点个数
    let leftCrossCount = 0;

    const len = pixes.length;

    const zero = create();

    for (let p = 0; p < len; p++) {
        const currentPix = flipY(pixes[p]);
        const nextIndex = p + 1;

        // 已达到最后一个点
        if (nextIndex >= len) {
            break;
        }
        
        // 去除面上的点与鼠标所在位置的点处于同一水平线的情况，防止首尾重复计数两次
        if (currentPix.y === pix.y) {
            continue;
        }

        // 下一个点
        const nextPix = flipY(pixes[nextIndex]);
        const currentToNextVec = [nextPix.x - currentPix.x, nextPix.y - currentPix.y];

        if (equals(zero, currentToNextVec)) {
            continue;
        }

        // 判断pix是否在线段之间，如果在，说明y = pix.y 与线段相交
        const isPositive = (pix.y - currentPix.y) * (pix.y - nextPix.y);

        // 该线段的两个端点在y = pix.y的同侧
        if (isPositive > 0) {
            continue;    
        }

        // 统计在pix左侧的交点个数
        // 逆时针, 遵循右手螺旋定则，anticlockwise < 0
        const anticlockwise = currentToNextVec[1];
        // 线段向量 a-b 
        //  a ----> b
        //   ↘ p
        // a-p向量
        const currentToPixVec = [pix.x - currentPix.x, pix.y - currentPix.y];
        const crossVec3 = cross([], currentToPixVec, currentToNextVec);

        // 向量方向标识与向量的模同号，即为左侧交点
        if (anticlockwise * crossVec3[2] > 0) {
            leftCrossCount++;
        }
    }

    // 奇数
    if (leftCrossCount % 2 === 1) {
        return true;
    } else {
        return false;
    }
}

const onFeatureFns = {
    [FeatureType.POINT]: onPoint,
    [FeatureType.LINE]: onLine,
    [FeatureType.POLYGON]: onPolygon,
}

export function pick(features:Features, pix:Pix, editor:Editor):Shape {
    const featureTypes = [FeatureType.POINT, FeatureType.LINE, FeatureType.POLYGON];

    for (const featureType of featureTypes) {
        const shapeFeatures = features[featureType] as Shape[];
        const onFeatureFn = onFeatureFns[featureType];

        for (const feature of shapeFeatures) {
            const { lngLats } = feature;
            const result = onFeatureFn(lngLats, pix, editor);

            // 点的缓存是纹理方形
            if (featureType === FeatureType.POINT) {
                if (result.w < feature.bufferSelected.w
                     && result.h < feature.bufferSelected.h) {
                    return feature;
                }
            } else if (featureType === FeatureType.LINE) {
                // 点在线上
                if (result <= feature.bufferSelected) {
                    return feature;
                }
            } else if (featureType === FeatureType.POLYGON) {
                // 点在面上
                if (result) {
                    return feature;
                }
            }
        }
    }

    return null;
}