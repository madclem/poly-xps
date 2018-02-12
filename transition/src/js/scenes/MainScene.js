import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import ViewTransition from '../views/ViewTransition';
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
		this.viewTransition = new ViewTransition(window.ASSET_URL + 'image/gradient4.jpg');
		this._bPlanes = new POLY.helpers.BatchPlanes();
	}

	render()
	{
		this.orbitalControl.update();
		this.viewBg.render();
		this.viewTransition.render();
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
