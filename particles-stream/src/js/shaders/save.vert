precision highp float;
attribute vec3 aPosition;
attribute vec2 aUv;
attribute vec3 aExtra;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vExtra;

void main(void) {
	vColor       = aPosition;
	vec3 pos     = vec3(aUv, 0.0);
	gl_Position  = vec4(pos, 1.0);
	gl_PointSize = 1.0;

	vExtra       = aExtra;
}
