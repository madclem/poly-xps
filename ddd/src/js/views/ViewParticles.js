import * as POLY from 'poly/Poly';
import ViewFBO1 from './ViewFBO1';
import ViewNoise from './ViewNoise';
import vert from '../shaders/particles.vert';
import frag from '../shaders/particles.frag';

export default class ViewParticles
{
    constructor(texture)
    {
        this.gl = POLY.gl;

        this.viewFBO1 = new ViewFBO1(); // to render the view without the water
		this.viewFBO1.setPos(-200, 100)

        this.viewNoise = new ViewNoise(256, 256);

    }

    render()
    {
        // this.time+=.1;
        this.viewNoise.render();
        // this.renderingProgram.bind();
		// this.dataTexture.bind(0);
        // this.renderingProgram.uniforms.time = this.time;
	    // POLY.GL.draw(this.geomRendering);
        //
        // POLY.gl.viewport(0, 0, 512, 512/POLY.GL.aspectRatio );
		// this.viewFBO1.render(this.dataTexture, 0);
    }
}
