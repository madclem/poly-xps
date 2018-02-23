
attribute vec2 aPosition;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;


void main(void) {
	vUv = aPosition * .5 + .5;

	vec3 pos = vec4( projectionMatrix * vec4(aPosition, .0, 1.)).rgb;

    gl_Position =  vec4(aPosition, 0., 1.0);
    // gl_Position =  vec4(pos, 1.0);
}
