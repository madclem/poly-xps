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

        this.t1 = new POLY.Texture(window.ASSET_URL + 'image/test1.png');
        this.t2 = new POLY.Texture(window.ASSET_URL + 'image/test2.png');
		this.program = new POLY.Program(vert, frag, {
            texture1: {
                type: 'texture',
                value: 0
            },
            texture2: {
                type: 'texture',
                value: 1
            },
        });
		this.quad = new POLY.geometry.Quad(this.program);
		// this.quad.rotation.x = Math.PI/2;
		this.quad.addAttribute(this.quad.uvs);

	}

	render()
	{
		this.orbitalControl.update();
		// this._bPlanes.draw();

        this.program.bind();
        this.t1.bind(0);
        this.t2.bind(1);
        POLY.GL.draw(this.quad);

	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
