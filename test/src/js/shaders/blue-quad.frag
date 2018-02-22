
precision highp float;

uniform sampler2D refraction;
uniform sampler2D reflection;
uniform sampler2D dudvMap;
uniform float time;

// varying vec4 clipSpace;
varying vec4 clipSpace;
varying vec2 vUv;
varying vec3 vPos;
varying float visibility;
uniform vec3 cameraPosition;

uniform sampler2D gradientMap;

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}


const float waveStrength = 0.005;
#define SKY_COLOR vec3(27./255., 27./255., 27./255.)

void main(void)
{
    vec2 uv = vec2(clipSpace.xy / clipSpace.w) / 2. + .5;

    vec2 refractTexCoord = vec2(uv.x, uv.y);
    vec2 reflectTexCoord = vec2(uv.x, uv.y);

    vec2 distortion1 = (texture2D(dudvMap, vec2(vUv.x + time, vUv.y)).rg * 2.0 - 1.0) * waveStrength;
    vec2 distortion2 = (texture2D(dudvMap, vec2(-vUv.x + time, vUv.y + time)).rg * 2.0 - 1.0) * waveStrength;

    vec2 totalDistortion = distortion1 + distortion2;
    // vec2 totalDistortion = distortion1 + distortion2;

    refractTexCoord += totalDistortion;
    refractTexCoord = clamp(refractTexCoord, 0.001, 0.999);

    reflectTexCoord += totalDistortion;
    // reflectTexCoord = clamp(refractTexCoord, 0.001, 0.999);
    reflectTexCoord.x = clamp(reflectTexCoord.x, 0.001, 0.999);
    // reflectTexCoord.y = clamp(reflectTexCoord.y, 0.001, 0.999);

    vec3 refractColor = texture2D(refraction, refractTexCoord).rgb;
    vec3 reflectColor = texture2D(reflection, reflectTexCoord).rgb;

    vec3 viewVector = normalize(cameraPosition);
    float dotProduct = dot(viewVector, vec3(0.,1.,0.));

    vec3 color = mix(reflectColor, refractColor, dotProduct);
    // vec3 color = mix(refractColor, reflectColor, pow(dotProduct, 1.));
    color = mix(color, vec3(189.0/255.,50./255.,50./255.), 0.15);
    color = mix(SKY_COLOR, color, pow(visibility, .2));
    // color = mix(SKY_COLOR, color, pow(visibility, .2));


    float br = 1.0 - luma(color.rgb);
    vec2 uvGrad = vec2(br, 0.5);
    vec3 colorGrad = texture2D(gradientMap, uvGrad).rgb;
    color.rgb = mix(color.rgb, colorGrad, .5);

    // float dist = length(vPos) * (10.0 + sin(time * 10.) * 2.);
    // color = mix(vec3(1.0, 0., 0.), color, dist);


    // color +=  * dist;

    // gl_FragColor = vec4(dist, dist, dist, 1.);
    gl_FragColor = vec4(color, 1.);
}
