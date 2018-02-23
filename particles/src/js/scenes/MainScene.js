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
		this._fboTest = new POLY.FrameBuffer(256, 256, true);

		//	views
		this._vFBO = new ViewFBO();
		// this._vFBO.setPos(-200, 100)
		this._vSave = new ViewSave();
		this._vSim 	  = new ViewSim();
		this._vRender = new ViewRender();

		this._fboCurrent.bind();
		this._vSave.render();
		this._fboCurrent.unbind();

		this._fboTarget.bind();
		this._vSave.render();
		this._fboTarget.unbind();

		// this.gl.clearColor(0,0,0,1);
	    // this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		// this._vSave.render();
		// this._bPlanes.draw();

		// POLY.gl.viewport(0, 256, 256, 256/POLY.GL.aspectRatio);
		// this._vFBO.render(this._fboTarget.getTexture(0));

		// this._fboTest.bind();
		// this._vSave.render();
		// this._fboTest.bind();
	}

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

		// if(this.tick < 6)
		// {
		//
		//
		// 	this.firstTime = true;
		// 	this._fboCurrent.bind();
		// 	this._vSave.render();
		// 	// this._bPlanes.draw();
		// 	this._fboCurrent.unbind();
		//
		// 	this._fboTarget.bind();
		// 	this._vSave.render();
		// 	// this._bPlanes.draw();
		// 	this._fboTarget.unbind();
		//
		// 	this._fboTest.bind();
		// 	this._vSave.render();
		// 	// this._bPlanes.draw();
		// 	this._fboTest.unbind();
		//
		// 	this.tick++;
		//
		// 	// POLY.gl.viewport(0, 256, 256, 256/POLY.GL.aspectRatio);
		// 	// this._vFBO.render(this._fboTest.getTexture(0));
		// 	this._fboTest.clear();
		// 	this._fboTarget.clear();
		// 	this._fboCurrent.clear();
		// 	// this._fboTest.clear();
		//
		// 	return;
		// }
		//
		//
		//
		if(this.tick % 100 == 0)
		{
			// console.log('here');
			// this.tick = 0;
			// this.updateFbo();
		}

		this.tick = 0;
		this.updateFbo();

		this.tick++;

		// this.updateFbo();
		let p = this.tick / 100;


		// this._vSave.render();
		// POLY.gl.clear(0, 0, 0, 0);
		// this._fboTest.bind();
		// this._vSim.render(this._fboCurrent.getTexture(1), this._fboCurrent.getTexture(0), this._fboCurrent.getTexture(2));
		// this._fboTest.unbind();
		this._vRender.render(this._fboCurrent.getTexture(0),this._fboTarget.getTexture(0), 1, this._fboCurrent.getTexture(2));
		this._bPlanes.draw();
		// const size = Math.min(256, POLY.gl.canvas.height/4);

		// for(let i=0; i<4; i++) {
		// 	POLY.GL.viewport(0, size * i, size, size);
		//
		// //
		// // POLY.gl.viewport(512, 0, 512, 512/POLY.GL.aspectRatio );
		// // this.viewFBO1.render(this.fbo.textures[0], 0);
		//
		// 	this._bCopy.draw(this._fboCurrent.getTexture(i));
		// }

		// this._fboTarget.bind();
		// this._vSim.render(this._fboCurrent.getTexture(1), this._fboCurrent.getTexture(0), this._fboCurrent.getTexture(2));
		// this._fboTarget.unbind();
		//
		// POLY.gl.viewport(0, 256, 256, 256/POLY.GL.aspectRatio);
		// this._vFBO.render(this._fboTest.getTexture(0));

		// for (var i = 0; i < 4; i++) {
		// 	// POLY.gl.viewport(i * 256, 0, 256, 256/POLY.GL.aspectRatio);
		// 	this._vFBO.render(this._fboTarget.getTexture(i));
		//
		// }
		//
		// for (var i = 0; i < 4; i++) {
		// 	POLY.gl.viewport(i * 256, 256/POLY.GL.aspectRatio, 256, 256/POLY.GL.aspectRatio);
		// 	this._vFBO.render(this._fboCurrent.getTexture(i));
		//
		// }
		// this._fboTarget.clear();
		// this._fboCurrent.clear();
		// this._fboTest.clear();
		// //


	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
