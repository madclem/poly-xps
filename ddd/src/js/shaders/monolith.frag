
precision highp float;

uniform float clipY;
uniform float dir; // -1 or 1

varying vec4 vPos;
varying vec3 vWsPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vLighting;
uniform sampler2D texture;


void main(void)
{
    if(vWsPosition.y  * dir > clipY * dir)
    {
        discard;
    }


    vec4 color = texture2D(texture, vUv);
    // color += vec4(1.) * vec4(vNormal, 1.);
    // vec4 color = vec4(vNormal, 1.);
    gl_FragColor = vec4(color.rgb * vLighting, 1.);
}
