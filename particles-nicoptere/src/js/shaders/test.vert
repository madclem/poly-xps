precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

varying vec3 vPos;
varying vec2 vUv;


void main(void) {
	vPos = aPosition;
	vec3 n = aNormal;
	vUv = aUv;
    gl_Position = vec4(aPosition, 1.0);
}