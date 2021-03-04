import REGL from 'regl';

import { LngLat, Point, lngLatsToPoints, GetModelMatrix, ShapeConfig } from './types';

class Shape {
    _regl: REGL.Regl;
    _lngLatsToPoints: lngLatsToPoints;
    getModelMatrix: GetModelMatrix;

    constructor (regl:REGL.Regl, { lngLatsToPoints, getModelMatrix }:ShapeConfig) {
        this._regl = regl;
        this._lngLatsToPoints = lngLatsToPoints;
        this.getModelMatrix = getModelMatrix;
    }

    project (lngLats:LngLat | Array<LngLat>): Point | Array<Point> {
        let isArray = true;

        // 不是数组先转成数组，统一处理
        if (!Array.isArray(lngLats)) {
            lngLats = [ lngLats ];
            isArray = false;
        }

        const points:Point[] = lngLats.map(geo => {
            return this._lngLatsToPoints(geo);
        });

        if(!isArray){
            return points.length === 0? null: points[0];
        }

        return points;
    }

    repaint (): void {

    }
}

export default Shape;