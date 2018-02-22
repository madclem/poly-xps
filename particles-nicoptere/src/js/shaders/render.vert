precision mediump float;


attribute vec3 aPosition;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

uniform float pointSize;

uniform sampler2D positions;

varying vec2 vUv;
void main() {
	// vec3 pos = aPosition;
	vec3 pos = texture2D( positions, aPosition.xy ).xyz;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( pos, 1.0 );

    gl_PointSize = pointSize;
}
