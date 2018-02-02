import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import vert from '../shaders/line.vert';
import frag from '../shaders/line.frag';
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

		this.points = [];
	    for (var i = 0; i < 40; i++)
		{
            this.points.push([-10 + 20/40 * i, Math.cos(i/5), 0]);
        }

		// create a shared program
		this.program = new POLY.Program(vert, frag, {
			aspect: {
				type: 'float',
				value: POLY.GL.aspectRatio
			},
			thickness: {
				type: 'float',
				value: .1
			}
		});

		this.line = new POLY.geometry.Line(this.program, this.points, null, 4);

		this.texture = new POLY.Texture(window.ASSET_URL + 'image/sky_gradient.jpg');
	}

	updatePoints()
	{
		for (var i = 0; i < this.points.length; i++) {
			this.points[i][1] = Math.cos(i/4 + this.tick / 20);
			this.points[i][2] = Math.sin(i/4 + this.tick / 20);
		}

		this.line.update(this.points)
	}

	render()
	{

		this.tick++;

		this.updatePoints();
		this.orbitalControl.update();

		this._bPlanes.draw();

		this.program.bind();
		this.texture.bind();
		POLY.GL.draw(this.line);
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
