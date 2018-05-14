precision highp float;

uniform vec3 color;
uniform float alpha;
uniform float hasColor;
uniform sampler2D uTexture;
uniform float active;
uniform float percentage;
uniform vec3 colorGradient;

varying vec3 vPos;
varying vec2 vUv;
varying float shadow;

void main(void) {

    vec4 texel = texture2D(uTexture, vUv.xy);
    vec3 outColor = texel.rgb;
    // vec3 outColor = vNormal;
    if(texel.a <= .1)
    {
        outColor = color;
    }

    float cx = smoothstep( 0.492, 0.5, abs(vUv.x - 0.5));
    float cy = smoothstep( 0.492, 0.5, abs(vUv.y - 0.5));
    float c = cy + cx; // could be min or max, try it yourself

    // gl_FragColor = vec4(color * (1.0 - c), .12);



    float x = pow(vUv.y, 2.);
    vec3 colorAfterGradient = mix(outColor, colorGradient, x * active * percentage);

    // gl_FragColor = vec4(outColor * vLighting, 1.0);
    vec3 p = normalize(vPos);

    vec3 col = mix(colorAfterGradient, vec3(0.0), shadow);

    col = mix(col, vec3(0.0), percentage * .6 * (1.0 - active));

    // col += vec3(1.) * active;
    // gl_FragColor = vec4(vec3(x), 1.0);
    gl_FragColor = vec4(col, 1.0);
    // gl_FragColor = vec4(col * (1.0 - c), 1.0);
    // gl_FragColor = vec4(outColor, alpha);
    // gl_FragColor.rgb *= alpha;
}
