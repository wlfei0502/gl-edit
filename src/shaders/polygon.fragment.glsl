precision mediump float;

uniform vec4 color;

void main() {
  // TODO: 后期需要做抗锯齿
  gl_FragColor = color / 255.0;
}