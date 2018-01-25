precision mediump float;

uniform sampler2D uTexture;

varying vec3 vPos;
varying vec2 vUv;

void main(void) {

	vec4 textureColor = texture2D(uTexture, vec2(vPos.s, vPos.t));
	gl_FragColor = vec4(textureColor.rgb, 1.0);
}