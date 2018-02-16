
precision highp float;

uniform float clipY;
uniform float dir; // -1 or 1

varying vec4 vPos;
varying vec3 vWsPosition;

void main(void)
{
    if(vWsPosition.y  * dir > clipY * dir)
    {
        discard;
    }

    // vec3 color = vec3(dir);
    vec3 color = vec3(.3);
    gl_FragColor = vec4(color, 1.);
}
