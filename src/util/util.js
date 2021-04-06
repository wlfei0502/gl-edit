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
 * 去除首尾空格
 * @param {*} str 
 */
export function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * 字符串按空格分割
 * @param {*} str 
 */
export function splitWords(str) {
    return trim(str).split(/\s+/);
}

/**
 * 生成uuid
 */
export function generateUUID() {
    var d = new Date().getTime();

    if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now();
    }

    var uuid = `id_xxxxxxxxxxxx`.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });

    return uuid;
}

export function base64ToUint8Array(base64, callback) {
    const img = new Image();
    img.src = base64;
    img.onload = function () {
        callback(img);
    }
}

export const dataURLToBlob = (dataurl) => {
    var arr = dataurl.split(','),
    	mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
	    n = bstr.length,
	    u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

export const blobToArrayBuffer = (blob, callback) => {
	let a = new FileReader();
    a.onload = function (e) { 
    	callback(e.target.result);
    }
    a.readAsArrayBuffer(blob);
}

/**
 * 对象深度合并
 * @param {*} obj1 
 * @param {*} obj2 
 * @param {*} cache 
 */
export function deepMerge(obj1, obj2, cache){
    //防止死循环，这里需要把循环过的对象添加到数组中
    cache = !Array.isArray(cache) ? [] : cache;

    //因为后面只对obj2进行遍历，所以这里只要判断obj2就可以了，如果obj2已经比较合并过了则直接返回obj2，否则在继续合并    
    if(~cache.indexOf(obj2) > 0) return obj2;

    cache.push(obj2);

    const isPlain1 = isPlainObject(obj1);
    const isPlain2 = isPlainObject(obj2);

    //obj1或obj2中只要其中一个不是对象，则按照浅合并的规则进行合并
    if(!isPlain1 || !isPlain2) return shallowMerge(obj1, obj2);

    //如果都是对象，则进行每一层级的递归合并
    let keys = [
        ...Object.keys(obj2),
        ...Object.getOwnPropertySymbols(obj2)
    ]

    keys.forEach(function(key){
        obj1[key] = deepMerge(obj1[key], obj2[key], cache);//这里递归调用
    });

    return obj1;
}

/**
 * 浅合并
 * @param {*} obj1 
 * @param {*} obj2 
 */
export function shallowMerge(obj1, obj2){
    let isPlain1 = isPlainObject(obj1);
    let isPlain2 = isPlainObject(obj2);

    //只要obj1不是对象，那么不管obj2是不是对象，都用obj2直接替换obj1
    if(!isPlain1) return obj2;

    //走到这一步时，说明obj1肯定是对象，那如果obj2不是对象，则还是以obj1为主
    if(!isPlain2) return obj1;

    //如果上面两个条件都不成立，那说明obj1和obj2肯定都是对象， 则遍历obj2 进行合并
    let keys = [
        ...Object.keys(obj2),
        ...Object.getOwnPropertySymbols(obj2)
    ]

    keys.forEach(function(key){
        obj1[key] = obj2[key];
    });

    return obj1;
}

/**
 * 检测是否是纯对象isPlainObject 
 * @param {*} obj 
 */
export function isPlainObject(obj){
    if(obj && Object.prototype.toString.call(obj) === "[object Object]"){
        return true;
    }

    return false;
}

/**
 * Get the first item that pass the test
 * by second argument function
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find(list, f) {
    return list.filter(f)[0]
}

/**
 * 深拷贝
 * @param {*} obj
 * @param {Array<Object>} cache 防止循环引用
 * @return {*}
 */
export function deepCopy(obj, cache = []) {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj);
    if (hit) {
        return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}

    cache.push({
        original: obj,
        copy
    })

    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache)
    })

    return copy;
}