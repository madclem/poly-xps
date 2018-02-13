import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import ViewTopWater from '../views/ViewTopWater';
import ViewUnderWater from '../views/ViewUnderWater';
import ViewFBO1 from '../views/ViewFBO1';
import vert from '../shaders/blue-quad.vert';
import frag from '../shaders/blue-quad.frag';
import {mat3, mat4} from 'gl-matrix';

export default class MainScene
{
	constructor()
	{
		this.gl = null;
		this.tick = 0;
		this.gl = POLY.gl;

		this.camera = new POLY.cameras.PerspectiveCamera();
		this.camera.perspective(45, POLY.GL.aspectRatio, 0.1, 100.0)

		this.orbitalControl = new POLY.control.OrbitalControl(this.camera.matrix);
		POLY.GL.setCamera(this.camera);

		this.viewBg = new ViewBg(window.ASSET_URL + 'image/sky_gradient.jpg');
		this.fbo = new POLY.FrameBuffer(1024, 1024);
		this.fbo2 = new POLY.FrameBuffer(1024, 1024);

		this.viewTopWater = new ViewTopWater();
		this.viewUnderWater = new ViewUnderWater();
		this.viewFBO1 = new ViewFBO1(); // to render the view without the water
		this.viewFBO1.setPos(-200, 100)
		this.viewFBO2 = new ViewFBO1(); // to render the view without the water
		this.viewFBO2.setPos(-200, 100)
		this._bPlanes = new POLY.helpers.BatchPlanes();

		this.bQProgram = new POLY.Program(vert, frag, {
			refraction: {
                type: 'texture',
                value: 0
            },
            reflection: {
                type: 'texture',
                value: 1
            },
		});
		this.bQuad = new POLY.geometry.Quad(this.bQProgram);
		this.bQuad.state.blend = true;
		this.bQuad.rotation.x = Math.PI/2;
		this.bQuad.scale.set(2);

	}

	render()
	{
		this.orbitalControl.update();

		this.viewBg.render();
		this._bPlanes.draw();

		// reflection
		this.fbo.bind();
		// this.viewBg.render();
		mat4.scale(this.camera.matrix, this.camera.matrix, [1, -1, 1]);
		this.viewTopWater.program.bind();
		this.viewTopWater.program.uniforms.clipY = 0;
		this.viewTopWater.program.uniforms.dir = -1;
		this.viewTopWater.render();
		this.fbo.unbind();

		mat4.scale(this.camera.matrix, this.camera.matrix, [1, -1, 1]);

		// refraction
		this.fbo2.bind();
		// this.viewBg.render();
        //
		this.viewTopWater.program.bind();
		this.viewTopWater.program.uniforms.dir = 1;
		this.viewTopWater.render();
		this.viewUnderWater.render();
		this.fbo2.unbind();

		this.viewTopWater.program.bind();
		this.viewTopWater.program.uniforms.clipY = 100;
		this.viewTopWater.render();
		this.viewUnderWater.render();

		this.bQProgram.bind();

		this.fbo2.gltexture.bind(0); // refraction
		this.fbo.gltexture.bind(1); // reflection
		POLY.GL.draw(this.bQuad);


		// POLY.gl.viewport(0, 0, 512, 512/POLY.GL.aspectRatio );
		// this.viewFBO2.render(this.fbo2.textures[0], 0);
        //
		// POLY.gl.viewport(512, 0, 512, 512/POLY.GL.aspectRatio );
		// this.viewFBO1.render(this.fbo.textures[0], 0);

		this.fbo.clear();
		this.fbo2.clear();
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
