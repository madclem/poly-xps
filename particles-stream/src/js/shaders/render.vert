// render.vert

precision highp float;
attribute vec3 aPosition;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform sampler2D textureCurr;
uniform sampler2D textureNext;
uniform sampler2D textureExtra;
uniform float percent;
uniform float time;
uniform vec2 viewport;

varying vec4 vColor;
varying vec3 vNormal;

const float radius = 0.01;

void main(void) {
	vec2 uv      = aPosition.xy;
	vec3 posCurr = texture2D(textureCurr, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;
	vec3 pos     = mix(posCurr, posNext, percent);
	vec3 extra   = texture2D(textureExtra, uv).rgb;
	gl_Position  = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
	// gl_Position  = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);




	float g 	 = sin(extra.r + time * mix(extra.b, 1.0, .5));
	g 			 = smoothstep(0.0, 1.0, g);
	g 			 = mix(g, 1.0, .5);
	vColor       = vec4(vec3(g), 1.0);

	float distOffset = viewport.y * projectionMatrix[1][1] * radius / gl_Position.w;
    gl_PointSize = distOffset * (.5 + extra.x * 1.0);
}
