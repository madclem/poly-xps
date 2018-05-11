precision highp float;

// uniform vec3 color;
uniform float alpha;
uniform sampler2D uTexture;

varying vec3 vPos;
varying vec2 vUv;
varying float shadow;

void main(void) {

    // vec3 outColor = vec3(1.);
    vec3 outColor = texture2D(uTexture, vUv.xy).rgb;
    // vec3 outColor = vNormal;
    if(vUv.y > .99 || vUv.y < .01 || vUv.x > .99 || vUv.x < .01)
    {
        // discard;
    }

    float cx = smoothstep( 0.492, 0.5, abs(vUv.x - 0.5));
    float cy = smoothstep( 0.492, 0.5, abs(vUv.y - 0.5));
    float c = cy + cx; // could be min or max, try it yourself

    // gl_FragColor = vec4(color * (1.0 - c), .12);



    // gl_FragColor = vec4(outColor * vLighting, 1.0);
    vec3 p = normalize(vPos);

    vec3 col = mix(outColor, vec3(0.0), shadow);
    gl_FragColor = vec4(col, 1.0);
    // gl_FragColor = vec4(col * (1.0 - c), 1.0);
    // gl_FragColor = vec4(outColor, alpha);
    // gl_FragColor.rgb *= alpha;
}
