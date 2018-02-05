precision highp float;

attribute vec3 aPosition;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

varying vec4 clipSpace;


void main(void) {
    clipSpace = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
    gl_Position = clipSpace;
    gl_PointSize = 1.0;
}
