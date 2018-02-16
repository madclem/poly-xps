import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import ViewTerrain from '../views/ViewTerrain';

import ViewMonolith from '../views/ViewMonolith';
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

		this.orbitalControl = new POLY.control.OrbitalControl(this.camera.matrix, 1);
		POLY.GL.setCamera(this.camera);

		this.viewBg = new ViewBg(window.ASSET_URL + 'image/sky_gradient3.jpg');
		this.fbo = new POLY.FrameBuffer(1024, 1024);
		this.fbo2 = new POLY.FrameBuffer(1024, 1024);

		this.viewMonolith = new ViewMonolith();
		// this.viewUnderWater = new ViewUnderWater();
		this.viewFBO1 = new ViewFBO1(); // to render the view without the water
		this.viewFBO1.setPos(-200, 100)
		this.viewFBO2 = new ViewFBO1(); // to render the view without the water
		this.viewFBO2.setPos(-200, 100)
		this._bPlanes = new POLY.helpers.BatchPlanes();

		this.dudvTexture = new POLY.Texture(window.ASSET_URL + 'image/dudvmap.png')
		this.bQProgram = new POLY.Program(vert, frag, {
			cameraPosition: {
                type: 'vec3',
                value: [0,0,0]
            },
			refraction: {
                type: 'texture',
                value: 0
            },
            reflection: {
                type: 'texture',
                value: 1
            },
            dudvMap: {
                type: 'texture',
                value: 2
            },
            time: {
                type: 'float',
                value: 0
            },
            density: {
                type: 'float',
                value: 0.065
            },
            gradient: {
                type: 'float',
                value: 21
            },
		});

		this.density = 0.065;
		this.gradient = 21;
		gui.add(this, 'density');
		gui.add(this, 'gradient');
		this.bQuad = new POLY.geometry.Quad(this.bQProgram);
		this.bQuad.addAttribute(this.bQuad.uvs, 'aUv', 2);
		this.bQuad.state.blend = true;
		this.bQuad.rotation.x = Math.PI/2;
		this.bQuad.scale.set(10);

		this.viewTerrain = new ViewTerrain();


	}

	render()
	{
		this.orbitalControl.update();

		this.viewBg.render();
		// this._bPlanes.draw();
		// this.viewTerrain.render();
		// this.viewBg.render();

		// reflection
		this.fbo.bind();
		this.viewBg.render();


		mat4.scale(this.camera.matrix, this.camera.matrix, [1, -1, 1]);
		this.viewTerrain.program.bind();
		this.viewTerrain.program.uniforms.clipY = 0;
		this.viewTerrain.program.uniforms.dir = -1;
		this.viewTerrain.render();

		this.viewMonolith.program.bind();
		this.viewMonolith.program.uniforms.clipY = 0;
		this.viewMonolith.program.uniforms.dir = -1;
		this.viewMonolith.render();
		this.fbo.unbind();
        //
		mat4.scale(this.camera.matrix, this.camera.matrix, [1, -1, 1]);

		// refraction
		this.fbo2.bind();
		// this.viewBg.render();
        //
		this.viewTerrain.program.bind();
		this.viewTerrain.program.uniforms.clipY = 0;
		this.viewTerrain.program.uniforms.dir = 1;
		this.viewTerrain.render();

		this.viewMonolith.program.bind();
		this.viewMonolith.program.uniforms.dir = 1;
		this.viewMonolith.render();
		// this.viewUnderWater.render();
		this.fbo2.unbind();

		this.viewMonolith.program.bind();
		this.viewMonolith.program.uniforms.clipY = 100;
		this.viewMonolith.render();
		// this.viewUnderWater.render();

		this.viewTerrain.program.bind();
		this.viewTerrain.program.uniforms.clipY = 100;
		this.viewTerrain.render();

		this.bQProgram.bind();
		// this.bQProgram.uniforms.density = this.density;
		// this.bQProgram.uniforms.gradient = this.gradient;
		this.bQProgram.uniforms.cameraPosition = this.orbitalControl._vec;
		this.bQProgram.uniforms.time += .001;
		this.bQProgram.uniforms.time %= 1;

		this.fbo2.gltexture.bind(0); // refraction
		this.fbo.gltexture.bind(1); // reflection
		this.dudvTexture.bind(2);
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
