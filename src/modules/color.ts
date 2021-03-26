class Color {
    _colors: {} = {};
    _uuids: {} = {};
    _currentColor: number[];

    constructor () {
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
        this._uuids[uuid] = colorKey;

        return [ ...this._currentColor ];
    }

    getUUID (colorKey) {
        return this._colors[colorKey];
    }

    changeUuid (oldUuid, newUuid) {
        const colorKey = this._uuids[oldUuid];
        this._uuids[newUuid] = colorKey;
        this._colors[colorKey] = newUuid;

        delete this._uuids[oldUuid];
    }
}


export default Color;