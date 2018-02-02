attribute vec3 position;
attribute float direction;
attribute vec3 aPrevious;
attribute vec3 aNext;
attribute vec2 aUv;
attribute float aCounters;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform float aspect;
uniform float thickness;

varying vec2 vUv;
varying vec2 vNormal;
varying float vCounters;


void main()
{
    vUv = aUv;

    vec2 aspectVec = vec2(aspect, 1.0);
    mat4 projViewModel = projectionMatrix * viewMatrix * modelMatrix;
    vec4 previousProjected = projViewModel * vec4(aPrevious, 1.0);
    vec4 currentProjected = projViewModel * vec4(position, 1.0);
    vec4 nextProjected = projViewModel * vec4(aNext, 1.0);

    vec2 currentScreen = currentProjected.xy / currentProjected.w * aspectVec;
    vec2 previousScreen = previousProjected.xy / previousProjected.w * aspectVec;
    vec2 nextScreen = nextProjected.xy / nextProjected.w * aspectVec;

    vCounters = aCounters;

    float len = thickness;
    float orientation = direction;

    vec2 dir = vec2(0.0);
    if (currentScreen == previousScreen)
    {
        dir = normalize(nextScreen - currentScreen);
    }
    else
    {
        dir = normalize(currentScreen - previousScreen);
    }

    vNormal = vec2(-dir.y, dir.x);
    vNormal *= len/2.0;
    vNormal.x /= aspect;

    vec4 offset =  vec4(vNormal * orientation, 0.0, 1.0);

    gl_Position = currentProjected + offset;
    gl_PointSize = 1.0;
}
