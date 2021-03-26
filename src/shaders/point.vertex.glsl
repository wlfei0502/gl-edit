uniform mat3 model;

attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 uv;

void main() {
    vec3 position = model * vec3(aPosition, 1.0);
    gl_Position = vec4(position.xy, 0.0, 1.0);

    uv = aTexCoord;
}