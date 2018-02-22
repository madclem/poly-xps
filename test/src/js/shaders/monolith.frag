
precision highp float;

uniform float clipY;
uniform float dir; // -1 or 1

varying vec4 vPos;
varying vec3 vWsPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vLighting;
uniform sampler2D texture;
uniform sampler2D gradientMap;

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}


void main(void)
{
    if(vWsPosition.y  * dir > clipY * dir)
    {
        discard;
    }


    vec4 color = texture2D(texture, vUv);

    float br = 1.0 - luma(color.rgb);
    vec2 uvGrad = vec2(br, 0.5);
    vec3 colorGrad = texture2D(gradientMap, uvGrad).rgb;
    color.rgb = mix(color.rgb, colorGrad, .3);
    // color += vec4(1.) * vec4(vNormal, 1.);
    // vec4 color = vec4(vNormal, 1.);
    gl_FragColor = vec4(color.rgb * vLighting * 1.5, 1.);
}
