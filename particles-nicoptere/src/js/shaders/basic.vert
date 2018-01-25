
attribute vec3 aPosition;
attribute vec2 aUv;
attribute vec3 aNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vUv;


void main(void) {
	vPos = aPosition;
	vUv = aUv;

	vec3 transformedNormal = aNormal * normalMatrix;
	vNormal = transformedNormal;
	vec4 mvPosition =  viewMatrix * modelMatrix * vec4(aPosition, 1.0);

    gl_Position = projectionMatrix * mvPosition;
}
