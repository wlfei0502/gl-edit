import Leaflet from './lib/leaflet';

// 绘制编辑器
let editor = null;

function glEdit() {
    if (editor) {
        throw new Error('GlEditor has been initialized!');
    }

    editor = new Leaflet({
        padding: 0,
    });

    return editor;
}

export default glEdit;