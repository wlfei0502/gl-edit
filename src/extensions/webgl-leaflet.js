import L from 'leaflet';
import { lngLatToPoint } from '../util/util';
import Editor from '../modules/editor';

// import '../modules/demo';

const { 
    Renderer, 
    DomEvent:{ on, off }, 
    Util:{ cancelAnimFrame },
    DomUtil:{ remove, setPosition },
    Browser:{ retina }
} = L;

// 继承render
const WebglLeaflet = Renderer.extend({
    getEvents: function () {
        var events = Renderer.prototype.getEvents.call(this);
        // 鼠标拖动实时绘制
        events.move = this._update;
        events.zoom = this._update;
        return events;
    },

    onAdd: function () {
        // canvas 添加到dom中
        Renderer.prototype.onAdd.call(this);
        // 开始绘制
        this._draw();
    },

    _draw: function () {
        // webgl 编辑器，初始化
        this._editor = new Editor(this.gl, {
            lngLatsToPoints: this._LngLatsToPointsCall(),
            getModelMatrix: this._getModelMatrixCall()
        });

        // 初始化绘制
        this._editor.repaint();
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

    _update: function () {
        if (this._map._animatingZoom && this._bounds) { return; }

        Renderer.prototype._update.call(this);

        const b = this._bounds,
            container = this._container,
            size = b.getSize(),
            m = retina ? 2 : 1;

        setPosition(container, b.min);

        container.width = m * size.x;
        container.height = m * size.y;
        container.style.width = size.x + 'px';
        container.style.height = size.y + 'px';

        // 地图移动，视野变化，都需要重绘
        this._editor && this._editor.repaint();
    },

    _LngLatsToPointsCall () {
        return lngLatToPoint((lngLat) => {
            const { x, y} = this._map.latLngToContainerPoint(L.latLng(lngLat.lat, lngLat.lng));
            return {
                x, y
            }
        });
    },

    _getModelMatrixCall () {
        return () => {
            const { x:w, y:h } = this._map.getSize();
            // glsl中的矩阵是主列矩阵
            return [ 2 / w, 0, 0, 0, -2 / h, 0, -1, 1, 1 ];
        }
    },

    _onClick: function (e) {
        // var point = this._map.mouseEventToLayerPoint(e);

        // console.log(point);
    },

    _onMouseMove: function (e) {
        if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) { return; }

        // var point = this._map.mouseEventToLayerPoint(e);
    },

    _onMouseOut: function (e) {
    },

    _onMouseHover: function (e, point) {
    },

    _fireEvent: function (layers, e, type) {
        this._map._fireDOMEvent(e, type || e.type, layers);
    },

    _bringToFront: function (layer) {
    },

    _bringToBack: function (layer) {

    },

    _destroyContainer: function () {
        cancelAnimFrame(this._redrawRequest);
        delete this.gl;
        remove(this._container);
        off(this._container);
        delete this._container;
    },
});

export default WebglLeaflet;