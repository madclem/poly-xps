precision highp float;

uniform vec3 color;
uniform sampler2D uDefaultImage;
uniform sampler2D uRevealImage;
uniform sampler2D uTransitionImage;
uniform float active;
uniform float percentage;
uniform float percentageBlack;
uniform float percentageTransition;
uniform vec3 colorGradient;

varying vec3 vPos;
varying vec2 vUv;
varying vec2 vUv2;
varying float shadow;


//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main(void) {
    float overlayThickness = .6;
    // TEXTURE COLOR, IF PNG WITH TRANSPARENCY, GET DEFAULT COLOR
    vec4 texel = texture2D(uDefaultImage, vUv.xy);
    vec3 outColor = mix(color, texel.rgb, texel.a);

    // IF TRANSITION (ICON -> IMAGE), then blend the colors

    vec2 p1 = vUv2;
    vec2 p2 = vec2(.5);
    float dist = distance(p1, p2);

    float col = 0.;
    // float n = dist;
    float radialWhite = abs((p1.x * 2.0) - 1.0) * abs((p1.y * 2.0) - 1.0);


    vec4 texelTransition = texture2D(uTransitionImage, vUv.xy);
    float n = snoise(vUv);// * radialWhite;
    float n2 = snoise(vUv * 2.);// * radialWhite;

    // col = n;
    // if(percentageTransition > texelTransition.g)
    // {
    //     col = 1.;
    // }

    // float lastN = n;
    // col = abs(n * n2);


    vec3 texelRevealImage = texture2D(uRevealImage, vUv.xy).rgb;
    outColor = mix(outColor, texelRevealImage, texelTransition.r);

    // COLOR GRADIENT, WHEN QUAD IS ACTIVE!
    float x = pow(vUv.y, 2.);
    vec3 colorAfterGradient = mix(outColor, colorGradient, x * active * percentage);

    // APPLY THE SHADOW PASSED FROM VERTEXT SHADER
    vec3 colourAfterShadow = mix(colorAfterGradient, vec3(0.0), shadow);

    // ADD A DARK OVERLAY IF NON ACTIVE AND IF THERE IS AN ACTIVE QUAD SOMEWHERE
    colourAfterShadow = mix(colourAfterShadow, vec3(0.0), percentage * overlayThickness * (1.0 - active));

    // ADD A FADE TO COMPLETE BLACK FOR WHEN CLICK ON MENU
    vec3 colourAfterBlackPercentage = mix(colourAfterShadow, vec3(0.0), percentageBlack);

    // vec2 p1 = vUv;
    // vec2 p2 = vec2(.5);
    // float dist = distance(p1, p2);


    // gl_FragColor = vec4(texelTransition.rgb, 1.0);
    // gl_FragColor = vec4(vec3(col), 1.0);
    // gl_FragColor = vec4(vec3(n), 1.0);
    gl_FragColor = vec4(colourAfterBlackPercentage, 1.0);
    // vec3 col = vec3(dist - percentageTransition);
}
