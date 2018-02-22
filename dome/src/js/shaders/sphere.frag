
precision highp float;

varying vec2 vUv;
uniform sampler2D texture;

void main(void)
{
    // vec4 color = vec4(0.);
    vec4 color = texture2D(texture, vUv);
    gl_FragColor = vec4(color.rgb, 1.);
}
