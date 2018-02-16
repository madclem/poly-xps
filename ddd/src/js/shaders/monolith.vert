
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;


uniform vec3 ambientLight;
uniform vec3 directionalLightColor;
uniform vec3 directionalVector;


varying vec3 vLighting;
// varying vec3 vPos;
varying vec4 vPos;
varying vec3 vWsPosition;
varying vec3 vNormal;
varying vec2 vUv;


void main(void) {
	vUv = aUv;
	vNormal = aNormal;
	vWsPosition	= vec4(modelMatrix * vec4(aPosition, 1.0)).xyz;

	vPos = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
    gl_Position =  vPos;

	float directional = max(dot(aNormal, directionalVector), 0.0);
	vLighting = ambientLight + (directionalLightColor * directional);
}
