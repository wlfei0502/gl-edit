import L from 'leaflet';
import { lngLatToPoint } from '../util/util';
import Editor from '../modules/editor';

const { 
    Renderer, 
    DomEvent:{ on, off }, 
    Util:{ cancelAnimFrame },
    DomUtil:{ remove, setPosition }
} = L;

// 继承render
const WebglLeaflet = Renderer.extend({

    getEvents: function () {
        var events = Renderer.prototype.getEvents.call(this);
        // 鼠标拖动实时绘制
        events.move = this._update;
        events.zoom = this._update;
        events.movestart = this._movestart;
        return events;
    },

    onAdd: function () {
        // canvas 添加到dom中
        Renderer.prototype.onAdd.call(this);
        // 开始绘制
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
        });

        // 拾取事件
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
        });

        // 绘制完成事件
        this._editor._context.on('finish', (feature) => {
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
        const { doubleClickZoom } = this._map.options;
        // 禁用双击放大事件
        if (doubleClickZoom) {
            this._map.doubleClickZoom.disable();
        }

        let clickFn = null, moveFn = null;

        // 通过回调，将editor和具体的地图api分割开，方便将来与其它地图API做适配，比如：mapbox
        this._editor.start(featureType, (mouseClick, mouseMove) => {
            clickFn = (evt) => {
                const lngLat = evt.latlng;
                mouseClick(lngLat, () => {
                    this._map.off('click', clickFn);
                    this._map.off('mousemove', moveFn);

                    // 绘制完成恢复双击放大
                    if (doubleClickZoom) {
                        setTimeout(() => {
                            this._map.doubleClickZoom.enable();
                        }, 200);
                    }
                });
            };

            moveFn = (evt) => {
                const lngLat = evt.latlng;
                mouseMove(lngLat);
            }

            this._map.on('click', clickFn);
            this._map.on('mousemove', moveFn);
        });
    },

    render (features, retain) {
        if (!this._editor) {
            throw new Error('gl-editor 初始化失败！');
        }

        this._editor.render(features, retain);
    },

    getFeature (featureId) {
        this._editor.getFeature(featureId);
    },

    changeIds (ids) {
        this._editor.changeIds(ids);
    },

    clear () {
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
        container.style.height = size.y + 'px';

        // 地图移动，视野变化，都需要重绘
        if (this._editor) {
            this._editor.repaint();
        }
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

    _movestart () {
        if (this._editor) {
            this._editor._context.setMapStatus('movestart');
        }
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