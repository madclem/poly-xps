
precision highp float;

uniform sampler2D refraction;
uniform sampler2D reflection;
uniform sampler2D dudvMap;
uniform float time;

// varying vec4 clipSpace;
varying vec4 clipSpace;
varying vec2 vUv;

const float waveStrength = 0.005;

void main(void)
{
    vec2 uv = vec2(clipSpace.xy / clipSpace.w) / 2. + .5;

    vec2 refractTexCoord = vec2(uv.x, uv.y);
    vec2 reflectTexCoord = vec2(uv.x, uv.y);

    vec2 distortion1 = (texture2D(dudvMap, vec2(vUv.x + time, vUv.y)).rg * 2.0 - 1.0) * waveStrength;
    vec2 distortion2 = (texture2D(dudvMap, vec2(-vUv.x + time, vUv.y + time)).rg * 2.0 - 1.0) * waveStrength;

    vec2 totalDistortion = distortion1 + distortion2;

    refractTexCoord += totalDistortion;
    reflectTexCoord += totalDistortion;

    vec3 refractColor = texture2D(refraction, refractTexCoord).rgb;
    vec3 reflectColor = texture2D(reflection, reflectTexCoord).rgb;

    vec3 color = mix(refractColor, reflectColor, .5);
    color = mix(color, vec3(0.0,0.0,1.0), 0.01);
    gl_FragColor = vec4(color, 1.);
}
