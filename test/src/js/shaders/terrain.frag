precision highp float;

uniform float clipY;
uniform float dir; // -1 or 1
uniform sampler2D gradientMap; // -1 or 1

varying vec3 vWsPosition;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;
varying float visibility;

// uniform sampler2D texture;

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}


#define fade 1.0
#define LIGHT_YELLOW vec3(fade, fade, -fade)
#define LIGHT_BLUE vec3(50.0, -fade, 0.0)

#define LIGHT0 vec3(.5, 1.0, .8)
#define LIGHT1 vec3(1., 0.5, 1.5)

#define SKY_COLOR vec3(27./255., 27./255., 27./255.)

void main(void)
{
	if(vWsPosition.y  * dir > clipY * dir)
    {
        discard;
    }

    vec3 color1 = vec3(24./255.0, 24./255., 24./255.);
    vec3 color2 = vec3(44./255.0, 42./255., 40./255.);
    vec3 d0 = diffuse(vNormal, LIGHT0, color1) * 1.5;
    vec3 d1 = diffuse(vNormal, LIGHT1, color2) * 1.5;

    // vec3 color = vec3(visibility);
    vec3 color = vec3(d0 + d1);
	color = mix(SKY_COLOR, color, visibility);

	float br = 1.0 - luma(color);
    vec2 uvGrad = vec2(br, 0.5);
    vec3 colorGrad = texture2D(gradientMap, uvGrad).rgb;
    color.rgb = mix(color.rgb, colorGrad, .5);


    gl_FragColor = vec4(color,1);
}
