attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vUv;


void main(void) {
    vPos = aPosition;
    vNormal = aNormal;
    gl_Position =  projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
}
