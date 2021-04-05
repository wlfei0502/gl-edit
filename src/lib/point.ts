import REGL from 'regl';

import Shape from "./shape";

class Point extends Shape {
    texture: REGL.Texture;
    texCoordBuffer: REGL.Buffer;
}

export default Point;