
precision highp float;

varying vec2 vUv;
uniform sampler2D texture;
uniform sampler2D gradientMap;

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}


void main(void)
{
    // vec4 color = texture2D(gradientMap, vUv);
    vec4 color = texture2D(texture, vUv);

    float br = 1.0 - luma(color.rgb);
    vec2 uvGrad = vec2(br, 0.5);
    vec3 colorGrad = texture2D(gradientMap, uvGrad).rgb;
    color.rgb = mix(color.rgb, colorGrad, .5);

    gl_FragColor = vec4(color.rgb, 1.);
}
