precision highp float;

attribute vec2 aPosition;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;



varying vec2 vUv;
varying vec2 vPos;

void main(void) {
    vUv = aPosition * .5 + .5;
    vPos = aPosition;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
