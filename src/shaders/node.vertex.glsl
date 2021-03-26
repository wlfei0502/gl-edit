uniform mat3 model;
uniform float size;

attribute vec2 aPosition;

void main() {
    vec3 position = model * vec3(aPosition, 1.0);
    gl_Position = vec4(position.xy, 0.0, 1.0);
    gl_PointSize = size; 
}