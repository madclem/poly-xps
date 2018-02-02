precision mediump float;

uniform sampler2D texture;
// varying float vCounters;
varying vec2 vUv;

void main() {

  vec4 color = vec4(1.);
  color *= texture2D(texture, vUv);

  gl_FragColor = color;
  // gl_FragColor.a *= step(vCounters, 2.0);
}
