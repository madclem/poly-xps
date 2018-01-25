
attribute vec3 aPosition;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

varying vec3 vPos;


void main(void) {
	vPos = aPosition;
	vec4 mvPosition =  viewMatrix * modelMatrix * vec4(aPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
