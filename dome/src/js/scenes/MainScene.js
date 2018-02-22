import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import {mat3, mat4} from 'gl-matrix';
import vert from '../shaders/sphere.vert';
import frag from '../shaders/sphere.frag';

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
		this._bPlanes = new POLY.helpers.BatchPlanes();

		this.texture = new POLY.Texture(window.ASSET_URL + 'image/sky_gradient3.jpg');

		console.log(vert, frag);
		this.program = new POLY.Program(vert, frag, {
			texture: {
				type: 'texture',
				value: 0
			}
		});
		this.sphere = new POLY.geometry.Sphere(this.program, {
			radius: 10,
			nbVert: 20
		});
		this.sphere.state.cullFace = true;
		console.log(this.sphere.uvs);
		this.sphere.addAttribute(this.sphere.uvs, 'aUv', 2);
	}

	render()
	{
		this.orbitalControl.update();
		// this.viewBg.render();
		this._bPlanes.draw();

		this.program.bind();
		this.texture.bind();
		POLY.GL.draw(this.sphere);
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
