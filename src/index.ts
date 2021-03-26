import WebglLeaflet from './extensions/webgl-leaflet';

function drawEdit() {
    const wl = new WebglLeaflet({
        padding: 0,
        zoomAnimation: false
    });
    return wl;
}

export default drawEdit;