import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import {mat3, mat4, vec3, vec4} from 'gl-matrix';

let target = vec3.create();

export default class MainScene
{
	constructor()
	{
		this.gl = null;
		this.tick = 0;
		this.gl = POLY.gl;

		this.mouse = {
			x:0,
			y:0
		}

		this.camera = new POLY.cameras.PerspectiveCamera();
		this.camera.perspective(45, POLY.GL.aspectRatio, 0.1, 100.0)

		this.orbitalControl = new POLY.control.OrbitalControl(this.camera.matrix);
		this.orbitalControl.lock(true);
		POLY.GL.setCamera(this.camera);

		this.viewBg = new ViewBg(window.ASSET_URL + 'image/sky_gradient.jpg');
		this._bPlanes = new POLY.helpers.BatchPlanes();

		this.program = new POLY.Program();
		this.sphere = new POLY.geometry.Sphere(this.program);
		this.sphere.scale.set(.2);
		this.sphere2 = new POLY.geometry.Sphere(this.program);
		this.sphere2.scale.set(.2);

		this.sphereIntersection = new POLY.geometry.Cube(this.program);
		this.sphereIntersection.scale.set(.2);

		this.sphereMouse = new POLY.geometry.Sphere(this.program);

		document.addEventListener('mousedown', this.onDown.bind(this));
		document.addEventListener('touchstart', this.onDown.bind(this));
		document.addEventListener('mouseup', this.onUp.bind(this));
		document.addEventListener('touchend', this.onUp.bind(this));
		document.addEventListener('mousemove', this.onMove.bind(this));
		document.addEventListener('touchmove', this.onMove.bind(this));
		document.addEventListener("keypress", this.onTraceRay.bind(this), false);

		this.viewRay = new POLY.geometry.Mesh(this.program, null, POLY.gl.LINES);
		this.viewRay.addPosition([
			0,0,0,
			0,1,0
		])


		this.planeP1 = [0,0,0]
		this.planeP2 = [1,1,0]
		this.planeP3 = [0, -1,0]


		let c1 = new POLY.geometry.Cube(this.program);
		c1.position.set(this.planeP1[0],this.planeP1[1],this.planeP1[2]);
		c1.scale.set(.2);

		let c2 = new POLY.geometry.Cube(this.program);
		c2.position.set(this.planeP2[0],this.planeP2[1],this.planeP2[2]);
		c2.scale.set(.2);

		let c3 = new POLY.geometry.Cube(this.program);
		c3.position.set(this.planeP3[0],this.planeP3[1],this.planeP3[2]);
		c3.scale.set(.2);

		let shape = new POLY.geometry.Mesh(this.program);
		shape.addPosition([
			this.planeP1[0], this.planeP1[1], this.planeP1[2],
			this.planeP2[0], this.planeP2[1], this.planeP2[2],
			this.planeP3[0], this.planeP3[1], this.planeP3[2],
		])

		this.geometries = [
			this.viewRay,
			// c1,
			// c2,
			// c3,
			// this.sphere,
			// this.sphere2,
			this.sphereIntersection,
			shape
		];
		this.rayCamera = new POLY.core.Ray();

	}

	onDown(e)
	{
		this.down = true;
	}


	onTraceRay()
	{
		this.rayCamera = this.camera.getRay([this.mouse.x, this.mouse.y, 1], this.rayCamera);
		let origin = this.orbitalControl._position;
		let direction = this.rayCamera.direction;

		vec3.copy(target, direction);
		vec3.scale(target, target, this.orbitalControl._radius);
		vec3.add(target, target, origin);

		this.viewRay.updatePosition('aPosition', [
			origin[0], origin[1], origin[2],
			target[0], target[1], target[2],
		]);

		this.findIntersection(origin, target);
	}
	onMove(e)
	{
		if(!this.down) return;


		let x = (e.clientX / POLY.gl.viewportWidth) * 2 - 1;
		let y = - (e.clientY / POLY.gl.viewportHeight) * 2 + 1;

		this.mouse.x = x;
		this.mouse.y = y;

		this.onTraceRay();
	}

