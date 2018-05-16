precision highp float;

attribute vec3 aPosition;
attribute vec2 aUv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float active;
uniform float zoom;


varying vec3 vPos;
varying vec2 vUv;
varying vec2 vUv2;
varying float shadow;

void main(void) {

    vec2 scaleCenter = vec2(0.5, 0.5);

    vUv = (aUv - scaleCenter) * zoom + scaleCenter;

    vUv2 = aUv;


    // vUv = aUv;
    vec4 pos = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
    vPos = aPosition;
    // vPos = pos.rgb;
    shadow = 0.0;
    if(active < 1.0)
    {
        shadow =  pow(-vPos.z/2.5, 2.);
    }
    gl_Position = pos;

}
