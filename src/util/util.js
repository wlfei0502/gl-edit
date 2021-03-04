/**
 * 网格索引
 */
export const links = {
    lineMesh (buffer, howMany, index) {
        for (let i = 0; i < howMany - 1; i++) {
            const a = index + i * 2
            const b = a + 1
            const c = a + 2
            const d = a + 3
            buffer.push(
                a, b, c,
                c, b, d
            )
        }
      return buffer
    }
}
  
/**
 * 操作缓存的一系列方法
 */
export const buffer = {
    duplicate (buffer, stride, dupScale) {
        if (stride == null) stride = 1;
        if (dupScale == null) dupScale = 1;
        const out = [];
        const component = new Array(stride * 2);
        for (let i = 0, il = buffer.length / stride; i < il; i++) {
            const index = i * stride
            for (let j = 0; j < stride; j++) {
                const value = buffer[index + j]
                component[j] = value
                component[j + stride] = value * dupScale
            }
            Array.prototype.push.apply(out, component)
        }
        return out;
    },
  
    mapElement (buffer, elementIndex, stride, map) {
        for (let i = 0, il = buffer.length / stride; i < il; i++) {
            const index = elementIndex + i * stride;
            buffer[index] = map(buffer[index], index, i);
        }
        return buffer;
    },
  
    pushElement (buffer, elementIndex, stride) {
        const component = new Array(stride);
        const ai = elementIndex * stride;
        for (let i = 0; i < stride; i++) {
            component[i] = buffer[ai + i];
        }
        Array.prototype.push.apply(buffer, component);
        return buffer;
    },
  
    unshiftElement (buffer, elementIndex, stride) {
        const component = new Array(stride);
        const ai = elementIndex * stride;
        for (let i = 0; i < stride; i++) {
            component[i] = buffer[ai + i];
        }
        Array.prototype.unshift.apply(buffer, component);
        return buffer;
    }
}

/**
* 经纬度转成像素函数
* @param {*} callback 经纬度转成像素函数
*/
export function lngLatToPoint(callback){
    return (lngLat) => {
        const { x, y } = callback(lngLat);
        // 对本身的变换加上平移值才是最后的变换结果
        return [ x, y ];
    }
}