
attribute vec3 aPosition;
attribute vec2 aUv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vUv;


void main(void) {
	vPos = aPosition;
	vUv = aUv;
	vec4 pos = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
    gl_Position =  pos;
    // gl_Position =  vec4(pos.xyz, 1.0);
}
