import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import ViewTerrain from '../views/ViewTerrain';
import vert from '../shaders/blue-quad.vert';
import frag from '../shaders/blue-quad.frag';
import {mat3, mat4} from 'gl-matrix';

export default class TerrainScene
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
		this.viewTerrain = new ViewTerrain();
	}

	render()
	{
		this.orbitalControl.update();

		this.viewBg.render();
		this.viewTerrain.render();
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
