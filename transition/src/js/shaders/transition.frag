
precision highp float;

uniform float cutoff;
uniform sampler2D texture;

varying vec2 vUv;

void main(void)
{
    vec4 color = texture2D(texture, vUv);

    vec4 c = vec4(0.,0.,0., 1.0);

    if(color.b < cutoff)
    {
        c = vec4(1.,0.,0., 1.0);
    }

    gl_FragColor = c;
    // gl_FragColor = color;
    // gl_FragColor = vec4(1., 0., 0., 1.);
}
