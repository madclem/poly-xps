import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import vert from '../shaders/confetti.vert';
import frag from '../shaders/confetti.frag';
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

		this.time = 0;
		this.percentage = 0;

		this.program = new POLY.Program(vert, frag, {
			time: {
				type: 'float',
				value: 1
			}
		});

		let positions = [];
		let indices = [];
		let normals = [];
		let posOffset = [];
		let extra = [];
		let colors = [];

		const num = 200;

		let colorsRef = [[255, 0, 128],[18, 234, 234],[208, 245, 0],[109, 39, 126],[174, 240, 255]];

		positions.push(
			1.0, 0.0, 0.0,
			1.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 0.0,
		);

		normals.push(
			1.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
		);

		indices.push(
			3,
			2,
			1,
			3,
			1,
			0
		);

		for (var i = 0; i < num; i++) {


			let x = Math.random() * 50 - 50/2;
			let y = Math.random() * 50 - 50/2;
			let z = Math.random() * 50 - 50/2;
			posOffset.push(
				x, y, z,
			);

			let extrax = Math.random();
			let extray = Math.random();
			let extraz = Math.random();

			extra.push(
				extrax, extray, extraz,
			);

			let c = colorsRef[i % colorsRef.length];

			colors.push(
				c[0]/255, c[1]/255, c[2]/255,
			);
		}

		this.particles = 	new POLY.geometry.Mesh(this.program);
		this.particles.addPosition(positions, 'aVertexPosition')
		this.particles.addAttribute(posOffset, 'aPosOffset', 3, true)
		this.particles.addAttribute(extra, 'aExtra', 3, true)
		this.particles.addAttribute(colors, 'aColors', 3, true)
		this.particles.addIndices(indices);

		this.particles.instanceCount = num;




	}

	render()
	{

		this.tick++;

		this.orbitalControl.update();

		this.viewBg.render();

		this.program.bind();
		this.program.uniforms.time += .005;
		POLY.GL.draw(this.particles);
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
