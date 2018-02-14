precision highp float;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;
// uniform sampler2D texture;

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

void main(void)
{
    //vec4 color = texture2D(texture, vUv);
    vec3 color1 = vec3(240./255.0, 240./255., 245./255.);
      vec3 color2 = vec3(24./255.0, 22./255., 20./255.);

        vec3 d0 = diffuse(vNormal, LIGHT0, color1) * 1.5;
    	vec3 d1 = diffuse(vNormal, LIGHT1, color2) * 1.5;
    vec3 color = vec3(d0 + d1);

    gl_FragColor = vec4(color,1);
}
