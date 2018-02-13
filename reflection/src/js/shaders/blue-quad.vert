precision highp float;

attribute vec3 aPosition;
attribute vec2 aUv;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

varying vec4 clipSpace;
varying vec2 vUv;

const float tiling = 6.0;

void main(void) {
    vUv = aUv;
    clipSpace = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
    gl_Position = clipSpace;
    gl_PointSize = 1.0;

    vUv = vec2(aPosition.x / 2.0 + .5, aPosition.y / 2.0 + .5) * tiling;
}
