import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import vert from '../shaders/planeToSphere.vert';
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
		this._bPlanes = new POLY.helpers.BatchPlanes();

		this.time = 0;
		this.percentage = 0;

		// create a shared program
		this.program = new POLY.Program(vert, null, {
			percentage: {
				type: 'float',
				value: 0
			},
			time: {
				type: 'float',
				value: 1
			}
		});

		this.plane = new POLY.geometry.Plane(this.program, {
			w: 4,
			h: 4,
			subdivision: 50,
			positionAttributeName: 'aPositionPlane',
		}, null, POLY.gl.POINTS);

		this.sphere = new POLY.geometry.Sphere(this.program, {
			nbVert: 50,
			radius: 2,
			positionAttributeName: 'aPositionSphere',
		}, null, POLY.gl.POINTS);

		console.log(this.sphere._vertices.length, this.plane._vertices.length);

	}

	render()
	{

		this.tick++;

		this.orbitalControl.update();

		this._bPlanes.draw();

		this.program.bind();
		this.program.uniforms.time = Math.abs(Math.cos(this.tick / 100));
		POLY.GL.draw(this.sphere);
		POLY.GL.draw(this.plane);
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
