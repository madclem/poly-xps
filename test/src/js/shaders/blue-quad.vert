precision highp float;

attribute vec3 aPosition;
attribute vec2 aUv;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;

uniform float gradient;
uniform float density;

varying vec4 clipSpace;
varying vec3 vPos;
varying vec2 vUv;
varying vec3 toCameraVector;
varying float visibility;

const float tiling = 6.0;


void main(void) {
    vUv = aUv;

    vPos = aPosition;
    vec4 worldPosition = modelMatrix * vec4(aPosition, 1.0);
    vec4 positionRelativeToCamera = viewMatrix * worldPosition;
    clipSpace = projectionMatrix * positionRelativeToCamera;
    gl_Position = clipSpace;
    gl_PointSize = 1.0;

    vUv = vec2(aPosition.x / 2.0 + .5, aPosition.y / 2.0 + .5) * tiling;
    toCameraVector = cameraPosition - worldPosition.xyz;




    float distance = length(positionRelativeToCamera.xyz);
    visibility = exp(-pow((distance * density), gradient));
    // visibility = distance;
    visibility = clamp(visibility, 0., 1.);

    // float distance = length(positionRelativeToCamera.xyz);
    // visibility = exp(-pow((distance * density), gradient));
    // visibility = clamp(visibility, 0., 1.);
}
