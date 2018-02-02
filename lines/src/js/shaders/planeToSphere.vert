precision highp float;

attribute vec3 aPositionPlane;
attribute vec3 aPositionSphere;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

uniform float percentage;
uniform float time;

void main(void) {

    vec3 pos = mix(aPositionSphere.xyz, aPositionPlane.xyz, time);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_PointSize = 2.0;
}
