import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import {mat3, mat4} from 'gl-matrix';
import vert from '../shaders/mesh.vert';
import frag from '../shaders/mesh.frag';

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

		this.program = new POLY.Program(vert, frag, {
			texture: {
				type: "texture",
				value: 0
			}
		});
		// this.rock = new POLY.geometry.IcoSphere(this.program);
		// this.rock = new POLY.geometry.Mesh(this.program);
		// this.rock = new POLY.geometry.Sphere(this.program, {
		// 	nbVert: 3
		// });
		//
		// for (var i = 0; i < this.rock._vertices.length; i+=3) {
		// 	let random = 1 + Math.random() * .3 - .3/2;
		// 	this.rock._vertices[i] *= (1 + Math.random() * .2);
		// 	// this.rock._vertices[i + 1] *= (1 + Math.random() * .2);
		// 	// this.rock._vertices[i + 2] *= (1 + Math.random() * .2);
		// }
		//
		// this.rock.updateAttribute('aPosition', this.rock._vertices)
		// console.log(this.rock);

		// let nbPoints = 5;
		//
		// for (var i = 0; i < nbPoints; i++)
		// {
		//
		// }

		// const cacheObj = Cache.getText('castle');
		// mesh = POLY.loaders.OBJLoader.parse(cacheObj);

		let obj = `

		mtllib pyramid-top.mtl
		v -4.13685 9.55999 4.13685
		v 4.13685 9.55999 4.13685
		v 4.13685 9.55999 -4.13685
		v -4.13685 9.55999 -4.13685
		v 0 23.6994 -0
		v -3.78027 10.7787 3.78027
		v 3.78027 10.7787 3.78027
		v 3.78027 10.7787 -3.78027
		v -3.78027 10.7787 -3.78027
		v -4.44925 9.56378 4.46195
		v 4.44925 9.56378 4.46195
		v 4.44925 9.56378 -4.46195
		v -4.44925 9.56378 -4.46195
		v -4.08929 10.7825 4.10096
		v 4.08929 10.7825 4.10096
		v 4.08929 10.7825 -4.10096
		v -4.08929 10.7825 -4.10096
		# 17 vertices

		vt 0.03806 0.80332
		vt 0.19716 0.80332
		vt 0.19716 0.96242
		vt 0.03806 0.96242
		vt 0.33825 0.48462
		vt 0.78364 0.51910
		vt 0.73648 0.28221
		vt 0.70058 0.74591
		vt 0.51160 0.89633
		vt 0.57291 0.10450
		vt 0.88733 0.52409
		vt 0.92940 0.52735
		vt 0.87290 0.24791
		vt 0.83540 0.26726
		vt 0.79694 0.76924
		vt 0.83106 0.79407
		vt 0.59071 0.93089
		vt 0.60668 0.96995
		vt 0.67866 0.04034
		vt 0.65687 0.07648
		vt 0.39073 0.96065
		vt 0.39667 0.96682
		vt 0.39667 0.80910
		vt 0.39073 0.81527
		vt 0.20317 0.79706
		vt 0.20317 0.96867
		vt 0.24534 0.96065
		vt 0.23940 0.96682
		vt 0.03205 0.96867
		vt 0.24534 0.81527
		vt 0.23940 0.80910
		vt 0.03205 0.79706
		# 32 texture coordinates

		vn -0.00404674 -0.999984 0.00388865
		vn 0.00404674 -0.999984 0.00388865
		vn 0.00404674 -0.999984 -0.00388865
		vn -0.00404674 -0.999984 -0.00388865
		vn 0 1 -0
		vn 0.327748 0.886037 -0.327902
		vn 0.327748 0.886037 0.327902
		vn -0.327748 0.886037 -0.327902
		vn -0.327748 0.886037 0.327902
		vn 0.326995 0.886621 -0.327073
		vn 0.489436 -0.721975 -0.489086
		vn 0.489436 -0.721975 0.489086
		vn 0.326995 0.886621 0.327073
		vn -0.326995 0.886621 -0.327073
		vn -0.489436 -0.721975 -0.489086
		vn -0.326995 0.886621 0.327073
		vn -0.489436 -0.721975 0.489086
		# 17 vertex normals

		usemtl None
		f 4/4/4 3/3/3 2/2/2 1/1/1
		f 7/7/7 8/6/6 5/5/5
		f 8/6/6 9/8/8 5/5/5
		f 9/8/8 6/9/9 5/5/5
		f 6/10/9 7/7/7 5/5/5
		f 15/14/13 11/13/12 12/12/11 16/11/10
		f 16/11/10 12/12/11 13/16/15 17/15/14
		f 17/15/14 13/16/15 10/18/17 14/17/16
		f 14/20/16 10/19/17 11/13/12 15/14/13
		f 7/24/7 15/23/13 16/22/10 8/21/6
		f 3/3/3 12/26/11 11/25/12 2/2/2
		f 8/21/6 16/22/10 17/28/14 9/27/8
		f 4/4/4 13/29/15 12/26/11 3/3/3
		f 9/27/8 17/28/14 14/31/16 6/30/9
		f 1/1/1 10/32/17 13/29/15 4/4/4
		f 6/30/9 14/31/16 15/23/13 7/24/7
		f 2/2/2 11/25/12 10/32/17 1/1/1
		# 17 facets
		`;
		// console.log(POLY.loadedResources);
		this.textureTop = new POLY.Texture(window.ASSET_URL + 'image/pyramid-top.jpg');
		let buffers = POLY.loaders.OBJLoader.parse(POLY.loadedResources[window.ASSET_URL + 'model/pyramid-top.obj'].data);


		console.log(buffers.coords);
		this.rock = new POLY.geometry.Mesh(this.program);
		this.rock.addPosition(buffers.positions);
		this.rock.addIndices(buffers.indices);
		this.rock.addAttribute(buffers.coords, 'aUv', 2);

		this.rock.scale.set(.1)
		// POLY.loaders.OBJLoader();
	}

	render()
	{
		this.orbitalControl.update();
		// this.viewBg.render();
		this._bPlanes.draw();

		this.program.bind();
		this.textureTop.bind(0);
		POLY.GL.draw(this.rock);
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
