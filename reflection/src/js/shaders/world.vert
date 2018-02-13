
attribute vec3 aPosition;
// attribute vec2 aUv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec4 vPos;
varying vec3 vWsPosition;
varying vec3 vNormal;
varying vec2 vUv;


void main(void) {
	vWsPosition	= vec4(modelMatrix * vec4(aPosition, 1.0)).xyz;
	vPos = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
	// vUv = aUv;
    gl_Position =  vPos;
}
