precision highp float;

attribute vec3 aPosition;
attribute vec2 aUv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vPos;
varying vec2 vUv;

void main(void) {

    vUv = aUv;
    vec4 pos = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
    vPos = pos.rgb;
    gl_Position = pos;
}
