(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('leaflet')) :
  typeof define === 'function' && define.amd ? define(['leaflet'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.L = global.L || {}, global.L.drawEdit = factory(global.L)));
}(this, (function (L) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var L__default = /*#__PURE__*/_interopDefaultLegacy(L);

  /**
   * 网格索引
   */
  const links = {
    lineMesh(buffer, howMany, index) {
      for (let i = 0; i < howMany - 1; i++) {
        const a = index + i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        buffer.push(a, b, c, c, b, d);
      }

      return buffer;
    }

  };
  /**
   * 操作缓存的一系列方法
   */

  const buffer = {
    duplicate(buffer, stride, dupScale) {
      if (stride == null) stride = 1;
      if (dupScale == null) dupScale = 1;
      const out = [];
      const component = new Array(stride * 2);

      for (let i = 0, il = buffer.length / stride; i < il; i++) {
        const index = i * stride;

        for (let j = 0; j < stride; j++) {
          const value = buffer[index + j];
          component[j] = value;
          component[j + stride] = value * dupScale;
        }

        Array.prototype.push.apply(out, component);
      }

      return out;
    },

    mapElement(buffer, elementIndex, stride, map) {
      for (let i = 0, il = buffer.length / stride; i < il; i++) {
        const index = elementIndex + i * stride;
        buffer[index] = map(buffer[index], index, i);
      }

      return buffer;
    },

    pushElement(buffer, elementIndex, stride) {
      const component = new Array(stride);
      const ai = elementIndex * stride;

      for (let i = 0; i < stride; i++) {
        component[i] = buffer[ai + i];
      }

      Array.prototype.push.apply(buffer, component);
      return buffer;
    },

    unshiftElement(buffer, elementIndex, stride) {
      const component = new Array(stride);
      const ai = elementIndex * stride;

      for (let i = 0; i < stride; i++) {
        component[i] = buffer[ai + i];
      }

      Array.prototype.unshift.apply(buffer, component);
      return buffer;
    }

  };
  /**
  * 经纬度转成像素函数
  * @param {*} callback 经纬度转成像素函数
  */

  function lngLatToPoint(callback) {
    return lngLat => {
      const {
        x,
        y
      } = callback(lngLat); // 对本身的变换加上平移值才是最后的变换结果

      return [x, y];
    };
  }
  /**
   * 去除首尾空格
   * @param {*} str 
   */

  function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
  }
  /**
   * 字符串按空格分割
   * @param {*} str 
   */

  function splitWords(str) {
    return trim(str).split(/\s+/);
  }
  /**
   * 生成uuid
   */

  function generateUUID() {
    var d = new Date().getTime();

    if (window.performance && typeof window.performance.now === 'function') {
      d += performance.now();
    }

    var uuid = `id_xxxxxxxxxxxx`.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  }
  function base64ToUint8Array(base64, callback) {
    const img = new Image();
    img.src = base64;

    img.onload = function () {
      callback(img);
    };
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  /** @deprecated */
  function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  }

  /**
   * 标绘信息
   */
  var FeatureType;
  (function (FeatureType) {
      FeatureType["POLYGON"] = "polygon";
      FeatureType["BORDER"] = "border";
      FeatureType["LINE"] = "line";
      FeatureType["NODE"] = "node";
      FeatureType["POINT"] = "point";
  })(FeatureType || (FeatureType = {}));
  var Modes;
  (function (Modes) {
      Modes["IDLE"] = "idle";
      Modes["WATING"] = "waiting";
      Modes["EDITING"] = "editing";
      Modes["END"] = "end";
      Modes["POINT_SELECT"] = "point_select";
      Modes["LINE_SELECT"] = "line_select";
      Modes["POLYGON_SELECT"] = "polygon_select";
      Modes["NODE_SELECT"] = "node_select";
  })(Modes || (Modes = {}));

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var regl_unchecked = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
      module.exports = factory() ;
  }(commonjsGlobal, (function () {
  var extend = function (base, opts) {
    var keys = Object.keys(opts);
    for (var i = 0; i < keys.length; ++i) {
      base[keys[i]] = opts[keys[i]];
    }
    return base
  };

  var VARIABLE_COUNTER = 0;

  var DYN_FUNC = 0;
  var DYN_CONSTANT = 5;
  var DYN_ARRAY = 6;

  function DynamicVariable (type, data) {
    this.id = (VARIABLE_COUNTER++);
    this.type = type;
    this.data = data;
  }

  function escapeStr (str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  }

  function splitParts (str) {
    if (str.length === 0) {
      return []
    }

    var firstChar = str.charAt(0);
    var lastChar = str.charAt(str.length - 1);

    if (str.length > 1 &&
        firstChar === lastChar &&
        (firstChar === '"' || firstChar === "'")) {
      return ['"' + escapeStr(str.substr(1, str.length - 2)) + '"']
    }

    var parts = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(str);
    if (parts) {
      return (
        splitParts(str.substr(0, parts.index))
          .concat(splitParts(parts[1]))
          .concat(splitParts(str.substr(parts.index + parts[0].length)))
      )
    }

    var subparts = str.split('.');
    if (subparts.length === 1) {
      return ['"' + escapeStr(str) + '"']
    }

    var result = [];
    for (var i = 0; i < subparts.length; ++i) {
      result = result.concat(splitParts(subparts[i]));
    }
    return result
  }

  function toAccessorString (str) {
    return '[' + splitParts(str).join('][') + ']'
  }

  function defineDynamic (type, data) {
    return new DynamicVariable(type, toAccessorString(data + ''))
  }

  function isDynamic (x) {
    return (typeof x === 'function' && !x._reglType) || (x instanceof DynamicVariable)
  }

  function unbox (x, path) {
    if (typeof x === 'function') {
      return new DynamicVariable(DYN_FUNC, x)
    } else if (typeof x === 'number' || typeof x === 'boolean') {
      return new DynamicVariable(DYN_CONSTANT, x)
    } else if (Array.isArray(x)) {
      return new DynamicVariable(DYN_ARRAY, x.map(function (y, i) { return unbox(y) }))
    } else if (x instanceof DynamicVariable) {
      return x
    }
    
  }

  var dynamic = {
    DynamicVariable: DynamicVariable,
    define: defineDynamic,
    isDynamic: isDynamic,
    unbox: unbox,
    accessor: toAccessorString
  };

  /* globals requestAnimationFrame, cancelAnimationFrame */
  var raf = {
    next: typeof requestAnimationFrame === 'function'
      ? function (cb) { return requestAnimationFrame(cb) }
      : function (cb) { return setTimeout(cb, 16) },
    cancel: typeof cancelAnimationFrame === 'function'
      ? function (raf) { return cancelAnimationFrame(raf) }
      : clearTimeout
  };

  /* globals performance */
  var clock = (typeof performance !== 'undefined' && performance.now)
      ? function () { return performance.now() }
      : function () { return +(new Date()) };

  function createStringStore () {
    var stringIds = { '': 0 };
    var stringValues = [''];
    return {
      id: function (str) {
        var result = stringIds[str];
        if (result) {
          return result
        }
        result = stringIds[str] = stringValues.length;
        stringValues.push(str);
        return result
      },

      str: function (id) {
        return stringValues[id]
      }
    }
  }

  // Context and canvas creation helper functions

  function createCanvas (element, onDone, pixelRatio) {
    var canvas = document.createElement('canvas');
    extend(canvas.style, {
      border: 0,
      margin: 0,
      padding: 0,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    });
    element.appendChild(canvas);

    if (element === document.body) {
      canvas.style.position = 'absolute';
      extend(element.style, {
        margin: 0,
        padding: 0
      });
    }

    function resize () {
      var w = window.innerWidth;
      var h = window.innerHeight;
      if (element !== document.body) {
        var bounds = canvas.getBoundingClientRect();
        w = bounds.right - bounds.left;
        h = bounds.bottom - bounds.top;
      }
      canvas.width = pixelRatio * w;
      canvas.height = pixelRatio * h;
    }

    var resizeObserver;
    if (element !== document.body && typeof ResizeObserver === 'function') {
      // ignore 'ResizeObserver' is not defined
      // eslint-disable-next-line
      resizeObserver = new ResizeObserver(function () {
        // setTimeout to avoid flicker
        setTimeout(resize);
      });
      resizeObserver.observe(element);
    } else {
      window.addEventListener('resize', resize, false);
    }

    function onDestroy () {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', resize);
      }
      element.removeChild(canvas);
    }

    resize();

    return {
      canvas: canvas,
      onDestroy: onDestroy
    }
  }

  function createContext (canvas, contextAttributes) {
    function get (name) {
      try {
        return canvas.getContext(name, contextAttributes)
      } catch (e) {
        return null
      }
    }
    return (
      get('webgl') ||
      get('experimental-webgl') ||
      get('webgl-experimental')
    )
  }

  function isHTMLElement (obj) {
    return (
      typeof obj.nodeName === 'string' &&
      typeof obj.appendChild === 'function' &&
      typeof obj.getBoundingClientRect === 'function'
    )
  }

  function isWebGLContext (obj) {
    return (
      typeof obj.drawArrays === 'function' ||
      typeof obj.drawElements === 'function'
    )
  }

  function parseExtensions (input) {
    if (typeof input === 'string') {
      return input.split()
    }
    
    return input
  }

  function getElement (desc) {
    if (typeof desc === 'string') {
      
      return document.querySelector(desc)
    }
    return desc
  }

  function parseArgs (args_) {
    var args = args_ || {};
    var element, container, canvas, gl;
    var contextAttributes = {};
    var extensions = [];
    var optionalExtensions = [];
    var pixelRatio = (typeof window === 'undefined' ? 1 : window.devicePixelRatio);
    var profile = false;
    var onDone = function (err) {
    };
    var onDestroy = function () {};
    if (typeof args === 'string') {
      
      element = document.querySelector(args);
      
    } else if (typeof args === 'object') {
      if (isHTMLElement(args)) {
        element = args;
      } else if (isWebGLContext(args)) {
        gl = args;
        canvas = gl.canvas;
      } else {
        
        if ('gl' in args) {
          gl = args.gl;
        } else if ('canvas' in args) {
          canvas = getElement(args.canvas);
        } else if ('container' in args) {
          container = getElement(args.container);
        }
        if ('attributes' in args) {
          contextAttributes = args.attributes;
          
        }
        if ('extensions' in args) {
          extensions = parseExtensions(args.extensions);
        }
        if ('optionalExtensions' in args) {
          optionalExtensions = parseExtensions(args.optionalExtensions);
        }
        if ('onDone' in args) {
          
          onDone = args.onDone;
        }
        if ('profile' in args) {
          profile = !!args.profile;
        }
        if ('pixelRatio' in args) {
          pixelRatio = +args.pixelRatio;
          
        }
      }
    } else ;

    if (element) {
      if (element.nodeName.toLowerCase() === 'canvas') {
        canvas = element;
      } else {
        container = element;
      }
    }

    if (!gl) {
      if (!canvas) {
        
        var result = createCanvas(container || document.body, onDone, pixelRatio);
        if (!result) {
          return null
        }
        canvas = result.canvas;
        onDestroy = result.onDestroy;
      }
      // workaround for chromium bug, premultiplied alpha value is platform dependent
      if (contextAttributes.premultipliedAlpha === undefined) contextAttributes.premultipliedAlpha = true;
      gl = createContext(canvas, contextAttributes);
    }

    if (!gl) {
      onDestroy();
      onDone('webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org');
      return null
    }

    return {
      gl: gl,
      canvas: canvas,
      container: container,
      extensions: extensions,
      optionalExtensions: optionalExtensions,
      pixelRatio: pixelRatio,
      profile: profile,
      onDone: onDone,
      onDestroy: onDestroy
    }
  }

  function createExtensionCache (gl, config) {
    var extensions = {};

    function tryLoadExtension (name_) {
      
      var name = name_.toLowerCase();
      var ext;
      try {
        ext = extensions[name] = gl.getExtension(name);
      } catch (e) {}
      return !!ext
    }

    for (var i = 0; i < config.extensions.length; ++i) {
      var name = config.extensions[i];
      if (!tryLoadExtension(name)) {
        config.onDestroy();
        config.onDone('"' + name + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser');
        return null
      }
    }

    config.optionalExtensions.forEach(tryLoadExtension);

    return {
      extensions: extensions,
      restore: function () {
        Object.keys(extensions).forEach(function (name) {
          if (extensions[name] && !tryLoadExtension(name)) {
            throw new Error('(regl): error restoring extension ' + name)
          }
        });
      }
    }
  }

  function loop (n, f) {
    var result = Array(n);
    for (var i = 0; i < n; ++i) {
      result[i] = f(i);
    }
    return result
  }

  var GL_BYTE = 5120;
  var GL_UNSIGNED_BYTE$1 = 5121;
  var GL_SHORT = 5122;
  var GL_UNSIGNED_SHORT = 5123;
  var GL_INT = 5124;
  var GL_UNSIGNED_INT = 5125;
  var GL_FLOAT$1 = 5126;

  function nextPow16 (v) {
    for (var i = 16; i <= (1 << 28); i *= 16) {
      if (v <= i) {
        return i
      }
    }
    return 0
  }

  function log2 (v) {
    var r, shift;
    r = (v > 0xFFFF) << 4;
    v >>>= r;
    shift = (v > 0xFF) << 3;
    v >>>= shift; r |= shift;
    shift = (v > 0xF) << 2;
    v >>>= shift; r |= shift;
    shift = (v > 0x3) << 1;
    v >>>= shift; r |= shift;
    return r | (v >> 1)
  }

  function createPool () {
    var bufferPool = loop(8, function () {
      return []
    });

    function alloc (n) {
      var sz = nextPow16(n);
      var bin = bufferPool[log2(sz) >> 2];
      if (bin.length > 0) {
        return bin.pop()
      }
      return new ArrayBuffer(sz)
    }

    function free (buf) {
      bufferPool[log2(buf.byteLength) >> 2].push(buf);
    }

    function allocType (type, n) {
      var result = null;
      switch (type) {
        case GL_BYTE:
          result = new Int8Array(alloc(n), 0, n);
          break
        case GL_UNSIGNED_BYTE$1:
          result = new Uint8Array(alloc(n), 0, n);
          break
        case GL_SHORT:
          result = new Int16Array(alloc(2 * n), 0, n);
          break
        case GL_UNSIGNED_SHORT:
          result = new Uint16Array(alloc(2 * n), 0, n);
          break
        case GL_INT:
          result = new Int32Array(alloc(4 * n), 0, n);
          break
        case GL_UNSIGNED_INT:
          result = new Uint32Array(alloc(4 * n), 0, n);
          break
        case GL_FLOAT$1:
          result = new Float32Array(alloc(4 * n), 0, n);
          break
        default:
          return null
      }
      if (result.length !== n) {
        return result.subarray(0, n)
      }
      return result
    }

    function freeType (array) {
      free(array.buffer);
    }

    return {
      alloc: alloc,
      free: free,
      allocType: allocType,
      freeType: freeType
    }
  }

  var pool = createPool();

  // zero pool for initial zero data
  pool.zero = createPool();

  var GL_SUBPIXEL_BITS = 0x0D50;
  var GL_RED_BITS = 0x0D52;
  var GL_GREEN_BITS = 0x0D53;
  var GL_BLUE_BITS = 0x0D54;
  var GL_ALPHA_BITS = 0x0D55;
  var GL_DEPTH_BITS = 0x0D56;
  var GL_STENCIL_BITS = 0x0D57;

  var GL_ALIASED_POINT_SIZE_RANGE = 0x846D;
  var GL_ALIASED_LINE_WIDTH_RANGE = 0x846E;

  var GL_MAX_TEXTURE_SIZE = 0x0D33;
  var GL_MAX_VIEWPORT_DIMS = 0x0D3A;
  var GL_MAX_VERTEX_ATTRIBS = 0x8869;
  var GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;
  var GL_MAX_VARYING_VECTORS = 0x8DFC;
  var GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
  var GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C;
  var GL_MAX_TEXTURE_IMAGE_UNITS = 0x8872;
  var GL_MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;
  var GL_MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;
  var GL_MAX_RENDERBUFFER_SIZE = 0x84E8;

  var GL_VENDOR = 0x1F00;
  var GL_RENDERER = 0x1F01;
  var GL_VERSION = 0x1F02;
  var GL_SHADING_LANGUAGE_VERSION = 0x8B8C;

  var GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;

  var GL_MAX_COLOR_ATTACHMENTS_WEBGL = 0x8CDF;
  var GL_MAX_DRAW_BUFFERS_WEBGL = 0x8824;

  var GL_TEXTURE_2D = 0x0DE1;
  var GL_TEXTURE_CUBE_MAP = 0x8513;
  var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
  var GL_TEXTURE0 = 0x84C0;
  var GL_RGBA = 0x1908;
  var GL_FLOAT = 0x1406;
  var GL_UNSIGNED_BYTE = 0x1401;
  var GL_FRAMEBUFFER = 0x8D40;
  var GL_FRAMEBUFFER_COMPLETE = 0x8CD5;
  var GL_COLOR_ATTACHMENT0 = 0x8CE0;
  var GL_COLOR_BUFFER_BIT$1 = 0x4000;

  var wrapLimits = function (gl, extensions) {
    var maxAnisotropic = 1;
    if (extensions.ext_texture_filter_anisotropic) {
      maxAnisotropic = gl.getParameter(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    }

    var maxDrawbuffers = 1;
    var maxColorAttachments = 1;
    if (extensions.webgl_draw_buffers) {
      maxDrawbuffers = gl.getParameter(GL_MAX_DRAW_BUFFERS_WEBGL);
      maxColorAttachments = gl.getParameter(GL_MAX_COLOR_ATTACHMENTS_WEBGL);
    }

    // detect if reading float textures is available (Safari doesn't support)
    var readFloat = !!extensions.oes_texture_float;
    if (readFloat) {
      var readFloatTexture = gl.createTexture();
      gl.bindTexture(GL_TEXTURE_2D, readFloatTexture);
      gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 1, 1, 0, GL_RGBA, GL_FLOAT, null);

      var fbo = gl.createFramebuffer();
      gl.bindFramebuffer(GL_FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, readFloatTexture, 0);
      gl.bindTexture(GL_TEXTURE_2D, null);

      if (gl.checkFramebufferStatus(GL_FRAMEBUFFER) !== GL_FRAMEBUFFER_COMPLETE) readFloat = false;

      else {
        gl.viewport(0, 0, 1, 1);
        gl.clearColor(1.0, 0.0, 0.0, 1.0);
        gl.clear(GL_COLOR_BUFFER_BIT$1);
        var pixels = pool.allocType(GL_FLOAT, 4);
        gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_FLOAT, pixels);

        if (gl.getError()) readFloat = false;
        else {
          gl.deleteFramebuffer(fbo);
          gl.deleteTexture(readFloatTexture);

          readFloat = pixels[0] === 1.0;
        }

        pool.freeType(pixels);
      }
    }

    // detect non power of two cube textures support (IE doesn't support)
    var isIE = typeof navigator !== 'undefined' && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent));

    var npotTextureCube = true;

    if (!isIE) {
      var cubeTexture = gl.createTexture();
      var data = pool.allocType(GL_UNSIGNED_BYTE, 36);
      gl.activeTexture(GL_TEXTURE0);
      gl.bindTexture(GL_TEXTURE_CUBE_MAP, cubeTexture);
      gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X, 0, GL_RGBA, 3, 3, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
      pool.freeType(data);
      gl.bindTexture(GL_TEXTURE_CUBE_MAP, null);
      gl.deleteTexture(cubeTexture);
      npotTextureCube = !gl.getError();
    }

    return {
      // drawing buffer bit depth
      colorBits: [
        gl.getParameter(GL_RED_BITS),
        gl.getParameter(GL_GREEN_BITS),
        gl.getParameter(GL_BLUE_BITS),
        gl.getParameter(GL_ALPHA_BITS)
      ],
      depthBits: gl.getParameter(GL_DEPTH_BITS),
      stencilBits: gl.getParameter(GL_STENCIL_BITS),
      subpixelBits: gl.getParameter(GL_SUBPIXEL_BITS),

      // supported extensions
      extensions: Object.keys(extensions).filter(function (ext) {
        return !!extensions[ext]
      }),

      // max aniso samples
      maxAnisotropic: maxAnisotropic,

      // max draw buffers
      maxDrawbuffers: maxDrawbuffers,
      maxColorAttachments: maxColorAttachments,

      // point and line size ranges
      pointSizeDims: gl.getParameter(GL_ALIASED_POINT_SIZE_RANGE),
      lineWidthDims: gl.getParameter(GL_ALIASED_LINE_WIDTH_RANGE),
      maxViewportDims: gl.getParameter(GL_MAX_VIEWPORT_DIMS),
      maxCombinedTextureUnits: gl.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS),
      maxCubeMapSize: gl.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE),
      maxRenderbufferSize: gl.getParameter(GL_MAX_RENDERBUFFER_SIZE),
      maxTextureUnits: gl.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS),
      maxTextureSize: gl.getParameter(GL_MAX_TEXTURE_SIZE),
      maxAttributes: gl.getParameter(GL_MAX_VERTEX_ATTRIBS),
      maxVertexUniforms: gl.getParameter(GL_MAX_VERTEX_UNIFORM_VECTORS),
      maxVertexTextureUnits: gl.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS),
      maxVaryingVectors: gl.getParameter(GL_MAX_VARYING_VECTORS),
      maxFragmentUniforms: gl.getParameter(GL_MAX_FRAGMENT_UNIFORM_VECTORS),

      // vendor info
      glsl: gl.getParameter(GL_SHADING_LANGUAGE_VERSION),
      renderer: gl.getParameter(GL_RENDERER),
      vendor: gl.getParameter(GL_VENDOR),
      version: gl.getParameter(GL_VERSION),

      // quirks
      readFloat: readFloat,
      npotTextureCube: npotTextureCube
    }
  };

  var isTypedArray = function (x) {
    return (
      x instanceof Uint8Array ||
      x instanceof Uint16Array ||
      x instanceof Uint32Array ||
      x instanceof Int8Array ||
      x instanceof Int16Array ||
      x instanceof Int32Array ||
      x instanceof Float32Array ||
      x instanceof Float64Array ||
      x instanceof Uint8ClampedArray
    )
  };

  function isNDArrayLike (obj) {
    return (
      !!obj &&
      typeof obj === 'object' &&
      Array.isArray(obj.shape) &&
      Array.isArray(obj.stride) &&
      typeof obj.offset === 'number' &&
      obj.shape.length === obj.stride.length &&
      (Array.isArray(obj.data) ||
        isTypedArray(obj.data)))
  }

  var values = function (obj) {
    return Object.keys(obj).map(function (key) { return obj[key] })
  };

  var flattenUtils = {
    shape: arrayShape$1,
    flatten: flattenArray
  };

  function flatten1D (array, nx, out) {
    for (var i = 0; i < nx; ++i) {
      out[i] = array[i];
    }
  }

  function flatten2D (array, nx, ny, out) {
    var ptr = 0;
    for (var i = 0; i < nx; ++i) {
      var row = array[i];
      for (var j = 0; j < ny; ++j) {
        out[ptr++] = row[j];
      }
    }
  }

  function flatten3D (array, nx, ny, nz, out, ptr_) {
    var ptr = ptr_;
    for (var i = 0; i < nx; ++i) {
      var row = array[i];
      for (var j = 0; j < ny; ++j) {
        var col = row[j];
        for (var k = 0; k < nz; ++k) {
          out[ptr++] = col[k];
        }
      }
    }
  }

  function flattenRec (array, shape, level, out, ptr) {
    var stride = 1;
    for (var i = level + 1; i < shape.length; ++i) {
      stride *= shape[i];
    }
    var n = shape[level];
    if (shape.length - level === 4) {
      var nx = shape[level + 1];
      var ny = shape[level + 2];
      var nz = shape[level + 3];
      for (i = 0; i < n; ++i) {
        flatten3D(array[i], nx, ny, nz, out, ptr);
        ptr += stride;
      }
    } else {
      for (i = 0; i < n; ++i) {
        flattenRec(array[i], shape, level + 1, out, ptr);
        ptr += stride;
      }
    }
  }

  function flattenArray (array, shape, type, out_) {
    var sz = 1;
    if (shape.length) {
      for (var i = 0; i < shape.length; ++i) {
        sz *= shape[i];
      }
    } else {
      sz = 0;
    }
    var out = out_ || pool.allocType(type, sz);
    switch (shape.length) {
      case 0:
        break
      case 1:
        flatten1D(array, shape[0], out);
        break
      case 2:
        flatten2D(array, shape[0], shape[1], out);
        break
      case 3:
        flatten3D(array, shape[0], shape[1], shape[2], out, 0);
        break
      default:
        flattenRec(array, shape, 0, out, 0);
    }
    return out
  }

  function arrayShape$1 (array_) {
    var shape = [];
    for (var array = array_; array.length; array = array[0]) {
      shape.push(array.length);
    }
    return shape
  }

  var arrayTypes = {
  	"[object Int8Array]": 5120,
  	"[object Int16Array]": 5122,
  	"[object Int32Array]": 5124,
  	"[object Uint8Array]": 5121,
  	"[object Uint8ClampedArray]": 5121,
  	"[object Uint16Array]": 5123,
  	"[object Uint32Array]": 5125,
  	"[object Float32Array]": 5126,
  	"[object Float64Array]": 5121,
  	"[object ArrayBuffer]": 5121
  };

  var int8 = 5120;
  var int16 = 5122;
  var int32 = 5124;
  var uint8 = 5121;
  var uint16 = 5123;
  var uint32 = 5125;
  var float = 5126;
  var float32 = 5126;
  var glTypes = {
  	int8: int8,
  	int16: int16,
  	int32: int32,
  	uint8: uint8,
  	uint16: uint16,
  	uint32: uint32,
  	float: float,
  	float32: float32
  };

  var dynamic$1 = 35048;
  var stream = 35040;
  var usageTypes = {
  	dynamic: dynamic$1,
  	stream: stream,
  	"static": 35044
  };

  var arrayFlatten = flattenUtils.flatten;
  var arrayShape = flattenUtils.shape;

  var GL_STATIC_DRAW = 0x88E4;
  var GL_STREAM_DRAW = 0x88E0;

  var GL_UNSIGNED_BYTE$2 = 5121;
  var GL_FLOAT$2 = 5126;

  var DTYPES_SIZES = [];
  DTYPES_SIZES[5120] = 1; // int8
  DTYPES_SIZES[5122] = 2; // int16
  DTYPES_SIZES[5124] = 4; // int32
  DTYPES_SIZES[5121] = 1; // uint8
  DTYPES_SIZES[5123] = 2; // uint16
  DTYPES_SIZES[5125] = 4; // uint32
  DTYPES_SIZES[5126] = 4; // float32

  function typedArrayCode (data) {
    return arrayTypes[Object.prototype.toString.call(data)] | 0
  }

  function copyArray (out, inp) {
    for (var i = 0; i < inp.length; ++i) {
      out[i] = inp[i];
    }
  }

  function transpose (
    result, data, shapeX, shapeY, strideX, strideY, offset) {
    var ptr = 0;
    for (var i = 0; i < shapeX; ++i) {
      for (var j = 0; j < shapeY; ++j) {
        result[ptr++] = data[strideX * i + strideY * j + offset];
      }
    }
  }

  function wrapBufferState (gl, stats, config, destroyBuffer) {
    var bufferCount = 0;
    var bufferSet = {};

    function REGLBuffer (type) {
      this.id = bufferCount++;
      this.buffer = gl.createBuffer();
      this.type = type;
      this.usage = GL_STATIC_DRAW;
      this.byteLength = 0;
      this.dimension = 1;
      this.dtype = GL_UNSIGNED_BYTE$2;

      this.persistentData = null;

      if (config.profile) {
        this.stats = { size: 0 };
      }
    }

    REGLBuffer.prototype.bind = function () {
      gl.bindBuffer(this.type, this.buffer);
    };

    REGLBuffer.prototype.destroy = function () {
      destroy(this);
    };

    var streamPool = [];

    function createStream (type, data) {
      var buffer = streamPool.pop();
      if (!buffer) {
        buffer = new REGLBuffer(type);
      }
      buffer.bind();
      initBufferFromData(buffer, data, GL_STREAM_DRAW, 0, 1, false);
      return buffer
    }

    function destroyStream (stream$$1) {
      streamPool.push(stream$$1);
    }

    function initBufferFromTypedArray (buffer, data, usage) {
      buffer.byteLength = data.byteLength;
      gl.bufferData(buffer.type, data, usage);
    }

    function initBufferFromData (buffer, data, usage, dtype, dimension, persist) {
      var shape;
      buffer.usage = usage;
      if (Array.isArray(data)) {
        buffer.dtype = dtype || GL_FLOAT$2;
        if (data.length > 0) {
          var flatData;
          if (Array.isArray(data[0])) {
            shape = arrayShape(data);
            var dim = 1;
            for (var i = 1; i < shape.length; ++i) {
              dim *= shape[i];
            }
            buffer.dimension = dim;
            flatData = arrayFlatten(data, shape, buffer.dtype);
            initBufferFromTypedArray(buffer, flatData, usage);
            if (persist) {
              buffer.persistentData = flatData;
            } else {
              pool.freeType(flatData);
            }
          } else if (typeof data[0] === 'number') {
            buffer.dimension = dimension;
            var typedData = pool.allocType(buffer.dtype, data.length);
            copyArray(typedData, data);
            initBufferFromTypedArray(buffer, typedData, usage);
            if (persist) {
              buffer.persistentData = typedData;
            } else {
              pool.freeType(typedData);
            }
          } else if (isTypedArray(data[0])) {
            buffer.dimension = data[0].length;
            buffer.dtype = dtype || typedArrayCode(data[0]) || GL_FLOAT$2;
            flatData = arrayFlatten(
              data,
              [data.length, data[0].length],
              buffer.dtype);
            initBufferFromTypedArray(buffer, flatData, usage);
            if (persist) {
              buffer.persistentData = flatData;
            } else {
              pool.freeType(flatData);
            }
          } else ;
        }
      } else if (isTypedArray(data)) {
        buffer.dtype = dtype || typedArrayCode(data);
        buffer.dimension = dimension;
        initBufferFromTypedArray(buffer, data, usage);
        if (persist) {
          buffer.persistentData = new Uint8Array(new Uint8Array(data.buffer));
        }
      } else if (isNDArrayLike(data)) {
        shape = data.shape;
        var stride = data.stride;
        var offset = data.offset;

        var shapeX = 0;
        var shapeY = 0;
        var strideX = 0;
        var strideY = 0;
        if (shape.length === 1) {
          shapeX = shape[0];
          shapeY = 1;
          strideX = stride[0];
          strideY = 0;
        } else if (shape.length === 2) {
          shapeX = shape[0];
          shapeY = shape[1];
          strideX = stride[0];
          strideY = stride[1];
        } else ;

        buffer.dtype = dtype || typedArrayCode(data.data) || GL_FLOAT$2;
        buffer.dimension = shapeY;

        var transposeData = pool.allocType(buffer.dtype, shapeX * shapeY);
        transpose(transposeData,
          data.data,
          shapeX, shapeY,
          strideX, strideY,
          offset);
        initBufferFromTypedArray(buffer, transposeData, usage);
        if (persist) {
          buffer.persistentData = transposeData;
        } else {
          pool.freeType(transposeData);
        }
      } else if (data instanceof ArrayBuffer) {
        buffer.dtype = GL_UNSIGNED_BYTE$2;
        buffer.dimension = dimension;
        initBufferFromTypedArray(buffer, data, usage);
        if (persist) {
          buffer.persistentData = new Uint8Array(new Uint8Array(data));
        }
      } else ;
    }

    function destroy (buffer) {
      stats.bufferCount--;

      // remove attribute link
      destroyBuffer(buffer);

      var handle = buffer.buffer;
      
      gl.deleteBuffer(handle);
      buffer.buffer = null;
      delete bufferSet[buffer.id];
    }

    function createBuffer (options, type, deferInit, persistent) {
      stats.bufferCount++;

      var buffer = new REGLBuffer(type);
      bufferSet[buffer.id] = buffer;

      function reglBuffer (options) {
        var usage = GL_STATIC_DRAW;
        var data = null;
        var byteLength = 0;
        var dtype = 0;
        var dimension = 1;
        if (Array.isArray(options) ||
            isTypedArray(options) ||
            isNDArrayLike(options) ||
            options instanceof ArrayBuffer) {
          data = options;
        } else if (typeof options === 'number') {
          byteLength = options | 0;
        } else if (options) {
          

          if ('data' in options) {
            
            data = options.data;
          }

          if ('usage' in options) {
            
            usage = usageTypes[options.usage];
          }

          if ('type' in options) {
            
            dtype = glTypes[options.type];
          }

          if ('dimension' in options) {
            
            dimension = options.dimension | 0;
          }

          if ('length' in options) {
            
            byteLength = options.length | 0;
          }
        }

        buffer.bind();
        if (!data) {
          // #475
          if (byteLength) gl.bufferData(buffer.type, byteLength, usage);
          buffer.dtype = dtype || GL_UNSIGNED_BYTE$2;
          buffer.usage = usage;
          buffer.dimension = dimension;
          buffer.byteLength = byteLength;
        } else {
          initBufferFromData(buffer, data, usage, dtype, dimension, persistent);
        }

        if (config.profile) {
          buffer.stats.size = buffer.byteLength * DTYPES_SIZES[buffer.dtype];
        }

        return reglBuffer
      }

      function setSubData (data, offset) {
        

        gl.bufferSubData(buffer.type, offset, data);
      }

      function subdata (data, offset_) {
        var offset = (offset_ || 0) | 0;
        var shape;
        buffer.bind();
        if (isTypedArray(data) || data instanceof ArrayBuffer) {
          setSubData(data, offset);
        } else if (Array.isArray(data)) {
          if (data.length > 0) {
            if (typeof data[0] === 'number') {
              var converted = pool.allocType(buffer.dtype, data.length);
              copyArray(converted, data);
              setSubData(converted, offset);
              pool.freeType(converted);
            } else if (Array.isArray(data[0]) || isTypedArray(data[0])) {
              shape = arrayShape(data);
              var flatData = arrayFlatten(data, shape, buffer.dtype);
              setSubData(flatData, offset);
              pool.freeType(flatData);
            } else ;
          }
        } else if (isNDArrayLike(data)) {
          shape = data.shape;
          var stride = data.stride;

          var shapeX = 0;
          var shapeY = 0;
          var strideX = 0;
          var strideY = 0;
          if (shape.length === 1) {
            shapeX = shape[0];
            shapeY = 1;
            strideX = stride[0];
            strideY = 0;
          } else if (shape.length === 2) {
            shapeX = shape[0];
            shapeY = shape[1];
            strideX = stride[0];
            strideY = stride[1];
          } else ;
          var dtype = Array.isArray(data.data)
            ? buffer.dtype
            : typedArrayCode(data.data);

          var transposeData = pool.allocType(dtype, shapeX * shapeY);
          transpose(transposeData,
            data.data,
            shapeX, shapeY,
            strideX, strideY,
            data.offset);
          setSubData(transposeData, offset);
          pool.freeType(transposeData);
        } else ;
        return reglBuffer
      }

      if (!deferInit) {
        reglBuffer(options);
      }

      reglBuffer._reglType = 'buffer';
      reglBuffer._buffer = buffer;
      reglBuffer.subdata = subdata;
      if (config.profile) {
        reglBuffer.stats = buffer.stats;
      }
      reglBuffer.destroy = function () { destroy(buffer); };

      return reglBuffer
    }

    function restoreBuffers () {
      values(bufferSet).forEach(function (buffer) {
        buffer.buffer = gl.createBuffer();
        gl.bindBuffer(buffer.type, buffer.buffer);
        gl.bufferData(
          buffer.type, buffer.persistentData || buffer.byteLength, buffer.usage);
      });
    }

    if (config.profile) {
      stats.getTotalBufferSize = function () {
        var total = 0;
        // TODO: Right now, the streams are not part of the total count.
        Object.keys(bufferSet).forEach(function (key) {
          total += bufferSet[key].stats.size;
        });
        return total
      };
    }

    return {
      create: createBuffer,

      createStream: createStream,
      destroyStream: destroyStream,

      clear: function () {
        values(bufferSet).forEach(destroy);
        streamPool.forEach(destroy);
      },

      getBuffer: function (wrapper) {
        if (wrapper && wrapper._buffer instanceof REGLBuffer) {
          return wrapper._buffer
        }
        return null
      },

      restore: restoreBuffers,

      _initBuffer: initBufferFromData
    }
  }

  var points = 0;
  var point = 0;
  var lines = 1;
  var line = 1;
  var triangles = 4;
  var triangle = 4;
  var primTypes = {
  	points: points,
  	point: point,
  	lines: lines,
  	line: line,
  	triangles: triangles,
  	triangle: triangle,
  	"line loop": 2,
  	"line strip": 3,
  	"triangle strip": 5,
  	"triangle fan": 6
  };

  var GL_POINTS = 0;
  var GL_LINES = 1;
  var GL_TRIANGLES = 4;

  var GL_BYTE$1 = 5120;
  var GL_UNSIGNED_BYTE$3 = 5121;
  var GL_SHORT$1 = 5122;
  var GL_UNSIGNED_SHORT$1 = 5123;
  var GL_INT$1 = 5124;
  var GL_UNSIGNED_INT$1 = 5125;

  var GL_ELEMENT_ARRAY_BUFFER = 34963;

  var GL_STREAM_DRAW$1 = 0x88E0;
  var GL_STATIC_DRAW$1 = 0x88E4;

  function wrapElementsState (gl, extensions, bufferState, stats) {
    var elementSet = {};
    var elementCount = 0;

    var elementTypes = {
      'uint8': GL_UNSIGNED_BYTE$3,
      'uint16': GL_UNSIGNED_SHORT$1
    };

    if (extensions.oes_element_index_uint) {
      elementTypes.uint32 = GL_UNSIGNED_INT$1;
    }

    function REGLElementBuffer (buffer) {
      this.id = elementCount++;
      elementSet[this.id] = this;
      this.buffer = buffer;
      this.primType = GL_TRIANGLES;
      this.vertCount = 0;
      this.type = 0;
    }

    REGLElementBuffer.prototype.bind = function () {
      this.buffer.bind();
    };

    var bufferPool = [];

    function createElementStream (data) {
      var result = bufferPool.pop();
      if (!result) {
        result = new REGLElementBuffer(bufferState.create(
          null,
          GL_ELEMENT_ARRAY_BUFFER,
          true,
          false)._buffer);
      }
      initElements(result, data, GL_STREAM_DRAW$1, -1, -1, 0, 0);
      return result
    }

    function destroyElementStream (elements) {
      bufferPool.push(elements);
    }

    function initElements (
      elements,
      data,
      usage,
      prim,
      count,
      byteLength,
      type) {
      elements.buffer.bind();
      var dtype;
      if (data) {
        var predictedType = type;
        if (!type && (
          !isTypedArray(data) ||
           (isNDArrayLike(data) && !isTypedArray(data.data)))) {
          predictedType = extensions.oes_element_index_uint
            ? GL_UNSIGNED_INT$1
            : GL_UNSIGNED_SHORT$1;
        }
        bufferState._initBuffer(
          elements.buffer,
          data,
          usage,
          predictedType,
          3);
      } else {
        gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, byteLength, usage);
        elements.buffer.dtype = dtype || GL_UNSIGNED_BYTE$3;
        elements.buffer.usage = usage;
        elements.buffer.dimension = 3;
        elements.buffer.byteLength = byteLength;
      }

      dtype = type;
      if (!type) {
        switch (elements.buffer.dtype) {
          case GL_UNSIGNED_BYTE$3:
          case GL_BYTE$1:
            dtype = GL_UNSIGNED_BYTE$3;
            break

          case GL_UNSIGNED_SHORT$1:
          case GL_SHORT$1:
            dtype = GL_UNSIGNED_SHORT$1;
            break

          case GL_UNSIGNED_INT$1:
          case GL_INT$1:
            dtype = GL_UNSIGNED_INT$1;
            break
            
        }
        elements.buffer.dtype = dtype;
      }
      elements.type = dtype;

      // Check oes_element_index_uint extension
      

      // try to guess default primitive type and arguments
      var vertCount = count;
      if (vertCount < 0) {
        vertCount = elements.buffer.byteLength;
        if (dtype === GL_UNSIGNED_SHORT$1) {
          vertCount >>= 1;
        } else if (dtype === GL_UNSIGNED_INT$1) {
          vertCount >>= 2;
        }
      }
      elements.vertCount = vertCount;

      // try to guess primitive type from cell dimension
      var primType = prim;
      if (prim < 0) {
        primType = GL_TRIANGLES;
        var dimension = elements.buffer.dimension;
        if (dimension === 1) primType = GL_POINTS;
        if (dimension === 2) primType = GL_LINES;
        if (dimension === 3) primType = GL_TRIANGLES;
      }
      elements.primType = primType;
    }

    function destroyElements (elements) {
      stats.elementsCount--;

      
      delete elementSet[elements.id];
      elements.buffer.destroy();
      elements.buffer = null;
    }

    function createElements (options, persistent) {
      var buffer = bufferState.create(null, GL_ELEMENT_ARRAY_BUFFER, true);
      var elements = new REGLElementBuffer(buffer._buffer);
      stats.elementsCount++;

      function reglElements (options) {
        if (!options) {
          buffer();
          elements.primType = GL_TRIANGLES;
          elements.vertCount = 0;
          elements.type = GL_UNSIGNED_BYTE$3;
        } else if (typeof options === 'number') {
          buffer(options);
          elements.primType = GL_TRIANGLES;
          elements.vertCount = options | 0;
          elements.type = GL_UNSIGNED_BYTE$3;
        } else {
          var data = null;
          var usage = GL_STATIC_DRAW$1;
          var primType = -1;
          var vertCount = -1;
          var byteLength = 0;
          var dtype = 0;
          if (Array.isArray(options) ||
              isTypedArray(options) ||
              isNDArrayLike(options)) {
            data = options;
          } else {
            
            if ('data' in options) {
              data = options.data;
              
            }
            if ('usage' in options) {
              
              usage = usageTypes[options.usage];
            }
            if ('primitive' in options) {
              
              primType = primTypes[options.primitive];
            }
            if ('count' in options) {
              
              vertCount = options.count | 0;
            }
            if ('type' in options) {
              
              dtype = elementTypes[options.type];
            }
            if ('length' in options) {
              byteLength = options.length | 0;
            } else {
              byteLength = vertCount;
              if (dtype === GL_UNSIGNED_SHORT$1 || dtype === GL_SHORT$1) {
                byteLength *= 2;
              } else if (dtype === GL_UNSIGNED_INT$1 || dtype === GL_INT$1) {
                byteLength *= 4;
              }
            }
          }
          initElements(
            elements,
            data,
            usage,
            primType,
            vertCount,
            byteLength,
            dtype);
        }

        return reglElements
      }

      reglElements(options);

      reglElements._reglType = 'elements';
      reglElements._elements = elements;
      reglElements.subdata = function (data, offset) {
        buffer.subdata(data, offset);
        return reglElements
      };
      reglElements.destroy = function () {
        destroyElements(elements);
      };

      return reglElements
    }

    return {
      create: createElements,
      createStream: createElementStream,
      destroyStream: destroyElementStream,
      getElements: function (elements) {
        if (typeof elements === 'function' &&
            elements._elements instanceof REGLElementBuffer) {
          return elements._elements
        }
        return null
      },
      clear: function () {
        values(elementSet).forEach(destroyElements);
      }
    }
  }

  var FLOAT = new Float32Array(1);
  var INT = new Uint32Array(FLOAT.buffer);

  var GL_UNSIGNED_SHORT$3 = 5123;

  function convertToHalfFloat (array) {
    var ushorts = pool.allocType(GL_UNSIGNED_SHORT$3, array.length);

    for (var i = 0; i < array.length; ++i) {
      if (isNaN(array[i])) {
        ushorts[i] = 0xffff;
      } else if (array[i] === Infinity) {
        ushorts[i] = 0x7c00;
      } else if (array[i] === -Infinity) {
        ushorts[i] = 0xfc00;
      } else {
        FLOAT[0] = array[i];
        var x = INT[0];

        var sgn = (x >>> 31) << 15;
        var exp = ((x << 1) >>> 24) - 127;
        var frac = (x >> 13) & ((1 << 10) - 1);

        if (exp < -24) {
          // round non-representable denormals to 0
          ushorts[i] = sgn;
        } else if (exp < -14) {
          // handle denormals
          var s = -14 - exp;
          ushorts[i] = sgn + ((frac + (1 << 10)) >> s);
        } else if (exp > 15) {
          // round overflow to +/- Infinity
          ushorts[i] = sgn + 0x7c00;
        } else {
          // otherwise convert directly
          ushorts[i] = sgn + ((exp + 15) << 10) + frac;
        }
      }
    }

    return ushorts
  }

  function isArrayLike (s) {
    return Array.isArray(s) || isTypedArray(s)
  }

  var GL_COMPRESSED_TEXTURE_FORMATS = 0x86A3;

  var GL_TEXTURE_2D$1 = 0x0DE1;
  var GL_TEXTURE_CUBE_MAP$1 = 0x8513;
  var GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 = 0x8515;

  var GL_RGBA$1 = 0x1908;
  var GL_ALPHA = 0x1906;
  var GL_RGB = 0x1907;
  var GL_LUMINANCE = 0x1909;
  var GL_LUMINANCE_ALPHA = 0x190A;

  var GL_RGBA4 = 0x8056;
  var GL_RGB5_A1 = 0x8057;
  var GL_RGB565 = 0x8D62;

  var GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033;
  var GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034;
  var GL_UNSIGNED_SHORT_5_6_5 = 0x8363;
  var GL_UNSIGNED_INT_24_8_WEBGL = 0x84FA;

  var GL_DEPTH_COMPONENT = 0x1902;
  var GL_DEPTH_STENCIL = 0x84F9;

  var GL_SRGB_EXT = 0x8C40;
  var GL_SRGB_ALPHA_EXT = 0x8C42;

  var GL_HALF_FLOAT_OES = 0x8D61;

  var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;
  var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;
  var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;
  var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;

  var GL_COMPRESSED_RGB_ATC_WEBGL = 0x8C92;
  var GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8C93;
  var GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87EE;

  var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
  var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
  var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
  var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

  var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;

  var GL_UNSIGNED_BYTE$4 = 0x1401;
  var GL_UNSIGNED_SHORT$2 = 0x1403;
  var GL_UNSIGNED_INT$2 = 0x1405;
  var GL_FLOAT$3 = 0x1406;

  var GL_TEXTURE_WRAP_S = 0x2802;
  var GL_TEXTURE_WRAP_T = 0x2803;

  var GL_REPEAT = 0x2901;
  var GL_CLAMP_TO_EDGE = 0x812F;
  var GL_MIRRORED_REPEAT = 0x8370;

  var GL_TEXTURE_MAG_FILTER = 0x2800;
  var GL_TEXTURE_MIN_FILTER = 0x2801;

  var GL_NEAREST = 0x2600;
  var GL_LINEAR = 0x2601;
  var GL_NEAREST_MIPMAP_NEAREST = 0x2700;
  var GL_LINEAR_MIPMAP_NEAREST = 0x2701;
  var GL_NEAREST_MIPMAP_LINEAR = 0x2702;
  var GL_LINEAR_MIPMAP_LINEAR = 0x2703;

  var GL_GENERATE_MIPMAP_HINT = 0x8192;
  var GL_DONT_CARE = 0x1100;
  var GL_FASTEST = 0x1101;
  var GL_NICEST = 0x1102;

  var GL_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE;

  var GL_UNPACK_ALIGNMENT = 0x0CF5;
  var GL_UNPACK_FLIP_Y_WEBGL = 0x9240;
  var GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
  var GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;

  var GL_BROWSER_DEFAULT_WEBGL = 0x9244;

  var GL_TEXTURE0$1 = 0x84C0;

  var MIPMAP_FILTERS = [
    GL_NEAREST_MIPMAP_NEAREST,
    GL_NEAREST_MIPMAP_LINEAR,
    GL_LINEAR_MIPMAP_NEAREST,
    GL_LINEAR_MIPMAP_LINEAR
  ];

  var CHANNELS_FORMAT = [
    0,
    GL_LUMINANCE,
    GL_LUMINANCE_ALPHA,
    GL_RGB,
    GL_RGBA$1
  ];

  var FORMAT_CHANNELS = {};
  FORMAT_CHANNELS[GL_LUMINANCE] =
  FORMAT_CHANNELS[GL_ALPHA] =
  FORMAT_CHANNELS[GL_DEPTH_COMPONENT] = 1;
  FORMAT_CHANNELS[GL_DEPTH_STENCIL] =
  FORMAT_CHANNELS[GL_LUMINANCE_ALPHA] = 2;
  FORMAT_CHANNELS[GL_RGB] =
  FORMAT_CHANNELS[GL_SRGB_EXT] = 3;
  FORMAT_CHANNELS[GL_RGBA$1] =
  FORMAT_CHANNELS[GL_SRGB_ALPHA_EXT] = 4;

  function objectName (str) {
    return '[object ' + str + ']'
  }

  var CANVAS_CLASS = objectName('HTMLCanvasElement');
  var OFFSCREENCANVAS_CLASS = objectName('OffscreenCanvas');
  var CONTEXT2D_CLASS = objectName('CanvasRenderingContext2D');
  var BITMAP_CLASS = objectName('ImageBitmap');
  var IMAGE_CLASS = objectName('HTMLImageElement');
  var VIDEO_CLASS = objectName('HTMLVideoElement');

  var PIXEL_CLASSES = Object.keys(arrayTypes).concat([
    CANVAS_CLASS,
    OFFSCREENCANVAS_CLASS,
    CONTEXT2D_CLASS,
    BITMAP_CLASS,
    IMAGE_CLASS,
    VIDEO_CLASS
  ]);

  // for every texture type, store
  // the size in bytes.
  var TYPE_SIZES = [];
  TYPE_SIZES[GL_UNSIGNED_BYTE$4] = 1;
  TYPE_SIZES[GL_FLOAT$3] = 4;
  TYPE_SIZES[GL_HALF_FLOAT_OES] = 2;

  TYPE_SIZES[GL_UNSIGNED_SHORT$2] = 2;
  TYPE_SIZES[GL_UNSIGNED_INT$2] = 4;

  var FORMAT_SIZES_SPECIAL = [];
  FORMAT_SIZES_SPECIAL[GL_RGBA4] = 2;
  FORMAT_SIZES_SPECIAL[GL_RGB5_A1] = 2;
  FORMAT_SIZES_SPECIAL[GL_RGB565] = 2;
  FORMAT_SIZES_SPECIAL[GL_DEPTH_STENCIL] = 4;

  FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5;
  FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5;
  FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1;
  FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1;

  FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ATC_WEBGL] = 0.5;
  FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1;
  FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1;

  FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5;
  FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25;
  FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5;
  FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25;

  FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ETC1_WEBGL] = 0.5;

  function isNumericArray (arr) {
    return (
      Array.isArray(arr) &&
      (arr.length === 0 ||
      typeof arr[0] === 'number'))
  }

  function isRectArray (arr) {
    if (!Array.isArray(arr)) {
      return false
    }
    var width = arr.length;
    if (width === 0 || !isArrayLike(arr[0])) {
      return false
    }
    return true
  }

  function classString (x) {
    return Object.prototype.toString.call(x)
  }

  function isCanvasElement (object) {
    return classString(object) === CANVAS_CLASS
  }

  function isOffscreenCanvas (object) {
    return classString(object) === OFFSCREENCANVAS_CLASS
  }

  function isContext2D (object) {
    return classString(object) === CONTEXT2D_CLASS
  }

  function isBitmap (object) {
    return classString(object) === BITMAP_CLASS
  }

  function isImageElement (object) {
    return classString(object) === IMAGE_CLASS
  }

  function isVideoElement (object) {
    return classString(object) === VIDEO_CLASS
  }

  function isPixelData (object) {
    if (!object) {
      return false
    }
    var className = classString(object);
    if (PIXEL_CLASSES.indexOf(className) >= 0) {
      return true
    }
    return (
      isNumericArray(object) ||
      isRectArray(object) ||
      isNDArrayLike(object))
  }

  function typedArrayCode$1 (data) {
    return arrayTypes[Object.prototype.toString.call(data)] | 0
  }

  function convertData (result, data) {
    var n = data.length;
    switch (result.type) {
      case GL_UNSIGNED_BYTE$4:
      case GL_UNSIGNED_SHORT$2:
      case GL_UNSIGNED_INT$2:
      case GL_FLOAT$3:
        var converted = pool.allocType(result.type, n);
        converted.set(data);
        result.data = converted;
        break

      case GL_HALF_FLOAT_OES:
        result.data = convertToHalfFloat(data);
        break
        
    }
  }

  function preConvert (image, n) {
    return pool.allocType(
      image.type === GL_HALF_FLOAT_OES
        ? GL_FLOAT$3
        : image.type, n)
  }

  function postConvert (image, data) {
    if (image.type === GL_HALF_FLOAT_OES) {
      image.data = convertToHalfFloat(data);
      pool.freeType(data);
    } else {
      image.data = data;
    }
  }

  function transposeData (image, array, strideX, strideY, strideC, offset) {
    var w = image.width;
    var h = image.height;
    var c = image.channels;
    var n = w * h * c;
    var data = preConvert(image, n);

    var p = 0;
    for (var i = 0; i < h; ++i) {
      for (var j = 0; j < w; ++j) {
        for (var k = 0; k < c; ++k) {
          data[p++] = array[strideX * j + strideY * i + strideC * k + offset];
        }
      }
    }

    postConvert(image, data);
  }

  function getTextureSize (format, type, width, height, isMipmap, isCube) {
    var s;
    if (typeof FORMAT_SIZES_SPECIAL[format] !== 'undefined') {
      // we have a special array for dealing with weird color formats such as RGB5A1
      s = FORMAT_SIZES_SPECIAL[format];
    } else {
      s = FORMAT_CHANNELS[format] * TYPE_SIZES[type];
    }

    if (isCube) {
      s *= 6;
    }

    if (isMipmap) {
      // compute the total size of all the mipmaps.
      var total = 0;

      var w = width;
      while (w >= 1) {
        // we can only use mipmaps on a square image,
        // so we can simply use the width and ignore the height:
        total += s * w * w;
        w /= 2;
      }
      return total
    } else {
      return s * width * height
    }
  }

  function createTextureSet (
    gl, extensions, limits, reglPoll, contextState, stats, config) {
    // -------------------------------------------------------
    // Initialize constants and parameter tables here
    // -------------------------------------------------------
    var mipmapHint = {
      "don't care": GL_DONT_CARE,
      'dont care': GL_DONT_CARE,
      'nice': GL_NICEST,
      'fast': GL_FASTEST
    };

    var wrapModes = {
      'repeat': GL_REPEAT,
      'clamp': GL_CLAMP_TO_EDGE,
      'mirror': GL_MIRRORED_REPEAT
    };

    var magFilters = {
      'nearest': GL_NEAREST,
      'linear': GL_LINEAR
    };

    var minFilters = extend({
      'mipmap': GL_LINEAR_MIPMAP_LINEAR,
      'nearest mipmap nearest': GL_NEAREST_MIPMAP_NEAREST,
      'linear mipmap nearest': GL_LINEAR_MIPMAP_NEAREST,
      'nearest mipmap linear': GL_NEAREST_MIPMAP_LINEAR,
      'linear mipmap linear': GL_LINEAR_MIPMAP_LINEAR
    }, magFilters);

    var colorSpace = {
      'none': 0,
      'browser': GL_BROWSER_DEFAULT_WEBGL
    };

    var textureTypes = {
      'uint8': GL_UNSIGNED_BYTE$4,
      'rgba4': GL_UNSIGNED_SHORT_4_4_4_4,
      'rgb565': GL_UNSIGNED_SHORT_5_6_5,
      'rgb5 a1': GL_UNSIGNED_SHORT_5_5_5_1
    };

    var textureFormats = {
      'alpha': GL_ALPHA,
      'luminance': GL_LUMINANCE,
      'luminance alpha': GL_LUMINANCE_ALPHA,
      'rgb': GL_RGB,
      'rgba': GL_RGBA$1,
      'rgba4': GL_RGBA4,
      'rgb5 a1': GL_RGB5_A1,
      'rgb565': GL_RGB565
    };

    var compressedTextureFormats = {};

    if (extensions.ext_srgb) {
      textureFormats.srgb = GL_SRGB_EXT;
      textureFormats.srgba = GL_SRGB_ALPHA_EXT;
    }

    if (extensions.oes_texture_float) {
      textureTypes.float32 = textureTypes.float = GL_FLOAT$3;
    }

    if (extensions.oes_texture_half_float) {
      textureTypes['float16'] = textureTypes['half float'] = GL_HALF_FLOAT_OES;
    }

    if (extensions.webgl_depth_texture) {
      extend(textureFormats, {
        'depth': GL_DEPTH_COMPONENT,
        'depth stencil': GL_DEPTH_STENCIL
      });

      extend(textureTypes, {
        'uint16': GL_UNSIGNED_SHORT$2,
        'uint32': GL_UNSIGNED_INT$2,
        'depth stencil': GL_UNSIGNED_INT_24_8_WEBGL
      });
    }

    if (extensions.webgl_compressed_texture_s3tc) {
      extend(compressedTextureFormats, {
        'rgb s3tc dxt1': GL_COMPRESSED_RGB_S3TC_DXT1_EXT,
        'rgba s3tc dxt1': GL_COMPRESSED_RGBA_S3TC_DXT1_EXT,
        'rgba s3tc dxt3': GL_COMPRESSED_RGBA_S3TC_DXT3_EXT,
        'rgba s3tc dxt5': GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
      });
    }

    if (extensions.webgl_compressed_texture_atc) {
      extend(compressedTextureFormats, {
        'rgb atc': GL_COMPRESSED_RGB_ATC_WEBGL,
        'rgba atc explicit alpha': GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
        'rgba atc interpolated alpha': GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
      });
    }

    if (extensions.webgl_compressed_texture_pvrtc) {
      extend(compressedTextureFormats, {
        'rgb pvrtc 4bppv1': GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
        'rgb pvrtc 2bppv1': GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
        'rgba pvrtc 4bppv1': GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
        'rgba pvrtc 2bppv1': GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
      });
    }

    if (extensions.webgl_compressed_texture_etc1) {
      compressedTextureFormats['rgb etc1'] = GL_COMPRESSED_RGB_ETC1_WEBGL;
    }

    // Copy over all texture formats
    var supportedCompressedFormats = Array.prototype.slice.call(
      gl.getParameter(GL_COMPRESSED_TEXTURE_FORMATS));
    Object.keys(compressedTextureFormats).forEach(function (name) {
      var format = compressedTextureFormats[name];
      if (supportedCompressedFormats.indexOf(format) >= 0) {
        textureFormats[name] = format;
      }
    });

    var supportedFormats = Object.keys(textureFormats);
    limits.textureFormats = supportedFormats;

    // associate with every format string its
    // corresponding GL-value.
    var textureFormatsInvert = [];
    Object.keys(textureFormats).forEach(function (key) {
      var val = textureFormats[key];
      textureFormatsInvert[val] = key;
    });

    // associate with every type string its
    // corresponding GL-value.
    var textureTypesInvert = [];
    Object.keys(textureTypes).forEach(function (key) {
      var val = textureTypes[key];
      textureTypesInvert[val] = key;
    });

    var magFiltersInvert = [];
    Object.keys(magFilters).forEach(function (key) {
      var val = magFilters[key];
      magFiltersInvert[val] = key;
    });

    var minFiltersInvert = [];
    Object.keys(minFilters).forEach(function (key) {
      var val = minFilters[key];
      minFiltersInvert[val] = key;
    });

    var wrapModesInvert = [];
    Object.keys(wrapModes).forEach(function (key) {
      var val = wrapModes[key];
      wrapModesInvert[val] = key;
    });

    // colorFormats[] gives the format (channels) associated to an
    // internalformat
    var colorFormats = supportedFormats.reduce(function (color, key) {
      var glenum = textureFormats[key];
      if (glenum === GL_LUMINANCE ||
          glenum === GL_ALPHA ||
          glenum === GL_LUMINANCE ||
          glenum === GL_LUMINANCE_ALPHA ||
          glenum === GL_DEPTH_COMPONENT ||
          glenum === GL_DEPTH_STENCIL ||
          (extensions.ext_srgb &&
                  (glenum === GL_SRGB_EXT ||
                   glenum === GL_SRGB_ALPHA_EXT))) {
        color[glenum] = glenum;
      } else if (glenum === GL_RGB5_A1 || key.indexOf('rgba') >= 0) {
        color[glenum] = GL_RGBA$1;
      } else {
        color[glenum] = GL_RGB;
      }
      return color
    }, {});

    function TexFlags () {
      // format info
      this.internalformat = GL_RGBA$1;
      this.format = GL_RGBA$1;
      this.type = GL_UNSIGNED_BYTE$4;
      this.compressed = false;

      // pixel storage
      this.premultiplyAlpha = false;
      this.flipY = false;
      this.unpackAlignment = 1;
      this.colorSpace = GL_BROWSER_DEFAULT_WEBGL;

      // shape info
      this.width = 0;
      this.height = 0;
      this.channels = 0;
    }

    function copyFlags (result, other) {
      result.internalformat = other.internalformat;
      result.format = other.format;
      result.type = other.type;
      result.compressed = other.compressed;

      result.premultiplyAlpha = other.premultiplyAlpha;
      result.flipY = other.flipY;
      result.unpackAlignment = other.unpackAlignment;
      result.colorSpace = other.colorSpace;

      result.width = other.width;
      result.height = other.height;
      result.channels = other.channels;
    }

    function parseFlags (flags, options) {
      if (typeof options !== 'object' || !options) {
        return
      }

      if ('premultiplyAlpha' in options) {
        
        flags.premultiplyAlpha = options.premultiplyAlpha;
      }

      if ('flipY' in options) {
        
        flags.flipY = options.flipY;
      }

      if ('alignment' in options) {
        
        flags.unpackAlignment = options.alignment;
      }

      if ('colorSpace' in options) {
        
        flags.colorSpace = colorSpace[options.colorSpace];
      }

      if ('type' in options) {
        var type = options.type;
        
        
        
        
        flags.type = textureTypes[type];
      }

      var w = flags.width;
      var h = flags.height;
      var c = flags.channels;
      var hasChannels = false;
      if ('shape' in options) {
        
        w = options.shape[0];
        h = options.shape[1];
        if (options.shape.length === 3) {
          c = options.shape[2];
          
          hasChannels = true;
        }
        
        
      } else {
        if ('radius' in options) {
          w = h = options.radius;
          
        }
        if ('width' in options) {
          w = options.width;
          
        }
        if ('height' in options) {
          h = options.height;
          
        }
        if ('channels' in options) {
          c = options.channels;
          
          hasChannels = true;
        }
      }
      flags.width = w | 0;
      flags.height = h | 0;
      flags.channels = c | 0;

      var hasFormat = false;
      if ('format' in options) {
        var formatStr = options.format;
        
        
        var internalformat = flags.internalformat = textureFormats[formatStr];
        flags.format = colorFormats[internalformat];
        if (formatStr in textureTypes) {
          if (!('type' in options)) {
            flags.type = textureTypes[formatStr];
          }
        }
        if (formatStr in compressedTextureFormats) {
          flags.compressed = true;
        }
        hasFormat = true;
      }

      // Reconcile channels and format
      if (!hasChannels && hasFormat) {
        flags.channels = FORMAT_CHANNELS[flags.format];
      } else if (hasChannels && !hasFormat) {
        if (flags.channels !== CHANNELS_FORMAT[flags.format]) {
          flags.format = flags.internalformat = CHANNELS_FORMAT[flags.channels];
        }
      } else ;
    }

    function setFlags (flags) {
      gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, flags.flipY);
      gl.pixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, flags.premultiplyAlpha);
      gl.pixelStorei(GL_UNPACK_COLORSPACE_CONVERSION_WEBGL, flags.colorSpace);
      gl.pixelStorei(GL_UNPACK_ALIGNMENT, flags.unpackAlignment);
    }

    // -------------------------------------------------------
    // Tex image data
    // -------------------------------------------------------
    function TexImage () {
      TexFlags.call(this);

      this.xOffset = 0;
      this.yOffset = 0;

      // data
      this.data = null;
      this.needsFree = false;

      // html element
      this.element = null;

      // copyTexImage info
      this.needsCopy = false;
    }

    function parseImage (image, options) {
      var data = null;
      if (isPixelData(options)) {
        data = options;
      } else if (options) {
        
        parseFlags(image, options);
        if ('x' in options) {
          image.xOffset = options.x | 0;
        }
        if ('y' in options) {
          image.yOffset = options.y | 0;
        }
        if (isPixelData(options.data)) {
          data = options.data;
        }
      }

      

      if (options.copy) {
        
        var viewW = contextState.viewportWidth;
        var viewH = contextState.viewportHeight;
        image.width = image.width || (viewW - image.xOffset);
        image.height = image.height || (viewH - image.yOffset);
        image.needsCopy = true;
        
      } else if (!data) {
        image.width = image.width || 1;
        image.height = image.height || 1;
        image.channels = image.channels || 4;
      } else if (isTypedArray(data)) {
        image.channels = image.channels || 4;
        image.data = data;
        if (!('type' in options) && image.type === GL_UNSIGNED_BYTE$4) {
          image.type = typedArrayCode$1(data);
        }
      } else if (isNumericArray(data)) {
        image.channels = image.channels || 4;
        convertData(image, data);
        image.alignment = 1;
        image.needsFree = true;
      } else if (isNDArrayLike(data)) {
        var array = data.data;
        if (!Array.isArray(array) && image.type === GL_UNSIGNED_BYTE$4) {
          image.type = typedArrayCode$1(array);
        }
        var shape = data.shape;
        var stride = data.stride;
        var shapeX, shapeY, shapeC, strideX, strideY, strideC;
        if (shape.length === 3) {
          shapeC = shape[2];
          strideC = stride[2];
        } else {
          
          shapeC = 1;
          strideC = 1;
        }
        shapeX = shape[0];
        shapeY = shape[1];
        strideX = stride[0];
        strideY = stride[1];
        image.alignment = 1;
        image.width = shapeX;
        image.height = shapeY;
        image.channels = shapeC;
        image.format = image.internalformat = CHANNELS_FORMAT[shapeC];
        image.needsFree = true;
        transposeData(image, array, strideX, strideY, strideC, data.offset);
      } else if (isCanvasElement(data) || isOffscreenCanvas(data) || isContext2D(data)) {
        if (isCanvasElement(data) || isOffscreenCanvas(data)) {
          image.element = data;
        } else {
          image.element = data.canvas;
        }
        image.width = image.element.width;
        image.height = image.element.height;
        image.channels = 4;
      } else if (isBitmap(data)) {
        image.element = data;
        image.width = data.width;
        image.height = data.height;
        image.channels = 4;
      } else if (isImageElement(data)) {
        image.element = data;
        image.width = data.naturalWidth;
        image.height = data.naturalHeight;
        image.channels = 4;
      } else if (isVideoElement(data)) {
        image.element = data;
        image.width = data.videoWidth;
        image.height = data.videoHeight;
        image.channels = 4;
      } else if (isRectArray(data)) {
        var w = image.width || data[0].length;
        var h = image.height || data.length;
        var c = image.channels;
        if (isArrayLike(data[0][0])) {
          c = c || data[0][0].length;
        } else {
          c = c || 1;
        }
        var arrayShape = flattenUtils.shape(data);
        var n = 1;
        for (var dd = 0; dd < arrayShape.length; ++dd) {
          n *= arrayShape[dd];
        }
        var allocData = preConvert(image, n);
        flattenUtils.flatten(data, arrayShape, '', allocData);
        postConvert(image, allocData);
        image.alignment = 1;
        image.width = w;
        image.height = h;
        image.channels = c;
        image.format = image.internalformat = CHANNELS_FORMAT[c];
        image.needsFree = true;
      }

      if (image.type === GL_FLOAT$3) ; else if (image.type === GL_HALF_FLOAT_OES) ;

      // do compressed texture  validation here.
    }

    function setImage (info, target, miplevel) {
      var element = info.element;
      var data = info.data;
      var internalformat = info.internalformat;
      var format = info.format;
      var type = info.type;
      var width = info.width;
      var height = info.height;

      setFlags(info);

      if (element) {
        gl.texImage2D(target, miplevel, format, format, type, element);
      } else if (info.compressed) {
        gl.compressedTexImage2D(target, miplevel, internalformat, width, height, 0, data);
      } else if (info.needsCopy) {
        reglPoll();
        gl.copyTexImage2D(
          target, miplevel, format, info.xOffset, info.yOffset, width, height, 0);
      } else {
        gl.texImage2D(target, miplevel, format, width, height, 0, format, type, data || null);
      }
    }

    function setSubImage (info, target, x, y, miplevel) {
      var element = info.element;
      var data = info.data;
      var internalformat = info.internalformat;
      var format = info.format;
      var type = info.type;
      var width = info.width;
      var height = info.height;

      setFlags(info);

      if (element) {
        gl.texSubImage2D(
          target, miplevel, x, y, format, type, element);
      } else if (info.compressed) {
        gl.compressedTexSubImage2D(
          target, miplevel, x, y, internalformat, width, height, data);
      } else if (info.needsCopy) {
        reglPoll();
        gl.copyTexSubImage2D(
          target, miplevel, x, y, info.xOffset, info.yOffset, width, height);
      } else {
        gl.texSubImage2D(
          target, miplevel, x, y, width, height, format, type, data);
      }
    }

    // texImage pool
    var imagePool = [];

    function allocImage () {
      return imagePool.pop() || new TexImage()
    }

    function freeImage (image) {
      if (image.needsFree) {
        pool.freeType(image.data);
      }
      TexImage.call(image);
      imagePool.push(image);
    }

    // -------------------------------------------------------
    // Mip map
    // -------------------------------------------------------
    function MipMap () {
      TexFlags.call(this);

      this.genMipmaps = false;
      this.mipmapHint = GL_DONT_CARE;
      this.mipmask = 0;
      this.images = Array(16);
    }

    function parseMipMapFromShape (mipmap, width, height) {
      var img = mipmap.images[0] = allocImage();
      mipmap.mipmask = 1;
      img.width = mipmap.width = width;
      img.height = mipmap.height = height;
      img.channels = mipmap.channels = 4;
    }

    function parseMipMapFromObject (mipmap, options) {
      var imgData = null;
      if (isPixelData(options)) {
        imgData = mipmap.images[0] = allocImage();
        copyFlags(imgData, mipmap);
        parseImage(imgData, options);
        mipmap.mipmask = 1;
      } else {
        parseFlags(mipmap, options);
        if (Array.isArray(options.mipmap)) {
          var mipData = options.mipmap;
          for (var i = 0; i < mipData.length; ++i) {
            imgData = mipmap.images[i] = allocImage();
            copyFlags(imgData, mipmap);
            imgData.width >>= i;
            imgData.height >>= i;
            parseImage(imgData, mipData[i]);
            mipmap.mipmask |= (1 << i);
          }
        } else {
          imgData = mipmap.images[0] = allocImage();
          copyFlags(imgData, mipmap);
          parseImage(imgData, options);
          mipmap.mipmask = 1;
        }
      }
      copyFlags(mipmap, mipmap.images[0]);

      // For textures of the compressed format WEBGL_compressed_texture_s3tc
      // we must have that
      //
      // "When level equals zero width and height must be a multiple of 4.
      // When level is greater than 0 width and height must be 0, 1, 2 or a multiple of 4. "
      //
      // but we do not yet support having multiple mipmap levels for compressed textures,
      // so we only test for level zero.

      if (
        mipmap.compressed &&
        (
          mipmap.internalformat === GL_COMPRESSED_RGB_S3TC_DXT1_EXT ||
          mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT1_EXT ||
          mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT3_EXT ||
          mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
        )
      ) ;
    }

    function setMipMap (mipmap, target) {
      var images = mipmap.images;
      for (var i = 0; i < images.length; ++i) {
        if (!images[i]) {
          return
        }
        setImage(images[i], target, i);
      }
    }

    var mipPool = [];

    function allocMipMap () {
      var result = mipPool.pop() || new MipMap();
      TexFlags.call(result);
      result.mipmask = 0;
      for (var i = 0; i < 16; ++i) {
        result.images[i] = null;
      }
      return result
    }

    function freeMipMap (mipmap) {
      var images = mipmap.images;
      for (var i = 0; i < images.length; ++i) {
        if (images[i]) {
          freeImage(images[i]);
        }
        images[i] = null;
      }
      mipPool.push(mipmap);
    }

    // -------------------------------------------------------
    // Tex info
    // -------------------------------------------------------
    function TexInfo () {
      this.minFilter = GL_NEAREST;
      this.magFilter = GL_NEAREST;

      this.wrapS = GL_CLAMP_TO_EDGE;
      this.wrapT = GL_CLAMP_TO_EDGE;

      this.anisotropic = 1;

      this.genMipmaps = false;
      this.mipmapHint = GL_DONT_CARE;
    }

    function parseTexInfo (info, options) {
      if ('min' in options) {
        var minFilter = options.min;
        
        info.minFilter = minFilters[minFilter];
        if (MIPMAP_FILTERS.indexOf(info.minFilter) >= 0 && !('faces' in options)) {
          info.genMipmaps = true;
        }
      }

      if ('mag' in options) {
        var magFilter = options.mag;
        
        info.magFilter = magFilters[magFilter];
      }

      var wrapS = info.wrapS;
      var wrapT = info.wrapT;
      if ('wrap' in options) {
        var wrap = options.wrap;
        if (typeof wrap === 'string') {
          
          wrapS = wrapT = wrapModes[wrap];
        } else if (Array.isArray(wrap)) {
          
          
          wrapS = wrapModes[wrap[0]];
          wrapT = wrapModes[wrap[1]];
        }
      } else {
        if ('wrapS' in options) {
          var optWrapS = options.wrapS;
          
          wrapS = wrapModes[optWrapS];
        }
        if ('wrapT' in options) {
          var optWrapT = options.wrapT;
          
          wrapT = wrapModes[optWrapT];
        }
      }
      info.wrapS = wrapS;
      info.wrapT = wrapT;

      if ('anisotropic' in options) {
        options.anisotropic;
        
        info.anisotropic = options.anisotropic;
      }

      if ('mipmap' in options) {
        var hasMipMap = false;
        switch (typeof options.mipmap) {
          case 'string':
            
            info.mipmapHint = mipmapHint[options.mipmap];
            info.genMipmaps = true;
            hasMipMap = true;
            break

          case 'boolean':
            hasMipMap = info.genMipmaps = options.mipmap;
            break

          case 'object':
            
            info.genMipmaps = false;
            hasMipMap = true;
            break
            
        }
        if (hasMipMap && !('min' in options)) {
          info.minFilter = GL_NEAREST_MIPMAP_NEAREST;
        }
      }
    }

    function setTexInfo (info, target) {
      gl.texParameteri(target, GL_TEXTURE_MIN_FILTER, info.minFilter);
      gl.texParameteri(target, GL_TEXTURE_MAG_FILTER, info.magFilter);
      gl.texParameteri(target, GL_TEXTURE_WRAP_S, info.wrapS);
      gl.texParameteri(target, GL_TEXTURE_WRAP_T, info.wrapT);
      if (extensions.ext_texture_filter_anisotropic) {
        gl.texParameteri(target, GL_TEXTURE_MAX_ANISOTROPY_EXT, info.anisotropic);
      }
      if (info.genMipmaps) {
        gl.hint(GL_GENERATE_MIPMAP_HINT, info.mipmapHint);
        gl.generateMipmap(target);
      }
    }

    // -------------------------------------------------------
    // Full texture object
    // -------------------------------------------------------
    var textureCount = 0;
    var textureSet = {};
    var numTexUnits = limits.maxTextureUnits;
    var textureUnits = Array(numTexUnits).map(function () {
      return null
    });

    function REGLTexture (target) {
      TexFlags.call(this);
      this.mipmask = 0;
      this.internalformat = GL_RGBA$1;

      this.id = textureCount++;

      this.refCount = 1;

      this.target = target;
      this.texture = gl.createTexture();

      this.unit = -1;
      this.bindCount = 0;

      this.texInfo = new TexInfo();

      if (config.profile) {
        this.stats = { size: 0 };
      }
    }

    function tempBind (texture) {
      gl.activeTexture(GL_TEXTURE0$1);
      gl.bindTexture(texture.target, texture.texture);
    }

    function tempRestore () {
      var prev = textureUnits[0];
      if (prev) {
        gl.bindTexture(prev.target, prev.texture);
      } else {
        gl.bindTexture(GL_TEXTURE_2D$1, null);
      }
    }

    function destroy (texture) {
      var handle = texture.texture;
      
      var unit = texture.unit;
      var target = texture.target;
      if (unit >= 0) {
        gl.activeTexture(GL_TEXTURE0$1 + unit);
        gl.bindTexture(target, null);
        textureUnits[unit] = null;
      }
      gl.deleteTexture(handle);
      texture.texture = null;
      texture.params = null;
      texture.pixels = null;
      texture.refCount = 0;
      delete textureSet[texture.id];
      stats.textureCount--;
    }

    extend(REGLTexture.prototype, {
      bind: function () {
        var texture = this;
        texture.bindCount += 1;
        var unit = texture.unit;
        if (unit < 0) {
          for (var i = 0; i < numTexUnits; ++i) {
            var other = textureUnits[i];
            if (other) {
              if (other.bindCount > 0) {
                continue
              }
              other.unit = -1;
            }
            textureUnits[i] = texture;
            unit = i;
            break
          }
          if (config.profile && stats.maxTextureUnits < (unit + 1)) {
            stats.maxTextureUnits = unit + 1; // +1, since the units are zero-based
          }
          texture.unit = unit;
          gl.activeTexture(GL_TEXTURE0$1 + unit);
          gl.bindTexture(texture.target, texture.texture);
        }
        return unit
      },

      unbind: function () {
        this.bindCount -= 1;
      },

      decRef: function () {
        if (--this.refCount <= 0) {
          destroy(this);
        }
      }
    });

    function createTexture2D (a, b) {
      var texture = new REGLTexture(GL_TEXTURE_2D$1);
      textureSet[texture.id] = texture;
      stats.textureCount++;

      function reglTexture2D (a, b) {
        var texInfo = texture.texInfo;
        TexInfo.call(texInfo);
        var mipData = allocMipMap();

        if (typeof a === 'number') {
          if (typeof b === 'number') {
            parseMipMapFromShape(mipData, a | 0, b | 0);
          } else {
            parseMipMapFromShape(mipData, a | 0, a | 0);
          }
        } else if (a) {
          
          parseTexInfo(texInfo, a);
          parseMipMapFromObject(mipData, a);
        } else {
          // empty textures get assigned a default shape of 1x1
          parseMipMapFromShape(mipData, 1, 1);
        }

        if (texInfo.genMipmaps) {
          mipData.mipmask = (mipData.width << 1) - 1;
        }
        texture.mipmask = mipData.mipmask;

        copyFlags(texture, mipData);

        
        texture.internalformat = mipData.internalformat;

        reglTexture2D.width = mipData.width;
        reglTexture2D.height = mipData.height;

        tempBind(texture);
        setMipMap(mipData, GL_TEXTURE_2D$1);
        setTexInfo(texInfo, GL_TEXTURE_2D$1);
        tempRestore();

        freeMipMap(mipData);

        if (config.profile) {
          texture.stats.size = getTextureSize(
            texture.internalformat,
            texture.type,
            mipData.width,
            mipData.height,
            texInfo.genMipmaps,
            false);
        }
        reglTexture2D.format = textureFormatsInvert[texture.internalformat];
        reglTexture2D.type = textureTypesInvert[texture.type];

        reglTexture2D.mag = magFiltersInvert[texInfo.magFilter];
        reglTexture2D.min = minFiltersInvert[texInfo.minFilter];

        reglTexture2D.wrapS = wrapModesInvert[texInfo.wrapS];
        reglTexture2D.wrapT = wrapModesInvert[texInfo.wrapT];

        return reglTexture2D
      }

      function subimage (image, x_, y_, level_) {
        

        var x = x_ | 0;
        var y = y_ | 0;
        var level = level_ | 0;

        var imageData = allocImage();
        copyFlags(imageData, texture);
        imageData.width = 0;
        imageData.height = 0;
        parseImage(imageData, image);
        imageData.width = imageData.width || ((texture.width >> level) - x);
        imageData.height = imageData.height || ((texture.height >> level) - y);

        
        
        
        

        tempBind(texture);
        setSubImage(imageData, GL_TEXTURE_2D$1, x, y, level);
        tempRestore();

        freeImage(imageData);

        return reglTexture2D
      }

      function resize (w_, h_) {
        var w = w_ | 0;
        var h = (h_ | 0) || w;
        if (w === texture.width && h === texture.height) {
          return reglTexture2D
        }

        reglTexture2D.width = texture.width = w;
        reglTexture2D.height = texture.height = h;

        tempBind(texture);

        for (var i = 0; texture.mipmask >> i; ++i) {
          var _w = w >> i;
          var _h = h >> i;
          if (!_w || !_h) break
          gl.texImage2D(
            GL_TEXTURE_2D$1,
            i,
            texture.format,
            _w,
            _h,
            0,
            texture.format,
            texture.type,
            null);
        }
        tempRestore();

        // also, recompute the texture size.
        if (config.profile) {
          texture.stats.size = getTextureSize(
            texture.internalformat,
            texture.type,
            w,
            h,
            false,
            false);
        }

        return reglTexture2D
      }

      reglTexture2D(a, b);

      reglTexture2D.subimage = subimage;
      reglTexture2D.resize = resize;
      reglTexture2D._reglType = 'texture2d';
      reglTexture2D._texture = texture;
      if (config.profile) {
        reglTexture2D.stats = texture.stats;
      }
      reglTexture2D.destroy = function () {
        texture.decRef();
      };

      return reglTexture2D
    }

    function createTextureCube (a0, a1, a2, a3, a4, a5) {
      var texture = new REGLTexture(GL_TEXTURE_CUBE_MAP$1);
      textureSet[texture.id] = texture;
      stats.cubeCount++;

      var faces = new Array(6);

      function reglTextureCube (a0, a1, a2, a3, a4, a5) {
        var i;
        var texInfo = texture.texInfo;
        TexInfo.call(texInfo);
        for (i = 0; i < 6; ++i) {
          faces[i] = allocMipMap();
        }

        if (typeof a0 === 'number' || !a0) {
          var s = (a0 | 0) || 1;
          for (i = 0; i < 6; ++i) {
            parseMipMapFromShape(faces[i], s, s);
          }
        } else if (typeof a0 === 'object') {
          if (a1) {
            parseMipMapFromObject(faces[0], a0);
            parseMipMapFromObject(faces[1], a1);
            parseMipMapFromObject(faces[2], a2);
            parseMipMapFromObject(faces[3], a3);
            parseMipMapFromObject(faces[4], a4);
            parseMipMapFromObject(faces[5], a5);
          } else {
            parseTexInfo(texInfo, a0);
            parseFlags(texture, a0);
            if ('faces' in a0) {
              var faceInput = a0.faces;
              
              for (i = 0; i < 6; ++i) {
                
                copyFlags(faces[i], texture);
                parseMipMapFromObject(faces[i], faceInput[i]);
              }
            } else {
              for (i = 0; i < 6; ++i) {
                parseMipMapFromObject(faces[i], a0);
              }
            }
          }
        } else ;

        copyFlags(texture, faces[0]);
        

        if (texInfo.genMipmaps) {
          texture.mipmask = (faces[0].width << 1) - 1;
        } else {
          texture.mipmask = faces[0].mipmask;
        }

        
        texture.internalformat = faces[0].internalformat;

        reglTextureCube.width = faces[0].width;
        reglTextureCube.height = faces[0].height;

        tempBind(texture);
        for (i = 0; i < 6; ++i) {
          setMipMap(faces[i], GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i);
        }
        setTexInfo(texInfo, GL_TEXTURE_CUBE_MAP$1);
        tempRestore();

        if (config.profile) {
          texture.stats.size = getTextureSize(
            texture.internalformat,
            texture.type,
            reglTextureCube.width,
            reglTextureCube.height,
            texInfo.genMipmaps,
            true);
        }

        reglTextureCube.format = textureFormatsInvert[texture.internalformat];
        reglTextureCube.type = textureTypesInvert[texture.type];

        reglTextureCube.mag = magFiltersInvert[texInfo.magFilter];
        reglTextureCube.min = minFiltersInvert[texInfo.minFilter];

        reglTextureCube.wrapS = wrapModesInvert[texInfo.wrapS];
        reglTextureCube.wrapT = wrapModesInvert[texInfo.wrapT];

        for (i = 0; i < 6; ++i) {
          freeMipMap(faces[i]);
        }

        return reglTextureCube
      }

      function subimage (face, image, x_, y_, level_) {
        
        

        var x = x_ | 0;
        var y = y_ | 0;
        var level = level_ | 0;

        var imageData = allocImage();
        copyFlags(imageData, texture);
        imageData.width = 0;
        imageData.height = 0;
        parseImage(imageData, image);
        imageData.width = imageData.width || ((texture.width >> level) - x);
        imageData.height = imageData.height || ((texture.height >> level) - y);

        
        
        
        

        tempBind(texture);
        setSubImage(imageData, GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + face, x, y, level);
        tempRestore();

        freeImage(imageData);

        return reglTextureCube
      }

      function resize (radius_) {
        var radius = radius_ | 0;
        if (radius === texture.width) {
          return
        }

        reglTextureCube.width = texture.width = radius;
        reglTextureCube.height = texture.height = radius;

        tempBind(texture);
        for (var i = 0; i < 6; ++i) {
          for (var j = 0; texture.mipmask >> j; ++j) {
            gl.texImage2D(
              GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i,
              j,
              texture.format,
              radius >> j,
              radius >> j,
              0,
              texture.format,
              texture.type,
              null);
          }
        }
        tempRestore();

        if (config.profile) {
          texture.stats.size = getTextureSize(
            texture.internalformat,
            texture.type,
            reglTextureCube.width,
            reglTextureCube.height,
            false,
            true);
        }

        return reglTextureCube
      }

      reglTextureCube(a0, a1, a2, a3, a4, a5);

      reglTextureCube.subimage = subimage;
      reglTextureCube.resize = resize;
      reglTextureCube._reglType = 'textureCube';
      reglTextureCube._texture = texture;
      if (config.profile) {
        reglTextureCube.stats = texture.stats;
      }
      reglTextureCube.destroy = function () {
        texture.decRef();
      };

      return reglTextureCube
    }

    // Called when regl is destroyed
    function destroyTextures () {
      for (var i = 0; i < numTexUnits; ++i) {
        gl.activeTexture(GL_TEXTURE0$1 + i);
        gl.bindTexture(GL_TEXTURE_2D$1, null);
        textureUnits[i] = null;
      }
      values(textureSet).forEach(destroy);

      stats.cubeCount = 0;
      stats.textureCount = 0;
    }

    if (config.profile) {
      stats.getTotalTextureSize = function () {
        var total = 0;
        Object.keys(textureSet).forEach(function (key) {
          total += textureSet[key].stats.size;
        });
        return total
      };
    }

    function restoreTextures () {
      for (var i = 0; i < numTexUnits; ++i) {
        var tex = textureUnits[i];
        if (tex) {
          tex.bindCount = 0;
          tex.unit = -1;
          textureUnits[i] = null;
        }
      }

      values(textureSet).forEach(function (texture) {
        texture.texture = gl.createTexture();
        gl.bindTexture(texture.target, texture.texture);
        for (var i = 0; i < 32; ++i) {
          if ((texture.mipmask & (1 << i)) === 0) {
            continue
          }
          if (texture.target === GL_TEXTURE_2D$1) {
            gl.texImage2D(GL_TEXTURE_2D$1,
              i,
              texture.internalformat,
              texture.width >> i,
              texture.height >> i,
              0,
              texture.internalformat,
              texture.type,
              null);
          } else {
            for (var j = 0; j < 6; ++j) {
              gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + j,
                i,
                texture.internalformat,
                texture.width >> i,
                texture.height >> i,
                0,
                texture.internalformat,
                texture.type,
                null);
            }
          }
        }
        setTexInfo(texture.texInfo, texture.target);
      });
    }

    function refreshTextures () {
      for (var i = 0; i < numTexUnits; ++i) {
        var tex = textureUnits[i];
        if (tex) {
          tex.bindCount = 0;
          tex.unit = -1;
          textureUnits[i] = null;
        }
        gl.activeTexture(GL_TEXTURE0$1 + i);
        gl.bindTexture(GL_TEXTURE_2D$1, null);
        gl.bindTexture(GL_TEXTURE_CUBE_MAP$1, null);
      }
    }

    return {
      create2D: createTexture2D,
      createCube: createTextureCube,
      clear: destroyTextures,
      getTexture: function (wrapper) {
        return null
      },
      restore: restoreTextures,
      refresh: refreshTextures
    }
  }

  var GL_RENDERBUFFER = 0x8D41;

  var GL_RGBA4$1 = 0x8056;
  var GL_RGB5_A1$1 = 0x8057;
  var GL_RGB565$1 = 0x8D62;
  var GL_DEPTH_COMPONENT16 = 0x81A5;
  var GL_STENCIL_INDEX8 = 0x8D48;
  var GL_DEPTH_STENCIL$1 = 0x84F9;

  var GL_SRGB8_ALPHA8_EXT = 0x8C43;

  var GL_RGBA32F_EXT = 0x8814;

  var GL_RGBA16F_EXT = 0x881A;
  var GL_RGB16F_EXT = 0x881B;

  var FORMAT_SIZES = [];

  FORMAT_SIZES[GL_RGBA4$1] = 2;
  FORMAT_SIZES[GL_RGB5_A1$1] = 2;
  FORMAT_SIZES[GL_RGB565$1] = 2;

  FORMAT_SIZES[GL_DEPTH_COMPONENT16] = 2;
  FORMAT_SIZES[GL_STENCIL_INDEX8] = 1;
  FORMAT_SIZES[GL_DEPTH_STENCIL$1] = 4;

  FORMAT_SIZES[GL_SRGB8_ALPHA8_EXT] = 4;
  FORMAT_SIZES[GL_RGBA32F_EXT] = 16;
  FORMAT_SIZES[GL_RGBA16F_EXT] = 8;
  FORMAT_SIZES[GL_RGB16F_EXT] = 6;

  function getRenderbufferSize (format, width, height) {
    return FORMAT_SIZES[format] * width * height
  }

  var wrapRenderbuffers = function (gl, extensions, limits, stats, config) {
    var formatTypes = {
      'rgba4': GL_RGBA4$1,
      'rgb565': GL_RGB565$1,
      'rgb5 a1': GL_RGB5_A1$1,
      'depth': GL_DEPTH_COMPONENT16,
      'stencil': GL_STENCIL_INDEX8,
      'depth stencil': GL_DEPTH_STENCIL$1
    };

    if (extensions.ext_srgb) {
      formatTypes['srgba'] = GL_SRGB8_ALPHA8_EXT;
    }

    if (extensions.ext_color_buffer_half_float) {
      formatTypes['rgba16f'] = GL_RGBA16F_EXT;
      formatTypes['rgb16f'] = GL_RGB16F_EXT;
    }

    if (extensions.webgl_color_buffer_float) {
      formatTypes['rgba32f'] = GL_RGBA32F_EXT;
    }

    var formatTypesInvert = [];
    Object.keys(formatTypes).forEach(function (key) {
      var val = formatTypes[key];
      formatTypesInvert[val] = key;
    });

    var renderbufferCount = 0;
    var renderbufferSet = {};

    function REGLRenderbuffer (renderbuffer) {
      this.id = renderbufferCount++;
      this.refCount = 1;

      this.renderbuffer = renderbuffer;

      this.format = GL_RGBA4$1;
      this.width = 0;
      this.height = 0;

      if (config.profile) {
        this.stats = { size: 0 };
      }
    }

    REGLRenderbuffer.prototype.decRef = function () {
      if (--this.refCount <= 0) {
        destroy(this);
      }
    };

    function destroy (rb) {
      var handle = rb.renderbuffer;
      
      gl.bindRenderbuffer(GL_RENDERBUFFER, null);
      gl.deleteRenderbuffer(handle);
      rb.renderbuffer = null;
      rb.refCount = 0;
      delete renderbufferSet[rb.id];
      stats.renderbufferCount--;
    }

    function createRenderbuffer (a, b) {
      var renderbuffer = new REGLRenderbuffer(gl.createRenderbuffer());
      renderbufferSet[renderbuffer.id] = renderbuffer;
      stats.renderbufferCount++;

      function reglRenderbuffer (a, b) {
        var w = 0;
        var h = 0;
        var format = GL_RGBA4$1;

        if (typeof a === 'object' && a) {
          var options = a;
          if ('shape' in options) {
            var shape = options.shape;
            
            w = shape[0] | 0;
            h = shape[1] | 0;
          } else {
            if ('radius' in options) {
              w = h = options.radius | 0;
            }
            if ('width' in options) {
              w = options.width | 0;
            }
            if ('height' in options) {
              h = options.height | 0;
            }
          }
          if ('format' in options) {
            
            format = formatTypes[options.format];
          }
        } else if (typeof a === 'number') {
          w = a | 0;
          if (typeof b === 'number') {
            h = b | 0;
          } else {
            h = w;
          }
        } else if (!a) {
          w = h = 1;
        } else ;

        // check shape
        

        if (w === renderbuffer.width &&
            h === renderbuffer.height &&
            format === renderbuffer.format) {
          return
        }

        reglRenderbuffer.width = renderbuffer.width = w;
        reglRenderbuffer.height = renderbuffer.height = h;
        renderbuffer.format = format;

        gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
        gl.renderbufferStorage(GL_RENDERBUFFER, format, w, h);

        

        if (config.profile) {
          renderbuffer.stats.size = getRenderbufferSize(renderbuffer.format, renderbuffer.width, renderbuffer.height);
        }
        reglRenderbuffer.format = formatTypesInvert[renderbuffer.format];

        return reglRenderbuffer
      }

      function resize (w_, h_) {
        var w = w_ | 0;
        var h = (h_ | 0) || w;

        if (w === renderbuffer.width && h === renderbuffer.height) {
          return reglRenderbuffer
        }

        // check shape
        

        reglRenderbuffer.width = renderbuffer.width = w;
        reglRenderbuffer.height = renderbuffer.height = h;

        gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
        gl.renderbufferStorage(GL_RENDERBUFFER, renderbuffer.format, w, h);

        

        // also, recompute size.
        if (config.profile) {
          renderbuffer.stats.size = getRenderbufferSize(
            renderbuffer.format, renderbuffer.width, renderbuffer.height);
        }

        return reglRenderbuffer
      }

      reglRenderbuffer(a, b);

      reglRenderbuffer.resize = resize;
      reglRenderbuffer._reglType = 'renderbuffer';
      reglRenderbuffer._renderbuffer = renderbuffer;
      if (config.profile) {
        reglRenderbuffer.stats = renderbuffer.stats;
      }
      reglRenderbuffer.destroy = function () {
        renderbuffer.decRef();
      };

      return reglRenderbuffer
    }

    if (config.profile) {
      stats.getTotalRenderbufferSize = function () {
        var total = 0;
        Object.keys(renderbufferSet).forEach(function (key) {
          total += renderbufferSet[key].stats.size;
        });
        return total
      };
    }

    function restoreRenderbuffers () {
      values(renderbufferSet).forEach(function (rb) {
        rb.renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(GL_RENDERBUFFER, rb.renderbuffer);
        gl.renderbufferStorage(GL_RENDERBUFFER, rb.format, rb.width, rb.height);
      });
      gl.bindRenderbuffer(GL_RENDERBUFFER, null);
    }

    return {
      create: createRenderbuffer,
      clear: function () {
        values(renderbufferSet).forEach(destroy);
      },
      restore: restoreRenderbuffers
    }
  };

  // We store these constants so that the minifier can inline them
  var GL_FRAMEBUFFER$1 = 0x8D40;
  var GL_RENDERBUFFER$1 = 0x8D41;

  var GL_TEXTURE_2D$2 = 0x0DE1;
  var GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 = 0x8515;

  var GL_COLOR_ATTACHMENT0$1 = 0x8CE0;
  var GL_DEPTH_ATTACHMENT = 0x8D00;
  var GL_STENCIL_ATTACHMENT = 0x8D20;
  var GL_DEPTH_STENCIL_ATTACHMENT = 0x821A;

  var GL_FRAMEBUFFER_COMPLETE$1 = 0x8CD5;
  var GL_HALF_FLOAT_OES$1 = 0x8D61;
  var GL_UNSIGNED_BYTE$5 = 0x1401;
  var GL_FLOAT$4 = 0x1406;

  var GL_RGB$1 = 0x1907;
  var GL_RGBA$2 = 0x1908;

  // for every texture format, store
  // the number of channels
  var textureFormatChannels = [];
  textureFormatChannels[GL_RGBA$2] = 4;
  textureFormatChannels[GL_RGB$1] = 3;

  // for every texture type, store
  // the size in bytes.
  var textureTypeSizes = [];
  textureTypeSizes[GL_UNSIGNED_BYTE$5] = 1;
  textureTypeSizes[GL_FLOAT$4] = 4;
  textureTypeSizes[GL_HALF_FLOAT_OES$1] = 2;

  function wrapFBOState (
    gl,
    extensions,
    limits,
    textureState,
    renderbufferState,
    stats) {
    var framebufferState = {
      cur: null,
      next: null,
      dirty: false,
      setFBO: null
    };

    var colorTextureFormats = ['rgba'];
    var colorRenderbufferFormats = ['rgba4', 'rgb565', 'rgb5 a1'];

    if (extensions.ext_srgb) {
      colorRenderbufferFormats.push('srgba');
    }

    if (extensions.ext_color_buffer_half_float) {
      colorRenderbufferFormats.push('rgba16f', 'rgb16f');
    }

    if (extensions.webgl_color_buffer_float) {
      colorRenderbufferFormats.push('rgba32f');
    }
    if (extensions.oes_texture_half_float) ;
    if (extensions.oes_texture_float) ;

    function FramebufferAttachment (target, texture, renderbuffer) {
      this.target = target;
      this.texture = texture;
      this.renderbuffer = renderbuffer;

      var w = 0;
      var h = 0;
      if (texture) {
        w = texture.width;
        h = texture.height;
      } else if (renderbuffer) {
        w = renderbuffer.width;
        h = renderbuffer.height;
      }
      this.width = w;
      this.height = h;
    }

    function decRef (attachment) {
      if (attachment) {
        if (attachment.texture) {
          attachment.texture._texture.decRef();
        }
        if (attachment.renderbuffer) {
          attachment.renderbuffer._renderbuffer.decRef();
        }
      }
    }

    function incRefAndCheckShape (attachment, width, height) {
      if (!attachment) {
        return
      }
      if (attachment.texture) {
        var texture = attachment.texture._texture;
        Math.max(1, texture.width);
        Math.max(1, texture.height);
        
        texture.refCount += 1;
      } else {
        var renderbuffer = attachment.renderbuffer._renderbuffer;
        
        renderbuffer.refCount += 1;
      }
    }

    function attach (location, attachment) {
      if (attachment) {
        if (attachment.texture) {
          gl.framebufferTexture2D(
            GL_FRAMEBUFFER$1,
            location,
            attachment.target,
            attachment.texture._texture.texture,
            0);
        } else {
          gl.framebufferRenderbuffer(
            GL_FRAMEBUFFER$1,
            location,
            GL_RENDERBUFFER$1,
            attachment.renderbuffer._renderbuffer.renderbuffer);
        }
      }
    }

    function parseAttachment (attachment) {
      var target = GL_TEXTURE_2D$2;
      var texture = null;
      var renderbuffer = null;

      var data = attachment;
      if (typeof attachment === 'object') {
        data = attachment.data;
        if ('target' in attachment) {
          target = attachment.target | 0;
        }
      }

      

      var type = data._reglType;
      if (type === 'texture2d') {
        texture = data;
        
      } else if (type === 'textureCube') {
        texture = data;
        
      } else if (type === 'renderbuffer') {
        renderbuffer = data;
        target = GL_RENDERBUFFER$1;
      } else ;

      return new FramebufferAttachment(target, texture, renderbuffer)
    }

    function allocAttachment (
      width,
      height,
      isTexture,
      format,
      type) {
      if (isTexture) {
        var texture = textureState.create2D({
          width: width,
          height: height,
          format: format,
          type: type
        });
        texture._texture.refCount = 0;
        return new FramebufferAttachment(GL_TEXTURE_2D$2, texture, null)
      } else {
        var rb = renderbufferState.create({
          width: width,
          height: height,
          format: format
        });
        rb._renderbuffer.refCount = 0;
        return new FramebufferAttachment(GL_RENDERBUFFER$1, null, rb)
      }
    }

    function unwrapAttachment (attachment) {
      return attachment && (attachment.texture || attachment.renderbuffer)
    }

    function resizeAttachment (attachment, w, h) {
      if (attachment) {
        if (attachment.texture) {
          attachment.texture.resize(w, h);
        } else if (attachment.renderbuffer) {
          attachment.renderbuffer.resize(w, h);
        }
        attachment.width = w;
        attachment.height = h;
      }
    }

    var framebufferCount = 0;
    var framebufferSet = {};

    function REGLFramebuffer () {
      this.id = framebufferCount++;
      framebufferSet[this.id] = this;

      this.framebuffer = gl.createFramebuffer();
      this.width = 0;
      this.height = 0;

      this.colorAttachments = [];
      this.depthAttachment = null;
      this.stencilAttachment = null;
      this.depthStencilAttachment = null;
    }

    function decFBORefs (framebuffer) {
      framebuffer.colorAttachments.forEach(decRef);
      decRef(framebuffer.depthAttachment);
      decRef(framebuffer.stencilAttachment);
      decRef(framebuffer.depthStencilAttachment);
    }

    function destroy (framebuffer) {
      var handle = framebuffer.framebuffer;
      
      gl.deleteFramebuffer(handle);
      framebuffer.framebuffer = null;
      stats.framebufferCount--;
      delete framebufferSet[framebuffer.id];
    }

    function updateFramebuffer (framebuffer) {
      var i;

      gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebuffer.framebuffer);
      var colorAttachments = framebuffer.colorAttachments;
      for (i = 0; i < colorAttachments.length; ++i) {
        attach(GL_COLOR_ATTACHMENT0$1 + i, colorAttachments[i]);
      }
      for (i = colorAttachments.length; i < limits.maxColorAttachments; ++i) {
        gl.framebufferTexture2D(
          GL_FRAMEBUFFER$1,
          GL_COLOR_ATTACHMENT0$1 + i,
          GL_TEXTURE_2D$2,
          null,
          0);
      }

      gl.framebufferTexture2D(
        GL_FRAMEBUFFER$1,
        GL_DEPTH_STENCIL_ATTACHMENT,
        GL_TEXTURE_2D$2,
        null,
        0);
      gl.framebufferTexture2D(
        GL_FRAMEBUFFER$1,
        GL_DEPTH_ATTACHMENT,
        GL_TEXTURE_2D$2,
        null,
        0);
      gl.framebufferTexture2D(
        GL_FRAMEBUFFER$1,
        GL_STENCIL_ATTACHMENT,
        GL_TEXTURE_2D$2,
        null,
        0);

      attach(GL_DEPTH_ATTACHMENT, framebuffer.depthAttachment);
      attach(GL_STENCIL_ATTACHMENT, framebuffer.stencilAttachment);
      attach(GL_DEPTH_STENCIL_ATTACHMENT, framebuffer.depthStencilAttachment);

      // Check status code
      var status = gl.checkFramebufferStatus(GL_FRAMEBUFFER$1);
      if (!gl.isContextLost() && status !== GL_FRAMEBUFFER_COMPLETE$1) ;

      gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebufferState.next ? framebufferState.next.framebuffer : null);
      framebufferState.cur = framebufferState.next;

      // FIXME: Clear error code here.  This is a work around for a bug in
      // headless-gl
      gl.getError();
    }

    function createFBO (a0, a1) {
      var framebuffer = new REGLFramebuffer();
      stats.framebufferCount++;

      function reglFramebuffer (a, b) {
        var i;

        

        var width = 0;
        var height = 0;

        var needsDepth = true;
        var needsStencil = true;

        var colorBuffer = null;
        var colorTexture = true;
        var colorFormat = 'rgba';
        var colorType = 'uint8';
        var colorCount = 1;

        var depthBuffer = null;
        var stencilBuffer = null;
        var depthStencilBuffer = null;
        var depthStencilTexture = false;

        if (typeof a === 'number') {
          width = a | 0;
          height = (b | 0) || width;
        } else if (!a) {
          width = height = 1;
        } else {
          
          var options = a;

          if ('shape' in options) {
            var shape = options.shape;
            
            width = shape[0];
            height = shape[1];
          } else {
            if ('radius' in options) {
              width = height = options.radius;
            }
            if ('width' in options) {
              width = options.width;
            }
            if ('height' in options) {
              height = options.height;
            }
          }

          if ('color' in options ||
              'colors' in options) {
            colorBuffer =
              options.color ||
              options.colors;
          }

          if (!colorBuffer) {
            if ('colorCount' in options) {
              colorCount = options.colorCount | 0;
              
            }

            if ('colorTexture' in options) {
              colorTexture = !!options.colorTexture;
              colorFormat = 'rgba4';
            }

            if ('colorType' in options) {
              colorType = options.colorType;
              if (!colorTexture) {
                if (colorType === 'half float' || colorType === 'float16') {
                  
                  colorFormat = 'rgba16f';
                } else if (colorType === 'float' || colorType === 'float32') {
                  
                  colorFormat = 'rgba32f';
                }
              }
              
            }

            if ('colorFormat' in options) {
              colorFormat = options.colorFormat;
              if (colorTextureFormats.indexOf(colorFormat) >= 0) {
                colorTexture = true;
              } else if (colorRenderbufferFormats.indexOf(colorFormat) >= 0) {
                colorTexture = false;
              } else ;
            }
          }

          if ('depthTexture' in options || 'depthStencilTexture' in options) {
            depthStencilTexture = !!(options.depthTexture ||
              options.depthStencilTexture);
            
          }

          if ('depth' in options) {
            if (typeof options.depth === 'boolean') {
              needsDepth = options.depth;
            } else {
              depthBuffer = options.depth;
              needsStencil = false;
            }
          }

          if ('stencil' in options) {
            if (typeof options.stencil === 'boolean') {
              needsStencil = options.stencil;
            } else {
              stencilBuffer = options.stencil;
              needsDepth = false;
            }
          }

          if ('depthStencil' in options) {
            if (typeof options.depthStencil === 'boolean') {
              needsDepth = needsStencil = options.depthStencil;
            } else {
              depthStencilBuffer = options.depthStencil;
              needsDepth = false;
              needsStencil = false;
            }
          }
        }

        // parse attachments
        var colorAttachments = null;
        var depthAttachment = null;
        var stencilAttachment = null;
        var depthStencilAttachment = null;

        // Set up color attachments
        if (Array.isArray(colorBuffer)) {
          colorAttachments = colorBuffer.map(parseAttachment);
        } else if (colorBuffer) {
          colorAttachments = [parseAttachment(colorBuffer)];
        } else {
          colorAttachments = new Array(colorCount);
          for (i = 0; i < colorCount; ++i) {
            colorAttachments[i] = allocAttachment(
              width,
              height,
              colorTexture,
              colorFormat,
              colorType);
          }
        }

        
        

        width = width || colorAttachments[0].width;
        height = height || colorAttachments[0].height;

        if (depthBuffer) {
          depthAttachment = parseAttachment(depthBuffer);
        } else if (needsDepth && !needsStencil) {
          depthAttachment = allocAttachment(
            width,
            height,
            depthStencilTexture,
            'depth',
            'uint32');
        }

        if (stencilBuffer) {
          stencilAttachment = parseAttachment(stencilBuffer);
        } else if (needsStencil && !needsDepth) {
          stencilAttachment = allocAttachment(
            width,
            height,
            false,
            'stencil',
            'uint8');
        }

        if (depthStencilBuffer) {
          depthStencilAttachment = parseAttachment(depthStencilBuffer);
        } else if (!depthBuffer && !stencilBuffer && needsStencil && needsDepth) {
          depthStencilAttachment = allocAttachment(
            width,
            height,
            depthStencilTexture,
            'depth stencil',
            'depth stencil');
        }

        for (i = 0; i < colorAttachments.length; ++i) {
          incRefAndCheckShape(colorAttachments[i]);
          

          if (colorAttachments[i] && colorAttachments[i].texture) {
            textureFormatChannels[colorAttachments[i].texture._texture.format] *
                textureTypeSizes[colorAttachments[i].texture._texture.type];
          }
        }
        incRefAndCheckShape(depthAttachment);
        
        incRefAndCheckShape(stencilAttachment);
        
        incRefAndCheckShape(depthStencilAttachment);
        

        // decrement references
        decFBORefs(framebuffer);

        framebuffer.width = width;
        framebuffer.height = height;

        framebuffer.colorAttachments = colorAttachments;
        framebuffer.depthAttachment = depthAttachment;
        framebuffer.stencilAttachment = stencilAttachment;
        framebuffer.depthStencilAttachment = depthStencilAttachment;

        reglFramebuffer.color = colorAttachments.map(unwrapAttachment);
        reglFramebuffer.depth = unwrapAttachment(depthAttachment);
        reglFramebuffer.stencil = unwrapAttachment(stencilAttachment);
        reglFramebuffer.depthStencil = unwrapAttachment(depthStencilAttachment);

        reglFramebuffer.width = framebuffer.width;
        reglFramebuffer.height = framebuffer.height;

        updateFramebuffer(framebuffer);

        return reglFramebuffer
      }

      function resize (w_, h_) {
        

        var w = Math.max(w_ | 0, 1);
        var h = Math.max((h_ | 0) || w, 1);
        if (w === framebuffer.width && h === framebuffer.height) {
          return reglFramebuffer
        }

        // resize all buffers
        var colorAttachments = framebuffer.colorAttachments;
        for (var i = 0; i < colorAttachments.length; ++i) {
          resizeAttachment(colorAttachments[i], w, h);
        }
        resizeAttachment(framebuffer.depthAttachment, w, h);
        resizeAttachment(framebuffer.stencilAttachment, w, h);
        resizeAttachment(framebuffer.depthStencilAttachment, w, h);

        framebuffer.width = reglFramebuffer.width = w;
        framebuffer.height = reglFramebuffer.height = h;

        updateFramebuffer(framebuffer);

        return reglFramebuffer
      }

      reglFramebuffer(a0, a1);

      return extend(reglFramebuffer, {
        resize: resize,
        _reglType: 'framebuffer',
        _framebuffer: framebuffer,
        destroy: function () {
          destroy(framebuffer);
          decFBORefs(framebuffer);
        },
        use: function (block) {
          framebufferState.setFBO({
            framebuffer: reglFramebuffer
          }, block);
        }
      })
    }

    function createCubeFBO (options) {
      var faces = Array(6);

      function reglFramebufferCube (a) {
        var i;

        

        var params = {
          color: null
        };

        var radius = 0;

        var colorBuffer = null;
        var colorFormat = 'rgba';
        var colorType = 'uint8';
        var colorCount = 1;

        if (typeof a === 'number') {
          radius = a | 0;
        } else if (!a) {
          radius = 1;
        } else {
          
          var options = a;

          if ('shape' in options) {
            var shape = options.shape;
            
            
            radius = shape[0];
          } else {
            if ('radius' in options) {
              radius = options.radius | 0;
            }
            if ('width' in options) {
              radius = options.width | 0;
            } else if ('height' in options) {
              radius = options.height | 0;
            }
          }

          if ('color' in options ||
              'colors' in options) {
            colorBuffer =
              options.color ||
              options.colors;
          }

          if (!colorBuffer) {
            if ('colorCount' in options) {
              colorCount = options.colorCount | 0;
              
            }

            if ('colorType' in options) {
              
              colorType = options.colorType;
            }

            if ('colorFormat' in options) {
              colorFormat = options.colorFormat;
              
            }
          }

          if ('depth' in options) {
            params.depth = options.depth;
          }

          if ('stencil' in options) {
            params.stencil = options.stencil;
          }

          if ('depthStencil' in options) {
            params.depthStencil = options.depthStencil;
          }
        }

        var colorCubes;
        if (colorBuffer) {
          if (Array.isArray(colorBuffer)) {
            colorCubes = [];
            for (i = 0; i < colorBuffer.length; ++i) {
              colorCubes[i] = colorBuffer[i];
            }
          } else {
            colorCubes = [ colorBuffer ];
          }
        } else {
          colorCubes = Array(colorCount);
          var cubeMapParams = {
            radius: radius,
            format: colorFormat,
            type: colorType
          };
          for (i = 0; i < colorCount; ++i) {
            colorCubes[i] = textureState.createCube(cubeMapParams);
          }
        }

        // Check color cubes
        params.color = Array(colorCubes.length);
        for (i = 0; i < colorCubes.length; ++i) {
          var cube = colorCubes[i];
          
          radius = radius || cube.width;
          
          params.color[i] = {
            target: GL_TEXTURE_CUBE_MAP_POSITIVE_X$2,
            data: colorCubes[i]
          };
        }

        for (i = 0; i < 6; ++i) {
          for (var j = 0; j < colorCubes.length; ++j) {
            params.color[j].target = GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + i;
          }
          // reuse depth-stencil attachments across all cube maps
          if (i > 0) {
            params.depth = faces[0].depth;
            params.stencil = faces[0].stencil;
            params.depthStencil = faces[0].depthStencil;
          }
          if (faces[i]) {
            (faces[i])(params);
          } else {
            faces[i] = createFBO(params);
          }
        }

        return extend(reglFramebufferCube, {
          width: radius,
          height: radius,
          color: colorCubes
        })
      }

      function resize (radius_) {
        var i;
        var radius = radius_ | 0;
        

        if (radius === reglFramebufferCube.width) {
          return reglFramebufferCube
        }

        var colors = reglFramebufferCube.color;
        for (i = 0; i < colors.length; ++i) {
          colors[i].resize(radius);
        }

        for (i = 0; i < 6; ++i) {
          faces[i].resize(radius);
        }

        reglFramebufferCube.width = reglFramebufferCube.height = radius;

        return reglFramebufferCube
      }

      reglFramebufferCube(options);

      return extend(reglFramebufferCube, {
        faces: faces,
        resize: resize,
        _reglType: 'framebufferCube',
        destroy: function () {
          faces.forEach(function (f) {
            f.destroy();
          });
        }
      })
    }

    function restoreFramebuffers () {
      framebufferState.cur = null;
      framebufferState.next = null;
      framebufferState.dirty = true;
      values(framebufferSet).forEach(function (fb) {
        fb.framebuffer = gl.createFramebuffer();
        updateFramebuffer(fb);
      });
    }

    return extend(framebufferState, {
      getFramebuffer: function (object) {
        if (typeof object === 'function' && object._reglType === 'framebuffer') {
          var fbo = object._framebuffer;
          if (fbo instanceof REGLFramebuffer) {
            return fbo
          }
        }
        return null
      },
      create: createFBO,
      createCube: createCubeFBO,
      clear: function () {
        values(framebufferSet).forEach(destroy);
      },
      restore: restoreFramebuffers
    })
  }

  var GL_FLOAT$5 = 5126;
  var GL_ARRAY_BUFFER$1 = 34962;
  var GL_ELEMENT_ARRAY_BUFFER$1 = 34963;

  function AttributeRecord () {
    this.state = 0;

    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    this.w = 0.0;

    this.buffer = null;
    this.size = 0;
    this.normalized = false;
    this.type = GL_FLOAT$5;
    this.offset = 0;
    this.stride = 0;
    this.divisor = 0;
  }

  function wrapAttributeState (
    gl,
    extensions,
    limits,
    stats,
    bufferState,
    elementState,
    drawState) {
    var NUM_ATTRIBUTES = limits.maxAttributes;
    var attributeBindings = new Array(NUM_ATTRIBUTES);
    for (var i = 0; i < NUM_ATTRIBUTES; ++i) {
      attributeBindings[i] = new AttributeRecord();
    }
    var vaoCount = 0;
    var vaoSet = {};

    var state = {
      Record: AttributeRecord,
      scope: {},
      state: attributeBindings,
      currentVAO: null,
      targetVAO: null,
      restore: extVAO() ? restoreVAO : function () {},
      createVAO: createVAO,
      getVAO: getVAO,
      destroyBuffer: destroyBuffer,
      setVAO: extVAO() ? setVAOEXT : setVAOEmulated,
      clear: extVAO() ? destroyVAOEXT : function () {}
    };

    function destroyBuffer (buffer) {
      for (var i = 0; i < attributeBindings.length; ++i) {
        var record = attributeBindings[i];
        if (record.buffer === buffer) {
          gl.disableVertexAttribArray(i);
          record.buffer = null;
        }
      }
    }

    function extVAO () {
      return extensions.oes_vertex_array_object
    }

    function extInstanced () {
      return extensions.angle_instanced_arrays
    }

    function getVAO (vao) {
      if (typeof vao === 'function' && vao._vao) {
        return vao._vao
      }
      return null
    }

    function setVAOEXT (vao) {
      if (vao === state.currentVAO) {
        return
      }
      var ext = extVAO();
      if (vao) {
        ext.bindVertexArrayOES(vao.vao);
      } else {
        ext.bindVertexArrayOES(null);
      }
      state.currentVAO = vao;
    }

    function setVAOEmulated (vao) {
      if (vao === state.currentVAO) {
        return
      }
      if (vao) {
        vao.bindAttrs();
      } else {
        var exti = extInstanced();
        for (var i = 0; i < attributeBindings.length; ++i) {
          var binding = attributeBindings[i];
          if (binding.buffer) {
            gl.enableVertexAttribArray(i);
            binding.buffer.bind();
            gl.vertexAttribPointer(i, binding.size, binding.type, binding.normalized, binding.stride, binding.offfset);
            if (exti && binding.divisor) {
              exti.vertexAttribDivisorANGLE(i, binding.divisor);
            }
          } else {
            gl.disableVertexAttribArray(i);
            gl.vertexAttrib4f(i, binding.x, binding.y, binding.z, binding.w);
          }
        }
        if (drawState.elements) {
          gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, drawState.elements.buffer.buffer);
        } else {
          gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, null);
        }
      }
      state.currentVAO = vao;
    }

    function destroyVAOEXT () {
      values(vaoSet).forEach(function (vao) {
        vao.destroy();
      });
    }

    function REGLVAO () {
      this.id = ++vaoCount;
      this.attributes = [];
      this.elements = null;
      this.ownsElements = false;
      this.count = 0;
      this.offset = 0;
      this.instances = -1;
      this.primitive = 4;
      var extension = extVAO();
      if (extension) {
        this.vao = extension.createVertexArrayOES();
      } else {
        this.vao = null;
      }
      vaoSet[this.id] = this;
      this.buffers = [];
    }

    REGLVAO.prototype.bindAttrs = function () {
      var exti = extInstanced();
      var attributes = this.attributes;
      for (var i = 0; i < attributes.length; ++i) {
        var attr = attributes[i];
        if (attr.buffer) {
          gl.enableVertexAttribArray(i);
          gl.bindBuffer(GL_ARRAY_BUFFER$1, attr.buffer.buffer);
          gl.vertexAttribPointer(i, attr.size, attr.type, attr.normalized, attr.stride, attr.offset);
          if (exti && attr.divisor) {
            exti.vertexAttribDivisorANGLE(i, attr.divisor);
          }
        } else {
          gl.disableVertexAttribArray(i);
          gl.vertexAttrib4f(i, attr.x, attr.y, attr.z, attr.w);
        }
      }
      for (var j = attributes.length; j < NUM_ATTRIBUTES; ++j) {
        gl.disableVertexAttribArray(j);
      }
      var elements = elementState.getElements(this.elements);
      if (elements) {
        gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, elements.buffer.buffer);
      } else {
        gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, null);
      }
    };

    REGLVAO.prototype.refresh = function () {
      var ext = extVAO();
      if (ext) {
        ext.bindVertexArrayOES(this.vao);
        this.bindAttrs();
        state.currentVAO = null;
        ext.bindVertexArrayOES(null);
      }
    };

    REGLVAO.prototype.destroy = function () {
      if (this.vao) {
        var extension = extVAO();
        if (this === state.currentVAO) {
          state.currentVAO = null;
          extension.bindVertexArrayOES(null);
        }
        extension.deleteVertexArrayOES(this.vao);
        this.vao = null;
      }
      if (this.ownsElements) {
        this.elements.destroy();
        this.elements = null;
        this.ownsElements = false;
      }
      if (vaoSet[this.id]) {
        delete vaoSet[this.id];
        stats.vaoCount -= 1;
      }
    };

    function restoreVAO () {
      var ext = extVAO();
      if (ext) {
        values(vaoSet).forEach(function (vao) {
          vao.refresh();
        });
      }
    }

    function createVAO (_attr) {
      var vao = new REGLVAO();
      stats.vaoCount += 1;

      function updateVAO (options) {
        var attributes;
        if (Array.isArray(options)) {
          attributes = options;
          if (vao.elements && vao.ownsElements) {
            vao.elements.destroy();
          }
          vao.elements = null;
          vao.ownsElements = false;
          vao.offset = 0;
          vao.count = 0;
          vao.instances = -1;
          vao.primitive = 4;
        } else {
          
          
          if (options.elements) {
            var elements = options.elements;
            if (vao.ownsElements) {
              if (typeof elements === 'function' && elements._reglType === 'elements') {
                vao.elements.destroy();
                vao.ownsElements = false;
              } else {
                vao.elements(elements);
                vao.ownsElements = false;
              }
            } else if (elementState.getElements(options.elements)) {
              vao.elements = options.elements;
              vao.ownsElements = false;
            } else {
              vao.elements = elementState.create(options.elements);
              vao.ownsElements = true;
            }
          } else {
            vao.elements = null;
            vao.ownsElements = false;
          }
          attributes = options.attributes;

          // set default vao
          vao.offset = 0;
          vao.count = -1;
          vao.instances = -1;
          vao.primitive = 4;

          // copy element properties
          if (vao.elements) {
            vao.count = vao.elements._elements.vertCount;
            vao.primitive = vao.elements._elements.primType;
          }

          if ('offset' in options) {
            vao.offset = options.offset | 0;
          }
          if ('count' in options) {
            vao.count = options.count | 0;
          }
          if ('instances' in options) {
            vao.instances = options.instances | 0;
          }
          if ('primitive' in options) {
            
            vao.primitive = primTypes[options.primitive];
          }

          
          
        }

        
        

        var bufUpdated = {};
        var nattributes = vao.attributes;
        nattributes.length = attributes.length;
        for (var i = 0; i < attributes.length; ++i) {
          var spec = attributes[i];
          var rec = nattributes[i] = new AttributeRecord();
          var data = spec.data || spec;
          if (Array.isArray(data) || isTypedArray(data) || isNDArrayLike(data)) {
            var buf;
            if (vao.buffers[i]) {
              buf = vao.buffers[i];
              if (isTypedArray(data) && buf._buffer.byteLength >= data.byteLength) {
                buf.subdata(data);
              } else {
                buf.destroy();
                vao.buffers[i] = null;
              }
            }
            if (!vao.buffers[i]) {
              buf = vao.buffers[i] = bufferState.create(spec, GL_ARRAY_BUFFER$1, false, true);
            }
            rec.buffer = bufferState.getBuffer(buf);
            rec.size = rec.buffer.dimension | 0;
            rec.normalized = false;
            rec.type = rec.buffer.dtype;
            rec.offset = 0;
            rec.stride = 0;
            rec.divisor = 0;
            rec.state = 1;
            bufUpdated[i] = 1;
          } else if (bufferState.getBuffer(spec)) {
            rec.buffer = bufferState.getBuffer(spec);
            rec.size = rec.buffer.dimension | 0;
            rec.normalized = false;
            rec.type = rec.buffer.dtype;
            rec.offset = 0;
            rec.stride = 0;
            rec.divisor = 0;
            rec.state = 1;
          } else if (bufferState.getBuffer(spec.buffer)) {
            rec.buffer = bufferState.getBuffer(spec.buffer);
            rec.size = ((+spec.size) || rec.buffer.dimension) | 0;
            rec.normalized = !!spec.normalized || false;
            if ('type' in spec) {
              
              rec.type = glTypes[spec.type];
            } else {
              rec.type = rec.buffer.dtype;
            }
            rec.offset = (spec.offset || 0) | 0;
            rec.stride = (spec.stride || 0) | 0;
            rec.divisor = (spec.divisor || 0) | 0;
            rec.state = 1;

            
            
            
            
            
          } else if ('x' in spec) {
            
            rec.x = +spec.x || 0;
            rec.y = +spec.y || 0;
            rec.z = +spec.z || 0;
            rec.w = +spec.w || 0;
            rec.state = 2;
          } else ;
        }

        // retire unused buffers
        for (var j = 0; j < vao.buffers.length; ++j) {
          if (!bufUpdated[j] && vao.buffers[j]) {
            vao.buffers[j].destroy();
            vao.buffers[j] = null;
          }
        }

        vao.refresh();
        return updateVAO
      }

      updateVAO.destroy = function () {
        for (var j = 0; j < vao.buffers.length; ++j) {
          if (vao.buffers[j]) {
            vao.buffers[j].destroy();
          }
        }
        vao.buffers.length = 0;

        if (vao.ownsElements) {
          vao.elements.destroy();
          vao.elements = null;
          vao.ownsElements = false;
        }

        vao.destroy();
      };

      updateVAO._vao = vao;
      updateVAO._reglType = 'vao';

      return updateVAO(_attr)
    }

    return state
  }

  var GL_FRAGMENT_SHADER = 35632;
  var GL_VERTEX_SHADER = 35633;

  var GL_ACTIVE_UNIFORMS = 0x8B86;
  var GL_ACTIVE_ATTRIBUTES = 0x8B89;

  function wrapShaderState (gl, stringStore, stats, config) {
    // ===================================================
    // glsl compilation and linking
    // ===================================================
    var fragShaders = {};
    var vertShaders = {};

    function ActiveInfo (name, id, location, info) {
      this.name = name;
      this.id = id;
      this.location = location;
      this.info = info;
    }

    function insertActiveInfo (list, info) {
      for (var i = 0; i < list.length; ++i) {
        if (list[i].id === info.id) {
          list[i].location = info.location;
          return
        }
      }
      list.push(info);
    }

    function getShader (type, id, command) {
      var cache = type === GL_FRAGMENT_SHADER ? fragShaders : vertShaders;
      var shader = cache[id];

      if (!shader) {
        var source = stringStore.str(id);
        shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        cache[id] = shader;
      }

      return shader
    }

    // ===================================================
    // program linking
    // ===================================================
    var programCache = {};
    var programList = [];

    var PROGRAM_COUNTER = 0;

    function REGLProgram (fragId, vertId) {
      this.id = PROGRAM_COUNTER++;
      this.fragId = fragId;
      this.vertId = vertId;
      this.program = null;
      this.uniforms = [];
      this.attributes = [];
      this.refCount = 1;

      if (config.profile) {
        this.stats = {
          uniformsCount: 0,
          attributesCount: 0
        };
      }
    }

    function linkProgram (desc, command, attributeLocations) {
      var i, info;

      // -------------------------------
      // compile & link
      // -------------------------------
      var fragShader = getShader(GL_FRAGMENT_SHADER, desc.fragId);
      var vertShader = getShader(GL_VERTEX_SHADER, desc.vertId);

      var program = desc.program = gl.createProgram();
      gl.attachShader(program, fragShader);
      gl.attachShader(program, vertShader);
      if (attributeLocations) {
        for (i = 0; i < attributeLocations.length; ++i) {
          var binding = attributeLocations[i];
          gl.bindAttribLocation(program, binding[0], binding[1]);
        }
      }

      gl.linkProgram(program);
      

      // -------------------------------
      // grab uniforms
      // -------------------------------
      var numUniforms = gl.getProgramParameter(program, GL_ACTIVE_UNIFORMS);
      if (config.profile) {
        desc.stats.uniformsCount = numUniforms;
      }
      var uniforms = desc.uniforms;
      for (i = 0; i < numUniforms; ++i) {
        info = gl.getActiveUniform(program, i);
        if (info) {
          if (info.size > 1) {
            for (var j = 0; j < info.size; ++j) {
              var name = info.name.replace('[0]', '[' + j + ']');
              insertActiveInfo(uniforms, new ActiveInfo(
                name,
                stringStore.id(name),
                gl.getUniformLocation(program, name),
                info));
            }
          }
          var uniName = info.name;
          if (info.size > 1) {
            uniName = uniName.replace('[0]', '');
          }
          insertActiveInfo(uniforms, new ActiveInfo(
            uniName,
            stringStore.id(uniName),
            gl.getUniformLocation(program, uniName),
            info));
        }
      }

      // -------------------------------
      // grab attributes
      // -------------------------------
      var numAttributes = gl.getProgramParameter(program, GL_ACTIVE_ATTRIBUTES);
      if (config.profile) {
        desc.stats.attributesCount = numAttributes;
      }

      var attributes = desc.attributes;
      for (i = 0; i < numAttributes; ++i) {
        info = gl.getActiveAttrib(program, i);
        if (info) {
          insertActiveInfo(attributes, new ActiveInfo(
            info.name,
            stringStore.id(info.name),
            gl.getAttribLocation(program, info.name),
            info));
        }
      }
    }

    if (config.profile) {
      stats.getMaxUniformsCount = function () {
        var m = 0;
        programList.forEach(function (desc) {
          if (desc.stats.uniformsCount > m) {
            m = desc.stats.uniformsCount;
          }
        });
        return m
      };

      stats.getMaxAttributesCount = function () {
        var m = 0;
        programList.forEach(function (desc) {
          if (desc.stats.attributesCount > m) {
            m = desc.stats.attributesCount;
          }
        });
        return m
      };
    }

    function restoreShaders () {
      fragShaders = {};
      vertShaders = {};
      for (var i = 0; i < programList.length; ++i) {
        linkProgram(programList[i], null, programList[i].attributes.map(function (info) {
          return [info.location, info.name]
        }));
      }
    }

    return {
      clear: function () {
        var deleteShader = gl.deleteShader.bind(gl);
        values(fragShaders).forEach(deleteShader);
        fragShaders = {};
        values(vertShaders).forEach(deleteShader);
        vertShaders = {};

        programList.forEach(function (desc) {
          gl.deleteProgram(desc.program);
        });
        programList.length = 0;
        programCache = {};

        stats.shaderCount = 0;
      },

      program: function (vertId, fragId, command, attribLocations) {
        
        

        var cache = programCache[fragId];
        if (!cache) {
          cache = programCache[fragId] = {};
        }
        var prevProgram = cache[vertId];
        if (prevProgram) {
          prevProgram.refCount++;
          if (!attribLocations) {
            return prevProgram
          }
        }
        var program = new REGLProgram(fragId, vertId);
        stats.shaderCount++;
        linkProgram(program, command, attribLocations);
        if (!prevProgram) {
          cache[vertId] = program;
        }
        programList.push(program);
        return extend(program, {
          destroy: function () {
            program.refCount--;
            if (program.refCount <= 0) {
              gl.deleteProgram(program.program);
              var idx = programList.indexOf(program);
              programList.splice(idx, 1);
              stats.shaderCount--;
            }
            // no program is linked to this vert anymore
            if (cache[program.vertId].refCount <= 0) {
              gl.deleteShader(vertShaders[program.vertId]);
              delete vertShaders[program.vertId];
              delete programCache[program.fragId][program.vertId];
            }
            // no program is linked to this frag anymore
            if (!Object.keys(programCache[program.fragId]).length) {
              gl.deleteShader(fragShaders[program.fragId]);
              delete fragShaders[program.fragId];
              delete programCache[program.fragId];
            }
          }
        })
      },

      restore: restoreShaders,

      shader: getShader,

      frag: -1,
      vert: -1
    }
  }

  var GL_RGBA$3 = 6408;
  var GL_UNSIGNED_BYTE$6 = 5121;
  var GL_PACK_ALIGNMENT = 0x0D05;
  var GL_FLOAT$6 = 0x1406; // 5126

  function wrapReadPixels (
    gl,
    framebufferState,
    reglPoll,
    context,
    glAttributes,
    extensions,
    limits) {
    function readPixelsImpl (input) {
      var type;
      if (framebufferState.next === null) {
        
        type = GL_UNSIGNED_BYTE$6;
      } else {
        
        type = framebufferState.next.colorAttachments[0].texture._texture.type;

        
      }

      var x = 0;
      var y = 0;
      var width = context.framebufferWidth;
      var height = context.framebufferHeight;
      var data = null;

      if (isTypedArray(input)) {
        data = input;
      } else if (input) {
        
        x = input.x | 0;
        y = input.y | 0;
        
        
        width = (input.width || (context.framebufferWidth - x)) | 0;
        height = (input.height || (context.framebufferHeight - y)) | 0;
        data = input.data || null;
      }

      
      

      // Update WebGL state
      reglPoll();

      // Compute size
      var size = width * height * 4;

      // Allocate data
      if (!data) {
        if (type === GL_UNSIGNED_BYTE$6) {
          data = new Uint8Array(size);
        } else if (type === GL_FLOAT$6) {
          data = data || new Float32Array(size);
        }
      }

      // Type check
      
      

      // Run read pixels
      gl.pixelStorei(GL_PACK_ALIGNMENT, 4);
      gl.readPixels(x, y, width, height, GL_RGBA$3,
        type,
        data);

      return data
    }

    function readPixelsFBO (options) {
      var result;
      framebufferState.setFBO({
        framebuffer: options.framebuffer
      }, function () {
        result = readPixelsImpl(options);
      });
      return result
    }

    function readPixels (options) {
      if (!options || !('framebuffer' in options)) {
        return readPixelsImpl(options)
      } else {
        return readPixelsFBO(options)
      }
    }

    return readPixels
  }

  function slice (x) {
    return Array.prototype.slice.call(x)
  }

  function join (x) {
    return slice(x).join('')
  }

  function createEnvironment () {
    // Unique variable id counter
    var varCounter = 0;

    // Linked values are passed from this scope into the generated code block
    // Calling link() passes a value into the generated scope and returns
    // the variable name which it is bound to
    var linkedNames = [];
    var linkedValues = [];
    function link (value) {
      for (var i = 0; i < linkedValues.length; ++i) {
        if (linkedValues[i] === value) {
          return linkedNames[i]
        }
      }

      var name = 'g' + (varCounter++);
      linkedNames.push(name);
      linkedValues.push(value);
      return name
    }

    // create a code block
    function block () {
      var code = [];
      function push () {
        code.push.apply(code, slice(arguments));
      }

      var vars = [];
      function def () {
        var name = 'v' + (varCounter++);
        vars.push(name);

        if (arguments.length > 0) {
          code.push(name, '=');
          code.push.apply(code, slice(arguments));
          code.push(';');
        }

        return name
      }

      return extend(push, {
        def: def,
        toString: function () {
          return join([
            (vars.length > 0 ? 'var ' + vars.join(',') + ';' : ''),
            join(code)
          ])
        }
      })
    }

    function scope () {
      var entry = block();
      var exit = block();

      var entryToString = entry.toString;
      var exitToString = exit.toString;

      function save (object, prop) {
        exit(object, prop, '=', entry.def(object, prop), ';');
      }

      return extend(function () {
        entry.apply(entry, slice(arguments));
      }, {
        def: entry.def,
        entry: entry,
        exit: exit,
        save: save,
        set: function (object, prop, value) {
          save(object, prop);
          entry(object, prop, '=', value, ';');
        },
        toString: function () {
          return entryToString() + exitToString()
        }
      })
    }

    function conditional () {
      var pred = join(arguments);
      var thenBlock = scope();
      var elseBlock = scope();

      var thenToString = thenBlock.toString;
      var elseToString = elseBlock.toString;

      return extend(thenBlock, {
        then: function () {
          thenBlock.apply(thenBlock, slice(arguments));
          return this
        },
        else: function () {
          elseBlock.apply(elseBlock, slice(arguments));
          return this
        },
        toString: function () {
          var elseClause = elseToString();
          if (elseClause) {
            elseClause = 'else{' + elseClause + '}';
          }
          return join([
            'if(', pred, '){',
            thenToString(),
            '}', elseClause
          ])
        }
      })
    }

    // procedure list
    var globalBlock = block();
    var procedures = {};
    function proc (name, count) {
      var args = [];
      function arg () {
        var name = 'a' + args.length;
        args.push(name);
        return name
      }

      count = count || 0;
      for (var i = 0; i < count; ++i) {
        arg();
      }

      var body = scope();
      var bodyToString = body.toString;

      var result = procedures[name] = extend(body, {
        arg: arg,
        toString: function () {
          return join([
            'function(', args.join(), '){',
            bodyToString(),
            '}'
          ])
        }
      });

      return result
    }

    function compile () {
      var code = ['"use strict";',
        globalBlock,
        'return {'];
      Object.keys(procedures).forEach(function (name) {
        code.push('"', name, '":', procedures[name].toString(), ',');
      });
      code.push('}');
      var src = join(code)
        .replace(/;/g, ';\n')
        .replace(/}/g, '}\n')
        .replace(/{/g, '{\n');
      var proc = Function.apply(null, linkedNames.concat(src));
      return proc.apply(null, linkedValues)
    }

    return {
      global: globalBlock,
      link: link,
      block: block,
      proc: proc,
      scope: scope,
      cond: conditional,
      compile: compile
    }
  }

  // "cute" names for vector components
  var CUTE_COMPONENTS = 'xyzw'.split('');

  var GL_UNSIGNED_BYTE$7 = 5121;

  var ATTRIB_STATE_POINTER = 1;
  var ATTRIB_STATE_CONSTANT = 2;

  var DYN_FUNC$1 = 0;
  var DYN_PROP$1 = 1;
  var DYN_CONTEXT$1 = 2;
  var DYN_STATE$1 = 3;
  var DYN_THUNK = 4;
  var DYN_CONSTANT$1 = 5;
  var DYN_ARRAY$1 = 6;

  var S_DITHER = 'dither';
  var S_BLEND_ENABLE = 'blend.enable';
  var S_BLEND_COLOR = 'blend.color';
  var S_BLEND_EQUATION = 'blend.equation';
  var S_BLEND_FUNC = 'blend.func';
  var S_DEPTH_ENABLE = 'depth.enable';
  var S_DEPTH_FUNC = 'depth.func';
  var S_DEPTH_RANGE = 'depth.range';
  var S_DEPTH_MASK = 'depth.mask';
  var S_COLOR_MASK = 'colorMask';
  var S_CULL_ENABLE = 'cull.enable';
  var S_CULL_FACE = 'cull.face';
  var S_FRONT_FACE = 'frontFace';
  var S_LINE_WIDTH = 'lineWidth';
  var S_POLYGON_OFFSET_ENABLE = 'polygonOffset.enable';
  var S_POLYGON_OFFSET_OFFSET = 'polygonOffset.offset';
  var S_SAMPLE_ALPHA = 'sample.alpha';
  var S_SAMPLE_ENABLE = 'sample.enable';
  var S_SAMPLE_COVERAGE = 'sample.coverage';
  var S_STENCIL_ENABLE = 'stencil.enable';
  var S_STENCIL_MASK = 'stencil.mask';
  var S_STENCIL_FUNC = 'stencil.func';
  var S_STENCIL_OPFRONT = 'stencil.opFront';
  var S_STENCIL_OPBACK = 'stencil.opBack';
  var S_SCISSOR_ENABLE = 'scissor.enable';
  var S_SCISSOR_BOX = 'scissor.box';
  var S_VIEWPORT = 'viewport';

  var S_PROFILE = 'profile';

  var S_FRAMEBUFFER = 'framebuffer';
  var S_VERT = 'vert';
  var S_FRAG = 'frag';
  var S_ELEMENTS = 'elements';
  var S_PRIMITIVE = 'primitive';
  var S_COUNT = 'count';
  var S_OFFSET = 'offset';
  var S_INSTANCES = 'instances';
  var S_VAO = 'vao';

  var SUFFIX_WIDTH = 'Width';
  var SUFFIX_HEIGHT = 'Height';

  var S_FRAMEBUFFER_WIDTH = S_FRAMEBUFFER + SUFFIX_WIDTH;
  var S_FRAMEBUFFER_HEIGHT = S_FRAMEBUFFER + SUFFIX_HEIGHT;
  var S_VIEWPORT_WIDTH = S_VIEWPORT + SUFFIX_WIDTH;
  var S_VIEWPORT_HEIGHT = S_VIEWPORT + SUFFIX_HEIGHT;
  var S_DRAWINGBUFFER = 'drawingBuffer';
  var S_DRAWINGBUFFER_WIDTH = S_DRAWINGBUFFER + SUFFIX_WIDTH;
  var S_DRAWINGBUFFER_HEIGHT = S_DRAWINGBUFFER + SUFFIX_HEIGHT;

  var NESTED_OPTIONS = [
    S_BLEND_FUNC,
    S_BLEND_EQUATION,
    S_STENCIL_FUNC,
    S_STENCIL_OPFRONT,
    S_STENCIL_OPBACK,
    S_SAMPLE_COVERAGE,
    S_VIEWPORT,
    S_SCISSOR_BOX,
    S_POLYGON_OFFSET_OFFSET
  ];

  var GL_ARRAY_BUFFER$2 = 34962;
  var GL_ELEMENT_ARRAY_BUFFER$2 = 34963;

  var GL_CULL_FACE = 0x0B44;
  var GL_BLEND = 0x0BE2;
  var GL_DITHER = 0x0BD0;
  var GL_STENCIL_TEST = 0x0B90;
  var GL_DEPTH_TEST = 0x0B71;
  var GL_SCISSOR_TEST = 0x0C11;
  var GL_POLYGON_OFFSET_FILL = 0x8037;
  var GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
  var GL_SAMPLE_COVERAGE = 0x80A0;

  var GL_FLOAT$7 = 5126;
  var GL_FLOAT_VEC2 = 35664;
  var GL_FLOAT_VEC3 = 35665;
  var GL_FLOAT_VEC4 = 35666;
  var GL_INT$2 = 5124;
  var GL_INT_VEC2 = 35667;
  var GL_INT_VEC3 = 35668;
  var GL_INT_VEC4 = 35669;
  var GL_BOOL = 35670;
  var GL_BOOL_VEC2 = 35671;
  var GL_BOOL_VEC3 = 35672;
  var GL_BOOL_VEC4 = 35673;
  var GL_FLOAT_MAT2 = 35674;
  var GL_FLOAT_MAT3 = 35675;
  var GL_FLOAT_MAT4 = 35676;
  var GL_SAMPLER_2D = 35678;
  var GL_SAMPLER_CUBE = 35680;

  var GL_TRIANGLES$1 = 4;

  var GL_FRONT = 1028;
  var GL_BACK = 1029;
  var GL_CW = 0x0900;
  var GL_CCW = 0x0901;
  var GL_MIN_EXT = 0x8007;
  var GL_MAX_EXT = 0x8008;
  var GL_ALWAYS = 519;
  var GL_KEEP = 7680;
  var GL_ZERO = 0;
  var GL_ONE = 1;
  var GL_FUNC_ADD = 0x8006;
  var GL_LESS = 513;

  var GL_FRAMEBUFFER$2 = 0x8D40;
  var GL_COLOR_ATTACHMENT0$2 = 0x8CE0;

  var blendFuncs = {
    '0': 0,
    '1': 1,
    'zero': 0,
    'one': 1,
    'src color': 768,
    'one minus src color': 769,
    'src alpha': 770,
    'one minus src alpha': 771,
    'dst color': 774,
    'one minus dst color': 775,
    'dst alpha': 772,
    'one minus dst alpha': 773,
    'constant color': 32769,
    'one minus constant color': 32770,
    'constant alpha': 32771,
    'one minus constant alpha': 32772,
    'src alpha saturate': 776
  };

  var compareFuncs = {
    'never': 512,
    'less': 513,
    '<': 513,
    'equal': 514,
    '=': 514,
    '==': 514,
    '===': 514,
    'lequal': 515,
    '<=': 515,
    'greater': 516,
    '>': 516,
    'notequal': 517,
    '!=': 517,
    '!==': 517,
    'gequal': 518,
    '>=': 518,
    'always': 519
  };

  var stencilOps = {
    '0': 0,
    'zero': 0,
    'keep': 7680,
    'replace': 7681,
    'increment': 7682,
    'decrement': 7683,
    'increment wrap': 34055,
    'decrement wrap': 34056,
    'invert': 5386
  };

  var orientationType = {
    'cw': GL_CW,
    'ccw': GL_CCW
  };

  function isBufferArgs (x) {
    return Array.isArray(x) ||
      isTypedArray(x) ||
      isNDArrayLike(x)
  }

  // Make sure viewport is processed first
  function sortState (state) {
    return state.sort(function (a, b) {
      if (a === S_VIEWPORT) {
        return -1
      } else if (b === S_VIEWPORT) {
        return 1
      }
      return (a < b) ? -1 : 1
    })
  }

  function Declaration (thisDep, contextDep, propDep, append) {
    this.thisDep = thisDep;
    this.contextDep = contextDep;
    this.propDep = propDep;
    this.append = append;
  }

  function isStatic (decl) {
    return decl && !(decl.thisDep || decl.contextDep || decl.propDep)
  }

  function createStaticDecl (append) {
    return new Declaration(false, false, false, append)
  }

  function createDynamicDecl (dyn, append) {
    var type = dyn.type;
    if (type === DYN_FUNC$1) {
      var numArgs = dyn.data.length;
      return new Declaration(
        true,
        numArgs >= 1,
        numArgs >= 2,
        append)
    } else if (type === DYN_THUNK) {
      var data = dyn.data;
      return new Declaration(
        data.thisDep,
        data.contextDep,
        data.propDep,
        append)
    } else if (type === DYN_CONSTANT$1) {
      return new Declaration(
        false,
        false,
        false,
        append)
    } else if (type === DYN_ARRAY$1) {
      var thisDep = false;
      var contextDep = false;
      var propDep = false;
      for (var i = 0; i < dyn.data.length; ++i) {
        var subDyn = dyn.data[i];
        if (subDyn.type === DYN_PROP$1) {
          propDep = true;
        } else if (subDyn.type === DYN_CONTEXT$1) {
          contextDep = true;
        } else if (subDyn.type === DYN_STATE$1) {
          thisDep = true;
        } else if (subDyn.type === DYN_FUNC$1) {
          thisDep = true;
          var subArgs = subDyn.data;
          if (subArgs >= 1) {
            contextDep = true;
          }
          if (subArgs >= 2) {
            propDep = true;
          }
        } else if (subDyn.type === DYN_THUNK) {
          thisDep = thisDep || subDyn.data.thisDep;
          contextDep = contextDep || subDyn.data.contextDep;
          propDep = propDep || subDyn.data.propDep;
        }
      }
      return new Declaration(
        thisDep,
        contextDep,
        propDep,
        append)
    } else {
      return new Declaration(
        type === DYN_STATE$1,
        type === DYN_CONTEXT$1,
        type === DYN_PROP$1,
        append)
    }
  }

  var SCOPE_DECL = new Declaration(false, false, false, function () {});

  function reglCore (
    gl,
    stringStore,
    extensions,
    limits,
    bufferState,
    elementState,
    textureState,
    framebufferState,
    uniformState,
    attributeState,
    shaderState,
    drawState,
    contextState,
    timer,
    config) {
    var AttributeRecord = attributeState.Record;

    var blendEquations = {
      'add': 32774,
      'subtract': 32778,
      'reverse subtract': 32779
    };
    if (extensions.ext_blend_minmax) {
      blendEquations.min = GL_MIN_EXT;
      blendEquations.max = GL_MAX_EXT;
    }

    var extInstancing = extensions.angle_instanced_arrays;
    var extDrawBuffers = extensions.webgl_draw_buffers;
    var extVertexArrays = extensions.oes_vertex_array_object;

    // ===================================================
    // ===================================================
    // WEBGL STATE
    // ===================================================
    // ===================================================
    var currentState = {
      dirty: true,
      profile: config.profile
    };
    var nextState = {};
    var GL_STATE_NAMES = [];
    var GL_FLAGS = {};
    var GL_VARIABLES = {};

    function propName (name) {
      return name.replace('.', '_')
    }

    function stateFlag (sname, cap, init) {
      var name = propName(sname);
      GL_STATE_NAMES.push(sname);
      nextState[name] = currentState[name] = !!init;
      GL_FLAGS[name] = cap;
    }

    function stateVariable (sname, func, init) {
      var name = propName(sname);
      GL_STATE_NAMES.push(sname);
      if (Array.isArray(init)) {
        currentState[name] = init.slice();
        nextState[name] = init.slice();
      } else {
        currentState[name] = nextState[name] = init;
      }
      GL_VARIABLES[name] = func;
    }

    // Dithering
    stateFlag(S_DITHER, GL_DITHER);

    // Blending
    stateFlag(S_BLEND_ENABLE, GL_BLEND);
    stateVariable(S_BLEND_COLOR, 'blendColor', [0, 0, 0, 0]);
    stateVariable(S_BLEND_EQUATION, 'blendEquationSeparate',
      [GL_FUNC_ADD, GL_FUNC_ADD]);
    stateVariable(S_BLEND_FUNC, 'blendFuncSeparate',
      [GL_ONE, GL_ZERO, GL_ONE, GL_ZERO]);

    // Depth
    stateFlag(S_DEPTH_ENABLE, GL_DEPTH_TEST, true);
    stateVariable(S_DEPTH_FUNC, 'depthFunc', GL_LESS);
    stateVariable(S_DEPTH_RANGE, 'depthRange', [0, 1]);
    stateVariable(S_DEPTH_MASK, 'depthMask', true);

    // Color mask
    stateVariable(S_COLOR_MASK, S_COLOR_MASK, [true, true, true, true]);

    // Face culling
    stateFlag(S_CULL_ENABLE, GL_CULL_FACE);
    stateVariable(S_CULL_FACE, 'cullFace', GL_BACK);

    // Front face orientation
    stateVariable(S_FRONT_FACE, S_FRONT_FACE, GL_CCW);

    // Line width
    stateVariable(S_LINE_WIDTH, S_LINE_WIDTH, 1);

    // Polygon offset
    stateFlag(S_POLYGON_OFFSET_ENABLE, GL_POLYGON_OFFSET_FILL);
    stateVariable(S_POLYGON_OFFSET_OFFSET, 'polygonOffset', [0, 0]);

    // Sample coverage
    stateFlag(S_SAMPLE_ALPHA, GL_SAMPLE_ALPHA_TO_COVERAGE);
    stateFlag(S_SAMPLE_ENABLE, GL_SAMPLE_COVERAGE);
    stateVariable(S_SAMPLE_COVERAGE, 'sampleCoverage', [1, false]);

    // Stencil
    stateFlag(S_STENCIL_ENABLE, GL_STENCIL_TEST);
    stateVariable(S_STENCIL_MASK, 'stencilMask', -1);
    stateVariable(S_STENCIL_FUNC, 'stencilFunc', [GL_ALWAYS, 0, -1]);
    stateVariable(S_STENCIL_OPFRONT, 'stencilOpSeparate',
      [GL_FRONT, GL_KEEP, GL_KEEP, GL_KEEP]);
    stateVariable(S_STENCIL_OPBACK, 'stencilOpSeparate',
      [GL_BACK, GL_KEEP, GL_KEEP, GL_KEEP]);

    // Scissor
    stateFlag(S_SCISSOR_ENABLE, GL_SCISSOR_TEST);
    stateVariable(S_SCISSOR_BOX, 'scissor',
      [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

    // Viewport
    stateVariable(S_VIEWPORT, S_VIEWPORT,
      [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

    // ===================================================
    // ===================================================
    // ENVIRONMENT
    // ===================================================
    // ===================================================
    var sharedState = {
      gl: gl,
      context: contextState,
      strings: stringStore,
      next: nextState,
      current: currentState,
      draw: drawState,
      elements: elementState,
      buffer: bufferState,
      shader: shaderState,
      attributes: attributeState.state,
      vao: attributeState,
      uniforms: uniformState,
      framebuffer: framebufferState,
      extensions: extensions,

      timer: timer,
      isBufferArgs: isBufferArgs
    };

    var sharedConstants = {
      primTypes: primTypes,
      compareFuncs: compareFuncs,
      blendFuncs: blendFuncs,
      blendEquations: blendEquations,
      stencilOps: stencilOps,
      glTypes: glTypes,
      orientationType: orientationType
    };

    

    if (extDrawBuffers) {
      sharedConstants.backBuffer = [GL_BACK];
      sharedConstants.drawBuffer = loop(limits.maxDrawbuffers, function (i) {
        if (i === 0) {
          return [0]
        }
        return loop(i, function (j) {
          return GL_COLOR_ATTACHMENT0$2 + j
        })
      });
    }

    var drawCallCounter = 0;
    function createREGLEnvironment () {
      var env = createEnvironment();
      var link = env.link;
      var global = env.global;
      env.id = drawCallCounter++;

      env.batchId = '0';

      // link shared state
      var SHARED = link(sharedState);
      var shared = env.shared = {
        props: 'a0'
      };
      Object.keys(sharedState).forEach(function (prop) {
        shared[prop] = global.def(SHARED, '.', prop);
      });

      // Inject runtime assertion stuff for debug builds
      

      // Copy GL state variables over
      var nextVars = env.next = {};
      var currentVars = env.current = {};
      Object.keys(GL_VARIABLES).forEach(function (variable) {
        if (Array.isArray(currentState[variable])) {
          nextVars[variable] = global.def(shared.next, '.', variable);
          currentVars[variable] = global.def(shared.current, '.', variable);
        }
      });

      // Initialize shared constants
      var constants = env.constants = {};
      Object.keys(sharedConstants).forEach(function (name) {
        constants[name] = global.def(JSON.stringify(sharedConstants[name]));
      });

      // Helper function for calling a block
      env.invoke = function (block, x) {
        switch (x.type) {
          case DYN_FUNC$1:
            var argList = [
              'this',
              shared.context,
              shared.props,
              env.batchId
            ];
            return block.def(
              link(x.data), '.call(',
              argList.slice(0, Math.max(x.data.length + 1, 4)),
              ')')
          case DYN_PROP$1:
            return block.def(shared.props, x.data)
          case DYN_CONTEXT$1:
            return block.def(shared.context, x.data)
          case DYN_STATE$1:
            return block.def('this', x.data)
          case DYN_THUNK:
            x.data.append(env, block);
            return x.data.ref
          case DYN_CONSTANT$1:
            return x.data.toString()
          case DYN_ARRAY$1:
            return x.data.map(function (y) {
              return env.invoke(block, y)
            })
        }
      };

      env.attribCache = {};

      var scopeAttribs = {};
      env.scopeAttrib = function (name) {
        var id = stringStore.id(name);
        if (id in scopeAttribs) {
          return scopeAttribs[id]
        }
        var binding = attributeState.scope[id];
        if (!binding) {
          binding = attributeState.scope[id] = new AttributeRecord();
        }
        var result = scopeAttribs[id] = link(binding);
        return result
      };

      return env
    }

    // ===================================================
    // ===================================================
    // PARSING
    // ===================================================
    // ===================================================
    function parseProfile (options) {
      var staticOptions = options.static;
      var dynamicOptions = options.dynamic;

      var profileEnable;
      if (S_PROFILE in staticOptions) {
        var value = !!staticOptions[S_PROFILE];
        profileEnable = createStaticDecl(function (env, scope) {
          return value
        });
        profileEnable.enable = value;
      } else if (S_PROFILE in dynamicOptions) {
        var dyn = dynamicOptions[S_PROFILE];
        profileEnable = createDynamicDecl(dyn, function (env, scope) {
          return env.invoke(scope, dyn)
        });
      }

      return profileEnable
    }

    function parseFramebuffer (options, env) {
      var staticOptions = options.static;
      var dynamicOptions = options.dynamic;

      if (S_FRAMEBUFFER in staticOptions) {
        var framebuffer = staticOptions[S_FRAMEBUFFER];
        if (framebuffer) {
          framebuffer = framebufferState.getFramebuffer(framebuffer);
          
          return createStaticDecl(function (env, block) {
            var FRAMEBUFFER = env.link(framebuffer);
            var shared = env.shared;
            block.set(
              shared.framebuffer,
              '.next',
              FRAMEBUFFER);
            var CONTEXT = shared.context;
            block.set(
              CONTEXT,
              '.' + S_FRAMEBUFFER_WIDTH,
              FRAMEBUFFER + '.width');
            block.set(
              CONTEXT,
              '.' + S_FRAMEBUFFER_HEIGHT,
              FRAMEBUFFER + '.height');
            return FRAMEBUFFER
          })
        } else {
          return createStaticDecl(function (env, scope) {
            var shared = env.shared;
            scope.set(
              shared.framebuffer,
              '.next',
              'null');
            var CONTEXT = shared.context;
            scope.set(
              CONTEXT,
              '.' + S_FRAMEBUFFER_WIDTH,
              CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
            scope.set(
              CONTEXT,
              '.' + S_FRAMEBUFFER_HEIGHT,
              CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
            return 'null'
          })
        }
      } else if (S_FRAMEBUFFER in dynamicOptions) {
        var dyn = dynamicOptions[S_FRAMEBUFFER];
        return createDynamicDecl(dyn, function (env, scope) {
          var FRAMEBUFFER_FUNC = env.invoke(scope, dyn);
          var shared = env.shared;
          var FRAMEBUFFER_STATE = shared.framebuffer;
          var FRAMEBUFFER = scope.def(
            FRAMEBUFFER_STATE, '.getFramebuffer(', FRAMEBUFFER_FUNC, ')');

          

          scope.set(
            FRAMEBUFFER_STATE,
            '.next',
            FRAMEBUFFER);
          var CONTEXT = shared.context;
          scope.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_WIDTH,
            FRAMEBUFFER + '?' + FRAMEBUFFER + '.width:' +
            CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
          scope.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_HEIGHT,
            FRAMEBUFFER +
            '?' + FRAMEBUFFER + '.height:' +
            CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
          return FRAMEBUFFER
        })
      } else {
        return null
      }
    }

    function parseViewportScissor (options, framebuffer, env) {
      var staticOptions = options.static;
      var dynamicOptions = options.dynamic;

      function parseBox (param) {
        if (param in staticOptions) {
          var box = staticOptions[param];
          

          var isStatic = true;
          var x = box.x | 0;
          var y = box.y | 0;
          var w, h;
          if ('width' in box) {
            w = box.width | 0;
            
          } else {
            isStatic = false;
          }
          if ('height' in box) {
            h = box.height | 0;
            
          } else {
            isStatic = false;
          }

          return new Declaration(
            !isStatic && framebuffer && framebuffer.thisDep,
            !isStatic && framebuffer && framebuffer.contextDep,
            !isStatic && framebuffer && framebuffer.propDep,
            function (env, scope) {
              var CONTEXT = env.shared.context;
              var BOX_W = w;
              if (!('width' in box)) {
                BOX_W = scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', x);
              }
              var BOX_H = h;
              if (!('height' in box)) {
                BOX_H = scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', y);
              }
              return [x, y, BOX_W, BOX_H]
            })
        } else if (param in dynamicOptions) {
          var dynBox = dynamicOptions[param];
          var result = createDynamicDecl(dynBox, function (env, scope) {
            var BOX = env.invoke(scope, dynBox);

            

            var CONTEXT = env.shared.context;
            var BOX_X = scope.def(BOX, '.x|0');
            var BOX_Y = scope.def(BOX, '.y|0');
            var BOX_W = scope.def(
              '"width" in ', BOX, '?', BOX, '.width|0:',
              '(', CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', BOX_X, ')');
            var BOX_H = scope.def(
              '"height" in ', BOX, '?', BOX, '.height|0:',
              '(', CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', BOX_Y, ')');

            

            return [BOX_X, BOX_Y, BOX_W, BOX_H]
          });
          if (framebuffer) {
            result.thisDep = result.thisDep || framebuffer.thisDep;
            result.contextDep = result.contextDep || framebuffer.contextDep;
            result.propDep = result.propDep || framebuffer.propDep;
          }
          return result
        } else if (framebuffer) {
          return new Declaration(
            framebuffer.thisDep,
            framebuffer.contextDep,
            framebuffer.propDep,
            function (env, scope) {
              var CONTEXT = env.shared.context;
              return [
                0, 0,
                scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH),
                scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT)]
            })
        } else {
          return null
        }
      }

      var viewport = parseBox(S_VIEWPORT);

      if (viewport) {
        var prevViewport = viewport;
        viewport = new Declaration(
          viewport.thisDep,
          viewport.contextDep,
          viewport.propDep,
          function (env, scope) {
            var VIEWPORT = prevViewport.append(env, scope);
            var CONTEXT = env.shared.context;
            scope.set(
              CONTEXT,
              '.' + S_VIEWPORT_WIDTH,
              VIEWPORT[2]);
            scope.set(
              CONTEXT,
              '.' + S_VIEWPORT_HEIGHT,
              VIEWPORT[3]);
            return VIEWPORT
          });
      }

      return {
        viewport: viewport,
        scissor_box: parseBox(S_SCISSOR_BOX)
      }
    }

    function parseAttribLocations (options, attributes) {
      var staticOptions = options.static;
      var staticProgram =
        typeof staticOptions[S_FRAG] === 'string' &&
        typeof staticOptions[S_VERT] === 'string';
      if (staticProgram) {
        if (Object.keys(attributes.dynamic).length > 0) {
          return null
        }
        var staticAttributes = attributes.static;
        var sAttributes = Object.keys(staticAttributes);
        if (sAttributes.length > 0 && typeof staticAttributes[sAttributes[0]] === 'number') {
          var bindings = [];
          for (var i = 0; i < sAttributes.length; ++i) {
            
            bindings.push([staticAttributes[sAttributes[i]] | 0, sAttributes[i]]);
          }
          return bindings
        }
      }
      return null
    }

    function parseProgram (options, env, attribLocations) {
      var staticOptions = options.static;
      var dynamicOptions = options.dynamic;

      function parseShader (name) {
        if (name in staticOptions) {
          var id = stringStore.id(staticOptions[name]);
          
          var result = createStaticDecl(function () {
            return id
          });
          result.id = id;
          return result
        } else if (name in dynamicOptions) {
          var dyn = dynamicOptions[name];
          return createDynamicDecl(dyn, function (env, scope) {
            var str = env.invoke(scope, dyn);
            var id = scope.def(env.shared.strings, '.id(', str, ')');
            
            return id
          })
        }
        return null
      }

      var frag = parseShader(S_FRAG);
      var vert = parseShader(S_VERT);

      var program = null;
      var progVar;
      if (isStatic(frag) && isStatic(vert)) {
        program = shaderState.program(vert.id, frag.id, null, attribLocations);
        progVar = createStaticDecl(function (env, scope) {
          return env.link(program)
        });
      } else {
        progVar = new Declaration(
          (frag && frag.thisDep) || (vert && vert.thisDep),
          (frag && frag.contextDep) || (vert && vert.contextDep),
          (frag && frag.propDep) || (vert && vert.propDep),
          function (env, scope) {
            var SHADER_STATE = env.shared.shader;
            var fragId;
            if (frag) {
              fragId = frag.append(env, scope);
            } else {
              fragId = scope.def(SHADER_STATE, '.', S_FRAG);
            }
            var vertId;
            if (vert) {
              vertId = vert.append(env, scope);
            } else {
              vertId = scope.def(SHADER_STATE, '.', S_VERT);
            }
            var progDef = SHADER_STATE + '.program(' + vertId + ',' + fragId;
            
            return scope.def(progDef + ')')
          });
      }

      return {
        frag: frag,
        vert: vert,
        progVar: progVar,
        program: program
      }
    }

    function parseDraw (options, env) {
      var staticOptions = options.static;
      var dynamicOptions = options.dynamic;

      // TODO: should use VAO to get default values for offset properties
      // should move vao parse into here and out of the old stuff

      var staticDraw = {};
      var vaoActive = false;

      function parseVAO () {
        if (S_VAO in staticOptions) {
          var vao = staticOptions[S_VAO];
          if (vao !== null && attributeState.getVAO(vao) === null) {
            vao = attributeState.createVAO(vao);
          }

          vaoActive = true;
          staticDraw.vao = vao;

          return createStaticDecl(function (env) {
            var vaoRef = attributeState.getVAO(vao);
            if (vaoRef) {
              return env.link(vaoRef)
            } else {
              return 'null'
            }
          })
        } else if (S_VAO in dynamicOptions) {
          vaoActive = true;
          var dyn = dynamicOptions[S_VAO];
          return createDynamicDecl(dyn, function (env, scope) {
            var vaoRef = env.invoke(scope, dyn);
            return scope.def(env.shared.vao + '.getVAO(' + vaoRef + ')')
          })
        }
        return null
      }

      var vao = parseVAO();

      var elementsActive = false;

      function parseElements () {
        if (S_ELEMENTS in staticOptions) {
          var elements = staticOptions[S_ELEMENTS];
          staticDraw.elements = elements;
          if (isBufferArgs(elements)) {
            var e = staticDraw.elements = elementState.create(elements, true);
            elements = elementState.getElements(e);
            elementsActive = true;
          } else if (elements) {
            elements = elementState.getElements(elements);
            elementsActive = true;
            
          }

          var result = createStaticDecl(function (env, scope) {
            if (elements) {
              var result = env.link(elements);
              env.ELEMENTS = result;
              return result
            }
            env.ELEMENTS = null;
            return null
          });
          result.value = elements;
          return result
        } else if (S_ELEMENTS in dynamicOptions) {
          elementsActive = true;

          var dyn = dynamicOptions[S_ELEMENTS];
          return createDynamicDecl(dyn, function (env, scope) {
            var shared = env.shared;

            var IS_BUFFER_ARGS = shared.isBufferArgs;
            var ELEMENT_STATE = shared.elements;

            var elementDefn = env.invoke(scope, dyn);
            var elements = scope.def('null');
            var elementStream = scope.def(IS_BUFFER_ARGS, '(', elementDefn, ')');

            var ifte = env.cond(elementStream)
              .then(elements, '=', ELEMENT_STATE, '.createStream(', elementDefn, ');')
              .else(elements, '=', ELEMENT_STATE, '.getElements(', elementDefn, ');');

            

            scope.entry(ifte);
            scope.exit(
              env.cond(elementStream)
                .then(ELEMENT_STATE, '.destroyStream(', elements, ');'));

            env.ELEMENTS = elements;

            return elements
          })
        } else if (vaoActive) {
          return new Declaration(
            vao.thisDep,
            vao.contextDep,
            vao.propDep,
            function (env, scope) {
              return scope.def(env.shared.vao + '.currentVAO?' + env.shared.elements + '.getElements(' + env.shared.vao + '.currentVAO.elements):null')
            })
        }
        return null
      }

      var elements = parseElements();

      function parsePrimitive () {
        if (S_PRIMITIVE in staticOptions) {
          var primitive = staticOptions[S_PRIMITIVE];
          staticDraw.primitive = primitive;
          
          return createStaticDecl(function (env, scope) {
            return primTypes[primitive]
          })
        } else if (S_PRIMITIVE in dynamicOptions) {
          var dynPrimitive = dynamicOptions[S_PRIMITIVE];
          return createDynamicDecl(dynPrimitive, function (env, scope) {
            var PRIM_TYPES = env.constants.primTypes;
            var prim = env.invoke(scope, dynPrimitive);
            
            return scope.def(PRIM_TYPES, '[', prim, ']')
          })
        } else if (elementsActive) {
          if (isStatic(elements)) {
            if (elements.value) {
              return createStaticDecl(function (env, scope) {
                return scope.def(env.ELEMENTS, '.primType')
              })
            } else {
              return createStaticDecl(function () {
                return GL_TRIANGLES$1
              })
            }
          } else {
            return new Declaration(
              elements.thisDep,
              elements.contextDep,
              elements.propDep,
              function (env, scope) {
                var elements = env.ELEMENTS;
                return scope.def(elements, '?', elements, '.primType:', GL_TRIANGLES$1)
              })
          }
        } else if (vaoActive) {
          return new Declaration(
            vao.thisDep,
            vao.contextDep,
            vao.propDep,
            function (env, scope) {
              return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.primitive:' + GL_TRIANGLES$1)
            })
        }
        return null
      }

      function parseParam (param, isOffset) {
        if (param in staticOptions) {
          var value = staticOptions[param] | 0;
          if (isOffset) {
            staticDraw.offset = value;
          } else {
            staticDraw.instances = value;
          }
          
          return createStaticDecl(function (env, scope) {
            if (isOffset) {
              env.OFFSET = value;
            }
            return value
          })
        } else if (param in dynamicOptions) {
          var dynValue = dynamicOptions[param];
          return createDynamicDecl(dynValue, function (env, scope) {
            var result = env.invoke(scope, dynValue);
            if (isOffset) {
              env.OFFSET = result;
              
            }
            return result
          })
        } else if (isOffset) {
          if (elementsActive) {
            return createStaticDecl(function (env, scope) {
              env.OFFSET = 0;
              return 0
            })
          } else if (vaoActive) {
            return new Declaration(
              vao.thisDep,
              vao.contextDep,
              vao.propDep,
              function (env, scope) {
                return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.offset:0')
              })
          }
        } else if (vaoActive) {
          return new Declaration(
            vao.thisDep,
            vao.contextDep,
            vao.propDep,
            function (env, scope) {
              return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.instances:-1')
            })
        }
        return null
      }

      var OFFSET = parseParam(S_OFFSET, true);

      function parseVertCount () {
        if (S_COUNT in staticOptions) {
          var count = staticOptions[S_COUNT] | 0;
          staticDraw.count = count;
          
          return createStaticDecl(function () {
            return count
          })
        } else if (S_COUNT in dynamicOptions) {
          var dynCount = dynamicOptions[S_COUNT];
          return createDynamicDecl(dynCount, function (env, scope) {
            var result = env.invoke(scope, dynCount);
            
            return result
          })
        } else if (elementsActive) {
          if (isStatic(elements)) {
            if (elements) {
              if (OFFSET) {
                return new Declaration(
                  OFFSET.thisDep,
                  OFFSET.contextDep,
                  OFFSET.propDep,
                  function (env, scope) {
                    var result = scope.def(
                      env.ELEMENTS, '.vertCount-', env.OFFSET);

                    

                    return result
                  })
              } else {
                return createStaticDecl(function (env, scope) {
                  return scope.def(env.ELEMENTS, '.vertCount')
                })
              }
            } else {
              var result = createStaticDecl(function () {
                return -1
              });
              
              return result
            }
          } else {
            var variable = new Declaration(
              elements.thisDep || OFFSET.thisDep,
              elements.contextDep || OFFSET.contextDep,
              elements.propDep || OFFSET.propDep,
              function (env, scope) {
                var elements = env.ELEMENTS;
                if (env.OFFSET) {
                  return scope.def(elements, '?', elements, '.vertCount-',
                    env.OFFSET, ':-1')
                }
                return scope.def(elements, '?', elements, '.vertCount:-1')
              });
            
            return variable
          }
        } else if (vaoActive) {
          var countVariable = new Declaration(
            vao.thisDep,
            vao.contextDep,
            vao.propDep,
            function (env, scope) {
              return scope.def(env.shared.vao, '.currentVAO?', env.shared.vao, '.currentVAO.count:-1')
            });
          return countVariable
        }
        return null
      }

      var primitive = parsePrimitive();
      var count = parseVertCount();
      var instances = parseParam(S_INSTANCES, false);

      return {
        elements: elements,
        primitive: primitive,
        count: count,
        instances: instances,
        offset: OFFSET,
        vao: vao,

        vaoActive: vaoActive,
        elementsActive: elementsActive,

        // static draw props
        static: staticDraw
      }
    }

    function parseGLState (options, env) {
      var staticOptions = options.static;
      var dynamicOptions = options.dynamic;

      var STATE = {};

      GL_STATE_NAMES.forEach(function (prop) {
        var param = propName(prop);

        function parseParam (parseStatic, parseDynamic) {
          if (prop in staticOptions) {
            var value = parseStatic(staticOptions[prop]);
            STATE[param] = createStaticDecl(function () {
              return value
            });
          } else if (prop in dynamicOptions) {
            var dyn = dynamicOptions[prop];
            STATE[param] = createDynamicDecl(dyn, function (env, scope) {
              return parseDynamic(env, scope, env.invoke(scope, dyn))
            });
          }
        }

        switch (prop) {
          case S_CULL_ENABLE:
          case S_BLEND_ENABLE:
          case S_DITHER:
          case S_STENCIL_ENABLE:
          case S_DEPTH_ENABLE:
          case S_SCISSOR_ENABLE:
          case S_POLYGON_OFFSET_ENABLE:
          case S_SAMPLE_ALPHA:
          case S_SAMPLE_ENABLE:
          case S_DEPTH_MASK:
            return parseParam(
              function (value) {
                
                return value
              },
              function (env, scope, value) {
                
                return value
              })

          case S_DEPTH_FUNC:
            return parseParam(
              function (value) {
                
                return compareFuncs[value]
              },
              function (env, scope, value) {
                var COMPARE_FUNCS = env.constants.compareFuncs;
                
                return scope.def(COMPARE_FUNCS, '[', value, ']')
              })

          case S_DEPTH_RANGE:
            return parseParam(
              function (value) {
                
                return value
              },
              function (env, scope, value) {
                

                var Z_NEAR = scope.def('+', value, '[0]');
                var Z_FAR = scope.def('+', value, '[1]');
                return [Z_NEAR, Z_FAR]
              })

          case S_BLEND_FUNC:
            return parseParam(
              function (value) {
                
                var srcRGB = ('srcRGB' in value ? value.srcRGB : value.src);
                var srcAlpha = ('srcAlpha' in value ? value.srcAlpha : value.src);
                var dstRGB = ('dstRGB' in value ? value.dstRGB : value.dst);
                var dstAlpha = ('dstAlpha' in value ? value.dstAlpha : value.dst);
                
                
                
                

                

                return [
                  blendFuncs[srcRGB],
                  blendFuncs[dstRGB],
                  blendFuncs[srcAlpha],
                  blendFuncs[dstAlpha]
                ]
              },
              function (env, scope, value) {
                var BLEND_FUNCS = env.constants.blendFuncs;

                

                function read (prefix, suffix) {
                  var func = scope.def(
                    '"', prefix, suffix, '" in ', value,
                    '?', value, '.', prefix, suffix,
                    ':', value, '.', prefix);

                  

                  return func
                }

                var srcRGB = read('src', 'RGB');
                var dstRGB = read('dst', 'RGB');

                

                var SRC_RGB = scope.def(BLEND_FUNCS, '[', srcRGB, ']');
                var SRC_ALPHA = scope.def(BLEND_FUNCS, '[', read('src', 'Alpha'), ']');
                var DST_RGB = scope.def(BLEND_FUNCS, '[', dstRGB, ']');
                var DST_ALPHA = scope.def(BLEND_FUNCS, '[', read('dst', 'Alpha'), ']');

                return [SRC_RGB, DST_RGB, SRC_ALPHA, DST_ALPHA]
              })

          case S_BLEND_EQUATION:
            return parseParam(
              function (value) {
                if (typeof value === 'string') {
                  
                  return [
                    blendEquations[value],
                    blendEquations[value]
                  ]
                } else if (typeof value === 'object') {
                  
                  
                  return [
                    blendEquations[value.rgb],
                    blendEquations[value.alpha]
                  ]
                } else ;
              },
              function (env, scope, value) {
                var BLEND_EQUATIONS = env.constants.blendEquations;

                var RGB = scope.def();
                var ALPHA = scope.def();

                var ifte = env.cond('typeof ', value, '==="string"');

                

                ifte.then(
                  RGB, '=', ALPHA, '=', BLEND_EQUATIONS, '[', value, '];');
                ifte.else(
                  RGB, '=', BLEND_EQUATIONS, '[', value, '.rgb];',
                  ALPHA, '=', BLEND_EQUATIONS, '[', value, '.alpha];');

                scope(ifte);

                return [RGB, ALPHA]
              })

          case S_BLEND_COLOR:
            return parseParam(
              function (value) {
                
                return loop(4, function (i) {
                  return +value[i]
                })
              },
              function (env, scope, value) {
                
                return loop(4, function (i) {
                  return scope.def('+', value, '[', i, ']')
                })
              })

          case S_STENCIL_MASK:
            return parseParam(
              function (value) {
                
                return value | 0
              },
              function (env, scope, value) {
                
                return scope.def(value, '|0')
              })

          case S_STENCIL_FUNC:
            return parseParam(
              function (value) {
                
                var cmp = value.cmp || 'keep';
                var ref = value.ref || 0;
                var mask = 'mask' in value ? value.mask : -1;
                
                
                
                return [
                  compareFuncs[cmp],
                  ref,
                  mask
                ]
              },
              function (env, scope, value) {
                var COMPARE_FUNCS = env.constants.compareFuncs;
                
                var cmp = scope.def(
                  '"cmp" in ', value,
                  '?', COMPARE_FUNCS, '[', value, '.cmp]',
                  ':', GL_KEEP);
                var ref = scope.def(value, '.ref|0');
                var mask = scope.def(
                  '"mask" in ', value,
                  '?', value, '.mask|0:-1');
                return [cmp, ref, mask]
              })

          case S_STENCIL_OPFRONT:
          case S_STENCIL_OPBACK:
            return parseParam(
              function (value) {
                
                var fail = value.fail || 'keep';
                var zfail = value.zfail || 'keep';
                var zpass = value.zpass || 'keep';
                
                
                
                return [
                  prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                  stencilOps[fail],
                  stencilOps[zfail],
                  stencilOps[zpass]
                ]
              },
              function (env, scope, value) {
                var STENCIL_OPS = env.constants.stencilOps;

                

                function read (name) {
                  

                  return scope.def(
                    '"', name, '" in ', value,
                    '?', STENCIL_OPS, '[', value, '.', name, ']:',
                    GL_KEEP)
                }

                return [
                  prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                  read('fail'),
                  read('zfail'),
                  read('zpass')
                ]
              })

          case S_POLYGON_OFFSET_OFFSET:
            return parseParam(
              function (value) {
                
                var factor = value.factor | 0;
                var units = value.units | 0;
                
                
                return [factor, units]
              },
              function (env, scope, value) {
                

                var FACTOR = scope.def(value, '.factor|0');
                var UNITS = scope.def(value, '.units|0');

                return [FACTOR, UNITS]
              })

          case S_CULL_FACE:
            return parseParam(
              function (value) {
                var face = 0;
                if (value === 'front') {
                  face = GL_FRONT;
                } else if (value === 'back') {
                  face = GL_BACK;
                }
                
                return face
              },
              function (env, scope, value) {
                
                return scope.def(value, '==="front"?', GL_FRONT, ':', GL_BACK)
              })

          case S_LINE_WIDTH:
            return parseParam(
              function (value) {
                
                return value
              },
              function (env, scope, value) {
                

                return value
              })

          case S_FRONT_FACE:
            return parseParam(
              function (value) {
                
                return orientationType[value]
              },
              function (env, scope, value) {
                
                return scope.def(value + '==="cw"?' + GL_CW + ':' + GL_CCW)
              })

          case S_COLOR_MASK:
            return parseParam(
              function (value) {
                
                return value.map(function (v) { return !!v })
              },
              function (env, scope, value) {
                
                return loop(4, function (i) {
                  return '!!' + value + '[' + i + ']'
                })
              })

          case S_SAMPLE_COVERAGE:
            return parseParam(
              function (value) {
                
                var sampleValue = 'value' in value ? value.value : 1;
                var sampleInvert = !!value.invert;
                
                return [sampleValue, sampleInvert]
              },
              function (env, scope, value) {
                
                var VALUE = scope.def(
                  '"value" in ', value, '?+', value, '.value:1');
                var INVERT = scope.def('!!', value, '.invert');
                return [VALUE, INVERT]
              })
        }
      });

      return STATE
    }

    function parseUniforms (uniforms, env) {
      var staticUniforms = uniforms.static;
      var dynamicUniforms = uniforms.dynamic;

      var UNIFORMS = {};

      Object.keys(staticUniforms).forEach(function (name) {
        var value = staticUniforms[name];
        var result;
        if (typeof value === 'number' ||
            typeof value === 'boolean') {
          result = createStaticDecl(function () {
            return value
          });
        } else if (typeof value === 'function') {
          var reglType = value._reglType;
          if (reglType === 'texture2d' ||
              reglType === 'textureCube') {
            result = createStaticDecl(function (env) {
              return env.link(value)
            });
          } else if (reglType === 'framebuffer' ||
                     reglType === 'framebufferCube') {
            
            result = createStaticDecl(function (env) {
              return env.link(value.color[0])
            });
          } else ;
        } else if (isArrayLike(value)) {
          result = createStaticDecl(function (env) {
            var ITEM = env.global.def('[',
              loop(value.length, function (i) {
                
                return value[i]
              }), ']');
            return ITEM
          });
        } else ;
        result.value = value;
        UNIFORMS[name] = result;
      });

      Object.keys(dynamicUniforms).forEach(function (key) {
        var dyn = dynamicUniforms[key];
        UNIFORMS[key] = createDynamicDecl(dyn, function (env, scope) {
          return env.invoke(scope, dyn)
        });
      });

      return UNIFORMS
    }

    function parseAttributes (attributes, env) {
      var staticAttributes = attributes.static;
      var dynamicAttributes = attributes.dynamic;

      var attributeDefs = {};

      Object.keys(staticAttributes).forEach(function (attribute) {
        var value = staticAttributes[attribute];
        var id = stringStore.id(attribute);

        var record = new AttributeRecord();
        if (isBufferArgs(value)) {
          record.state = ATTRIB_STATE_POINTER;
          record.buffer = bufferState.getBuffer(
            bufferState.create(value, GL_ARRAY_BUFFER$2, false, true));
          record.type = 0;
        } else {
          var buffer = bufferState.getBuffer(value);
          if (buffer) {
            record.state = ATTRIB_STATE_POINTER;
            record.buffer = buffer;
            record.type = 0;
          } else {
            
            if ('constant' in value) {
              var constant = value.constant;
              record.buffer = 'null';
              record.state = ATTRIB_STATE_CONSTANT;
              if (typeof constant === 'number') {
                record.x = constant;
              } else {
                
                CUTE_COMPONENTS.forEach(function (c, i) {
                  if (i < constant.length) {
                    record[c] = constant[i];
                  }
                });
              }
            } else {
              if (isBufferArgs(value.buffer)) {
                buffer = bufferState.getBuffer(
                  bufferState.create(value.buffer, GL_ARRAY_BUFFER$2, false, true));
              } else {
                buffer = bufferState.getBuffer(value.buffer);
              }
              

              var offset = value.offset | 0;
              

              var stride = value.stride | 0;
              

              var size = value.size | 0;
              

              var normalized = !!value.normalized;

              var type = 0;
              if ('type' in value) {
                
                type = glTypes[value.type];
              }

              var divisor = value.divisor | 0;
              

              record.buffer = buffer;
              record.state = ATTRIB_STATE_POINTER;
              record.size = size;
              record.normalized = normalized;
              record.type = type || buffer.dtype;
              record.offset = offset;
              record.stride = stride;
              record.divisor = divisor;
            }
          }
        }

        attributeDefs[attribute] = createStaticDecl(function (env, scope) {
          var cache = env.attribCache;
          if (id in cache) {
            return cache[id]
          }
          var result = {
            isStream: false
          };
          Object.keys(record).forEach(function (key) {
            result[key] = record[key];
          });
          if (record.buffer) {
            result.buffer = env.link(record.buffer);
            result.type = result.type || (result.buffer + '.dtype');
          }
          cache[id] = result;
          return result
        });
      });

      Object.keys(dynamicAttributes).forEach(function (attribute) {
        var dyn = dynamicAttributes[attribute];

        function appendAttributeCode (env, block) {
          var VALUE = env.invoke(block, dyn);

          var shared = env.shared;
          var constants = env.constants;

          var IS_BUFFER_ARGS = shared.isBufferArgs;
          var BUFFER_STATE = shared.buffer;

          // Perform validation on attribute
          

          // allocate names for result
          var result = {
            isStream: block.def(false)
          };
          var defaultRecord = new AttributeRecord();
          defaultRecord.state = ATTRIB_STATE_POINTER;
          Object.keys(defaultRecord).forEach(function (key) {
            result[key] = block.def('' + defaultRecord[key]);
          });

          var BUFFER = result.buffer;
          var TYPE = result.type;
          block(
            'if(', IS_BUFFER_ARGS, '(', VALUE, ')){',
            result.isStream, '=true;',
            BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$2, ',', VALUE, ');',
            TYPE, '=', BUFFER, '.dtype;',
            '}else{',
            BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, ');',
            'if(', BUFFER, '){',
            TYPE, '=', BUFFER, '.dtype;',
            '}else if("constant" in ', VALUE, '){',
            result.state, '=', ATTRIB_STATE_CONSTANT, ';',
            'if(typeof ' + VALUE + '.constant === "number"){',
            result[CUTE_COMPONENTS[0]], '=', VALUE, '.constant;',
            CUTE_COMPONENTS.slice(1).map(function (n) {
              return result[n]
            }).join('='), '=0;',
            '}else{',
            CUTE_COMPONENTS.map(function (name, i) {
              return (
                result[name] + '=' + VALUE + '.constant.length>' + i +
                '?' + VALUE + '.constant[' + i + ']:0;'
              )
            }).join(''),
            '}}else{',
            'if(', IS_BUFFER_ARGS, '(', VALUE, '.buffer)){',
            BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$2, ',', VALUE, '.buffer);',
            '}else{',
            BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, '.buffer);',
            '}',
            TYPE, '="type" in ', VALUE, '?',
            constants.glTypes, '[', VALUE, '.type]:', BUFFER, '.dtype;',
            result.normalized, '=!!', VALUE, '.normalized;');
          function emitReadRecord (name) {
            block(result[name], '=', VALUE, '.', name, '|0;');
          }
          emitReadRecord('size');
          emitReadRecord('offset');
          emitReadRecord('stride');
          emitReadRecord('divisor');

          block('}}');

          block.exit(
            'if(', result.isStream, '){',
            BUFFER_STATE, '.destroyStream(', BUFFER, ');',
            '}');

          return result
        }

        attributeDefs[attribute] = createDynamicDecl(dyn, appendAttributeCode);
      });

      return attributeDefs
    }

    function parseContext (context) {
      var staticContext = context.static;
      var dynamicContext = context.dynamic;
      var result = {};

      Object.keys(staticContext).forEach(function (name) {
        var value = staticContext[name];
        result[name] = createStaticDecl(function (env, scope) {
          if (typeof value === 'number' || typeof value === 'boolean') {
            return '' + value
          } else {
            return env.link(value)
          }
        });
      });

      Object.keys(dynamicContext).forEach(function (name) {
        var dyn = dynamicContext[name];
        result[name] = createDynamicDecl(dyn, function (env, scope) {
          return env.invoke(scope, dyn)
        });
      });

      return result
    }

    function parseArguments (options, attributes, uniforms, context, env) {
      options.static;
      options.dynamic;

      

      var attribLocations = parseAttribLocations(options, attributes);

      var framebuffer = parseFramebuffer(options);
      var viewportAndScissor = parseViewportScissor(options, framebuffer);
      var draw = parseDraw(options);
      var state = parseGLState(options);
      var shader = parseProgram(options, env, attribLocations);

      function copyBox (name) {
        var defn = viewportAndScissor[name];
        if (defn) {
          state[name] = defn;
        }
      }
      copyBox(S_VIEWPORT);
      copyBox(propName(S_SCISSOR_BOX));

      var dirty = Object.keys(state).length > 0;

      var result = {
        framebuffer: framebuffer,
        draw: draw,
        shader: shader,
        state: state,
        dirty: dirty,
        scopeVAO: null,
        drawVAO: null,
        useVAO: false,
        attributes: {}
      };

      result.profile = parseProfile(options);
      result.uniforms = parseUniforms(uniforms);
      result.drawVAO = result.scopeVAO = draw.vao;
      // special case: check if we can statically allocate a vertex array object for this program
      if (!result.drawVAO &&
        shader.program &&
        !attribLocations &&
        extensions.angle_instanced_arrays &&
        draw.static.elements) {
        var useVAO = true;
        var staticBindings = shader.program.attributes.map(function (attr) {
          var binding = attributes.static[attr];
          useVAO = useVAO && !!binding;
          return binding
        });
        if (useVAO && staticBindings.length > 0) {
          var vao = attributeState.getVAO(attributeState.createVAO({
            attributes: staticBindings,
            elements: draw.static.elements
          }));
          result.drawVAO = new Declaration(null, null, null, function (env, scope) {
            return env.link(vao)
          });
          result.useVAO = true;
        }
      }
      if (attribLocations) {
        result.useVAO = true;
      } else {
        result.attributes = parseAttributes(attributes);
      }
      result.context = parseContext(context);
      return result
    }

    // ===================================================
    // ===================================================
    // COMMON UPDATE FUNCTIONS
    // ===================================================
    // ===================================================
    function emitContext (env, scope, context) {
      var shared = env.shared;
      var CONTEXT = shared.context;

      var contextEnter = env.scope();

      Object.keys(context).forEach(function (name) {
        scope.save(CONTEXT, '.' + name);
        var defn = context[name];
        var value = defn.append(env, scope);
        if (Array.isArray(value)) {
          contextEnter(CONTEXT, '.', name, '=[', value.join(), '];');
        } else {
          contextEnter(CONTEXT, '.', name, '=', value, ';');
        }
      });

      scope(contextEnter);
    }

    // ===================================================
    // ===================================================
    // COMMON DRAWING FUNCTIONS
    // ===================================================
    // ===================================================
    function emitPollFramebuffer (env, scope, framebuffer, skipCheck) {
      var shared = env.shared;

      var GL = shared.gl;
      var FRAMEBUFFER_STATE = shared.framebuffer;
      var EXT_DRAW_BUFFERS;
      if (extDrawBuffers) {
        EXT_DRAW_BUFFERS = scope.def(shared.extensions, '.webgl_draw_buffers');
      }

      var constants = env.constants;

      var DRAW_BUFFERS = constants.drawBuffer;
      var BACK_BUFFER = constants.backBuffer;

      var NEXT;
      if (framebuffer) {
        NEXT = framebuffer.append(env, scope);
      } else {
        NEXT = scope.def(FRAMEBUFFER_STATE, '.next');
      }

      if (!skipCheck) {
        scope('if(', NEXT, '!==', FRAMEBUFFER_STATE, '.cur){');
      }
      scope(
        'if(', NEXT, '){',
        GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',', NEXT, '.framebuffer);');
      if (extDrawBuffers) {
        scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(',
          DRAW_BUFFERS, '[', NEXT, '.colorAttachments.length]);');
      }
      scope('}else{',
        GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',null);');
      if (extDrawBuffers) {
        scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(', BACK_BUFFER, ');');
      }
      scope(
        '}',
        FRAMEBUFFER_STATE, '.cur=', NEXT, ';');
      if (!skipCheck) {
        scope('}');
      }
    }

    function emitPollState (env, scope, args) {
      var shared = env.shared;

      var GL = shared.gl;

      var CURRENT_VARS = env.current;
      var NEXT_VARS = env.next;
      var CURRENT_STATE = shared.current;
      var NEXT_STATE = shared.next;

      var block = env.cond(CURRENT_STATE, '.dirty');

      GL_STATE_NAMES.forEach(function (prop) {
        var param = propName(prop);
        if (param in args.state) {
          return
        }

        var NEXT, CURRENT;
        if (param in NEXT_VARS) {
          NEXT = NEXT_VARS[param];
          CURRENT = CURRENT_VARS[param];
          var parts = loop(currentState[param].length, function (i) {
            return block.def(NEXT, '[', i, ']')
          });
          block(env.cond(parts.map(function (p, i) {
            return p + '!==' + CURRENT + '[' + i + ']'
          }).join('||'))
            .then(
              GL, '.', GL_VARIABLES[param], '(', parts, ');',
              parts.map(function (p, i) {
                return CURRENT + '[' + i + ']=' + p
              }).join(';'), ';'));
        } else {
          NEXT = block.def(NEXT_STATE, '.', param);
          var ifte = env.cond(NEXT, '!==', CURRENT_STATE, '.', param);
          block(ifte);
          if (param in GL_FLAGS) {
            ifte(
              env.cond(NEXT)
                .then(GL, '.enable(', GL_FLAGS[param], ');')
                .else(GL, '.disable(', GL_FLAGS[param], ');'),
              CURRENT_STATE, '.', param, '=', NEXT, ';');
          } else {
            ifte(
              GL, '.', GL_VARIABLES[param], '(', NEXT, ');',
              CURRENT_STATE, '.', param, '=', NEXT, ';');
          }
        }
      });
      if (Object.keys(args.state).length === 0) {
        block(CURRENT_STATE, '.dirty=false;');
      }
      scope(block);
    }

    function emitSetOptions (env, scope, options, filter) {
      var shared = env.shared;
      var CURRENT_VARS = env.current;
      var CURRENT_STATE = shared.current;
      var GL = shared.gl;
      sortState(Object.keys(options)).forEach(function (param) {
        var defn = options[param];
        if (filter && !filter(defn)) {
          return
        }
        var variable = defn.append(env, scope);
        if (GL_FLAGS[param]) {
          var flag = GL_FLAGS[param];
          if (isStatic(defn)) {
            if (variable) {
              scope(GL, '.enable(', flag, ');');
            } else {
              scope(GL, '.disable(', flag, ');');
            }
          } else {
            scope(env.cond(variable)
              .then(GL, '.enable(', flag, ');')
              .else(GL, '.disable(', flag, ');'));
          }
          scope(CURRENT_STATE, '.', param, '=', variable, ';');
        } else if (isArrayLike(variable)) {
          var CURRENT = CURRENT_VARS[param];
          scope(
            GL, '.', GL_VARIABLES[param], '(', variable, ');',
            variable.map(function (v, i) {
              return CURRENT + '[' + i + ']=' + v
            }).join(';'), ';');
        } else {
          scope(
            GL, '.', GL_VARIABLES[param], '(', variable, ');',
            CURRENT_STATE, '.', param, '=', variable, ';');
        }
      });
    }

    function injectExtensions (env, scope) {
      if (extInstancing) {
        env.instancing = scope.def(
          env.shared.extensions, '.angle_instanced_arrays');
      }
    }

    function emitProfile (env, scope, args, useScope, incrementCounter) {
      var shared = env.shared;
      var STATS = env.stats;
      var CURRENT_STATE = shared.current;
      var TIMER = shared.timer;
      var profileArg = args.profile;

      function perfCounter () {
        if (typeof performance === 'undefined') {
          return 'Date.now()'
        } else {
          return 'performance.now()'
        }
      }

      var CPU_START, QUERY_COUNTER;
      function emitProfileStart (block) {
        CPU_START = scope.def();
        block(CPU_START, '=', perfCounter(), ';');
        if (typeof incrementCounter === 'string') {
          block(STATS, '.count+=', incrementCounter, ';');
        } else {
          block(STATS, '.count++;');
        }
        if (timer) {
          if (useScope) {
            QUERY_COUNTER = scope.def();
            block(QUERY_COUNTER, '=', TIMER, '.getNumPendingQueries();');
          } else {
            block(TIMER, '.beginQuery(', STATS, ');');
          }
        }
      }

      function emitProfileEnd (block) {
        block(STATS, '.cpuTime+=', perfCounter(), '-', CPU_START, ';');
        if (timer) {
          if (useScope) {
            block(TIMER, '.pushScopeStats(',
              QUERY_COUNTER, ',',
              TIMER, '.getNumPendingQueries(),',
              STATS, ');');
          } else {
            block(TIMER, '.endQuery();');
          }
        }
      }

      function scopeProfile (value) {
        var prev = scope.def(CURRENT_STATE, '.profile');
        scope(CURRENT_STATE, '.profile=', value, ';');
        scope.exit(CURRENT_STATE, '.profile=', prev, ';');
      }

      var USE_PROFILE;
      if (profileArg) {
        if (isStatic(profileArg)) {
          if (profileArg.enable) {
            emitProfileStart(scope);
            emitProfileEnd(scope.exit);
            scopeProfile('true');
          } else {
            scopeProfile('false');
          }
          return
        }
        USE_PROFILE = profileArg.append(env, scope);
        scopeProfile(USE_PROFILE);
      } else {
        USE_PROFILE = scope.def(CURRENT_STATE, '.profile');
      }

      var start = env.block();
      emitProfileStart(start);
      scope('if(', USE_PROFILE, '){', start, '}');
      var end = env.block();
      emitProfileEnd(end);
      scope.exit('if(', USE_PROFILE, '){', end, '}');
    }

    function emitAttributes (env, scope, args, attributes, filter) {
      var shared = env.shared;

      function typeLength (x) {
        switch (x) {
          case GL_FLOAT_VEC2:
          case GL_INT_VEC2:
          case GL_BOOL_VEC2:
            return 2
          case GL_FLOAT_VEC3:
          case GL_INT_VEC3:
          case GL_BOOL_VEC3:
            return 3
          case GL_FLOAT_VEC4:
          case GL_INT_VEC4:
          case GL_BOOL_VEC4:
            return 4
          default:
            return 1
        }
      }

      function emitBindAttribute (ATTRIBUTE, size, record) {
        var GL = shared.gl;

        var LOCATION = scope.def(ATTRIBUTE, '.location');
        var BINDING = scope.def(shared.attributes, '[', LOCATION, ']');

        var STATE = record.state;
        var BUFFER = record.buffer;
        var CONST_COMPONENTS = [
          record.x,
          record.y,
          record.z,
          record.w
        ];

        var COMMON_KEYS = [
          'buffer',
          'normalized',
          'offset',
          'stride'
        ];

        function emitBuffer () {
          scope(
            'if(!', BINDING, '.buffer){',
            GL, '.enableVertexAttribArray(', LOCATION, ');}');

          var TYPE = record.type;
          var SIZE;
          if (!record.size) {
            SIZE = size;
          } else {
            SIZE = scope.def(record.size, '||', size);
          }

          scope('if(',
            BINDING, '.type!==', TYPE, '||',
            BINDING, '.size!==', SIZE, '||',
            COMMON_KEYS.map(function (key) {
              return BINDING + '.' + key + '!==' + record[key]
            }).join('||'),
            '){',
            GL, '.bindBuffer(', GL_ARRAY_BUFFER$2, ',', BUFFER, '.buffer);',
            GL, '.vertexAttribPointer(', [
              LOCATION,
              SIZE,
              TYPE,
              record.normalized,
              record.stride,
              record.offset
            ], ');',
            BINDING, '.type=', TYPE, ';',
            BINDING, '.size=', SIZE, ';',
            COMMON_KEYS.map(function (key) {
              return BINDING + '.' + key + '=' + record[key] + ';'
            }).join(''),
            '}');

          if (extInstancing) {
            var DIVISOR = record.divisor;
            scope(
              'if(', BINDING, '.divisor!==', DIVISOR, '){',
              env.instancing, '.vertexAttribDivisorANGLE(', [LOCATION, DIVISOR], ');',
              BINDING, '.divisor=', DIVISOR, ';}');
          }
        }

        function emitConstant () {
          scope(
            'if(', BINDING, '.buffer){',
            GL, '.disableVertexAttribArray(', LOCATION, ');',
            BINDING, '.buffer=null;',
            '}if(', CUTE_COMPONENTS.map(function (c, i) {
              return BINDING + '.' + c + '!==' + CONST_COMPONENTS[i]
            }).join('||'), '){',
            GL, '.vertexAttrib4f(', LOCATION, ',', CONST_COMPONENTS, ');',
            CUTE_COMPONENTS.map(function (c, i) {
              return BINDING + '.' + c + '=' + CONST_COMPONENTS[i] + ';'
            }).join(''),
            '}');
        }

        if (STATE === ATTRIB_STATE_POINTER) {
          emitBuffer();
        } else if (STATE === ATTRIB_STATE_CONSTANT) {
          emitConstant();
        } else {
          scope('if(', STATE, '===', ATTRIB_STATE_POINTER, '){');
          emitBuffer();
          scope('}else{');
          emitConstant();
          scope('}');
        }
      }

      attributes.forEach(function (attribute) {
        var name = attribute.name;
        var arg = args.attributes[name];
        var record;
        if (arg) {
          if (!filter(arg)) {
            return
          }
          record = arg.append(env, scope);
        } else {
          if (!filter(SCOPE_DECL)) {
            return
          }
          var scopeAttrib = env.scopeAttrib(name);
          
          record = {};
          Object.keys(new AttributeRecord()).forEach(function (key) {
            record[key] = scope.def(scopeAttrib, '.', key);
          });
        }
        emitBindAttribute(
          env.link(attribute), typeLength(attribute.info.type), record);
      });
    }

    function emitUniforms (env, scope, args, uniforms, filter, isBatchInnerLoop) {
      var shared = env.shared;
      var GL = shared.gl;

      var definedArrUniforms = {};
      var infix;
      for (var i = 0; i < uniforms.length; ++i) {
        var uniform = uniforms[i];
        var name = uniform.name;
        var type = uniform.info.type;
        var size = uniform.info.size;
        var arg = args.uniforms[name];
        if (size > 1) {
          // either foo[n] or foos, avoid define both
          if (!arg) {
            continue
          }
          var arrUniformName = name.replace('[0]', '');
          if (definedArrUniforms[arrUniformName]) {
            continue
          }
          definedArrUniforms[arrUniformName] = 1;
        }
        var UNIFORM = env.link(uniform);
        var LOCATION = UNIFORM + '.location';

        var VALUE;
        if (arg) {
          if (!filter(arg)) {
            continue
          }
          if (isStatic(arg)) {
            var value = arg.value;
            
            if (type === GL_SAMPLER_2D || type === GL_SAMPLER_CUBE) {
              
              var TEX_VALUE = env.link(value._texture || value.color[0]._texture);
              scope(GL, '.uniform1i(', LOCATION, ',', TEX_VALUE + '.bind());');
              scope.exit(TEX_VALUE, '.unbind();');
            } else if (
              type === GL_FLOAT_MAT2 ||
              type === GL_FLOAT_MAT3 ||
              type === GL_FLOAT_MAT4) {
              
              var MAT_VALUE = env.global.def('new Float32Array([' +
                Array.prototype.slice.call(value) + '])');
              var dim = 2;
              if (type === GL_FLOAT_MAT3) {
                dim = 3;
              } else if (type === GL_FLOAT_MAT4) {
                dim = 4;
              }
              scope(
                GL, '.uniformMatrix', dim, 'fv(',
                LOCATION, ',false,', MAT_VALUE, ');');
            } else {
              switch (type) {
                case GL_FLOAT$7:
                  infix = '1f';
                  break
                case GL_FLOAT_VEC2:
                  
                  infix = '2f';
                  break
                case GL_FLOAT_VEC3:
                  
                  infix = '3f';
                  break
                case GL_FLOAT_VEC4:
                  
                  infix = '4f';
                  break
                case GL_BOOL:
                  infix = '1i';
                  break
                case GL_INT$2:
                  infix = '1i';
                  break
                case GL_BOOL_VEC2:
                  
                  infix = '2i';
                  break
                case GL_INT_VEC2:
                  
                  infix = '2i';
                  break
                case GL_BOOL_VEC3:
                  
                  infix = '3i';
                  break
                case GL_INT_VEC3:
                  
                  infix = '3i';
                  break
                case GL_BOOL_VEC4:
                  
                  infix = '4i';
                  break
                case GL_INT_VEC4:
                  
                  infix = '4i';
                  break
              }
              if (size > 1) {
                infix += 'v';
                value = env.global.def('[' +
                Array.prototype.slice.call(value) + ']');
              } else {
                value = isArrayLike(value) ? Array.prototype.slice.call(value) : value;
              }
              scope(GL, '.uniform', infix, '(', LOCATION, ',',
                value,
                ');');
            }
            continue
          } else {
            VALUE = arg.append(env, scope);
          }
        } else {
          if (!filter(SCOPE_DECL)) {
            continue
          }
          VALUE = scope.def(shared.uniforms, '[', stringStore.id(name), ']');
        }

        if (type === GL_SAMPLER_2D) {
          
          scope(
            'if(', VALUE, '&&', VALUE, '._reglType==="framebuffer"){',
            VALUE, '=', VALUE, '.color[0];',
            '}');
        } else if (type === GL_SAMPLER_CUBE) {
          
          scope(
            'if(', VALUE, '&&', VALUE, '._reglType==="framebufferCube"){',
            VALUE, '=', VALUE, '.color[0];',
            '}');
        }

        // perform type validation
        

        var unroll = 1;
        switch (type) {
          case GL_SAMPLER_2D:
          case GL_SAMPLER_CUBE:
            var TEX = scope.def(VALUE, '._texture');
            scope(GL, '.uniform1i(', LOCATION, ',', TEX, '.bind());');
            scope.exit(TEX, '.unbind();');
            continue

          case GL_INT$2:
          case GL_BOOL:
            infix = '1i';
            break

          case GL_INT_VEC2:
          case GL_BOOL_VEC2:
            infix = '2i';
            unroll = 2;
            break

          case GL_INT_VEC3:
          case GL_BOOL_VEC3:
            infix = '3i';
            unroll = 3;
            break

          case GL_INT_VEC4:
          case GL_BOOL_VEC4:
            infix = '4i';
            unroll = 4;
            break

          case GL_FLOAT$7:
            infix = '1f';
            break

          case GL_FLOAT_VEC2:
            infix = '2f';
            unroll = 2;
            break

          case GL_FLOAT_VEC3:
            infix = '3f';
            unroll = 3;
            break

          case GL_FLOAT_VEC4:
            infix = '4f';
            unroll = 4;
            break

          case GL_FLOAT_MAT2:
            infix = 'Matrix2fv';
            break

          case GL_FLOAT_MAT3:
            infix = 'Matrix3fv';
            break

          case GL_FLOAT_MAT4:
            infix = 'Matrix4fv';
            break
        }

        if (infix.indexOf('Matrix') === -1 && size > 1) {
          infix += 'v';
          unroll = 1;
        }

        if (infix.charAt(0) === 'M') {
          scope(GL, '.uniform', infix, '(', LOCATION, ',');
          var matSize = Math.pow(type - GL_FLOAT_MAT2 + 2, 2);
          var STORAGE = env.global.def('new Float32Array(', matSize, ')');
          if (Array.isArray(VALUE)) {
            scope(
              'false,(',
              loop(matSize, function (i) {
                return STORAGE + '[' + i + ']=' + VALUE[i]
              }), ',', STORAGE, ')');
          } else {
            scope(
              'false,(Array.isArray(', VALUE, ')||', VALUE, ' instanceof Float32Array)?', VALUE, ':(',
              loop(matSize, function (i) {
                return STORAGE + '[' + i + ']=' + VALUE + '[' + i + ']'
              }), ',', STORAGE, ')');
          }
          scope(');');
        } else if (unroll > 1) {
          var prev = [];
          var cur = [];
          for (var j = 0; j < unroll; ++j) {
            if (Array.isArray(VALUE)) {
              cur.push(VALUE[j]);
            } else {
              cur.push(scope.def(VALUE + '[' + j + ']'));
            }
            if (isBatchInnerLoop) {
              prev.push(scope.def());
            }
          }
          if (isBatchInnerLoop) {
            scope('if(!', env.batchId, '||', prev.map(function (p, i) {
              return p + '!==' + cur[i]
            }).join('||'), '){', prev.map(function (p, i) {
              return p + '=' + cur[i] + ';'
            }).join(''));
          }
          scope(GL, '.uniform', infix, '(', LOCATION, ',', cur.join(','), ');');
          if (isBatchInnerLoop) {
            scope('}');
          }
        } else {
          
          if (isBatchInnerLoop) {
            var prevS = scope.def();
            scope('if(!', env.batchId, '||', prevS, '!==', VALUE, '){',
              prevS, '=', VALUE, ';');
          }
          scope(GL, '.uniform', infix, '(', LOCATION, ',', VALUE, ');');
          if (isBatchInnerLoop) {
            scope('}');
          }
        }
      }
    }

    function emitDraw (env, outer, inner, args) {
      var shared = env.shared;
      var GL = shared.gl;
      var DRAW_STATE = shared.draw;

      var drawOptions = args.draw;

      function emitElements () {
        var defn = drawOptions.elements;
        var ELEMENTS;
        var scope = outer;
        if (defn) {
          if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
            scope = inner;
          }
          ELEMENTS = defn.append(env, scope);
          if (drawOptions.elementsActive) {
            scope(
              'if(' + ELEMENTS + ')' +
              GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$2 + ',' + ELEMENTS + '.buffer.buffer);');
          }
        } else {
          ELEMENTS = scope.def();
          scope(
            ELEMENTS, '=', DRAW_STATE, '.', S_ELEMENTS, ';',
            'if(', ELEMENTS, '){',
            GL, '.bindBuffer(', GL_ELEMENT_ARRAY_BUFFER$2, ',', ELEMENTS, '.buffer.buffer);}',
            'else if(', shared.vao, '.currentVAO){',
            ELEMENTS, '=', env.shared.elements + '.getElements(' + shared.vao, '.currentVAO.elements);',
            (!extVertexArrays ? 'if(' + ELEMENTS + ')' + GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$2 + ',' + ELEMENTS + '.buffer.buffer);' : ''),
            '}');
        }
        return ELEMENTS
      }

      function emitCount () {
        var defn = drawOptions.count;
        var COUNT;
        var scope = outer;
        if (defn) {
          if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
            scope = inner;
          }
          COUNT = defn.append(env, scope);
          
        } else {
          COUNT = scope.def(DRAW_STATE, '.', S_COUNT);
          
        }
        return COUNT
      }

      var ELEMENTS = emitElements();
      function emitValue (name) {
        var defn = drawOptions[name];
        if (defn) {
          if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
            return defn.append(env, inner)
          } else {
            return defn.append(env, outer)
          }
        } else {
          return outer.def(DRAW_STATE, '.', name)
        }
      }

      var PRIMITIVE = emitValue(S_PRIMITIVE);
      var OFFSET = emitValue(S_OFFSET);

      var COUNT = emitCount();
      if (typeof COUNT === 'number') {
        if (COUNT === 0) {
          return
        }
      } else {
        inner('if(', COUNT, '){');
        inner.exit('}');
      }

      var INSTANCES, EXT_INSTANCING;
      if (extInstancing) {
        INSTANCES = emitValue(S_INSTANCES);
        EXT_INSTANCING = env.instancing;
      }

      var ELEMENT_TYPE = ELEMENTS + '.type';

      var elementsStatic = drawOptions.elements && isStatic(drawOptions.elements) && !drawOptions.vaoActive;

      function emitInstancing () {
        function drawElements () {
          inner(EXT_INSTANCING, '.drawElementsInstancedANGLE(', [
            PRIMITIVE,
            COUNT,
            ELEMENT_TYPE,
            OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$7 + ')>>1)',
            INSTANCES
          ], ');');
        }

        function drawArrays () {
          inner(EXT_INSTANCING, '.drawArraysInstancedANGLE(',
            [PRIMITIVE, OFFSET, COUNT, INSTANCES], ');');
        }

        if (ELEMENTS && ELEMENTS !== 'null') {
          if (!elementsStatic) {
            inner('if(', ELEMENTS, '){');
            drawElements();
            inner('}else{');
            drawArrays();
            inner('}');
          } else {
            drawElements();
          }
        } else {
          drawArrays();
        }
      }

      function emitRegular () {
        function drawElements () {
          inner(GL + '.drawElements(' + [
            PRIMITIVE,
            COUNT,
            ELEMENT_TYPE,
            OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$7 + ')>>1)'
          ] + ');');
        }

        function drawArrays () {
          inner(GL + '.drawArrays(' + [PRIMITIVE, OFFSET, COUNT] + ');');
        }

        if (ELEMENTS && ELEMENTS !== 'null') {
          if (!elementsStatic) {
            inner('if(', ELEMENTS, '){');
            drawElements();
            inner('}else{');
            drawArrays();
            inner('}');
          } else {
            drawElements();
          }
        } else {
          drawArrays();
        }
      }

      if (extInstancing && (typeof INSTANCES !== 'number' || INSTANCES >= 0)) {
        if (typeof INSTANCES === 'string') {
          inner('if(', INSTANCES, '>0){');
          emitInstancing();
          inner('}else if(', INSTANCES, '<0){');
          emitRegular();
          inner('}');
        } else {
          emitInstancing();
        }
      } else {
        emitRegular();
      }
    }

    function createBody (emitBody, parentEnv, args, program, count) {
      var env = createREGLEnvironment();
      var scope = env.proc('body', count);
      
      if (extInstancing) {
        env.instancing = scope.def(
          env.shared.extensions, '.angle_instanced_arrays');
      }
      emitBody(env, scope, args, program);
      return env.compile().body
    }

    // ===================================================
    // ===================================================
    // DRAW PROC
    // ===================================================
    // ===================================================
    function emitDrawBody (env, draw, args, program) {
      injectExtensions(env, draw);
      if (args.useVAO) {
        if (args.drawVAO) {
          draw(env.shared.vao, '.setVAO(', args.drawVAO.append(env, draw), ');');
        } else {
          draw(env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
        }
      } else {
        draw(env.shared.vao, '.setVAO(null);');
        emitAttributes(env, draw, args, program.attributes, function () {
          return true
        });
      }
      emitUniforms(env, draw, args, program.uniforms, function () {
        return true
      }, false);
      emitDraw(env, draw, draw, args);
    }

    function emitDrawProc (env, args) {
      var draw = env.proc('draw', 1);

      injectExtensions(env, draw);

      emitContext(env, draw, args.context);
      emitPollFramebuffer(env, draw, args.framebuffer);

      emitPollState(env, draw, args);
      emitSetOptions(env, draw, args.state);

      emitProfile(env, draw, args, false, true);

      var program = args.shader.progVar.append(env, draw);
      draw(env.shared.gl, '.useProgram(', program, '.program);');

      if (args.shader.program) {
        emitDrawBody(env, draw, args, args.shader.program);
      } else {
        draw(env.shared.vao, '.setVAO(null);');
        var drawCache = env.global.def('{}');
        var PROG_ID = draw.def(program, '.id');
        var CACHED_PROC = draw.def(drawCache, '[', PROG_ID, ']');
        draw(
          env.cond(CACHED_PROC)
            .then(CACHED_PROC, '.call(this,a0);')
            .else(
              CACHED_PROC, '=', drawCache, '[', PROG_ID, ']=',
              env.link(function (program) {
                return createBody(emitDrawBody, env, args, program, 1)
              }), '(', program, ');',
              CACHED_PROC, '.call(this,a0);'));
      }

      if (Object.keys(args.state).length > 0) {
        draw(env.shared.current, '.dirty=true;');
      }
      if (env.shared.vao) {
        draw(env.shared.vao, '.setVAO(null);');
      }
    }

    // ===================================================
    // ===================================================
    // BATCH PROC
    // ===================================================
    // ===================================================

    function emitBatchDynamicShaderBody (env, scope, args, program) {
      env.batchId = 'a1';

      injectExtensions(env, scope);

      function all () {
        return true
      }

      emitAttributes(env, scope, args, program.attributes, all);
      emitUniforms(env, scope, args, program.uniforms, all, false);
      emitDraw(env, scope, scope, args);
    }

    function emitBatchBody (env, scope, args, program) {
      injectExtensions(env, scope);

      var contextDynamic = args.contextDep;

      var BATCH_ID = scope.def();
      var PROP_LIST = 'a0';
      var NUM_PROPS = 'a1';
      var PROPS = scope.def();
      env.shared.props = PROPS;
      env.batchId = BATCH_ID;

      var outer = env.scope();
      var inner = env.scope();

      scope(
        outer.entry,
        'for(', BATCH_ID, '=0;', BATCH_ID, '<', NUM_PROPS, ';++', BATCH_ID, '){',
        PROPS, '=', PROP_LIST, '[', BATCH_ID, '];',
        inner,
        '}',
        outer.exit);

      function isInnerDefn (defn) {
        return ((defn.contextDep && contextDynamic) || defn.propDep)
      }

      function isOuterDefn (defn) {
        return !isInnerDefn(defn)
      }

      if (args.needsContext) {
        emitContext(env, inner, args.context);
      }
      if (args.needsFramebuffer) {
        emitPollFramebuffer(env, inner, args.framebuffer);
      }
      emitSetOptions(env, inner, args.state, isInnerDefn);

      if (args.profile && isInnerDefn(args.profile)) {
        emitProfile(env, inner, args, false, true);
      }

      if (!program) {
        var progCache = env.global.def('{}');
        var PROGRAM = args.shader.progVar.append(env, inner);
        var PROG_ID = inner.def(PROGRAM, '.id');
        var CACHED_PROC = inner.def(progCache, '[', PROG_ID, ']');
        inner(
          env.shared.gl, '.useProgram(', PROGRAM, '.program);',
          'if(!', CACHED_PROC, '){',
          CACHED_PROC, '=', progCache, '[', PROG_ID, ']=',
          env.link(function (program) {
            return createBody(
              emitBatchDynamicShaderBody, env, args, program, 2)
          }), '(', PROGRAM, ');}',
          CACHED_PROC, '.call(this,a0[', BATCH_ID, '],', BATCH_ID, ');');
      } else {
        if (args.useVAO) {
          if (args.drawVAO) {
            if (isInnerDefn(args.drawVAO)) {
              // vao is a prop
              inner(env.shared.vao, '.setVAO(', args.drawVAO.append(env, inner), ');');
            } else {
              // vao is invariant
              outer(env.shared.vao, '.setVAO(', args.drawVAO.append(env, outer), ');');
            }
          } else {
            // scoped vao binding
            outer(env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
          }
        } else {
          outer(env.shared.vao, '.setVAO(null);');
          emitAttributes(env, outer, args, program.attributes, isOuterDefn);
          emitAttributes(env, inner, args, program.attributes, isInnerDefn);
        }
        emitUniforms(env, outer, args, program.uniforms, isOuterDefn, false);
        emitUniforms(env, inner, args, program.uniforms, isInnerDefn, true);
        emitDraw(env, outer, inner, args);
      }
    }

    function emitBatchProc (env, args) {
      var batch = env.proc('batch', 2);
      env.batchId = '0';

      injectExtensions(env, batch);

      // Check if any context variables depend on props
      var contextDynamic = false;
      var needsContext = true;
      Object.keys(args.context).forEach(function (name) {
        contextDynamic = contextDynamic || args.context[name].propDep;
      });
      if (!contextDynamic) {
        emitContext(env, batch, args.context);
        needsContext = false;
      }

      // framebuffer state affects framebufferWidth/height context vars
      var framebuffer = args.framebuffer;
      var needsFramebuffer = false;
      if (framebuffer) {
        if (framebuffer.propDep) {
          contextDynamic = needsFramebuffer = true;
        } else if (framebuffer.contextDep && contextDynamic) {
          needsFramebuffer = true;
        }
        if (!needsFramebuffer) {
          emitPollFramebuffer(env, batch, framebuffer);
        }
      } else {
        emitPollFramebuffer(env, batch, null);
      }

      // viewport is weird because it can affect context vars
      if (args.state.viewport && args.state.viewport.propDep) {
        contextDynamic = true;
      }

      function isInnerDefn (defn) {
        return (defn.contextDep && contextDynamic) || defn.propDep
      }

      // set webgl options
      emitPollState(env, batch, args);
      emitSetOptions(env, batch, args.state, function (defn) {
        return !isInnerDefn(defn)
      });

      if (!args.profile || !isInnerDefn(args.profile)) {
        emitProfile(env, batch, args, false, 'a1');
      }

      // Save these values to args so that the batch body routine can use them
      args.contextDep = contextDynamic;
      args.needsContext = needsContext;
      args.needsFramebuffer = needsFramebuffer;

      // determine if shader is dynamic
      var progDefn = args.shader.progVar;
      if ((progDefn.contextDep && contextDynamic) || progDefn.propDep) {
        emitBatchBody(
          env,
          batch,
          args,
          null);
      } else {
        var PROGRAM = progDefn.append(env, batch);
        batch(env.shared.gl, '.useProgram(', PROGRAM, '.program);');
        if (args.shader.program) {
          emitBatchBody(
            env,
            batch,
            args,
            args.shader.program);
        } else {
          batch(env.shared.vao, '.setVAO(null);');
          var batchCache = env.global.def('{}');
          var PROG_ID = batch.def(PROGRAM, '.id');
          var CACHED_PROC = batch.def(batchCache, '[', PROG_ID, ']');
          batch(
            env.cond(CACHED_PROC)
              .then(CACHED_PROC, '.call(this,a0,a1);')
              .else(
                CACHED_PROC, '=', batchCache, '[', PROG_ID, ']=',
                env.link(function (program) {
                  return createBody(emitBatchBody, env, args, program, 2)
                }), '(', PROGRAM, ');',
                CACHED_PROC, '.call(this,a0,a1);'));
        }
      }

      if (Object.keys(args.state).length > 0) {
        batch(env.shared.current, '.dirty=true;');
      }

      if (env.shared.vao) {
        batch(env.shared.vao, '.setVAO(null);');
      }
    }

    // ===================================================
    // ===================================================
    // SCOPE COMMAND
    // ===================================================
    // ===================================================
    function emitScopeProc (env, args) {
      var scope = env.proc('scope', 3);
      env.batchId = 'a2';

      var shared = env.shared;
      var CURRENT_STATE = shared.current;

      emitContext(env, scope, args.context);

      if (args.framebuffer) {
        args.framebuffer.append(env, scope);
      }

      sortState(Object.keys(args.state)).forEach(function (name) {
        var defn = args.state[name];
        var value = defn.append(env, scope);
        if (isArrayLike(value)) {
          value.forEach(function (v, i) {
            scope.set(env.next[name], '[' + i + ']', v);
          });
        } else {
          scope.set(shared.next, '.' + name, value);
        }
      });

      emitProfile(env, scope, args, true, true)

      ;[S_ELEMENTS, S_OFFSET, S_COUNT, S_INSTANCES, S_PRIMITIVE].forEach(
        function (opt) {
          var variable = args.draw[opt];
          if (!variable) {
            return
          }
          scope.set(shared.draw, '.' + opt, '' + variable.append(env, scope));
        });

      Object.keys(args.uniforms).forEach(function (opt) {
        var value = args.uniforms[opt].append(env, scope);
        if (Array.isArray(value)) {
          value = '[' + value.join() + ']';
        }
        scope.set(
          shared.uniforms,
          '[' + stringStore.id(opt) + ']',
          value);
      });

      Object.keys(args.attributes).forEach(function (name) {
        var record = args.attributes[name].append(env, scope);
        var scopeAttrib = env.scopeAttrib(name);
        Object.keys(new AttributeRecord()).forEach(function (prop) {
          scope.set(scopeAttrib, '.' + prop, record[prop]);
        });
      });

      if (args.scopeVAO) {
        scope.set(shared.vao, '.targetVAO', args.scopeVAO.append(env, scope));
      }

      function saveShader (name) {
        var shader = args.shader[name];
        if (shader) {
          scope.set(shared.shader, '.' + name, shader.append(env, scope));
        }
      }
      saveShader(S_VERT);
      saveShader(S_FRAG);

      if (Object.keys(args.state).length > 0) {
        scope(CURRENT_STATE, '.dirty=true;');
        scope.exit(CURRENT_STATE, '.dirty=true;');
      }

      scope('a1(', env.shared.context, ',a0,', env.batchId, ');');
    }

    function isDynamicObject (object) {
      if (typeof object !== 'object' || isArrayLike(object)) {
        return
      }
      var props = Object.keys(object);
      for (var i = 0; i < props.length; ++i) {
        if (dynamic.isDynamic(object[props[i]])) {
          return true
        }
      }
      return false
    }

    function splatObject (env, options, name) {
      var object = options.static[name];
      if (!object || !isDynamicObject(object)) {
        return
      }

      var globals = env.global;
      var keys = Object.keys(object);
      var thisDep = false;
      var contextDep = false;
      var propDep = false;
      var objectRef = env.global.def('{}');
      keys.forEach(function (key) {
        var value = object[key];
        if (dynamic.isDynamic(value)) {
          if (typeof value === 'function') {
            value = object[key] = dynamic.unbox(value);
          }
          var deps = createDynamicDecl(value, null);
          thisDep = thisDep || deps.thisDep;
          propDep = propDep || deps.propDep;
          contextDep = contextDep || deps.contextDep;
        } else {
          globals(objectRef, '.', key, '=');
          switch (typeof value) {
            case 'number':
              globals(value);
              break
            case 'string':
              globals('"', value, '"');
              break
            case 'object':
              if (Array.isArray(value)) {
                globals('[', value.join(), ']');
              }
              break
            default:
              globals(env.link(value));
              break
          }
          globals(';');
        }
      });

      function appendBlock (env, block) {
        keys.forEach(function (key) {
          var value = object[key];
          if (!dynamic.isDynamic(value)) {
            return
          }
          var ref = env.invoke(block, value);
          block(objectRef, '.', key, '=', ref, ';');
        });
      }

      options.dynamic[name] = new dynamic.DynamicVariable(DYN_THUNK, {
        thisDep: thisDep,
        contextDep: contextDep,
        propDep: propDep,
        ref: objectRef,
        append: appendBlock
      });
      delete options.static[name];
    }

    // ===========================================================================
    // ===========================================================================
    // MAIN DRAW COMMAND
    // ===========================================================================
    // ===========================================================================
    function compileCommand (options, attributes, uniforms, context, stats) {
      var env = createREGLEnvironment();

      // link stats, so that we can easily access it in the program.
      env.stats = env.link(stats);

      // splat options and attributes to allow for dynamic nested properties
      Object.keys(attributes.static).forEach(function (key) {
        splatObject(env, attributes, key);
      });
      NESTED_OPTIONS.forEach(function (name) {
        splatObject(env, options, name);
      });

      var args = parseArguments(options, attributes, uniforms, context, env);

      emitDrawProc(env, args);
      emitScopeProc(env, args);
      emitBatchProc(env, args);

      return extend(env.compile(), {
        destroy: function () {
          args.shader.program.destroy();
        }
      })
    }

    // ===========================================================================
    // ===========================================================================
    // POLL / REFRESH
    // ===========================================================================
    // ===========================================================================
    return {
      next: nextState,
      current: currentState,
      procs: (function () {
        var env = createREGLEnvironment();
        var poll = env.proc('poll');
        var refresh = env.proc('refresh');
        var common = env.block();
        poll(common);
        refresh(common);

        var shared = env.shared;
        var GL = shared.gl;
        var NEXT_STATE = shared.next;
        var CURRENT_STATE = shared.current;

        common(CURRENT_STATE, '.dirty=false;');

        emitPollFramebuffer(env, poll);
        emitPollFramebuffer(env, refresh, null, true);

        // Refresh updates all attribute state changes
        var INSTANCING;
        if (extInstancing) {
          INSTANCING = env.link(extInstancing);
        }

        // update vertex array bindings
        if (extensions.oes_vertex_array_object) {
          refresh(env.link(extensions.oes_vertex_array_object), '.bindVertexArrayOES(null);');
        }
        for (var i = 0; i < limits.maxAttributes; ++i) {
          var BINDING = refresh.def(shared.attributes, '[', i, ']');
          var ifte = env.cond(BINDING, '.buffer');
          ifte.then(
            GL, '.enableVertexAttribArray(', i, ');',
            GL, '.bindBuffer(',
            GL_ARRAY_BUFFER$2, ',',
            BINDING, '.buffer.buffer);',
            GL, '.vertexAttribPointer(',
            i, ',',
            BINDING, '.size,',
            BINDING, '.type,',
            BINDING, '.normalized,',
            BINDING, '.stride,',
            BINDING, '.offset);'
          ).else(
            GL, '.disableVertexAttribArray(', i, ');',
            GL, '.vertexAttrib4f(',
            i, ',',
            BINDING, '.x,',
            BINDING, '.y,',
            BINDING, '.z,',
            BINDING, '.w);',
            BINDING, '.buffer=null;');
          refresh(ifte);
          if (extInstancing) {
            refresh(
              INSTANCING, '.vertexAttribDivisorANGLE(',
              i, ',',
              BINDING, '.divisor);');
          }
        }
        refresh(
          env.shared.vao, '.currentVAO=null;',
          env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');

        Object.keys(GL_FLAGS).forEach(function (flag) {
          var cap = GL_FLAGS[flag];
          var NEXT = common.def(NEXT_STATE, '.', flag);
          var block = env.block();
          block('if(', NEXT, '){',
            GL, '.enable(', cap, ')}else{',
            GL, '.disable(', cap, ')}',
            CURRENT_STATE, '.', flag, '=', NEXT, ';');
          refresh(block);
          poll(
            'if(', NEXT, '!==', CURRENT_STATE, '.', flag, '){',
            block,
            '}');
        });

        Object.keys(GL_VARIABLES).forEach(function (name) {
          var func = GL_VARIABLES[name];
          var init = currentState[name];
          var NEXT, CURRENT;
          var block = env.block();
          block(GL, '.', func, '(');
          if (isArrayLike(init)) {
            var n = init.length;
            NEXT = env.global.def(NEXT_STATE, '.', name);
            CURRENT = env.global.def(CURRENT_STATE, '.', name);
            block(
              loop(n, function (i) {
                return NEXT + '[' + i + ']'
              }), ');',
              loop(n, function (i) {
                return CURRENT + '[' + i + ']=' + NEXT + '[' + i + '];'
              }).join(''));
            poll(
              'if(', loop(n, function (i) {
                return NEXT + '[' + i + ']!==' + CURRENT + '[' + i + ']'
              }).join('||'), '){',
              block,
              '}');
          } else {
            NEXT = common.def(NEXT_STATE, '.', name);
            CURRENT = common.def(CURRENT_STATE, '.', name);
            block(
              NEXT, ');',
              CURRENT_STATE, '.', name, '=', NEXT, ';');
            poll(
              'if(', NEXT, '!==', CURRENT, '){',
              block,
              '}');
          }
          refresh(block);
        });

        return env.compile()
      })(),
      compile: compileCommand
    }
  }

  function stats () {
    return {
      vaoCount: 0,
      bufferCount: 0,
      elementsCount: 0,
      framebufferCount: 0,
      shaderCount: 0,
      textureCount: 0,
      cubeCount: 0,
      renderbufferCount: 0,
      maxTextureUnits: 0
    }
  }

  var GL_QUERY_RESULT_EXT = 0x8866;
  var GL_QUERY_RESULT_AVAILABLE_EXT = 0x8867;
  var GL_TIME_ELAPSED_EXT = 0x88BF;

  var createTimer = function (gl, extensions) {
    if (!extensions.ext_disjoint_timer_query) {
      return null
    }

    // QUERY POOL BEGIN
    var queryPool = [];
    function allocQuery () {
      return queryPool.pop() || extensions.ext_disjoint_timer_query.createQueryEXT()
    }
    function freeQuery (query) {
      queryPool.push(query);
    }
    // QUERY POOL END

    var pendingQueries = [];
    function beginQuery (stats) {
      var query = allocQuery();
      extensions.ext_disjoint_timer_query.beginQueryEXT(GL_TIME_ELAPSED_EXT, query);
      pendingQueries.push(query);
      pushScopeStats(pendingQueries.length - 1, pendingQueries.length, stats);
    }

    function endQuery () {
      extensions.ext_disjoint_timer_query.endQueryEXT(GL_TIME_ELAPSED_EXT);
    }

    //
    // Pending stats pool.
    //
    function PendingStats () {
      this.startQueryIndex = -1;
      this.endQueryIndex = -1;
      this.sum = 0;
      this.stats = null;
    }
    var pendingStatsPool = [];
    function allocPendingStats () {
      return pendingStatsPool.pop() || new PendingStats()
    }
    function freePendingStats (pendingStats) {
      pendingStatsPool.push(pendingStats);
    }
    // Pending stats pool end

    var pendingStats = [];
    function pushScopeStats (start, end, stats) {
      var ps = allocPendingStats();
      ps.startQueryIndex = start;
      ps.endQueryIndex = end;
      ps.sum = 0;
      ps.stats = stats;
      pendingStats.push(ps);
    }

    // we should call this at the beginning of the frame,
    // in order to update gpuTime
    var timeSum = [];
    var queryPtr = [];
    function update () {
      var ptr, i;

      var n = pendingQueries.length;
      if (n === 0) {
        return
      }

      // Reserve space
      queryPtr.length = Math.max(queryPtr.length, n + 1);
      timeSum.length = Math.max(timeSum.length, n + 1);
      timeSum[0] = 0;
      queryPtr[0] = 0;

      // Update all pending timer queries
      var queryTime = 0;
      ptr = 0;
      for (i = 0; i < pendingQueries.length; ++i) {
        var query = pendingQueries[i];
        if (extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_AVAILABLE_EXT)) {
          queryTime += extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_EXT);
          freeQuery(query);
        } else {
          pendingQueries[ptr++] = query;
        }
        timeSum[i + 1] = queryTime;
        queryPtr[i + 1] = ptr;
      }
      pendingQueries.length = ptr;

      // Update all pending stat queries
      ptr = 0;
      for (i = 0; i < pendingStats.length; ++i) {
        var stats = pendingStats[i];
        var start = stats.startQueryIndex;
        var end = stats.endQueryIndex;
        stats.sum += timeSum[end] - timeSum[start];
        var startPtr = queryPtr[start];
        var endPtr = queryPtr[end];
        if (endPtr === startPtr) {
          stats.stats.gpuTime += stats.sum / 1e6;
          freePendingStats(stats);
        } else {
          stats.startQueryIndex = startPtr;
          stats.endQueryIndex = endPtr;
          pendingStats[ptr++] = stats;
        }
      }
      pendingStats.length = ptr;
    }

    return {
      beginQuery: beginQuery,
      endQuery: endQuery,
      pushScopeStats: pushScopeStats,
      update: update,
      getNumPendingQueries: function () {
        return pendingQueries.length
      },
      clear: function () {
        queryPool.push.apply(queryPool, pendingQueries);
        for (var i = 0; i < queryPool.length; i++) {
          extensions.ext_disjoint_timer_query.deleteQueryEXT(queryPool[i]);
        }
        pendingQueries.length = 0;
        queryPool.length = 0;
      },
      restore: function () {
        pendingQueries.length = 0;
        queryPool.length = 0;
      }
    }
  };

  var GL_COLOR_BUFFER_BIT = 16384;
  var GL_DEPTH_BUFFER_BIT = 256;
  var GL_STENCIL_BUFFER_BIT = 1024;

  var GL_ARRAY_BUFFER = 34962;

  var CONTEXT_LOST_EVENT = 'webglcontextlost';
  var CONTEXT_RESTORED_EVENT = 'webglcontextrestored';

  var DYN_PROP = 1;
  var DYN_CONTEXT = 2;
  var DYN_STATE = 3;

  function find (haystack, needle) {
    for (var i = 0; i < haystack.length; ++i) {
      if (haystack[i] === needle) {
        return i
      }
    }
    return -1
  }

  function wrapREGL (args) {
    var config = parseArgs(args);
    if (!config) {
      return null
    }

    var gl = config.gl;
    var glAttributes = gl.getContextAttributes();
    gl.isContextLost();

    var extensionState = createExtensionCache(gl, config);
    if (!extensionState) {
      return null
    }

    var stringStore = createStringStore();
    var stats$$1 = stats();
    var extensions = extensionState.extensions;
    var timer = createTimer(gl, extensions);

    var START_TIME = clock();
    var WIDTH = gl.drawingBufferWidth;
    var HEIGHT = gl.drawingBufferHeight;

    var contextState = {
      tick: 0,
      time: 0,
      viewportWidth: WIDTH,
      viewportHeight: HEIGHT,
      framebufferWidth: WIDTH,
      framebufferHeight: HEIGHT,
      drawingBufferWidth: WIDTH,
      drawingBufferHeight: HEIGHT,
      pixelRatio: config.pixelRatio
    };
    var uniformState = {};
    var drawState = {
      elements: null,
      primitive: 4, // GL_TRIANGLES
      count: -1,
      offset: 0,
      instances: -1
    };

    var limits = wrapLimits(gl, extensions);
    var bufferState = wrapBufferState(
      gl,
      stats$$1,
      config,
      destroyBuffer);
    var elementState = wrapElementsState(gl, extensions, bufferState, stats$$1);
    var attributeState = wrapAttributeState(
      gl,
      extensions,
      limits,
      stats$$1,
      bufferState,
      elementState,
      drawState);
    function destroyBuffer (buffer) {
      return attributeState.destroyBuffer(buffer)
    }
    var shaderState = wrapShaderState(gl, stringStore, stats$$1, config);
    var textureState = createTextureSet(
      gl,
      extensions,
      limits,
      function () { core.procs.poll(); },
      contextState,
      stats$$1,
      config);
    var renderbufferState = wrapRenderbuffers(gl, extensions, limits, stats$$1, config);
    var framebufferState = wrapFBOState(
      gl,
      extensions,
      limits,
      textureState,
      renderbufferState,
      stats$$1);
    var core = reglCore(
      gl,
      stringStore,
      extensions,
      limits,
      bufferState,
      elementState,
      textureState,
      framebufferState,
      uniformState,
      attributeState,
      shaderState,
      drawState,
      contextState,
      timer,
      config);
    var readPixels = wrapReadPixels(
      gl,
      framebufferState,
      core.procs.poll,
      contextState);

    var nextState = core.next;
    var canvas = gl.canvas;

    var rafCallbacks = [];
    var lossCallbacks = [];
    var restoreCallbacks = [];
    var destroyCallbacks = [config.onDestroy];

    var activeRAF = null;
    function handleRAF () {
      if (rafCallbacks.length === 0) {
        if (timer) {
          timer.update();
        }
        activeRAF = null;
        return
      }

      // schedule next animation frame
      activeRAF = raf.next(handleRAF);

      // poll for changes
      poll();

      // fire a callback for all pending rafs
      for (var i = rafCallbacks.length - 1; i >= 0; --i) {
        var cb = rafCallbacks[i];
        if (cb) {
          cb(contextState, null, 0);
        }
      }

      // flush all pending webgl calls
      gl.flush();

      // poll GPU timers *after* gl.flush so we don't delay command dispatch
      if (timer) {
        timer.update();
      }
    }

    function startRAF () {
      if (!activeRAF && rafCallbacks.length > 0) {
        activeRAF = raf.next(handleRAF);
      }
    }

    function stopRAF () {
      if (activeRAF) {
        raf.cancel(handleRAF);
        activeRAF = null;
      }
    }

    function handleContextLoss (event) {
      event.preventDefault();

      // pause request animation frame
      stopRAF();

      // lose context
      lossCallbacks.forEach(function (cb) {
        cb();
      });
    }

    function handleContextRestored (event) {
      // clear error code
      gl.getError();

      // refresh state
      extensionState.restore();
      shaderState.restore();
      bufferState.restore();
      textureState.restore();
      renderbufferState.restore();
      framebufferState.restore();
      attributeState.restore();
      if (timer) {
        timer.restore();
      }

      // refresh state
      core.procs.refresh();

      // restart RAF
      startRAF();

      // restore context
      restoreCallbacks.forEach(function (cb) {
        cb();
      });
    }

    if (canvas) {
      canvas.addEventListener(CONTEXT_LOST_EVENT, handleContextLoss, false);
      canvas.addEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored, false);
    }

    function destroy () {
      rafCallbacks.length = 0;
      stopRAF();

      if (canvas) {
        canvas.removeEventListener(CONTEXT_LOST_EVENT, handleContextLoss);
        canvas.removeEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored);
      }

      shaderState.clear();
      framebufferState.clear();
      renderbufferState.clear();
      attributeState.clear();
      textureState.clear();
      elementState.clear();
      bufferState.clear();

      if (timer) {
        timer.clear();
      }

      destroyCallbacks.forEach(function (cb) {
        cb();
      });
    }

    function compileProcedure (options) {
      
      

      function flattenNestedOptions (options) {
        var result = extend({}, options);
        delete result.uniforms;
        delete result.attributes;
        delete result.context;
        delete result.vao;

        if ('stencil' in result && result.stencil.op) {
          result.stencil.opBack = result.stencil.opFront = result.stencil.op;
          delete result.stencil.op;
        }

        function merge (name) {
          if (name in result) {
            var child = result[name];
            delete result[name];
            Object.keys(child).forEach(function (prop) {
              result[name + '.' + prop] = child[prop];
            });
          }
        }
        merge('blend');
        merge('depth');
        merge('cull');
        merge('stencil');
        merge('polygonOffset');
        merge('scissor');
        merge('sample');

        if ('vao' in options) {
          result.vao = options.vao;
        }

        return result
      }

      function separateDynamic (object, useArrays) {
        var staticItems = {};
        var dynamicItems = {};
        Object.keys(object).forEach(function (option) {
          var value = object[option];
          if (dynamic.isDynamic(value)) {
            dynamicItems[option] = dynamic.unbox(value, option);
            return
          } else if (useArrays && Array.isArray(value)) {
            for (var i = 0; i < value.length; ++i) {
              if (dynamic.isDynamic(value[i])) {
                dynamicItems[option] = dynamic.unbox(value, option);
                return
              }
            }
          }
          staticItems[option] = value;
        });
        return {
          dynamic: dynamicItems,
          static: staticItems
        }
      }

      // Treat context variables separate from other dynamic variables
      var context = separateDynamic(options.context || {}, true);
      var uniforms = separateDynamic(options.uniforms || {}, true);
      var attributes = separateDynamic(options.attributes || {}, false);
      var opts = separateDynamic(flattenNestedOptions(options), false);

      var stats$$1 = {
        gpuTime: 0.0,
        cpuTime: 0.0,
        count: 0
      };

      var compiled = core.compile(opts, attributes, uniforms, context, stats$$1);

      var draw = compiled.draw;
      var batch = compiled.batch;
      var scope = compiled.scope;

      // FIXME: we should modify code generation for batch commands so this
      // isn't necessary
      var EMPTY_ARRAY = [];
      function reserve (count) {
        while (EMPTY_ARRAY.length < count) {
          EMPTY_ARRAY.push(null);
        }
        return EMPTY_ARRAY
      }

      function REGLCommand (args, body) {
        var i;
        if (typeof args === 'function') {
          return scope.call(this, null, args, 0)
        } else if (typeof body === 'function') {
          if (typeof args === 'number') {
            for (i = 0; i < args; ++i) {
              scope.call(this, null, body, i);
            }
          } else if (Array.isArray(args)) {
            for (i = 0; i < args.length; ++i) {
              scope.call(this, args[i], body, i);
            }
          } else {
            return scope.call(this, args, body, 0)
          }
        } else if (typeof args === 'number') {
          if (args > 0) {
            return batch.call(this, reserve(args | 0), args | 0)
          }
        } else if (Array.isArray(args)) {
          if (args.length) {
            return batch.call(this, args, args.length)
          }
        } else {
          return draw.call(this, args)
        }
      }

      return extend(REGLCommand, {
        stats: stats$$1,
        destroy: function () {
          compiled.destroy();
        }
      })
    }

    var setFBO = framebufferState.setFBO = compileProcedure({
      framebuffer: dynamic.define.call(null, DYN_PROP, 'framebuffer')
    });

    function clearImpl (_, options) {
      var clearFlags = 0;
      core.procs.poll();

      var c = options.color;
      if (c) {
        gl.clearColor(+c[0] || 0, +c[1] || 0, +c[2] || 0, +c[3] || 0);
        clearFlags |= GL_COLOR_BUFFER_BIT;
      }
      if ('depth' in options) {
        gl.clearDepth(+options.depth);
        clearFlags |= GL_DEPTH_BUFFER_BIT;
      }
      if ('stencil' in options) {
        gl.clearStencil(options.stencil | 0);
        clearFlags |= GL_STENCIL_BUFFER_BIT;
      }

      
      gl.clear(clearFlags);
    }

    function clear (options) {
      
      if ('framebuffer' in options) {
        if (options.framebuffer &&
            options.framebuffer_reglType === 'framebufferCube') {
          for (var i = 0; i < 6; ++i) {
            setFBO(extend({
              framebuffer: options.framebuffer.faces[i]
            }, options), clearImpl);
          }
        } else {
          setFBO(options, clearImpl);
        }
      } else {
        clearImpl(null, options);
      }
    }

    function frame (cb) {
      
      rafCallbacks.push(cb);

      function cancel () {
        // FIXME:  should we check something other than equals cb here?
        // what if a user calls frame twice with the same callback...
        //
        var i = find(rafCallbacks, cb);
        
        function pendingCancel () {
          var index = find(rafCallbacks, pendingCancel);
          rafCallbacks[index] = rafCallbacks[rafCallbacks.length - 1];
          rafCallbacks.length -= 1;
          if (rafCallbacks.length <= 0) {
            stopRAF();
          }
        }
        rafCallbacks[i] = pendingCancel;
      }

      startRAF();

      return {
        cancel: cancel
      }
    }

    // poll viewport
    function pollViewport () {
      var viewport = nextState.viewport;
      var scissorBox = nextState.scissor_box;
      viewport[0] = viewport[1] = scissorBox[0] = scissorBox[1] = 0;
      contextState.viewportWidth =
        contextState.framebufferWidth =
        contextState.drawingBufferWidth =
        viewport[2] =
        scissorBox[2] = gl.drawingBufferWidth;
      contextState.viewportHeight =
        contextState.framebufferHeight =
        contextState.drawingBufferHeight =
        viewport[3] =
        scissorBox[3] = gl.drawingBufferHeight;
    }

    function poll () {
      contextState.tick += 1;
      contextState.time = now();
      pollViewport();
      core.procs.poll();
    }

    function refresh () {
      textureState.refresh();
      pollViewport();
      core.procs.refresh();
      if (timer) {
        timer.update();
      }
    }

    function now () {
      return (clock() - START_TIME) / 1000.0
    }

    refresh();

    function addListener (event, callback) {
      

      var callbacks;
      switch (event) {
        case 'frame':
          return frame(callback)
        case 'lost':
          callbacks = lossCallbacks;
          break
        case 'restore':
          callbacks = restoreCallbacks;
          break
        case 'destroy':
          callbacks = destroyCallbacks;
          break
          
      }

      callbacks.push(callback);
      return {
        cancel: function () {
          for (var i = 0; i < callbacks.length; ++i) {
            if (callbacks[i] === callback) {
              callbacks[i] = callbacks[callbacks.length - 1];
              callbacks.pop();
              return
            }
          }
        }
      }
    }

    var regl = extend(compileProcedure, {
      // Clear current FBO
      clear: clear,

      // Short cuts for dynamic variables
      prop: dynamic.define.bind(null, DYN_PROP),
      context: dynamic.define.bind(null, DYN_CONTEXT),
      this: dynamic.define.bind(null, DYN_STATE),

      // executes an empty draw command
      draw: compileProcedure({}),

      // Resources
      buffer: function (options) {
        return bufferState.create(options, GL_ARRAY_BUFFER, false, false)
      },
      elements: function (options) {
        return elementState.create(options, false)
      },
      texture: textureState.create2D,
      cube: textureState.createCube,
      renderbuffer: renderbufferState.create,
      framebuffer: framebufferState.create,
      framebufferCube: framebufferState.createCube,
      vao: attributeState.createVAO,

      // Expose context attributes
      attributes: glAttributes,

      // Frame rendering
      frame: frame,
      on: addListener,

      // System limits
      limits: limits,
      hasExtension: function (name) {
        return limits.extensions.indexOf(name.toLowerCase()) >= 0
      },

      // Read pixels
      read: readPixels,

      // Destroy regl and all associated resources
      destroy: destroy,

      // Direct GL state manipulation
      _gl: gl,
      _refresh: refresh,

      poll: function () {
        poll();
        if (timer) {
          timer.update();
        }
      },

      // Current time
      now: now,

      // regl Statistics Information
      stats: stats$$1
    });

    config.onDone(null, regl);

    return regl
  }

  return wrapREGL;

  })));
  });

  function falseFn() { return false; }
  /**
   * 实现发布-订阅模式的事件中心
   * 源码修改自leaflet的Event类
   */
  var Evented = /** @class */ (function () {
      function Evented() {
          this._events = {};
      }
      /**
       * 事件注册
       * @param types { start:fn, end:fn } || start end
       * @param fn context || function
       * @param context null || context
       */
      Evented.prototype.on = function (types, fn, context) {
          if (typeof types === 'object') {
              for (var type in types) {
                  this._on(type, types[type], fn);
              }
          }
          else {
              types = splitWords(types);
              for (var i = 0, len = types.length; i < len; i++) {
                  this._on(types[i], fn, context);
              }
          }
          return this;
      };
      /**
       * 事件注销
       * @param types
       * @param fn
       * @param context
       */
      Evented.prototype.off = function (types, fn, context) {
          if (!types) {
              delete this._events;
          }
          else if (typeof types === 'object') {
              for (var type in types) {
                  this._off(type, types[type], fn);
              }
          }
          else {
              types = splitWords(types);
              for (var i = 0, len = types.length; i < len; i++) {
                  this._off(types[i], fn, context);
              }
          }
          return this;
      };
      /**
       * 单个事件注册
       * @param type
       * @param fn
       * @param context
       */
      Evented.prototype._on = function (type, fn, context) {
          this._events = this._events || {};
          var typeListeners = this._events[type];
          if (!typeListeners) {
              typeListeners = [];
              this._events[type] = typeListeners;
          }
          if (!context) {
              context = this;
          }
          var newListener = { fn: fn, ctx: context }, listeners = typeListeners;
          for (var i = 0, len = listeners.length; i < len; i++) {
              if (listeners[i].fn === fn && listeners[i].ctx === context) {
                  return;
              }
          }
          listeners.push(newListener);
      };
      /**
       * 单个事件注销
       * @param type
       * @param fn
       * @param context
       */
      Evented.prototype._off = function (type, fn, context) {
          var listeners, i, len;
          if (!this._events) {
              return;
          }
          listeners = this._events[type];
          if (!listeners) {
              return;
          }
          if (!fn) {
              for (i = 0, len = listeners.length; i < len; i++) {
                  listeners[i].fn = falseFn;
              }
              delete this._events[type];
              return;
          }
          if (!context) {
              context = this;
          }
          if (listeners) {
              for (i = 0, len = listeners.length; i < len; i++) {
                  var l = listeners[i];
                  if (l.ctx !== context) {
                      continue;
                  }
                  if (l.fn === fn) {
                      l.fn = falseFn;
                      if (this._firingCount) {
                          this._events[type] = listeners = listeners.slice();
                      }
                      listeners.splice(i, 1);
                      return;
                  }
              }
          }
      };
      /**
       * 触发事件
       * @param type 事件类型
       * @param data 事件数据
       */
      Evented.prototype.fire = function (type, data) {
          if (!this.listens(type)) {
              return this;
          }
          if (this._events) {
              var listeners = this._events[type];
              if (listeners) {
                  this._firingCount = (this._firingCount + 1) || 1;
                  for (var i = 0, len = listeners.length; i < len; i++) {
                      var l = listeners[i];
                      l.fn.call(l.ctx || this, data);
                  }
                  this._firingCount--;
              }
          }
          return this;
      };
      /**
       * 判断事件是否已经监听过
       * @param type
       */
      Evented.prototype.listens = function (type) {
          var listeners = this._events && this._events[type];
          if (listeners && listeners.length) {
              return true;
          }
          return false;
      };
      return Evented;
  }());

  var Color = /** @class */ (function () {
      function Color() {
          this._colors = {};
          this._uuids = {};
          this._currentColor = [0, 0, 0, 0];
      }
      Color.prototype.getColor = function (uuid) {
          function recursive(color, index) {
              var part = color[index];
              if (part + 1 <= 255) {
                  part = part + 1;
                  color[index] = part;
                  return;
              }
              else {
                  color[index] = 0;
              }
              recursive(color, index + 1);
          }
          recursive(this._currentColor, 0);
          // 颜色与uuid一一对应
          var colorKey = this._currentColor.join('-');
          this._colors[colorKey] = uuid;
          this._uuids[uuid] = colorKey;
          return __spreadArrays(this._currentColor);
      };
      Color.prototype.getUUID = function (colorKey) {
          return this._colors[colorKey];
      };
      Color.prototype.changeUuid = function (oldUuid, newUuid) {
          var colorKey = this._uuids[oldUuid];
          this._uuids[newUuid] = colorKey;
          this._colors[colorKey] = newUuid;
          delete this._uuids[oldUuid];
      };
      return Color;
  }());

  var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAeklEQVR4AWMgAvABcQEQFwGxEgMVQNq6desKV69eXQIxlHLQ8P//fzAGsQeHgaMGOiAZ6ECMBiVocmhAw7gMcMCuFpFOi9avX18McQUmRjcNlzqQGbB0WgBKuJQaCDIDZBYsa6VR6mWoGXwkR8qwS4ejBlJewFJeBQAAqLzY76D65MUAAAAASUVORK5CYII=";

  var img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABG0lEQVR4AbWTMWi0QBBG/+LA/hrZ5u/PHvu+Lw6s7QkBk85Nawqxuz6SUsukr84eu5QBSXoCImazDxS8DZG4Sz54MIzjY53Ff38VNXHWHDU7ZyFpmkZFUaQ8z3vVvRvN3lZ4Rjan6zolpVRCiA/97KQ5bBUeOZmZvu9VWZYqDMNPPfO0RbjjMznZT5l2vCm3aZqagiVyq3DPzvjMhdA5J3ZmCP9rYo1chRlmjRy4AEMY13V9rVtyDWYm6bc8Gzu7eHEYhrssyx6Bevnst3u+kPm+/z5fFDU9ayGnQpTneQnU9KyFRVE8mEJ61kIQQrwhAmqnHUKSJPUspHYWjuMogyB4AWpnIbRtew/UNsK4qqorXliDGWZXTTa/3hfS9r3bdRtDEgAAAABJRU5ErkJggg==";

  var img$2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABCElEQVR4AbWTAWbGQBCFi0hIBAIECkAukLOEAGEPUEULZE8RAaUEQAJoe4PkHiUHaFsWOp3HLrGVrv3X/3hWJuMz85K9uZZIe2U37CgYCG3bRm3bUpIk71x7YBeXAlfAjPZ9JykllWX5ze9GduULbDCZLaUUTdNEdV3/cM+LDzDCmpjsTDpjLz32fX8E2Ja+wAKZYc0DMFgjMrOAt2zBlg4L9NrACh/AAoplWe65JP8zejT0j16tzE4hXde9ZVn2iRPPzpxdwDRNv4gFaDBwGIbnOI4VoMETAoapnlim5gl0w7yBWAvrYU0DCwLq4AlQAwieMM/zD5yhQDHP853rx0YPet04z6v3C3dEyAkWQDzRAAAAAElFTkSuQmCC";

  var img$3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAA0klEQVR4Ae2TMQ6CQBBFLUjo6WjsuQBnIaHeAxgL7ZhjcABqKPUIcA8TbmBC4zjfYNQxuI5EK3/ymnF82f0bFt8Kj7RCJgSzhUjXdZznOYdheJDZRog+FbaQXdP3PRMRx3F8lN9KIbEKM5xMZxgGrqqK0zQ9yc7OIgxwTZxsKmPHpmyLongQKMgqjNAZrnkTzk+JzpRwKTiBPLjLrkqCB1BC1zTNWkb0CuyM0qfsVWeTEs27Pes/8T2zhEqgZn/hrx/Fg03o6rpe+WTYwa7HZf/0zi/2zDOd9wpPAAAAAElFTkSuQmCC";

  var cursors = {
      waiting: img,
      editing: img,
      point: img$1,
      node: img$1,
      line: img$2,
      polygon: img$3
  };
  /**
   * 图形绘制上下文，用来管理图形编辑的全局状态
   */
  var Context = /** @class */ (function (_super) {
      __extends(Context, _super);
      function Context(_a) {
          var gl = _a.gl, shapeConfig = _a.shapeConfig;
          var _this = _super.call(this) || this;
          _this.mode = ''; // 当前所处的编辑模式：无|标点|标线|标面
          _this.mapStatus = '';
          _this.pixDis = 3; // 用户选中要素的缓存区大小
          _this._hover = false;
          _this._gl = gl;
          _this._regl = regl_unchecked(_this._gl);
          _this._shapeConfig = shapeConfig;
          _this.color = new Color();
          return _this;
      }
      /**
       * 编辑模式切换
       * @param mode 要素类型
       */
      Context.prototype.enter = function (mode) {
          this.mode = mode;
          this.hover(this.mode, false);
      };
      Context.prototype.exit = function () {
          this.mode = Modes.IDLE;
          this.hover(this.mode, false);
      };
      Context.prototype.hover = function (type, isHover) {
          var cursor = cursors[type];
          if (!cursor) {
              this._gl.canvas.style.cursor = 'inherit';
              return;
          }
          this._hover = isHover;
          this._gl.canvas.style.cursor = "url(" + cursor + ") 9 9,auto";
      };
      Context.prototype.out = function () {
          if (!this._hover) {
              return;
          }
          this.hover(this.mode, false);
      };
      /**
       * 地图操作状态
       * @param mapStatus
       */
      Context.prototype.setMapStatus = function (mapStatus) {
          this.mapStatus = mapStatus;
      };
      return Context;
  }(Evented));

  var img$4 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAACACAYAAAB9V9ELAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZEQjBGQTEwOEI3NzExRUI4QTNCRjJBQTAyNDg0MjhDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZEQjBGQTExOEI3NzExRUI4QTNCRjJBQTAyNDg0MjhDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkRCMEZBMEU4Qjc3MTFFQjhBM0JGMkFBMDI0ODQyOEMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkRCMEZBMEY4Qjc3MTFFQjhBM0JGMkFBMDI0ODQyOEMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6wfmQYAAA59ElEQVR42uxd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";

  var dasha1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 285,
  	y: 394
  };
  var dian1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 313,
  	y: 394
  };
  var dijishi1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 341,
  	y: 394
  };
  var gaoerfu1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 397,
  	y: 394
  };
  var gonganju1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 0,
  	y: 426
  };
  var gongmu1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 28,
  	y: 426
  };
  var gongjiaozhan1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 56,
  	y: 426
  };
  var guangzhou1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 84,
  	y: 426
  };
  var haerbin1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 112,
  	y: 426
  };
  var guowaishoudu1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 140,
  	y: 426
  };
  var hangzhou1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 168,
  	y: 426
  };
  var hongb1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 196,
  	y: 426
  };
  var jiansheyinhang1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 224,
  	y: 426
  };
  var jiayouzhan1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 252,
  	y: 426
  };
  var jiuba1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 280,
  	y: 426
  };
  var jiudian1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 308,
  	y: 426
  };
  var kfc1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 336,
  	y: 426
  };
  var ktv1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 364,
  	y: 426
  };
  var kunming1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 392,
  	y: 426
  };
  var kafeiting1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 446,
  	y: 305
  };
  var lanb1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 420,
  	y: 426
  };
  var lanc1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 443,
  	y: 204
  };
  var lvb1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 436,
  	y: 333
  };
  var lvc1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 423,
  	y: 233
  };
  var lvguan1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 422,
  	y: 362
  };
  var ningbo1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 425,
  	y: 394
  };
  var nonghang1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 439,
  	y: 168
  };
  var qicheweixiu1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 425,
  	y: 265
  };
  var quxian1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 422,
  	y: 0
  };
  var shan1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 420,
  	y: 56
  };
  var shangchang1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 438,
  	y: 112
  };
  var shanghai1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 0,
  	y: 454
  };
  var shenghui1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 28,
  	y: 454
  };
  var shenyang1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 56,
  	y: 454
  };
  var simiao1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 84,
  	y: 454
  };
  var tingchechang1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 112,
  	y: 454
  };
  var wuxi1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 140,
  	y: 454
  };
  var xian1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 168,
  	y: 454
  };
  var xican1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 196,
  	y: 454
  };
  var xuexiao1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 224,
  	y: 454
  };
  var yaodian1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 252,
  	y: 454
  };
  var yinyueting1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 280,
  	y: 454
  };
  var yiyuan1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 308,
  	y: 454
  };
  var zhengfujiguan1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 336,
  	y: 454
  };
  var zhengzhou1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 364,
  	y: 454
  };
  var youju1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 392,
  	y: 454
  };
  var youlechang1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 420,
  	y: 454
  };
  var zhaoshangyinhang1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 474,
  	y: 305
  };
  var zhongcan1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 448,
  	y: 426
  };
  var zhongguoyinhang1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 448,
  	y: 454
  };
  var zhuzhai1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 471,
  	y: 204
  };
  var suzhout1 = {
  	pixelRatio: 2,
  	width: 36,
  	height: 20,
  	x: 464,
  	y: 333
  };
  var aoment1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 24,
  	x: 451,
  	y: 233
  };
  var fuzhout1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 24,
  	x: 450,
  	y: 362
  };
  var jie2 = {
  	pixelRatio: 2,
  	width: 33,
  	height: 19,
  	x: 453,
  	y: 394
  };
  var changzhout1 = {
  	pixelRatio: 2,
  	width: 25,
  	height: 24,
  	x: 476,
  	y: 426
  };
  var gaoxiongt1 = {
  	pixelRatio: 2,
  	width: 30,
  	height: 20,
  	x: 467,
  	y: 168
  };
  var jinant1 = {
  	pixelRatio: 2,
  	width: 25,
  	height: 24,
  	x: 476,
  	y: 454
  };
  var beijinga1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 478,
  	y: 362
  };
  var changzhoua1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 453,
  	y: 265
  };
  var dongguana1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 477,
  	y: 265
  };
  var dongguant1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 450,
  	y: 0
  };
  var fuzhoua1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 474,
  	y: 0
  };
  var gonghang1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 448,
  	y: 56
  };
  var gongyuan1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 472,
  	y: 56
  };
  var guangfa1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 466,
  	y: 112
  };
  var guiyanga1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 0,
  	y: 482
  };
  var guiyangt1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 24,
  	y: 482
  };
  var hefeit1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 48,
  	y: 482
  };
  var hefeia1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 72,
  	y: 482
  };
  var honga1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 96,
  	y: 482
  };
  var huaxia1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 120,
  	y: 482
  };
  var jinana1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 144,
  	y: 482
  };
  var lana1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 168,
  	y: 482
  };
  var lnqingguia1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 192,
  	y: 482
  };
  var lnqingguit1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 216,
  	y: 482
  };
  var lva1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 240,
  	y: 482
  };
  var nanchanga1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 264,
  	y: 482
  };
  var nanchangt1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 288,
  	y: 482
  };
  var nanjingdianche1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 312,
  	y: 482
  };
  var nanninga1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 336,
  	y: 482
  };
  var nanningt1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 360,
  	y: 482
  };
  var qingdaoa1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 384,
  	y: 482
  };
  var qingdaot1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 408,
  	y: 482
  };
  var shenfa1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 432,
  	y: 482
  };
  var shenzhen1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 456,
  	y: 482
  };
  var shijiazhuanga1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 480,
  	y: 482
  };
  var shijiazhuangt1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 502,
  	y: 305
  };
  var tianjint1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 501,
  	y: 426
  };
  var wulumuqit1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 501,
  	y: 454
  };
  var wuhant1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 499,
  	y: 204
  };
  var wulumuqia1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 500,
  	y: 333
  };
  var xiament1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 479,
  	y: 233
  };
  var xiamena1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 502,
  	y: 362
  };
  var xuzhoua1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 486,
  	y: 394
  };
  var xuzhout1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 497,
  	y: 168
  };
  var zhongxin1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 24,
  	x: 501,
  	y: 265
  };
  var chengdut1 = {
  	pixelRatio: 2,
  	width: 28,
  	height: 20,
  	x: 498,
  	y: 0
  };
  var wenzhout1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 22,
  	x: 496,
  	y: 56
  };
  var jiaohang1 = {
  	pixelRatio: 2,
  	width: 22,
  	height: 22,
  	x: 504,
  	y: 482
  };
  var changshat1 = {
  	pixelRatio: 2,
  	width: 23,
  	height: 20,
  	x: 503,
  	y: 233
  };
  var xianggangt1 = {
  	pixelRatio: 2,
  	width: 22,
  	height: 20,
  	x: 490,
  	y: 112
  };
  var nanjingt1 = {
  	pixelRatio: 2,
  	width: 21,
  	height: 20,
  	x: 0,
  	y: 506
  };
  var taibeit1 = {
  	pixelRatio: 2,
  	width: 21,
  	height: 20,
  	x: 21,
  	y: 506
  };
  var huaiandianche1 = {
  	pixelRatio: 2,
  	width: 23,
  	height: 18,
  	x: 42,
  	y: 506
  };
  var beijingt1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 65,
  	y: 506
  };
  var beijingw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 85,
  	y: 506
  };
  var beijingy1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 105,
  	y: 506
  };
  var changchunt1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 125,
  	y: 506
  };
  var changzhouw = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 145,
  	y: 506
  };
  var chongqingt1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 165,
  	y: 506
  };
  var daliant1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 185,
  	y: 506
  };
  var dongguanw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 205,
  	y: 506
  };
  var fuzhouw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 225,
  	y: 506
  };
  var guangzhout1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 245,
  	y: 506
  };
  var guiyangw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 265,
  	y: 506
  };
  var haerbint1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 285,
  	y: 506
  };
  var hangzhout1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 305,
  	y: 506
  };
  var hefeiw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 325,
  	y: 506
  };
  var hongw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 345,
  	y: 506
  };
  var jinanw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 365,
  	y: 506
  };
  var kunmingt1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 385,
  	y: 506
  };
  var lanw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 405,
  	y: 506
  };
  var lnqingguiw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 425,
  	y: 506
  };
  var lvw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 445,
  	y: 506
  };
  var minsheng1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 465,
  	y: 506
  };
  var nanchangw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 485,
  	y: 506
  };
  var nanningw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 505,
  	y: 506
  };
  var ningbot1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 525,
  	y: 506
  };
  var qingdaow1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 526,
  	y: 482
  };
  var qitayinhang1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 526,
  	y: 305
  };
  var shanghait1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 525,
  	y: 426
  };
  var shenyangt1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 525,
  	y: 454
  };
  var shenzhent1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 523,
  	y: 204
  };
  var shijiazhuangw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 524,
  	y: 333
  };
  var wulumuqiw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 526,
  	y: 233
  };
  var wuxit1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 526,
  	y: 362
  };
  var xiant1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 510,
  	y: 394
  };
  var zhengzhout1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 521,
  	y: 168
  };
  var xiamenw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 525,
  	y: 265
  };
  var xuzhouw1 = {
  	pixelRatio: 2,
  	width: 20,
  	height: 20,
  	x: 526,
  	y: 0
  };
  var guangda1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 16,
  	x: 520,
  	y: 56
  };
  var pufa1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 16,
  	x: 512,
  	y: 112
  };
  var xingye1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 16,
  	x: 0,
  	y: 526
  };
  var suzhoudianche1 = {
  	pixelRatio: 2,
  	width: 24,
  	height: 11,
  	x: 24,
  	y: 526
  };
  var arrowRight = {
  	pixelRatio: 2,
  	width: 23,
  	height: 11,
  	x: 48,
  	y: 526
  };
  var arrowLeft = {
  	pixelRatio: 2,
  	width: 23,
  	height: 7,
  	x: 71,
  	y: 526
  };
  var daodian1 = {
  	pixelRatio: 2,
  	width: 8,
  	height: 8,
  	x: 94,
  	y: 526
  };
  var json = {
  	"0": {
  	width: 27,
  	height: 42,
  	x: 1,
  	y: 44
  },
  	"1": {
  	pixelRatio: 2,
  	width: 28,
  	height: 28,
  	x: 369,
  	y: 394
  },
  	dasha1: dasha1,
  	dian1: dian1,
  	dijishi1: dijishi1,
  	gaoerfu1: gaoerfu1,
  	gonganju1: gonganju1,
  	gongmu1: gongmu1,
  	gongjiaozhan1: gongjiaozhan1,
  	guangzhou1: guangzhou1,
  	haerbin1: haerbin1,
  	guowaishoudu1: guowaishoudu1,
  	hangzhou1: hangzhou1,
  	hongb1: hongb1,
  	jiansheyinhang1: jiansheyinhang1,
  	jiayouzhan1: jiayouzhan1,
  	jiuba1: jiuba1,
  	jiudian1: jiudian1,
  	kfc1: kfc1,
  	ktv1: ktv1,
  	kunming1: kunming1,
  	kafeiting1: kafeiting1,
  	lanb1: lanb1,
  	lanc1: lanc1,
  	lvb1: lvb1,
  	lvc1: lvc1,
  	lvguan1: lvguan1,
  	ningbo1: ningbo1,
  	nonghang1: nonghang1,
  	qicheweixiu1: qicheweixiu1,
  	quxian1: quxian1,
  	shan1: shan1,
  	shangchang1: shangchang1,
  	shanghai1: shanghai1,
  	shenghui1: shenghui1,
  	shenyang1: shenyang1,
  	simiao1: simiao1,
  	tingchechang1: tingchechang1,
  	wuxi1: wuxi1,
  	xian1: xian1,
  	xican1: xican1,
  	xuexiao1: xuexiao1,
  	yaodian1: yaodian1,
  	yinyueting1: yinyueting1,
  	yiyuan1: yiyuan1,
  	zhengfujiguan1: zhengfujiguan1,
  	zhengzhou1: zhengzhou1,
  	youju1: youju1,
  	youlechang1: youlechang1,
  	zhaoshangyinhang1: zhaoshangyinhang1,
  	zhongcan1: zhongcan1,
  	zhongguoyinhang1: zhongguoyinhang1,
  	zhuzhai1: zhuzhai1,
  	suzhout1: suzhout1,
  	aoment1: aoment1,
  	fuzhout1: fuzhout1,
  	jie2: jie2,
  	changzhout1: changzhout1,
  	gaoxiongt1: gaoxiongt1,
  	jinant1: jinant1,
  	beijinga1: beijinga1,
  	changzhoua1: changzhoua1,
  	dongguana1: dongguana1,
  	dongguant1: dongguant1,
  	fuzhoua1: fuzhoua1,
  	gonghang1: gonghang1,
  	gongyuan1: gongyuan1,
  	guangfa1: guangfa1,
  	guiyanga1: guiyanga1,
  	guiyangt1: guiyangt1,
  	hefeit1: hefeit1,
  	hefeia1: hefeia1,
  	honga1: honga1,
  	huaxia1: huaxia1,
  	jinana1: jinana1,
  	lana1: lana1,
  	lnqingguia1: lnqingguia1,
  	lnqingguit1: lnqingguit1,
  	lva1: lva1,
  	nanchanga1: nanchanga1,
  	nanchangt1: nanchangt1,
  	nanjingdianche1: nanjingdianche1,
  	nanninga1: nanninga1,
  	nanningt1: nanningt1,
  	qingdaoa1: qingdaoa1,
  	qingdaot1: qingdaot1,
  	shenfa1: shenfa1,
  	shenzhen1: shenzhen1,
  	shijiazhuanga1: shijiazhuanga1,
  	shijiazhuangt1: shijiazhuangt1,
  	tianjint1: tianjint1,
  	wulumuqit1: wulumuqit1,
  	wuhant1: wuhant1,
  	wulumuqia1: wulumuqia1,
  	xiament1: xiament1,
  	xiamena1: xiamena1,
  	xuzhoua1: xuzhoua1,
  	xuzhout1: xuzhout1,
  	zhongxin1: zhongxin1,
  	chengdut1: chengdut1,
  	wenzhout1: wenzhout1,
  	jiaohang1: jiaohang1,
  	changshat1: changshat1,
  	xianggangt1: xianggangt1,
  	nanjingt1: nanjingt1,
  	taibeit1: taibeit1,
  	huaiandianche1: huaiandianche1,
  	beijingt1: beijingt1,
  	beijingw1: beijingw1,
  	beijingy1: beijingy1,
  	changchunt1: changchunt1,
  	changzhouw: changzhouw,
  	chongqingt1: chongqingt1,
  	daliant1: daliant1,
  	dongguanw1: dongguanw1,
  	fuzhouw1: fuzhouw1,
  	guangzhout1: guangzhout1,
  	guiyangw1: guiyangw1,
  	haerbint1: haerbint1,
  	hangzhout1: hangzhout1,
  	hefeiw1: hefeiw1,
  	hongw1: hongw1,
  	jinanw1: jinanw1,
  	kunmingt1: kunmingt1,
  	lanw1: lanw1,
  	lnqingguiw1: lnqingguiw1,
  	lvw1: lvw1,
  	minsheng1: minsheng1,
  	nanchangw1: nanchangw1,
  	nanningw1: nanningw1,
  	ningbot1: ningbot1,
  	qingdaow1: qingdaow1,
  	qitayinhang1: qitayinhang1,
  	shanghait1: shanghait1,
  	shenyangt1: shenyangt1,
  	shenzhent1: shenzhent1,
  	shijiazhuangw1: shijiazhuangw1,
  	wulumuqiw1: wulumuqiw1,
  	wuxit1: wuxit1,
  	xiant1: xiant1,
  	zhengzhout1: zhengzhout1,
  	xiamenw1: xiamenw1,
  	xuzhouw1: xuzhouw1,
  	guangda1: guangda1,
  	pufa1: pufa1,
  	xingye1: xingye1,
  	suzhoudianche1: suzhoudianche1,
  	arrowRight: arrowRight,
  	arrowLeft: arrowLeft,
  	daodian1: daodian1
  };

  var Shape = /** @class */ (function () {
      function Shape(context, featureInfo) {
          this._context = context;
          var _a = featureInfo.id, id = _a === void 0 ? '0' : _a, _b = featureInfo.lngLats, lngLats = _b === void 0 ? [] : _b, _c = featureInfo.style, style = _c === void 0 ? {} : _c;
          this._id = id === '0' ? generateUUID() : id;
          this._lngLats = this.clone(lngLats);
          this._pickColor = this._context.color.getColor(this._id);
          this.style = style;
      }
      Shape.prototype._initEvent = function () {
          // 等待拾取
          this._context.on('pick-start', this._pickStart, this);
      };
      /**
       * 拾取
       * @param pickInfo 拾取所需要的信息, 鼠标所在位置坐标和帧缓冲区
       */
      Shape.prototype._pickStart = function (pickInfo) {
          if (this._lngLats.length === 0) {
              return;
          }
          var uuid = pickInfo.uuid, type = pickInfo.type;
          // uuid与当前要素id相同，说明拾取到当前要素了
          if (uuid === this._id) {
              this._context.fire("picked:" + type, {
                  type: type,
                  feature: this
              });
          }
      };
      Shape.prototype.getId = function () {
          return this._id;
      };
      Shape.prototype.project = function (lngLats) {
          var _this = this;
          var isArray = true;
          // 不是数组先转成数组，统一处理
          if (!Array.isArray(lngLats)) {
              lngLats = [lngLats];
              isArray = false;
          }
          var points = lngLats.map(function (geo) {
              return _this._context._shapeConfig.lngLatsToPoints(geo);
          });
          if (!isArray) {
              return points.length === 0 ? null : points[0];
          }
          return points;
      };
      Shape.prototype.clone = function (lngLats) {
          if (!Array.isArray(lngLats)) {
              lngLats = [lngLats];
          }
          return lngLats.map(function (lngLat) {
              return __assign({}, lngLat);
          });
      };
      Shape.prototype.add = function () {
      };
      Shape.prototype["delete"] = function () {
      };
      Shape.prototype.update = function () {
      };
      /**
       * 坐标克隆返回，防止上层应用修改该值
       */
      Shape.prototype.getLngLats = function () {
          return this.clone(this._lngLats);
      };
      Shape.prototype.setLngLats = function (lngLats) {
          if (!Array.isArray(lngLats)) {
              lngLats = [lngLats];
          }
          this._lngLats = this.clone(lngLats);
          this.repaint();
      };
      Shape.prototype.setStyle = function (style, isRepaint) {
          if (isRepaint === void 0) { isRepaint = true; }
          this.style = __assign(__assign({}, this.style), style);
          isRepaint && this._context.fire('repaint');
      };
      Shape.prototype.setId = function (id) {
          // 目前只针对新标绘的要素进行id重设
          if (this._id.indexOf('id_') === -1) {
              return;
          }
          var oldId = this._id;
          var ids = this._id.split('_');
          var suffix = '_';
          if (ids.length > 2) {
              suffix = suffix + ids.slice(2).join('_');
          }
          else {
              suffix = '';
          }
          this._id = "" + id + suffix;
          // 改变颜色与id的对应关系
          this._context.color.changeUuid(oldId, this._id);
      };
      /**
       * 移除该要素
       */
      Shape.prototype.destroy = function () {
          this._lngLats = [];
          this._context.off('pick-start', this._pickStart, this);
          this._context.fire('repaint');
      };
      return Shape;
  }());

  var DEFAULT_INFO = {
      id: '0',
      lngLats: [],
      style: {
          code: 0,
          color: [0, 0, 0, 0]
      }
  };
  var imgWidth = 512, imgHeight = 128;
  var Point = /** @class */ (function (_super) {
      __extends(Point, _super);
      function Point(context, info) {
          if (info === void 0) { info = DEFAULT_INFO; }
          var _this = _super.call(this, context, info) || this;
          _this.featureType = 'point';
          // 初始化绘制配置
          _this._initDraw();
          // 初始化事件监听
          _this._initEvent();
          return _this;
      }
      Point.prototype._initDraw = function () {
          var _this = this;
          var _regl = this._context._regl;
          base64ToUint8Array(img$4, function (data) {
              _this.texture = _regl.texture({
                  width: imgWidth,
                  height: imgHeight,
                  data: data
              });
          });
          this.positionBuffer = _regl.buffer({
              usage: 'dynamic',
              type: 'float'
          });
          this.texCoordBuffer = _regl.buffer({
              usage: 'dynamic',
              type: 'float'
          });
          this.elements = _regl.elements({
              primitive: 'triangles',
              usage: 'dynamic',
              type: 'uint16',
              count: 0,
              length: 0
          });
      };
      Point.prototype.waiting = function (register) {
          var _this = this;
          // 地图点击事件
          var mapClick = function (lngLat, finish) {
              // 进入编辑模式
              _this._context.enter(Modes.EDITING);
              _this._lngLats = [lngLat];
              finish();
              _this._context.fire('repaint');
              _this._context.fire('draw-finish', _this);
          };
          // 鼠标在地图上移动事件
          var mapMove = function (lngLat) {
          };
          register(mapClick, mapMove);
      };
      Point.prototype.repaint = function () {
          if (this._lngLats.length < 1) {
              return;
          }
          // 经纬度转屏幕像素坐标
          var points = this.project(this._lngLats);
          var _a = this.style.code, code = _a === void 0 ? '0' : _a;
          var _b = json[code], width = _b.width, height = _b.height, texCoordX = _b.x, texCoordY = _b.y;
          var ratio = window.devicePixelRatio;
          var halfWidth = width / 2;
          // 顶点位置平铺成一维的
          var positions = [];
          var point = points[0];
          // 推算出四角点坐标，使得经纬度位置正好处于图标的正中下方
          for (var p = 0; p < 4; p++) {
              var cornerX = point[0] + ((-1) * Math.pow(-1, p % 2)) * (halfWidth / ratio);
              var cornerY = point[1] + (Math.floor(p / 2) - 1) * (height / ratio);
              positions.push(cornerX, cornerY);
          }
          // 更新缓冲区
          // 顶点更新
          this.positionBuffer(positions);
          // 纹理坐标更新
          var texCoords = [];
          for (var t = 0; t < 4; t++) {
              var x = texCoordX + width * (t % 2);
              var y = texCoordY + height * Math.floor(t / 2);
              texCoords.push(x / imgWidth, y / imgHeight);
          }
          this.texCoordBuffer(texCoords);
          // 索引更新
          var indices = [0, 1, 2, 2, 1, 3];
          this.elements(indices);
      };
      Point.prototype.select = function () {
      };
      Point.prototype.unselect = function () {
      };
      return Point;
  }(Shape));

  var Node = /** @class */ (function (_super) {
      __extends(Node, _super);
      function Node(context, info) {
          var _this = _super.call(this, context, info) || this;
          // 依附的要素ID集合
          _this.attachIds = [];
          _this.featureType = 'node';
          _this.attachIds.push(info.attachId);
          // 初始化绘制配置
          _this._initDraw();
          // 初始化事件监听
          _this._initEvent();
          return _this;
      }
      Node.prototype._initDraw = function () {
          this.positionBuffer = this._context._regl.buffer({
              usage: 'dynamic',
              type: 'float'
          });
      };
      Node.prototype.waiting = function () { };
      Node.prototype.repaint = function () {
          if (this._lngLats.length < 1) {
              return;
          }
          // 经纬度转屏幕像素坐标
          var points = this.project(this._lngLats);
          // 顶点位置平铺成一维的
          var positions = [];
          for (var p = 0; p < points.length; p++) {
              var point = points[p];
              positions.push.apply(positions, point);
          }
          // 更新缓冲区
          // 顶点更新
          this.positionBuffer(positions);
      };
      Node.prototype.unselect = function () {
      };
      Node.prototype.select = function () {
      };
      return Node;
  }(Shape));

  var DEFAULT_INFO$1 = {
      id: '0',
      lngLats: [],
      style: {
          width: 3,
          color: [255, 255, 255, 255]
      }
  };
  var Line = /** @class */ (function (_super) {
      __extends(Line, _super);
      function Line(context, info) {
          if (info === void 0) { info = DEFAULT_INFO$1; }
          var _this = _super.call(this, context, info) || this;
          _this.nodes = [];
          _this.featureType = 'line';
          // 初始化绘制配置
          _this._initDraw();
          // 初始化事件监听
          _this._initEvent();
          return _this;
      }
      Line.prototype._initDraw = function () {
          var _regl = this._context._regl;
          this.positionBuffer = _regl.buffer({
              usage: 'dynamic',
              type: 'float'
          });
          this.offsetBuffer = _regl.buffer({
              usage: 'dynamic',
              type: 'float'
          });
          this.elements = _regl.elements({
              primitive: 'triangles',
              usage: 'dynamic',
              type: 'uint16',
              count: 0,
              length: 0
          });
      };
      /**
       * 标线处于等待标绘的状态
       * @param register 注册鼠标点击和移动
       */
      Line.prototype.waiting = function (register) {
          var _this = this;
          // 地图点击事件
          var mapClick = function (lngLat, finish) {
              // 进入编辑模式
              _this._context.enter(Modes.EDITING);
              var len = _this._lngLats.length;
              if (len > 1) {
                  var lastLngLat = _this._lngLats[len - 2];
                  var lastPoint = _this.project(lastLngLat);
                  var currentPoint = _this.project(lngLat);
                  var xDis = Math.abs(lastPoint[0] - currentPoint[0]);
                  var yDis = Math.abs(lastPoint[1] - currentPoint[1]);
                  // 最后一个点点击的位置相同即完成绘制
                  // 之后需要添加缓冲区，只要点击到缓冲区内，就代表绘制结束
                  if (xDis <= _this._context.pixDis && yDis <= _this._context.pixDis) {
                      // 移除最后一个移动点
                      _this._lngLats.splice(len - 1, 1);
                      _this.nodes.splice(len - 1, 1);
                      _this.nodes[_this.nodes.length - 1].style.size = 18;
                      // 完成绘制的回调函数
                      finish();
                      _this._context.fire('draw-finish', _this);
                      return;
                  }
                  else {
                      _this._lngLats[len - 1] = lngLat;
                      _this.nodes[len - 1].setLngLats(lngLat);
                  }
              }
              else {
                  // 首次绘制，需要为线添加两个点
                  _this._lngLats.push(lngLat);
                  // 节点
                  var lastIndex_1 = _this._lngLats.length - 1;
                  _this.createNode(lngLat, lastIndex_1);
              }
              // 添加移动点
              _this._lngLats.push(lngLat);
              // 节点
              var lastIndex = _this._lngLats.length - 1;
              _this.createNode(lngLat, lastIndex);
          };
          // 鼠标在地图上移动事件
          var mapMove = function (lngLat) {
              var len = _this._lngLats.length;
              if (len === 0) {
                  return;
              }
              _this._lngLats[len - 1] = lngLat;
              _this.nodes[len - 1].setLngLats(lngLat);
          };
          // 注册监听函数
          register(mapClick, mapMove);
      };
      Line.prototype.createNode = function (lngLat, index) {
          // 节点
          var node = new Node(this._context, {
              id: this._id + "_node_" + index,
              attachId: this._id,
              lngLats: [lngLat],
              style: {
                  color: [255, 255, 255, 255],
                  size: 14.0
              }
          });
          this.nodes.push(node);
          return node;
      };
      Line.prototype.nodeRestyle = function () {
          var lastIndex = this.nodes.length - 1;
          // 重新计算node的size
          this.nodes.forEach(function (node, index) {
              var size = 14.0;
              if (index === 0 || index === lastIndex) {
                  size = 18.0;
              }
              node.setStyle({
                  size: size
              }, false);
          });
      };
      Line.prototype.repaint = function () {
          if (this._lngLats.length < 2) {
              return;
          }
          else if (this._lngLats.length === 2) {
              if (this._lngLats[0] === this._lngLats[1]) {
                  return;
              }
          }
          // 经纬度转屏幕像素坐标
          var points = this.project(this._lngLats);
          var len = points.length;
          // 顶点位置平铺成一维的
          var positions = [];
          for (var p = 0; p < points.length; p++) {
              var point = points[p];
              positions.push.apply(positions, point);
          }
          // 以 1，2，3三个顶点为例
          // 复制最后一个顶点，放到最后面：1，2，3，3
          buffer.pushElement(positions, len - 1, 2);
          // 复制第一个顶点，放到最前面：1，1，2，3，3
          buffer.unshiftElement(positions, 0, 2);
          // 所有顶点挨个复制，1，1，2，3，3 -> 1，1，1，1，2，2，3，3，3，3
          var positionsDup = new Float32Array(buffer.duplicate(positions, 2));
          // 法向量两侧反向
          var offset = new Array(len).fill(1);
          var offsetDup = buffer.duplicate(offset, 1, -1);
          var indices = links.lineMesh([], len, 0);
          // 更新缓冲区
          // 顶点更新
          this.positionBuffer(positionsDup);
          // 法向量方向更新
          this.offsetBuffer(offsetDup);
          // 索引更新
          this.elements(indices);
          // 重新设置每个节点的样式
          this.nodeRestyle();
      };
      /**
       * 点击的是空白区域, 只保留首尾节点
       */
      Line.prototype.unselect = function () {
          if (this.nodes.length < 2) {
              return;
          }
          var first = this.nodes[0];
          var last = this.nodes[this.nodes.length - 1];
          first.setId(this._id + "_node_0");
          last.setId(this._id + "_node_1");
          this.nodes = [first, last];
          // 重绘
          this._context.fire('repaint');
      };
      /**
       * 要素被选中
       */
      Line.prototype.select = function () {
          var _this = this;
          this.nodes = [];
          this._lngLats.forEach(function (lngLat, index) {
              var node = _this.createNode(lngLat, index);
              if (index === 0 || index === _this._lngLats.length - 1) {
                  node.setStyle({
                      size: 18
                  }, false);
              }
          });
          // 重绘
          this._context.fire('repaint');
      };
      return Line;
  }(Shape));

  var earcut_1 = earcut;
  var _default = earcut;

  function earcut(data, holeIndices, dim) {

      dim = dim || 2;

      var hasHoles = holeIndices && holeIndices.length,
          outerLen = hasHoles ? holeIndices[0] * dim : data.length,
          outerNode = linkedList(data, 0, outerLen, dim, true),
          triangles = [];

      if (!outerNode || outerNode.next === outerNode.prev) return triangles;

      var minX, minY, maxX, maxY, x, y, invSize;

      if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

      // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
      if (data.length > 80 * dim) {
          minX = maxX = data[0];
          minY = maxY = data[1];

          for (var i = dim; i < outerLen; i += dim) {
              x = data[i];
              y = data[i + 1];
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
          }

          // minX, minY and invSize are later used to transform coords into integers for z-order calculation
          invSize = Math.max(maxX - minX, maxY - minY);
          invSize = invSize !== 0 ? 1 / invSize : 0;
      }

      earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

      return triangles;
  }

  // create a circular doubly linked list from polygon points in the specified winding order
  function linkedList(data, start, end, dim, clockwise) {
      var i, last;

      if (clockwise === (signedArea(data, start, end, dim) > 0)) {
          for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
      } else {
          for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
      }

      if (last && equals(last, last.next)) {
          removeNode(last);
          last = last.next;
      }

      return last;
  }

  // eliminate colinear or duplicate points
  function filterPoints(start, end) {
      if (!start) return start;
      if (!end) end = start;

      var p = start,
          again;
      do {
          again = false;

          if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
              removeNode(p);
              p = end = p.prev;
              if (p === p.next) break;
              again = true;

          } else {
              p = p.next;
          }
      } while (again || p !== end);

      return end;
  }

  // main ear slicing loop which triangulates a polygon (given as a linked list)
  function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
      if (!ear) return;

      // interlink polygon nodes in z-order
      if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

      var stop = ear,
          prev, next;

      // iterate through ears, slicing them one by one
      while (ear.prev !== ear.next) {
          prev = ear.prev;
          next = ear.next;

          if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
              // cut off the triangle
              triangles.push(prev.i / dim);
              triangles.push(ear.i / dim);
              triangles.push(next.i / dim);

              removeNode(ear);

              // skipping the next vertex leads to less sliver triangles
              ear = next.next;
              stop = next.next;

              continue;
          }

          ear = next;

          // if we looped through the whole remaining polygon and can't find any more ears
          if (ear === stop) {
              // try filtering points and slicing again
              if (!pass) {
                  earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

              // if this didn't work, try curing all small self-intersections locally
              } else if (pass === 1) {
                  ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                  earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

              // as a last resort, try splitting the remaining polygon into two
              } else if (pass === 2) {
                  splitEarcut(ear, triangles, dim, minX, minY, invSize);
              }

              break;
          }
      }
  }

  // check whether a polygon node forms a valid ear with adjacent nodes
  function isEar(ear) {
      var a = ear.prev,
          b = ear,
          c = ear.next;

      if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

      // now make sure we don't have other points inside the potential ear
      var p = ear.next.next;

      while (p !== ear.prev) {
          if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
              area(p.prev, p, p.next) >= 0) return false;
          p = p.next;
      }

      return true;
  }

  function isEarHashed(ear, minX, minY, invSize) {
      var a = ear.prev,
          b = ear,
          c = ear.next;

      if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

      // triangle bbox; min & max are calculated like this for speed
      var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
          minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
          maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
          maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

      // z-order range for the current triangle bbox;
      var minZ = zOrder(minTX, minTY, minX, minY, invSize),
          maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

      var p = ear.prevZ,
          n = ear.nextZ;

      // look for points inside the triangle in both directions
      while (p && p.z >= minZ && n && n.z <= maxZ) {
          if (p !== ear.prev && p !== ear.next &&
              pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
              area(p.prev, p, p.next) >= 0) return false;
          p = p.prevZ;

          if (n !== ear.prev && n !== ear.next &&
              pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
              area(n.prev, n, n.next) >= 0) return false;
          n = n.nextZ;
      }

      // look for remaining points in decreasing z-order
      while (p && p.z >= minZ) {
          if (p !== ear.prev && p !== ear.next &&
              pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
              area(p.prev, p, p.next) >= 0) return false;
          p = p.prevZ;
      }

      // look for remaining points in increasing z-order
      while (n && n.z <= maxZ) {
          if (n !== ear.prev && n !== ear.next &&
              pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
              area(n.prev, n, n.next) >= 0) return false;
          n = n.nextZ;
      }

      return true;
  }

  // go through all polygon nodes and cure small local self-intersections
  function cureLocalIntersections(start, triangles, dim) {
      var p = start;
      do {
          var a = p.prev,
              b = p.next.next;

          if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

              triangles.push(a.i / dim);
              triangles.push(p.i / dim);
              triangles.push(b.i / dim);

              // remove two nodes involved
              removeNode(p);
              removeNode(p.next);

              p = start = b;
          }
          p = p.next;
      } while (p !== start);

      return filterPoints(p);
  }

  // try splitting polygon into two and triangulate them independently
  function splitEarcut(start, triangles, dim, minX, minY, invSize) {
      // look for a valid diagonal that divides the polygon into two
      var a = start;
      do {
          var b = a.next.next;
          while (b !== a.prev) {
              if (a.i !== b.i && isValidDiagonal(a, b)) {
                  // split the polygon in two by the diagonal
                  var c = splitPolygon(a, b);

                  // filter colinear points around the cuts
                  a = filterPoints(a, a.next);
                  c = filterPoints(c, c.next);

                  // run earcut on each half
                  earcutLinked(a, triangles, dim, minX, minY, invSize);
                  earcutLinked(c, triangles, dim, minX, minY, invSize);
                  return;
              }
              b = b.next;
          }
          a = a.next;
      } while (a !== start);
  }

  // link every hole into the outer loop, producing a single-ring polygon without holes
  function eliminateHoles(data, holeIndices, outerNode, dim) {
      var queue = [],
          i, len, start, end, list;

      for (i = 0, len = holeIndices.length; i < len; i++) {
          start = holeIndices[i] * dim;
          end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
          list = linkedList(data, start, end, dim, false);
          if (list === list.next) list.steiner = true;
          queue.push(getLeftmost(list));
      }

      queue.sort(compareX);

      // process holes from left to right
      for (i = 0; i < queue.length; i++) {
          eliminateHole(queue[i], outerNode);
          outerNode = filterPoints(outerNode, outerNode.next);
      }

      return outerNode;
  }

  function compareX(a, b) {
      return a.x - b.x;
  }

  // find a bridge between vertices that connects hole with an outer ring and and link it
  function eliminateHole(hole, outerNode) {
      outerNode = findHoleBridge(hole, outerNode);
      if (outerNode) {
          var b = splitPolygon(outerNode, hole);

          // filter collinear points around the cuts
          filterPoints(outerNode, outerNode.next);
          filterPoints(b, b.next);
      }
  }

  // David Eberly's algorithm for finding a bridge between hole and outer polygon
  function findHoleBridge(hole, outerNode) {
      var p = outerNode,
          hx = hole.x,
          hy = hole.y,
          qx = -Infinity,
          m;

      // find a segment intersected by a ray from the hole's leftmost point to the left;
      // segment's endpoint with lesser x will be potential connection point
      do {
          if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
              var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
              if (x <= hx && x > qx) {
                  qx = x;
                  if (x === hx) {
                      if (hy === p.y) return p;
                      if (hy === p.next.y) return p.next;
                  }
                  m = p.x < p.next.x ? p : p.next;
              }
          }
          p = p.next;
      } while (p !== outerNode);

      if (!m) return null;

      if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

      // look for points inside the triangle of hole point, segment intersection and endpoint;
      // if there are no points found, we have a valid connection;
      // otherwise choose the point of the minimum angle with the ray as connection point

      var stop = m,
          mx = m.x,
          my = m.y,
          tanMin = Infinity,
          tan;

      p = m;

      do {
          if (hx >= p.x && p.x >= mx && hx !== p.x &&
                  pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

              tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

              if (locallyInside(p, hole) &&
                  (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                  m = p;
                  tanMin = tan;
              }
          }

          p = p.next;
      } while (p !== stop);

      return m;
  }

  // whether sector in vertex m contains sector in vertex p in the same coordinates
  function sectorContainsSector(m, p) {
      return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
  }

  // interlink polygon nodes in z-order
  function indexCurve(start, minX, minY, invSize) {
      var p = start;
      do {
          if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
          p.prevZ = p.prev;
          p.nextZ = p.next;
          p = p.next;
      } while (p !== start);

      p.prevZ.nextZ = null;
      p.prevZ = null;

      sortLinked(p);
  }

  // Simon Tatham's linked list merge sort algorithm
  // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
  function sortLinked(list) {
      var i, p, q, e, tail, numMerges, pSize, qSize,
          inSize = 1;

      do {
          p = list;
          list = null;
          tail = null;
          numMerges = 0;

          while (p) {
              numMerges++;
              q = p;
              pSize = 0;
              for (i = 0; i < inSize; i++) {
                  pSize++;
                  q = q.nextZ;
                  if (!q) break;
              }
              qSize = inSize;

              while (pSize > 0 || (qSize > 0 && q)) {

                  if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                      e = p;
                      p = p.nextZ;
                      pSize--;
                  } else {
                      e = q;
                      q = q.nextZ;
                      qSize--;
                  }

                  if (tail) tail.nextZ = e;
                  else list = e;

                  e.prevZ = tail;
                  tail = e;
              }

              p = q;
          }

          tail.nextZ = null;
          inSize *= 2;

      } while (numMerges > 1);

      return list;
  }

  // z-order of a point given coords and inverse of the longer side of data bbox
  function zOrder(x, y, minX, minY, invSize) {
      // coords are transformed into non-negative 15-bit integer range
      x = 32767 * (x - minX) * invSize;
      y = 32767 * (y - minY) * invSize;

      x = (x | (x << 8)) & 0x00FF00FF;
      x = (x | (x << 4)) & 0x0F0F0F0F;
      x = (x | (x << 2)) & 0x33333333;
      x = (x | (x << 1)) & 0x55555555;

      y = (y | (y << 8)) & 0x00FF00FF;
      y = (y | (y << 4)) & 0x0F0F0F0F;
      y = (y | (y << 2)) & 0x33333333;
      y = (y | (y << 1)) & 0x55555555;

      return x | (y << 1);
  }

  // find the leftmost node of a polygon ring
  function getLeftmost(start) {
      var p = start,
          leftmost = start;
      do {
          if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
          p = p.next;
      } while (p !== start);

      return leftmost;
  }

  // check if a point lies within a convex triangle
  function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
      return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
             (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
             (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
  }

  // check if a diagonal between two polygon nodes is valid (lies in polygon interior)
  function isValidDiagonal(a, b) {
      return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
             (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
              (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
              equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
  }

  // signed area of a triangle
  function area(p, q, r) {
      return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  }

  // check if two points are equal
  function equals(p1, p2) {
      return p1.x === p2.x && p1.y === p2.y;
  }

  // check if two segments intersect
  function intersects(p1, q1, p2, q2) {
      var o1 = sign(area(p1, q1, p2));
      var o2 = sign(area(p1, q1, q2));
      var o3 = sign(area(p2, q2, p1));
      var o4 = sign(area(p2, q2, q1));

      if (o1 !== o2 && o3 !== o4) return true; // general case

      if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
      if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
      if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
      if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

      return false;
  }

  // for collinear points p, q, r, check if point q lies on segment pr
  function onSegment(p, q, r) {
      return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
  }

  function sign(num) {
      return num > 0 ? 1 : num < 0 ? -1 : 0;
  }

  // check if a polygon diagonal intersects any polygon segments
  function intersectsPolygon(a, b) {
      var p = a;
      do {
          if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                  intersects(p, p.next, a, b)) return true;
          p = p.next;
      } while (p !== a);

      return false;
  }

  // check if a polygon diagonal is locally inside the polygon
  function locallyInside(a, b) {
      return area(a.prev, a, a.next) < 0 ?
          area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
          area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
  }

  // check if the middle point of a polygon diagonal is inside the polygon
  function middleInside(a, b) {
      var p = a,
          inside = false,
          px = (a.x + b.x) / 2,
          py = (a.y + b.y) / 2;
      do {
          if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                  (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
              inside = !inside;
          p = p.next;
      } while (p !== a);

      return inside;
  }

  // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
  // if one belongs to the outer ring and another to a hole, it merges it into a single ring
  function splitPolygon(a, b) {
      var a2 = new Node$1(a.i, a.x, a.y),
          b2 = new Node$1(b.i, b.x, b.y),
          an = a.next,
          bp = b.prev;

      a.next = b;
      b.prev = a;

      a2.next = an;
      an.prev = a2;

      b2.next = a2;
      a2.prev = b2;

      bp.next = b2;
      b2.prev = bp;

      return b2;
  }

  // create a node and optionally link it with previous one (in a circular doubly linked list)
  function insertNode(i, x, y, last) {
      var p = new Node$1(i, x, y);

      if (!last) {
          p.prev = p;
          p.next = p;

      } else {
          p.next = last.next;
          p.prev = last;
          last.next.prev = p;
          last.next = p;
      }
      return p;
  }

  function removeNode(p) {
      p.next.prev = p.prev;
      p.prev.next = p.next;

      if (p.prevZ) p.prevZ.nextZ = p.nextZ;
      if (p.nextZ) p.nextZ.prevZ = p.prevZ;
  }

  function Node$1(i, x, y) {
      // vertex index in coordinates array
      this.i = i;

      // vertex coordinates
      this.x = x;
      this.y = y;

      // previous and next vertex nodes in a polygon ring
      this.prev = null;
      this.next = null;

      // z-order curve value
      this.z = null;

      // previous and next nodes in z-order
      this.prevZ = null;
      this.nextZ = null;

      // indicates whether this is a steiner point
      this.steiner = false;
  }

  // return a percentage difference between the polygon area and its triangulation area;
  // used to verify correctness of triangulation
  earcut.deviation = function (data, holeIndices, dim, triangles) {
      var hasHoles = holeIndices && holeIndices.length;
      var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

      var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
      if (hasHoles) {
          for (var i = 0, len = holeIndices.length; i < len; i++) {
              var start = holeIndices[i] * dim;
              var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
              polygonArea -= Math.abs(signedArea(data, start, end, dim));
          }
      }

      var trianglesArea = 0;
      for (i = 0; i < triangles.length; i += 3) {
          var a = triangles[i] * dim;
          var b = triangles[i + 1] * dim;
          var c = triangles[i + 2] * dim;
          trianglesArea += Math.abs(
              (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
              (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
      }

      return polygonArea === 0 && trianglesArea === 0 ? 0 :
          Math.abs((trianglesArea - polygonArea) / polygonArea);
  };

  function signedArea(data, start, end, dim) {
      var sum = 0;
      for (var i = start, j = end - dim; i < end; i += dim) {
          sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
          j = i;
      }
      return sum;
  }

  // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
  earcut.flatten = function (data) {
      var dim = data[0][0].length,
          result = {vertices: [], holes: [], dimensions: dim},
          holeIndex = 0;

      for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
              for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
          }
          if (i > 0) {
              holeIndex += data[i - 1].length;
              result.holes.push(holeIndex);
          }
      }
      return result;
  };
  earcut_1.default = _default;

  var DEFAULT_INFO$2 = { id: '0', lngLats: [], style: { color: [255, 0, 0, 120] } };
  var Polygon = /** @class */ (function (_super) {
      __extends(Polygon, _super);
      /**
       *
       * @param context
       * @param info  { id: '0', lngLats: [], style: { color: [255, 0, 0, 120] }}
       */
      function Polygon(context, info) {
          if (info === void 0) { info = DEFAULT_INFO$2; }
          var _this = _super.call(this, context, info) || this;
          _this.nodes = [];
          _this.featureType = 'polygon';
          var lineId = _this._id + "_border";
          _this._line = new Line(context, { id: lineId, lngLats: _this._lngLats, style: { width: 2, color: _this.style.color } });
          // 初始化事件监听
          _this._initEvent();
          // 初始化绘制配置
          _this._initDraw();
          return _this;
      }
      Polygon.prototype._initDraw = function () {
          var _regl = this._context._regl;
          this.positionBuffer = _regl.buffer({
              usage: 'dynamic',
              type: 'float'
          });
          this.elements = _regl.elements({
              primitive: 'triangles',
              usage: 'dynamic',
              type: 'uint16',
              count: 0,
              length: 0
          });
      };
      /**
       * 标线处于等待标绘的状态
       * @param register 注册鼠标点击和移动
       */
      Polygon.prototype.waiting = function (register) {
          var _this = this;
          // 地图点击事件
          var mapClick = function (lngLat, finish) {
              // 进入编辑模式
              _this._context.enter(Modes.EDITING);
              var len = _this._lngLats.length;
              if (len > 1) {
                  // 最后一个点
                  var lastLngLat = _this._lngLats[len - 3];
                  // 最后一个点点击的位置相同即完成绘制
                  // 之后需要添加缓冲区，只要点击到缓冲区内，就代表绘制结束
                  var lastPoint = _this.project(lastLngLat);
                  var currentPoint = _this.project(lngLat);
                  var xDis = Math.abs(lastPoint[0] - currentPoint[0]);
                  var yDis = Math.abs(lastPoint[1] - currentPoint[1]);
                  if (xDis <= _this._context.pixDis && yDis <= _this._context.pixDis) {
                      // 移除移动点
                      _this._lngLats.splice(len - 2, 1);
                      // 更新边框坐标
                      _this._line.setLngLats(_this._lngLats);
                      // 完成绘制的回调函数
                      finish();
                      // 通知外层接口
                      _this._context.fire('draw-finish', _this);
                      return;
                  }
              }
              else {
                  // 首次绘制，需要为面添加三个点
                  // 移动点
                  _this._lngLats.push(lngLat);
                  // 末尾点
                  _this._lngLats.push(lngLat);
              }
              len = _this._lngLats.length;
              // 本次需要插入的点
              _this._lngLats.splice(len - 2, 0, lngLat);
              _this._line.setLngLats(_this._lngLats);
          };
          // 鼠标在地图上移动事件
          var mapMove = function (lngLat) {
              var len = _this._lngLats.length;
              if (len === 0) {
                  return;
              }
              _this._lngLats[len - 2] = lngLat;
              _this._line.setLngLats(_this._lngLats);
          };
          // 注册监听函数
          register(mapClick, mapMove);
      };
      Polygon.prototype.repaint = function () {
          if (this._lngLats.length < 2) {
              return;
          }
          else if (this._lngLats.length === 3) {
              // 三点重合
              if (this._lngLats[0] === this._lngLats[1]
                  && this._lngLats[1] === this._lngLats[2]) {
                  return;
              }
          }
          // 经纬度转屏幕像素坐标
          var points = this.project(this._lngLats);
          // 顶点位置平铺成一维的
          var positions = [];
          for (var p = 0; p < points.length; p++) {
              var point = points[p];
              positions.push.apply(positions, point);
          }
          var indices = earcut_1(positions);
          if (indices.length === 0) {
              indices = [0, 1, 2];
          }
          // 更新缓冲区
          // 顶点更新
          this.positionBuffer(positions);
          // 索引更新
          this.elements(indices);
      };
      Polygon.prototype.unselect = function () {
      };
      Polygon.prototype.select = function () {
      };
      return Polygon;
  }(Shape));

  var pointVert = "#define GLSLIFY 1\nuniform mat3 model;attribute vec2 aPosition;attribute vec2 aTexCoord;varying vec2 uv;void main(){vec3 position=model*vec3(aPosition,1.0);gl_Position=vec4(position.xy,0.0,1.0);uv=aTexCoord;}"; // eslint-disable-line

  var pointFrag = "precision mediump float;\n#define GLSLIFY 1\nuniform sampler2D texture;uniform bool fbo;uniform vec4 color;varying vec2 uv;void main(){if(fbo){gl_FragColor=color/255.0;}else{gl_FragColor=texture2D(texture,uv);}}"; // eslint-disable-line

  var lineVert = "#define GLSLIFY 1\nuniform mat3 model;uniform float thickness;uniform int miter;uniform float aspect;uniform float height;attribute vec2 prevPosition;attribute vec2 currPosition;attribute vec2 nextPosition;attribute float offsetScale;void main(){vec2 aspectVec=vec2(aspect,1.0);vec2 prevProject=(model*vec3(prevPosition,1.0)).xy;vec2 currProject=(model*vec3(currPosition,1.0)).xy;vec2 nextProject=(model*vec3(nextPosition,1.0)).xy;vec2 prevScreen=prevProject*aspectVec;vec2 currScreen=currProject*aspectVec;vec2 nextScreen=nextProject*aspectVec;float len=thickness;vec2 dir=vec2(0.0);if(currScreen==prevScreen){dir=normalize(nextScreen-currScreen);}else if(currScreen==nextScreen){dir=normalize(currScreen-prevScreen);}else{vec2 dirA=normalize((currScreen-prevScreen));if(miter==1){vec2 dirB=normalize((nextScreen-currScreen));float cosin=dot(dirA,dirB);if(cosin<-0.995){dir=dirB;}else{vec2 tangent=normalize(dirA+dirB);vec2 perp=vec2(-dirA.y,dirA.x);vec2 miter=vec2(-tangent.y,tangent.x);dir=tangent;len=thickness/dot(miter,perp);}}else{dir=dirA;}}vec2 normal=vec2(-dir.y,dir.x)*len;normal.y/=height;normal.x/=height*aspect/2.0;normal.x/=aspect;vec4 offset=vec4(normal*offsetScale,0.0,0.0);gl_Position=vec4(currProject,0.0,1.0)+offset;}"; // eslint-disable-line

  var lineFrag = "precision mediump float;\n#define GLSLIFY 1\nuniform vec4 color;void main(){gl_FragColor=color/255.0;}"; // eslint-disable-line

  var polygonVert = "#define GLSLIFY 1\nuniform mat3 model;attribute vec2 aPosition;void main(){vec3 position=model*vec3(aPosition,1.0);gl_Position=vec4(position.xy,0.0,1.0);}"; // eslint-disable-line

  var polygonFrag = "precision mediump float;\n#define GLSLIFY 1\nuniform vec4 color;void main(){gl_FragColor=color/255.0;}"; // eslint-disable-line

  var nodeVert = "#define GLSLIFY 1\nuniform mat3 model;uniform float size;attribute vec2 aPosition;void main(){vec3 position=model*vec3(aPosition,1.0);gl_Position=vec4(position.xy,0.0,1.0);gl_PointSize=size;}"; // eslint-disable-line

  var nodeFrag = "precision mediump float;\n#define GLSLIFY 1\nuniform vec4 color;void main(){float dist=distance(gl_PointCoord,vec2(0.5,0.5));float smooth1=smoothstep(0.55,0.45,dist);float smooth2=smoothstep(0.45,0.4,dist);gl_FragColor=vec4(0,0,0,1)*smooth1*(1.0-smooth2)+color/255.0*smooth2;}"; // eslint-disable-line

  var _a;
  // 要素类型对应的要素类
  var featureClasses = (_a = {},
      _a[FeatureType.POLYGON] = Polygon,
      _a[FeatureType.BORDER] = Line,
      _a[FeatureType.LINE] = Line,
      _a[FeatureType.NODE] = Node,
      _a[FeatureType.POINT] = Point,
      _a);
  var FLOAT_BYTES = Float32Array.BYTES_PER_ELEMENT;
  var Editor = /** @class */ (function () {
      function Editor(gl, shapeConfig) {
          var _a;
          this._features = {};
          this._featureProps = {};
          this._fboFeatureProps = {};
          this._drawCommand = (_a = {},
              _a[FeatureType.POLYGON] = null,
              _a[FeatureType.BORDER] = null,
              _a[FeatureType.LINE] = null,
              _a[FeatureType.NODE] = null,
              _a[FeatureType.POINT] = null,
              _a);
          // 当前被选中的要素
          this._pickedFeature = null;
          // 重绘
          this._tick = null;
          // 拾取定时器，防止频繁拾取
          this._pickTick = null;
          this._context = new Context({
              gl: gl,
              shapeConfig: shapeConfig
          });
          // 初始化变量
          this._init();
          // 事件监听初始化
          this._initializeEvent();
          // 预编译图形绘制命令
          this._initializeDrawCommand();
      }
      /**
       * 初始化变量
       */
      Editor.prototype._init = function () {
          var _this = this;
          Object.values(FeatureType).forEach(function (featureType) {
              _this._features[featureType] = [];
              _this._featureProps[featureType] = [];
              _this._fboFeatureProps[featureType] = [];
          });
          this._newFeature = null;
      };
      /**
       * 事件监听
       */
      Editor.prototype._initializeEvent = function () {
          var _this = this;
          // 窗口变化，重置viewport
          window.addEventListener('resize', function () {
              _this._isPoll = true;
          });
          // 重绘
          this._context.on('repaint', this.repaint, this);
          // 绘制完成
          this._context.on('draw-finish', this._drawFinish, this);
          this._context.on('picked:click', this._pickedClick, this);
          // 悬浮拾取到元素
          this._context.on('picked:mousemove', this._pickedHover, this);
          // 未拾取到元素
          this._context.on('picked:mouseout', this._pickedOut, this);
          // 点击的是画布空白区域
          this._context.on('picked:clickout', this._pickedClickout, this);
          // 画布点击事件
          this._context._gl.canvas.addEventListener('click', this.pickEvent.bind(this));
          // 悬浮高亮拾取
          this._context._gl.canvas.addEventListener('mousemove', function (event) {
              if (_this._pickTick) {
                  clearTimeout(_this._pickTick);
              }
              _this._pickTick = setTimeout(function () {
                  _this.pickEvent(event);
                  _this._pickTick = null;
              }, 30);
          });
      };
      /**
       * 拾取事件
       * @param event 点击拾取|悬浮拾取
       */
      Editor.prototype.pickEvent = function (event) {
          var _this = this;
          var evt = event;
          var clientX = evt.clientX, clientY = evt.clientY, type = evt.type;
          var _a = this._context, _gl = _a._gl, _regl = _a._regl, mapStatus = _a.mapStatus, mode = _a.mode;
          // 等待，编辑状态，不允许点击拾取
          if ((mode === Modes.WATING || mode === Modes.EDITING) && type === 'click') {
              return;
          }
          // 底图移动，不触发点击拾取动作
          if (mapStatus === 'movestart' && type === 'click') {
              this._context.setMapStatus('');
              return;
          }
          // 设备像素比
          var dpr = window.devicePixelRatio;
          var target = evt.target;
          var rect = target.getBoundingClientRect();
          var x = dpr * (clientX - rect.left);
          var y = _gl.drawingBufferHeight - dpr * (clientY - rect.top);
          // 创建帧缓冲区
          var fbo = _regl.framebuffer({
              width: _regl._gl.drawingBufferWidth,
              height: _regl._gl.drawingBufferHeight,
              depth: false,
              stencil: false,
              depthStencil: false
          });
          // 使用帧缓冲区
          _regl({ framebuffer: fbo })(function () {
              // 重绘图形到fbo
              _this.repaint({ fbo: true, drawing: false });
              // 拾取鼠标点击位置的颜色
              var rgba = _regl.read({
                  x: x,
                  y: y,
                  width: 1,
                  height: 1
              });
              // 销毁帧缓冲区
              fbo.destroy();
              // 颜色分量组成的key
              var colorKey = rgba.join('-');
              // 颜色key对应的uuid
              var uuid = _this._context.color.getUUID(colorKey);
              // 拾取到要素了
              if (uuid) {
                  // 去查找拾取到哪个要素了
                  _this._context.fire('pick-start', { uuid: uuid, type: type });
              }
              else {
                  if (type === 'mousemove') {
                      _this._context.fire('picked:mouseout');
                  }
                  else if (type === 'click') {
                      _this._context.fire('picked:clickout');
                  }
              }
          });
      };
      /**
       * 要素悬浮事件
       * @param param0
       */
      Editor.prototype._pickedHover = function (_a) {
          var feature = _a.feature;
          this._context.hover(feature.featureType, true);
      };
      /**
       * 要素离开事件
       */
      Editor.prototype._pickedOut = function () {
          this._context.out();
      };
      /**
       * 点击要素，拾取
       */
      Editor.prototype._pickedClick = function (_a) {
          var feature = _a.feature;
          // 取消上一个被选中的要素
          this._pickedClickout();
          var featureTypeUpper = feature.featureType.toUpperCase();
          this._context.enter(Modes[featureTypeUpper + "_SELECT"]);
          this._pickedFeature = feature;
          // 要素被选中
          this._pickedFeature.select();
      };
      /**
       * 点击画布空白区域
       */
      Editor.prototype._pickedClickout = function () {
          if (~this._context.mode.indexOf('_select') === 0
              && this._context.mode !== Modes.IDLE) {
              return;
          }
          if (this._pickedFeature) {
              this._pickedFeature.unselect();
              this._pickedFeature = null;
          }
      };
      /**
       * 初始化绘制命令
       */
      Editor.prototype._initializeDrawCommand = function () {
          // 创建标面绘制命令
          this.createPolygonDrawCommand();
          // 创建标线绘制命令
          this.createLineDrawCommand();
          // 创建节点
          this.creatNodeDrawCommand();
          // 创建标点绘制命令
          this.createPointDrawCommand();
      };
      /**
       * 创建标点绘制命令
       */
      Editor.prototype.createPointDrawCommand = function () {
          var _regl = this._context._regl;
          var uniforms = {
              model: _regl.prop('modelMatrix'),
              texture: _regl.prop('texture'),
              color: _regl.prop('color'),
              fbo: _regl.prop('fbo')
          };
          var attributes = {
              aPosition: {
                  buffer: _regl.prop('positionBuffer')
              },
              aTexCoord: {
                  buffer: _regl.prop('texCoordBuffer')
              }
          };
          // 标点预编译着色器程序
          this._drawCommand[FeatureType.POINT] = _regl({
              vert: pointVert,
              frag: pointFrag,
              uniforms: uniforms,
              attributes: attributes,
              elements: _regl.prop('elements')
          });
      };
      /**
       * 创建标线绘制命令
       */
      Editor.prototype.createLineDrawCommand = function () {
          var _regl = this._context._regl;
          var uniforms = {
              model: _regl.prop('modelMatrix'),
              color: _regl.prop('color') || [255, 255, 255, 255],
              thickness: _regl.prop('width') || 3,
              miter: 1,
              aspect: function (_a) {
                  var viewportWidth = _a.viewportWidth, viewportHeight = _a.viewportHeight;
                  return viewportWidth / viewportHeight;
              },
              height: function (_a) {
                  var viewportHeight = _a.viewportHeight, pixelRatio = _a.pixelRatio;
                  return viewportHeight / pixelRatio;
              }
          };
          var attributes = {
              prevPosition: {
                  buffer: _regl.prop('positionBuffer'),
                  offset: 0
              },
              currPosition: {
                  buffer: _regl.prop('positionBuffer'),
                  offset: FLOAT_BYTES * 2 * 2
              },
              nextPosition: {
                  buffer: _regl.prop('positionBuffer'),
                  offset: FLOAT_BYTES * 2 * 4
              },
              offsetScale: _regl.prop('offsetBuffer')
          };
          // 预编译着色器程序
          this._drawCommand[FeatureType.LINE] = _regl({
              vert: lineVert,
              frag: lineFrag,
              uniforms: uniforms,
              attributes: attributes,
              elements: _regl.prop('elements')
          });
          this._drawCommand[FeatureType.BORDER] = _regl({
              vert: lineVert,
              frag: lineFrag,
              uniforms: uniforms,
              attributes: attributes,
              elements: _regl.prop('elements')
          });
      };
      /**
       * 创建标面绘制命令
       */
      Editor.prototype.createPolygonDrawCommand = function () {
          var _regl = this._context._regl;
          var uniforms = {
              model: _regl.prop('modelMatrix'),
              color: _regl.prop('color') || [255, 0, 102, 127]
          };
          var attributes = {
              aPosition: {
                  buffer: _regl.prop('positionBuffer'),
                  offset: 0
              }
          };
          // 标面预编译着色器程序
          this._drawCommand[FeatureType.POLYGON] = _regl({
              vert: polygonVert,
              frag: polygonFrag,
              uniforms: uniforms,
              attributes: attributes,
              elements: _regl.prop('elements')
          });
      };
      Editor.prototype.creatNodeDrawCommand = function () {
          var _regl = this._context._regl;
          var uniforms = {
              model: _regl.prop('modelMatrix'),
              color: _regl.prop('color'),
              size: _regl.prop('size')
          };
          var attributes = {
              aPosition: {
                  buffer: _regl.prop('positionBuffer'),
                  offset: 0
              }
          };
          // 标面预编译着色器程序
          this._drawCommand[FeatureType.NODE] = _regl({
              vert: nodeVert,
              frag: nodeFrag,
              uniforms: uniforms,
              attributes: attributes,
              primitive: 'points',
              count: 1
          });
      };
      /**
       * 渲染要素信息
       * @param geos
       * @param retain 是否保留新标绘的要素
       */
      Editor.prototype.render = function (geos, retain) {
          var _this = this;
          if (geos === void 0) { geos = {}; }
          if (retain === void 0) { retain = true; }
          // 重绘当前视野的元素
          var featureTypes = [FeatureType.POLYGON, FeatureType.LINE, FeatureType.POINT];
          // 刷新当前视野元素的时候，新标绘的要素不删除
          if (retain) {
              featureTypes.forEach(function (featureType) {
                  var retainFeatures = _this._features[featureType];
                  _this._features[featureType] = [];
                  for (var _i = 0, retainFeatures_1 = retainFeatures; _i < retainFeatures_1.length; _i++) {
                      var feature = retainFeatures_1[_i];
                      if (feature._id.startsWith('id_')) {
                          _this._features[featureType].push(feature);
                      }
                  }
              });
          }
          // 接受新的要素
          featureTypes.forEach(function (featureType) {
              var features = geos[featureType] || [];
              var featuresMap = features.map(function (featureInfo) {
                  var feature = new featureClasses[featureType](_this._context, featureInfo);
                  return feature;
              });
              _this._features[featureType] = _this._features[featureType].concat(featuresMap);
          });
          // 重绘
          this.repaint();
      };
      /**
       * 启动编辑
       * @param featureType 要素类型
       */
      Editor.prototype.start = function (featureType, fn) {
          var _this = this;
          // 已选中的元素要取消选中
          this._pickedClickout();
          // 进入等待编辑模式
          this._context.enter(Modes.WATING);
          // 先销毁上一次未完成绘制的要素
          if (this._newFeature) {
              this._newFeature.destroy();
          }
          // 创建新的要素
          this._newFeature = new featureClasses[featureType](this._context, undefined);
          // 要素进入待编辑模式
          this._newFeature.waiting(fn);
          if (featureType !== FeatureType.POINT) {
              this._tick = this._context._regl.frame(function () {
                  _this.drawing();
              });
          }
      };
      /**
       * 绘制完成
       */
      Editor.prototype._drawFinish = function (feature) {
          // 退出编辑模式， 进入要素选中模式
          this._context.enter(Modes[feature.featureType.toUpperCase() + "_SELECT"]);
          if (!this._newFeature) {
              return;
          }
          // 新标绘的要素加入到要素集合中
          this._addFeature(this._newFeature);
          // 新标绘的要素成为被选中的要素
          this._pickedFeature = this._newFeature;
          this._context.fire('finish', this._newFeature);
          this._clearTick();
          this._newFeature = null;
          this.repaint();
      };
      Editor.prototype.drawBatch = function (featureType, featureProps, fbo) {
          var _this = this;
          // 批量绘制，帧缓冲区中的绘制不需要透明度，不然造成拾取颜色不准确
          if (fbo) {
              this._drawCommand[featureType](featureProps);
          }
          else {
              var blendEnable = featureType !== FeatureType.LINE;
              this._context._regl({
                  blend: {
                      enable: blendEnable,
                      func: {
                          src: 'src alpha',
                          dst: 'one minus src alpha'
                      }
                  },
                  depth: {
                      mask: false
                  }
              })(function () {
                  // 需要使用α混合，添加透明度
                  _this._drawCommand[featureType](featureProps);
              });
          }
      };
      /**
       * 数据更新，引起图形重新渲染
       */
      Editor.prototype.repaint = function (param) {
          var _this = this;
          if (param === void 0) { param = { fbo: false, drawing: false }; }
          var _regl = this._context._regl;
          if (!_regl) {
              return;
          }
          // 窗口尺寸变化，需要重新设置webgl的viewport
          if (this._isPoll) {
              _regl.poll();
              this._isPoll = false;
          }
          // 重置颜色缓冲区和深度缓存区
          _regl.clear({
              color: [0, 0, 0, 0],
              depth: 1
          });
          // 是否在帧缓冲区中绘制标识
          var fbo = param.fbo, drawing = param.drawing;
          var _featureProps = fbo ? this._fboFeatureProps : this._featureProps;
          var nodeProps = _featureProps[FeatureType.NODE];
          var borderProps = _featureProps[FeatureType.BORDER];
          if (!drawing) {
              nodeProps = [];
              borderProps = [];
          }
          var featureTypes = [FeatureType.POLYGON, FeatureType.LINE, FeatureType.POINT];
          // 已有的面、线、点集合重绘
          for (var _i = 0, featureTypes_1 = featureTypes; _i < featureTypes_1.length; _i++) {
              var featureType = featureTypes_1[_i];
              if (!drawing) {
                  var featureProps_1 = this._features[featureType].map(function (feature) {
                      // 多边形边框
                      if (feature.featureType === FeatureType.POLYGON) {
                          borderProps.push(_this.featureMap(feature._line, fbo));
                      }
                      // 节点
                      if (feature.featureType === FeatureType.LINE || feature.featureType === FeatureType.POLYGON) {
                          feature.nodes.forEach(function (node) {
                              nodeProps.push(_this.featureMap(node, fbo));
                          });
                      }
                      return _this.featureMap(feature, fbo);
                  });
                  _featureProps[featureType] = featureProps_1;
                  if (featureType === FeatureType.POLYGON) {
                      _featureProps[FeatureType.BORDER] = borderProps;
                  }
                  if (featureType === FeatureType.LINE || featureType === FeatureType.POLYGON) {
                      _featureProps[FeatureType.NODE] = nodeProps;
                  }
              }
              var featureProps = _featureProps[featureType];
              if (featureProps.length > 0) {
                  this.drawBatch(featureType, featureProps, fbo);
              }
              // 绘制多边形边框
              if (featureType === FeatureType.POLYGON) {
                  if (_featureProps[FeatureType.BORDER].length > 0) {
                      this.drawBatch(FeatureType.BORDER, _featureProps[FeatureType.BORDER], fbo);
                  }
              }
              // 绘制节点
              if (featureType === FeatureType.LINE || featureType === FeatureType.POLYGON) {
                  if (_featureProps[FeatureType.NODE].length > 0) {
                      this.drawBatch(FeatureType.NODE, _featureProps[FeatureType.NODE], fbo);
                  }
              }
          }
          // 正在绘制的点线面重绘, 并且帧缓冲区不绘制正在绘制的要素
          if (this._newFeature && !fbo) {
              var featureType = this._newFeature.featureType;
              var newFeatureProps = this.featureMap(this._newFeature, fbo);
              this.drawBatch(featureType, newFeatureProps, fbo);
              if (featureType === FeatureType.POLYGON) {
                  var borderFeature = this._newFeature._line;
                  var borderFeatureProps = this.featureMap(borderFeature, fbo);
                  this.drawBatch(FeatureType.BORDER, borderFeatureProps, fbo);
              }
              if (featureType === FeatureType.LINE || featureType === FeatureType.POLYGON) {
                  var nodes = this._newFeature.nodes;
                  var featureProps = nodes.map(function (node) {
                      return _this.featureMap(node, fbo);
                  });
                  this.drawBatch(FeatureType.NODE, featureProps, fbo);
              }
          }
      };
      Editor.prototype.drawing = function () {
          this.repaint({
              drawing: true,
              fbo: false
          });
      };
      Editor.prototype.featureMap = function (feature, fbo) {
          // 重新计算顶点的位置，索引，样式
          !fbo && feature.repaint();
          var featureType = feature.featureType, positionBuffer = feature.positionBuffer, offsetBuffer = feature.offsetBuffer, texCoordBuffer = feature.texCoordBuffer, texture = feature.texture, elements = feature.elements, _pickColor = feature._pickColor, style = feature.style;
          // 缓冲区中绘制拾取颜色
          var color = fbo ? _pickColor : style.color;
          // 获得投影矩阵
          var modelMatrix = this._context._shapeConfig.getModelMatrix();
          // 基础属性，点线面都包含
          var props = __assign(__assign({ _id: feature._id, positionBuffer: positionBuffer }, style), { color: color,
              modelMatrix: modelMatrix,
              elements: elements });
          switch (featureType) {
              case FeatureType.BORDER:
              case FeatureType.LINE:
                  var width = fbo ? 20 : style.width;
                  return __assign(__assign({}, props), { width: width,
                      offsetBuffer: offsetBuffer });
              case FeatureType.POLYGON:
                  return props;
              case FeatureType.NODE:
                  var size = fbo ? 40 : style.size;
                  return __assign(__assign({}, props), { size: size });
              case FeatureType.POINT:
                  return __assign(__assign({}, props), { texCoordBuffer: texCoordBuffer,
                      texture: texture, fbo: !!fbo });
          }
      };
      /**
       * 新绘制的要素添加到要素缓存中
       * @param feature
       */
      Editor.prototype._addFeature = function (feature) {
          var featureType = feature.featureType;
          this._features[featureType].push(feature);
      };
      /**
       * 根据要素ID查询要素
       * @param featureId
       */
      Editor.prototype.getFeature = function (featureId) {
          var _this = this;
          var feature = null;
          Object.keys(this._features).forEach(function (featureType) {
              // 要素已经找到了
              if (feature) {
                  return;
              }
              feature = _this._features[featureType].find(function (feature) {
                  return feature._id === featureId;
              });
          });
          return feature;
      };
      Editor.prototype.changeIds = function (ids) {
          var _this = this;
          if (ids === void 0) { ids = {}; }
          // TODO：修改节点绑定的attachIds
          Object.keys(ids).forEach(function (oldId) {
              var newId = ids[oldId];
              Object.keys(_this._features).forEach(function (featureType) {
                  var features = _this._features[featureType];
                  var feature = features.find(function (feature) {
                      return feature._id.indexOf(oldId) > -1;
                  });
                  if (feature) {
                      feature.setId(newId);
                  }
              });
          });
      };
      /**
       * 清空画板
       */
      Editor.prototype.clear = function () {
          this._init();
          this._clearTick();
          this.repaint();
      };
      Editor.prototype._clearTick = function () {
          if (this._tick) {
              this._tick.cancel();
              this._tick = null;
          }
          if (this._pickTick) {
              clearTimeout(this._pickTick);
              this._pickTick = null;
          }
      };
      return Editor;
  }());

  const {
    Renderer,
    DomEvent: {
      on,
      off
    },
    Util: {
      cancelAnimFrame
    },
    DomUtil: {
      remove,
      setPosition
    }
  } = L__default['default']; // 继承render

  const WebglLeaflet = Renderer.extend({
    getEvents: function () {
      var events = Renderer.prototype.getEvents.call(this); // 鼠标拖动实时绘制

      events.move = this._update;
      events.zoom = this._update;
      events.movestart = this._movestart;
      return events;
    },
    onAdd: function () {
      // canvas 添加到dom中
      Renderer.prototype.onAdd.call(this); // 开始绘制

      this._draw();
    },
    _initContainer: function () {
      var container = this._container = document.createElement('canvas');
      on(container, 'mousemove', this._onMouseMove, this);
      on(container, 'click dblclick mousedown mouseup contextmenu', this._onClick, this);
      on(container, 'mouseout', this._onMouseOut, this);
      this.gl = container.getContext('webgl');

      if (!this.gl) {
        throw new Error('Webgl is not supported in your broswer');
      }
    },
    _draw: function () {
      // webgl 编辑器，初始化
      this._editor = new Editor(this.gl, {
        lngLatsToPoints: this._LngLatsToPointsCall(),
        getModelMatrix: this._getModelMatrixCall()
      }); // 拾取事件

      this._editor._context.on('picked:click picked:mousemove', ({
        type,
        feature
      }) => {
        if (!feature) {
          console.log('error:', feature._id);
          return;
        }

        if (type === 'mousemove') {
          type = 'hover';
        }

        this.fire(`picked:${type}`, {
          feature
        });
      }); // 绘制完成事件


      this._editor._context.on('finish', feature => {
        this.fire('finish', {
          feature
        });
      });
    },

    /**
     * 开始编辑哪种要素
     * @param {*} featureType 要素类型
     */
    start: function (featureType) {
      const {
        doubleClickZoom
      } = this._map.options; // 禁用双击放大事件

      if (doubleClickZoom) {
        this._map.doubleClickZoom.disable();
      }

      let clickFn = null,
          moveFn = null; // 通过回调，将editor和具体的地图api分割开，方便将来与其它地图API做适配，比如：mapbox

      this._editor.start(featureType, (mouseClick, mouseMove) => {
        clickFn = evt => {
          const lngLat = evt.latlng;
          mouseClick(lngLat, () => {
            this._map.off('click', clickFn);

            this._map.off('mousemove', moveFn); // 绘制完成恢复双击放大


            if (doubleClickZoom) {
              setTimeout(() => {
                this._map.doubleClickZoom.enable();
              }, 200);
            }
          });
        };

        moveFn = evt => {
          const lngLat = evt.latlng;
          mouseMove(lngLat);
        };

        this._map.on('click', clickFn);

        this._map.on('mousemove', moveFn);
      });
    },

    render(features, retain) {
      if (!this._editor) {
        throw new Error('gl-editor 初始化失败！');
      }

      this._editor.render(features, retain);
    },

    getFeature(featureId) {
      this._editor.getFeature(featureId);
    },

    changeIds(ids) {
      this._editor.changeIds(ids);
    },

    clear() {
      this._editor.clear();
    },

    _update: function () {
      Renderer.prototype._update.call(this);

      const b = this._bounds,
            container = this._container,
            size = b.getSize(),
            m = window.devicePixelRatio;
      setPosition(container, b.min);
      container.width = m * size.x;
      container.height = m * size.y;
      container.style.width = size.x + 'px';
      container.style.height = size.y + 'px'; // 地图移动，视野变化，都需要重绘

      if (this._editor) {
        this._editor.repaint();
      }
    },

    _LngLatsToPointsCall() {
      return lngLatToPoint(lngLat => {
        const {
          x,
          y
        } = this._map.latLngToContainerPoint(L__default['default'].latLng(lngLat.lat, lngLat.lng));

        return {
          x,
          y
        };
      });
    },

    _getModelMatrixCall() {
      return () => {
        const {
          x: w,
          y: h
        } = this._map.getSize(); // glsl中的矩阵是主列矩阵


        return [2 / w, 0, 0, 0, -2 / h, 0, -1, 1, 1];
      };
    },

    _onClick: function (e) {// var point = this._map.mouseEventToLayerPoint(e);
      // console.log(point);
    },

    _movestart() {
      if (this._editor) {
        this._editor._context.setMapStatus('movestart');
      }
    },

    _onMouseMove: function (e) {
      if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) {
        return;
      } // var point = this._map.mouseEventToLayerPoint(e);

    },
    _onMouseOut: function (e) {},
    _onMouseHover: function (e, point) {},
    _fireEvent: function (layers, e, type) {
      this._map._fireDOMEvent(e, type || e.type, layers);
    },
    _bringToFront: function (layer) {},
    _bringToBack: function (layer) {},
    _destroyContainer: function () {
      cancelAnimFrame(this._redrawRequest);
      delete this.gl;
      remove(this._container);
      off(this._container);
      delete this._container;
    }
  });

  function drawEdit() {
      var wl = new WebglLeaflet({
          padding: 0,
          zoomAnimation: false
      });
      return wl;
  }

  return drawEdit;

})));
