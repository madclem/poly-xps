
precision highp float;

uniform sampler2D refraction;
uniform sampler2D reflection;

// varying vec4 clipSpace;
varying vec4 clipSpace;

void main(void)
{
    vec2 uv = vec2(clipSpace.xy / clipSpace.w) / 2. + .5;
    vec3 colorT1 = texture2D(refraction, uv).rgb;
    vec3 colorT2 = texture2D(reflection, uv).rgb;

    vec3 color = mix(colorT1, colorT2, .5);
    gl_FragColor = vec4(color, 1.);
}
