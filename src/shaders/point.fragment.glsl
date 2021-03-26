precision mediump float;

uniform sampler2D texture;
uniform bool fbo;
uniform vec4 color;
varying vec2 uv;

void main() {
  if(fbo){
    gl_FragColor = color / 255.0;
  } else {
    gl_FragColor = texture2D(texture, uv);
  }
}