precision mediump float;

uniform vec4 color;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
    float smooth1 = smoothstep(0.55, 0.45, dist);
    float smooth2 = smoothstep(0.45, 0.4, dist);

    gl_FragColor = vec4(0, 0, 0, 1) * smooth1 * (1.0 - smooth2) + color / 255.0 * smooth2;
}