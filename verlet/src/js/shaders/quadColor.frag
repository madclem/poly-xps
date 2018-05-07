precision highp float;

uniform vec3 color;

varying vec3 vPos;
varying vec2 vUv;

void main(void) {

    vec3 outColor = color;
    if(vUv.y > .99 || vUv.y < .01 || vUv.x > .99 || vUv.x < .01)
    {
        // discard;
    }

    float cx = smoothstep( 0.492, 0.5, abs(vUv.x - 0.5));
    float cy = smoothstep( 0.492, 0.5, abs(vUv.y - 0.5));
    float c = cy + cx; // could be min or max, try it yourself

    gl_FragColor = vec4(color * (1.0 - c), 1.);

    // gl_FragColor = vec4(outColor, 1.0);
}
