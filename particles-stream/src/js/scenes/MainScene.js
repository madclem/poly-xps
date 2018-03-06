import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import ViewFBO from '../views/ViewFBO';
import ViewSave from '../views/ViewSave';
import ViewRender from '../views/ViewRender';
import ViewSim from '../views/ViewSim';
import {mat3, mat4} from 'gl-matrix';

export default class MainScene
{
	constructor()
	{
		this.gl = null;
		this.tick = 0;
		this.count = 0;
		this.gl = POLY.gl;

		this.camera = new POLY.cameras.PerspectiveCamera();
		this.camera.perspective(45, POLY.GL.aspectRatio, 0.1, 100.0)

		this.orbitalControl = new POLY.control.OrbitalControl(this.camera.matrix);
		POLY.GL.setCamera(this.camera);

		this.viewBg = new ViewBg(window.ASSET_URL + 'image/sky_gradient.jpg');
		this._bPlanes = new POLY.helpers.BatchPlanes();

		this._fboCurrent = new POLY.FrameBuffer(256, 256, true);
		this._fboTarget = new POLY.FrameBuffer(256, 256, true);

		//	views
		this._vFBO = new ViewFBO(); // only to render the FBOS
		this._vSave = new ViewSave(); // only used once, to initiat the FBOs textures
		this._vSim 	  = new ViewSim(); // will simulate the physics (velocity, acceleration, noise!)
		this._vRender = new ViewRender(); // will render on screen!

		// initiate the FBOs textures (4 per FBO)
		this._fboCurrent.bind();
		this._vSave.render();
		this._fboCurrent.unbind();

		this._fboTarget.bind();
		this._vSave.render();
		this._fboTarget.unbind();
	}

	// would be good to to that https://github.com/modderme123/fluid/blob/master/script.js
	updateFbo()
	{
		this._fboTarget.bind();
		POLY.gl.clear(0, 0, 0, 1);
		this._vSim.render(this._fboCurrent.getTexture(1), this._fboCurrent.getTexture(0), this._fboCurrent.getTexture(2));
		this._fboTarget.unbind();

		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;

	}

	render()
	{

		this.orbitalControl.update();
		// only every 10 frames for optimisations
		if(this.tick % 10 === 0)
		{
			this.tick = 0;
		}

		this.updateFbo();
		// this.tick++;

		let p = this.tick / 10; // so we need to pass a percentage to tween the positions
		// /!\ if you look into updateFbo(), let tmp          = this._fboCurrent; AND this._fboTarget  = tmp;
		// so fboTarget is in fact the currentTexture, that's why the first argument below is the currentTexture
		// and the second one is the targetTexture (this._fboCurrent = this._fboTarget; above)
		// this._fboCurrent.getTexture(2) is the extra, and affects only the colors and the size of the particle
		this._vRender.render(this._fboTarget.getTexture(0),this._fboCurrent.getTexture(0), 1, this._fboCurrent.getTexture(2));

		// this._bPlanes.draw();
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);
	}
}
