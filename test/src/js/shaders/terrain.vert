attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float gradient;
uniform float density;

varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWsPosition;
varying float visibility;


void main(void) {

    // float density = .22;
    // float gradient = 10.;

    vec4 worldPosition = modelMatrix * vec4(aPosition, 1.0);
    vWsPosition	= vec4(modelMatrix * vec4(aPosition, 1.0)).xyz;

    vPos = aPosition;
    vNormal = aNormal;

    vec4 positionRelativeToCamera = viewMatrix * worldPosition;

    gl_Position =  projectionMatrix * positionRelativeToCamera;

    float distance = length(worldPosition.xyz);
    visibility = exp(-pow((distance * density), gradient));
    // visibility = distance;
    visibility = clamp(visibility, 0., 1.);
}
