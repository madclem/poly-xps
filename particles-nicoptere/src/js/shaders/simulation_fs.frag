precision mediump float;

uniform sampler2D uPositionsTexture;
varying vec2 vUv;

void main() {
 
    //basic simulation: displays the particles in place.
    vec3 pos = texture2D( uPositionsTexture, vUv ).rgb;
    /*
        we can move the particle here 
    */
    gl_FragColor = vec4( pos,1.0 );
}