	findIntersection(pt1, pt2)
	{
		// plane equation

		let p1 = this.planeP1;
		let p2 = this.planeP2;
		let p3 = this.planeP3;



		// a(x - x0) + b(y-y0) + c(z- z0) = 0
		let x0 = p1[0]
		let y0 = p1[1]
		let z0 = p1[2]

		// <a, b, c> is a vector perpendicular to the plane

		/* find perpendicular vector */
		// create 2 vectors
		let v1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]]
		let v2 = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]]

		// https://www.youtube.com/watch?v=0qYJfKG-3l8

		// cross product
		// |i     j     k
		// |v1[0] v1[1] v1[2]
		// |v2[0] v2[1] v2[2]

		// | v1[1] v1[2]|    -  |v1[0]v1[2]|    + |v1[0] v1[1]|
		// | v2[1] v2[2]| i     |v2[0]v2[2]| j    |v2[0] v2[1]|k

		// (v1[1] * v2[2] + v1[2] * v2[1]) * i - (v1[0] * v2[2] + v1[2] * v2[0]) * j + (v1[0] * v2[1] + v1[1] * v2[0]) * k
		let abc = [(v1[1] * v2[2] + v1[2] * v2[1]), - (v1[0] * v2[2] + v1[2] * v2[0]) ,  -(v1[0] * v2[1] + v1[1] * v2[0])]

		// let abc = vec3.create();
		// vec3.cross(abc, v1, v2)
		// abc[2] *= -1;
		// console.log(abc);

		// this.sphere.position.set(abc[0], abc[1], abc[2]);


		// plane equation
		// abc[0] * (x - x0) + abc[1] * (y-y0) + abc[2](z- z0) = 0
		// abc[0] * x - abc[0] * x0 + abc[1] * y - abc[1] * y0 + abc[2] * z - abc[2] * z0 = 0
		// abc[0] * x  +  abc[1] * y + abc[2] * z = abc[0] * x0 + abc[1] * y0 + abc[2] * z0;


		// line equation
		// r(t) = < pt1[0], pt1[1], pt1[2] > + t <pt2[0] - pt1[0], pt2[1] - pt1[1], pt2[2] - pt1[2]>
		// 1*) r(t) = pt1[0] + t * (pt2[0] - pt1[0]) , t * (pt2[1] - pt1[1]) + pt1[1] , t * (pt2[2] - pt1[2]) + pt1[2];

		// abc[0] * (pt1[0] + t * (pt2[0] - pt1[0]))  +  abc[1] * (t * (pt2[1] - pt1[1]) + pt1[1]) + abc[2] * (t * (pt2[2] - pt1[2]) + pt1[2]) = abc[0] * x0 + abc[1] * y0 + abc[2] * z0;
		// abc[0] * pt1[0] + abc[0] * t * (pt2[0] - pt1[0]) + abc[1] * pt1[1] + abc[1] * t * (pt2[1] - pt1[1]) + abc[2] * pt1[2] + abc[2] * t * (pt2[2] - pt1[2]) = abc[0] * x0 + abc[1] * y0 + abc[2] * z0;
		//  abc[0] * t * (pt2[0] - pt1[0]) + abc[1] * t * (pt2[1] - pt1[1]) + abc[2] * t * (pt2[2] - pt1[2]) = abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * pt1[0]- abc[1] * pt1[1] - abc[2] * pt1[2];
		// t * (abc[0] * (pt2[0] - pt1[0]) + abc[1] * (pt2[1] - pt1[1]) + abc[2] * (pt2[2] - pt1[2])) = abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * pt1[0]- abc[1] * pt1[1] - abc[2] * pt1[2];
		// t = (abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * pt1[0]- abc[1] * pt1[1] - abc[2] * pt1[2]) / (abc[0] * (pt2[0] - pt1[0]) + abc[1] * (pt2[1] - pt1[1]) + abc[2] * (pt2[2] - pt1[2]));

		// abc[0] * t * pt2[0] + abc[1] * t * pt2[1] + abc[2] * t * pt2[2] = abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * pt1[0] - abc[1] * pt1[1] - abc[2] * pt1[2]
		// t * (abc[0] * pt2[0] + abc[1] * pt2[1] + abc[2] * pt2[2]) = abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * pt1[0] - abc[1] * pt1[1] - abc[2] * pt1[2]
		// t = (abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * pt1[0] - abc[1] * pt1[1] - abc[2] * pt1[2]) / (abc[0] * pt2[0] + abc[1] * pt2[1] + abc[2] * pt2[2])

		// plane equation:
		// 0 = abc[0] * (p1[0] + t * p2[0] - x0) + abc[1] * (t * p2[1] + p1[1]-y0) + abc[2](t * p2[2] + p1[2]- z0)
		// 0 = abc[0] * p1[0] + abc[0]*(t * p2[0]) - abc[0]*x0
		// + abc[1]*(t * p2[1]) + abc[1]*p1[1] - abc[1]*y0
		// + abc[2]*(t * p2[2]) + abc[2]*p1[2] - abc[2] * z0

		// 0 = abc[0]*(t * p2[0]) + abc[1]*(t * p2[1]) + abc[2]*(t * p2[2])  ===> t
		// + abc[0] * p1[0] + abc[0]*x0  + abc[1]*p1[1] - abc[0]*y0 + abc[2]*p1[2] - abc[2] * z0


		// 0 = t * (abc[0] * p2[0] + abc[1] * p2[1] + abc[2] * p2[2]) + abc[0] * p1[0] + abc[0]*x0  + abc[1]*p1[1] - abc[0]*y0 + abc[2]*p1[2] - abc[2] * z0
		// t = -(abc[0] * p1[0] + abc[0]*x0  + abc[1]*p1[1] - abc[0]*y0 + abc[2]*p1[2] - abc[2] * z0) / (abc[0] * p2[0] + abc[1] * p2[1] + abc[2] * p2[2])
		// let t = -(abc[0] * p1[0] + abc[0]*x0  + abc[1]*p1[1] - abc[0]*y0 + abc[2]*p1[2] - abc[2] * z0) / (abc[0] * p2[0] + abc[1] * p2[1] + abc[2] * p2[2]);
		let t = (abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * pt1[0]- abc[1] * pt1[1] - abc[2] * pt1[2]) / (abc[0] * (pt2[0] - pt1[0]) + abc[1] * (pt2[1] - pt1[1]) + abc[2] * (pt2[2] - pt1[2]));

		// if(!t) t = 0;
		console.log('t', t);  
		console.log((abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * pt1[0]- abc[1] * pt1[1] - abc[2] * pt1[2]), (abc[0] * (pt2[0] - pt1[0]) + abc[1] * (pt2[1] - pt1[1]) + abc[2] * (pt2[2] - pt1[2])));

		// so when we replace the line above (1*))
		// = pt1[0] + t * pt2[0] , t * pt2[1] + pt1[1] , t * pt2[2] + pt1[2];
		let newx = t * (pt2[0] - pt1[0]) + pt1[0];
		let newy = t * (pt2[1] - pt1[1]) + pt1[1];
		let newz = t * (pt2[2] - pt1[2]) + pt1[2];

		// let l = pt1[0] + t * (pt2[0] - pt1[0]) , t * (pt2[1] - pt1[1]) + pt1[1] , t * (pt2[2] - pt1[2]) + pt1[2]

		// this.sphere.position.set(pt1[0], pt1[1], pt1[2]);
		this.sphere.position.set(pt2[0], pt2[1], pt2[2]);
		this.sphere2.position.set(pt1[0], pt1[1], pt1[2]);

		this.sphereIntersection.position.set(newx, newy, newz);
		// this.sphere.position.set(newx, newy, newz);
		// this.sphere2.position.set(pt2[0], pt2[1], pt2[2]);

		console.log('here');
		console.log(newx, newy, newz);


	}

	onUp(e)
	{
		this.down = false;
	}

	render()
	{
		this.orbitalControl.update();

		// this.viewBg.render();
		this._bPlanes.draw();
		this.tick++;

		this.program.bind();

		for (var i = 0; i < this.geometries.length; i++) {
			POLY.GL.draw(this.geometries[i]);
		}
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
