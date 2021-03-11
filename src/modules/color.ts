class Color {
    _colors: {};

    _currentColor: number[];

    constructor () {
        this._colors = {};
        this._currentColor = [0, 0, 0, 0];
    }

    getColor (uuid) {

        function recursive(color, index) {
            let part = color[index];
            
            if (part + 1 <= 255) {
                part = part + 1;
                color[index] = part;
                return;
            } else {
                color[index] = 0;
            }

            recursive(color, index + 1);
        }

        recursive(this._currentColor, 0);

        // 颜色与uuid一一对应
        const colorKey = this._currentColor.join('-');
        this._colors[colorKey] = uuid;

        return [ ...this._currentColor ];
    }

    getUUID (colorKey) {
        return this._colors[colorKey];
    }
}


export default Color;