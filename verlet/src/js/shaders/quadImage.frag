precision highp float;

uniform vec3 color;
uniform vec3 colorMenu;
uniform sampler2D uDefaultImage;
uniform sampler2D uRevealImage;
uniform sampler2D uTransitionImage;
uniform float active;
uniform float percentage;
uniform float percentageBlack;
uniform float percentageTransition;
uniform float TtoBorRtoL;
uniform float percentageLogoMenu;

// for transition (MENU)
// isIcon = in order to not have weird black border, we need to add + .002 or -.002 depending if we're showing the menu or not...
uniform float isIcon; // - 1 or 1
uniform float percentageX;
uniform float percentageY;

uniform vec3 colorGradient;

varying vec3 vPos;
varying vec2 vUv;
varying float shadow;

void main(void) {
    float overlayThickness = .6;
    // TEXTURE COLOR, IF PNG WITH TRANSPARENCY, GET DEFAULT COLOR
    vec4 texel = texture2D(uDefaultImage, vUv.xy);
    vec3 outColor = mix(color, texel.rgb, texel.a);

    // IF TRANSITION (ICON -> IMAGE), then blend the colors
    vec4 texelTransition = texture2D(uTransitionImage, vUv.xy);
    vec3 texelRevealImage = texture2D(uRevealImage, vUv.xy).rgb;
    outColor = mix(outColor, texelRevealImage, texelTransition.r);

    // COLOR GRADIENT, WHEN QUAD IS ACTIVE!
    float x = pow(vUv.y, 2.);
    vec3 colorAfterGradient = mix(outColor, colorGradient, x * active * percentage);

    // APPLY THE SHADOW PASSED FROM VERTEXT SHADER
    vec3 colorAfterShadow = mix(colorAfterGradient, vec3(0.0), shadow);

    // ADD A DARK OVERLAY IF NON ACTIVE AND IF THERE IS AN ACTIVE QUAD SOMEWHERE
    colorAfterShadow = mix(colorAfterShadow, vec3(0.0), percentage * overlayThickness * (1.0 - active));

    // ADD A FADE TO COMPLETE BLACK FOR WHEN CLICK ON MENU
    vec3 colorAfterBlackPercentage = mix(colorAfterShadow, vec3(0.0), percentageBlack);

    // ADD A TRANSITION FROM R TO L OR T TO B OR INVERSED
    float topToBottom0or1 = 0. + TtoBorRtoL * 1.;
    float topToBottom = -1. + TtoBorRtoL * 2.;

    vec2 v1 = vec2(percentageX, percentageY);
    vec2 v2 = vec2(topToBottom0or1 - (vUv.x) * topToBottom + isIcon * .004, topToBottom0or1 - vUv.y * topToBottom + isIcon * .004);

    vec2 mask = vec2(greaterThan(v1, v2));
    vec3 colorAfterTransitionMenu = mix(colorAfterBlackPercentage, colorMenu, mask.x + mask.y);

    // LAST STEP: show the main logo (at the point it's up to the dev to have swap the texture
    // (after PercentageX or percentageY = 1.0) so the image is hidden
    vec3 lastColor = mix(colorAfterTransitionMenu, texel.rgb, percentageLogoMenu * texel.a);

    // lastColor = color;
    // gl_FragColor = vec4(vec3(mask.x), 1.0);
    gl_FragColor = vec4(lastColor, 1.0);
}
