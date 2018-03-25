import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import Physics from '../Physics';
import PointMass from '../views/ViewPointMass';
import PointQuad from '../views/ViewPointQuad';
import ViewQuad from '../views/ViewQuad';
import SpeedController from '../control/SpeedController';
import {mat3, mat4, vec3} from 'gl-matrix';

let target = vec3.create();

const getCursorPos = function (e) {
    if(e.touches) {
        return {
            x:e.touches[0].pageX,
            y:e.touches[0].pageY
        };
    } else {
        return {
            x:e.clientX,
            y:e.clientY
        };
    }
};

export default class MainScene
{
	constructor()
	{

		this.debug = true;
		this.gl = null;
		this.tick = 0;
		this.gl = POLY.gl;

		this.camera = new POLY.cameras.PerspectiveCamera();
		this.camera.perspective(45, POLY.GL.aspectRatio, 0.1, 100.0)

		this.orbitalControl = new POLY.control.OrbitalControl(this.camera.matrix);
		this.orbitalControl.lock(true);
		// this.orbitalControl.lockZoom(true);
		POLY.GL.setCamera(this.camera);


		this.projectionMatrix = mat4.create();

		this._bPlanes = new POLY.helpers.BatchPlanes();


		this.gridHeight = 4;
		this.gridWidth = 8;
		this.restingDistances = 1;
		this.stiffnesses = .04;

		this.pointsGrid = [];
		this.pointsQuad = [];
		this.views = [];
		this.viewsVerlet = [];

		this.physics = new Physics();
		this.createGridPoints();
		this.createQuads();
		this.createQuadsVerlet();

		this.limitMinY = -(this.gridHeight * this.restingDistances)/2 + this.restingDistances/2;
		this.limitMinX = -(this.gridWidth * this.restingDistances)/2 + this.restingDistances/2;

		this.program = new POLY.Program();
		this.viewRay = new POLY.geometry.Mesh(this.program, null, POLY.gl.LINES);
		this.viewRay.addPosition([
			0,0,0,
			0,1,0
		]);

		this.sphereIntersection = new POLY.geometry.Sphere(this.program);
		this.sphereIntersection.scale.set(.05);

		this.cubeTest = new POLY.geometry.Cube(this.program);
		this.cubeTest.scale.set(.1);

		this.rayCamera = new POLY.core.Ray();

		this.mouse = { x: 0, y: 0}
		this.planeP1 = [0,0,0]
		this.planeP2 = [1,1,0]
		this.planeP3 = [0, -1,0]

		this.addEvents();

		this.pinnedPoints = [];
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

		let intersection = this.findIntersection(origin, target);
		this.intersection = intersection;

		this.findNeighbours(intersection);
		//
		this.impactVerlet(intersection);
	}

	impactVerlet(pt)
	{
		// optimise here, dont loop through all the points

		let minDist = this.restingDistances;

		for (let y = 0; y < this.gridHeight; y++)
		{
			for (let x = 0; x < this.gridWidth; x++)
			{
				let index = this.getPointsAtCoordinates(x, y);

				let pG = this.pointsGrid[index];

				let dist = Math.pow(pt.x - pG.x, 2) + Math.pow(pt.y - pG.y, 2);

				if(dist <= minDist)
				{
					let depth = this.map(dist, 0, minDist, -.04, 0);
					console.log('here', depth);
					// pG.program.uniforms.color = [.2, .2, .2]

					pG.test = true;
					pG.accZ = depth;
					// pG.pinTo(null, null, depth);
				}
				else {
					// pG.unpin();
					pG.accZ = 0;
				}

			}
		}
	}

	findIntersection(pt1, pt2)
	{
		// plane equation
		let p1 = this.planeP1;
		let p2 = this.planeP2;
		let p3 = this.planeP3;

		let x0 = p1[0]
		let y0 = p1[1]
		let z0 = p1[2]

		/* find perpendicular vector */
		let v1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]]
		let v2 = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]]
		let abc = [(v1[1] * v2[2] + v1[2] * v2[1]), - (v1[0] * v2[2] + v1[2] * v2[0]) ,  -(v1[0] * v2[1] + v1[1] * v2[0])]
		let t = (abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * pt1[0]- abc[1] * pt1[1] - abc[2] * pt1[2]) / (abc[0] * (pt2[0] - pt1[0]) + abc[1] * (pt2[1] - pt1[1]) + abc[2] * (pt2[2] - pt1[2]));

		// so when we replace the line above (1*))
		let newx = t * (pt2[0] - pt1[0]) + pt1[0];
		let newy = t * (pt2[1] - pt1[1]) + pt1[1];
		let newz = t * (pt2[2] - pt1[2]) + pt1[2];

		this.sphereIntersection.position.set(newx, newy, newz);

		return { x: newx, y:newy, z:newz };
	}

	addEvents()
	{
		window.addEventListener('mousedown', (e) => this._onDown(e));
        window.addEventListener('mouseup', () => this._onUp());
        window.addEventListener('mousemove', (e) => this._onMove(e));

        window.addEventListener('touchstart', (e) => this._onDown(e));
        window.addEventListener('touchend', () => this._onUp());
        window.addEventListener('touchmove', (e) => this._onMove(e));
        window.addEventListener('keydown', (e) => this._onKeydown(e));
	}

	_onKeydown()
	{
		// this.onTraceRay();
		// this.cubeTest.position.x = this.intersection.x;
		// this.cubeTest.position.y = this.intersection.y;

		this.findNeighbours(this.intersection);
		// this.impactVerlet(this.intersection);
	}

	_onDown(e)
	{
		if(this._isDown) return;

		this._isDown = true;

		this.firstPos = getCursorPos(e);
	}

	_onMove(e)
	{

		if(!this._isDown) return;

		let pt = getCursorPos(e);

		let x = (pt.x / POLY.gl.viewportWidth) * 2 - 1;
		let y = - (pt.y / POLY.gl.viewportHeight) * 2 + 1;

		this.mouse.x = x;
		this.mouse.y = y;

		this.onTraceRay();
	}

	_onUp(e)
	{
		this._isDown = false;
	}

	createGridPoints()
	{
		for (let y = 0; y < this.gridHeight; y++) // due to the way PointMasss are attached, we need the y loop on the outside
		{
			for (let x = 0; x < this.gridWidth; x++)
			{
				let pointmass = new PointMass((-(this.gridWidth - 1) / 2) * this.restingDistances + x * this.restingDistances, (-(this.gridHeight - 1)/2) * this.restingDistances + y * this.restingDistances);
				let pointquad = new PointQuad((-(this.gridWidth - 1) / 2) * this.restingDistances +  x * this.restingDistances, (-(this.gridHeight - 1)/2) * this.restingDistances + y * this.restingDistances);

				if (x != 0)
					pointmass.attachTo(this.pointsGrid[this.pointsGrid.length-1], this.restingDistances, this.stiffnesses);
				if (y != 0)
					pointmass.attachTo(this.pointsGrid[(y - 1) * (this.gridWidth) + x], this.restingDistances, this.stiffnesses);

				// if ((x == 0 && y == 0) || (x == (this.gridWidth - 1) && y == 0) || (y == (this.gridHeight - 1) && x ==0) || (y == (this.gridHeight - 1) && x ==(this.gridWidth - 1)))
				if (x == 0 || y == 0 || x == (this.gridWidth - 1) || y == (this.gridHeight - 1))
					pointmass.pinTo(pointmass.x, pointmass.y, 0, true);

				this.pointsGrid.push(pointmass);
				this.pointsQuad.push(pointquad);
			}
		}

		// this.pointsGrid[12].pinTo(null, null, -1)
	}

	findNeighbours(p1)
	{

		let minX = -(this.gridWidth - 1) / 2 * this.restingDistances;
		let minY = -(this.gridHeight - 1)/2 * this.restingDistances

		// find column
		let lastX = -1;
		for (let x = 0; x < this.gridWidth; x++)
		{
			let index = this.getPointsAtCoordinates(x, 0);
			let pG = this.pointsGrid[index];

			if(pG.x > p1.x)
			{

				break;
			}

			lastX = x;
		}

		let lastY = -1;
		for (let y = 0; y < this.gridHeight; y++)
		{
			let index = this.getPointsAtCoordinates(0, y);
			let pG = this.pointsGrid[index];

			if(pG.y > p1.y)
			{

				break;
			}

			lastY = y;
		}

		if(lastY < 0 || lastY >= (this.gridHeight - 1) || lastX < 0 || lastX >= (this.gridWidth - 1))
		{
			return;
		}

		let points = [];
		for (let y = lastY; y <= lastY + 1; y++) // due to the way PointMasss are attached, we need the y loop on the outside
		{
			for (let x = lastX; x <= lastX + 1; x++)
			{
				let index = this.getPointsAtCoordinates(x, y);
				let pG = this.pointsGrid[index];

				pG.temp = true;

				let dist = Math.pow(p1.x - pG.x, 2) + Math.pow(p1.y - pG.y, 2);

				points.push({
					p: pG,
					dist
				});
			}
		}

		function compare(a,b) {
		  if (a.dist < b.dist)
		    return -1;
		  if (a.dist > b.dist)
		    return 1;
		  return 0;
		}

		points.sort(compare);


		if(points.length >= 3)
		{
			let p1P = points[0].p;
			let p2P = points[1].p;
			let p3P = points[2].p;

			// p1P.program.uniforms.color = [1,0,0];
			// p2P.program.uniforms.color = [1,0,0];
			// p3P.program.uniforms.color = [1,0,0];



		// a(x - x0) + b(y-y0) + c(z- z0) = 0
			let x0 = p1P.x;
			let y0 = p1P.y;
			let z0 = p1P.z

			let x = p1.x;
			let y = p1.y;

		// <a, b, c> is a vector perpendicular to the plane

		/* find perpendicular vector */
		// create 2 vectors
			let v1 = [p2P.x - p1P.x, p2P.y - p1P.y, p2P.z - p1P.z]
			let v2 = [p3P.x - p2P.x, p3P.y - p2P.y, p3P.z - p2P.z]

		// https://www.youtube.com/watch?v=0qYJfKG-3l8

		// cross product
		// |i     j     k
		// |v1[0] v1[1] v1[2]
		// |v2[0] v2[1] v2[2]

		// | v1[1] v1[2]|    -  |v1[0]v1[2]|    + |v1[0] v1[1]|
		// | v2[1] v2[2]| i     |v2[0]v2[2]| j    |v2[0] v2[1]|k

		// (v1[1] * v2[2] + v1[2] * v2[1]) * i - (v1[0] * v2[2] + v1[2] * v2[0]) * j + (v1[0] * v2[1] + v1[1] * v2[0]) * k
		// let abc = [(v1[1] * v2[2] + v1[2] * v2[1]), - (v1[0] * v2[2] + v1[2] * v2[0]) ,  -(v1[0] * v2[1] + v1[1] * v2[0])]

		let abc = vec3.create();
		vec3.cross(abc, v1, v2)
		// abc[2] *= -1;
		// console.log(abc);

		// this.sphere.position.set(abc[0], abc[1], abc[2]);


		// plane equation
		// abc[0] * (x - x0) + abc[1] * (y-y0) + abc[2](z- z0) = 0
		// abc[0] * x - abc[0] * x0 + abc[1] * y - abc[1] * y0 + abc[2] * z - abc[2] * z0 = 0
		// abc[0] * x  +  abc[1] * y + abc[2] * z = abc[0] * x0 + abc[1] * y0 + abc[2] * z0;
		 let z = (abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * x  -  abc[1] * y) / abc[2];

		 // this.cubeTest.position.x = abc[0];
		 // this.cubeTest.position.y = abc[1];
		 // this.cubeTest.position.z = abc[2];

		 // this.cubeTest.position.x = this.intersection.x;
 		 // this.cubeTest.position.y = this.intersection.y;
		 // this.cubeTest.position.z = z;

		 if(p1.setZ)
		 {
			 p1.setZ(z);
		 }
		}




		// if(points.length >= 3)
		// {
		// 	let A = points[0];
		// 	let B = points[1];
		// 	let C = points[2];
		//
		// 	let z = A.z + ((B.x - A.x) * (C.z - A.z) - (C.x - A.x) * (B.z - A.z)) / ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) * (p1.y - A.y)    -    ((B.y - A.y) * (C.z - A.z) - (C.y - A.y) * (B.z - A.z)) / ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) * (p1.x - A.x)
		// 	// console.log('new z', z);
		// 	this.cubeTest.position.z = z;
		// 	if(p1.setZ)
		// 	{
		// 		p1.setZ(z);
		// 	}
		// }

		// console.log("column between y = ", lastY, lastY + 1);
		// let sum = 0;
		// let nbPoints = 0;
		//
		// let dists = []
		//
		// let points = [];
		// let maxDist = 0;
		//
		// for (var i = 0; i < this.pointsGrid.length; i++)
		// {
		// 	// calculate distance between the points, if between restingDistances, keep them for next step
		// 	let p2 = this.pointsGrid[i];
		// 	let dist = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
		//
		// 	if(dist < this.restingDistances * this.restingDistances)
		// 	{
		// 		if(dist > maxDist) maxDist = dist;
		// 		p2.program.bind();
		// 		// p2.program.uniforms.color = [1, 0, 1]
		//
		// 		points.push({
		// 			p: p2,
		// 			dist
		// 		});
		// 	}
		// }
		//
		// function compare(a,b) {
		//   if (a.dist < b.dist)
		//     return -1;
		//   if (a.dist > b.dist)
		//     return 1;
		//   return 0;
		// }
		//
		// points.sort(compare);
		//
		//
		// if(points.length >= 3)
		// {
		// 	let A = points[0].p;
		// 	let B = points[1].p;
		// 	let C = points[2].p;
		//
		// 	let z = A.z + ((B.x - A.x) * (C.z - A.z) - (C.x - A.x) * (B.z - A.z)) / ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) * (p1.y - A.y)    -    ((B.y - A.y) * (C.z - A.z) - (C.y - A.y) * (B.z - A.z)) / ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) * (p1.x - A.x)
		// 	p1.setZ(z);
		// }
	}

	createQuads()
	{
		let nbColumns = this.gridWidth - 1;
		let nbLines = this.gridHeight - 1;

		let nbQuads = nbColumns * nbLines;

		for (var i = 0; i < nbLines * nbColumns; i++)
		{
			let viewQuad = new ViewQuad();
			this.views.push(viewQuad);
		}
	}

	createQuadsVerlet()
	{
		let nbColumns = this.gridWidth - 1;
		let nbLines = this.gridHeight - 1;

		let nbQuads = nbColumns * nbLines;

		for (var y = 0; y < nbLines; y++) {
			for (var x = 0; x < nbColumns; x++) {
				let pts = [];
				pts.push(this.pointsGrid[this.getPointsAtCoordinates(x, y)]);
				pts.push(this.pointsGrid[this.getPointsAtCoordinates(x + 1, y)]);
				pts.push(this.pointsGrid[this.getPointsAtCoordinates(x + 1, y + 1)]);
				pts.push(this.pointsGrid[this.getPointsAtCoordinates(x, y + 1)]);

				let viewQuad = new ViewQuad();
				viewQuad.attachPointRef(pts);

				this.viewsVerlet.push(viewQuad);
			}
		}
	}

	getPointsAtCoordinates(x, y)
	{
		let index = x + (this.gridWidth) * y;
		return index;
	}

	getViewAtCoordinates(x, y)
	{
		let index = x + (this.gridWidth - 1) * y;
		return index;
	}

	move(from, to)
	{
		this.pointsGrid.splice(to, 0, this.pointsGrid.splice(from, 1));
	}
	render()
	{

		// POLY.GL._camera.projectionMatrix = this.projectionMatrix;

		let nbColumns = this.gridWidth - 1;
		let nbLines = this.gridHeight - 1;

		this.orbitalControl.update();
		this._bPlanes.draw();

		// RENDER THE QUADS
		for (var yView = 0; yView < nbLines; yView++)
		{
			for (var xView = 0; xView < nbColumns; xView++)
			{
				let index = this.getViewAtCoordinates(xView, yView);
				let quad = this.views[index];
				// let quadVerlet = this.viewsVerlet[index];
				quad.render();
				// quadVerlet.render();
			}
		}

		// LOOP THE QUAD'S POINTS GRID
		let reappearLeft = false;
		let reappearRight = false;
		let reappearTop = false;
		let reappearBottom = false;

		for (let y = 0; y < this.gridHeight; y++)   // due to the way PointMasss are attached, we need the y loop on the outside
		{
			for (let x = 0; x < this.gridWidth; x++)
			{
				let index = this.getPointsAtCoordinates(x, y);
				let pointquad = this.pointsQuad[index];

				pointquad.x += .01;
				if(pointquad.y < this.limitMinY)
				{
					pointquad.y += this.gridHeight;
					reappearTop = true;
				}
				else if(pointquad.y > this.limitMinY + this.gridHeight)
				{
					pointquad.y = this.limitMinY;
					reappearBottom = true;
				}

				if(pointquad.x <= this.limitMinX)
				{
					pointquad.x += this.gridWidth;
					this.pointsQuad.splice(index, 1)
					this.pointsQuad.splice(index + this.gridWidth -1, 0, pointquad);

					reappearRight = true;
				}
				else if(pointquad.x > this.limitMinX + this.gridWidth)
				{
					pointquad.x = this.limitMinX;
					this.pointsQuad.splice(index, 1)
					this.pointsQuad.splice(index - this.gridWidth + 1, 0, pointquad);

					reappearLeft = true;
				}

				pointquad.render();
			}
		}

		// REORDER THE ACTUAL QUADS
		if(reappearBottom)
		{
			for (var i = 0; i < this.gridWidth; i++)
			{
				this.pointsQuad.splice(0, 0, this.pointsQuad.pop());
			}

			for (var xView = 0; xView < nbColumns; xView++)
			{
				this.views.splice(0, 0, this.views.pop());
			}

		}
		else if(reappearTop)
		{
			for (var i = 0; i < this.gridWidth; i++)
			{
				this.pointsQuad.push(this.pointsQuad.shift());
			}

			for (var xView = 0; xView < nbColumns; xView++)
			{
				this.views.push(this.views.shift());
			}
		}

		if(reappearRight)
		{

			for (var yView = 0; yView < nbLines; yView++)
			{
				let index = this.getViewAtCoordinates(0, yView);
				let quad = this.views[index];

				this.views.splice(index, 1)
				this.views.splice(index + this.gridWidth, 0, quad);
			}
		}
		else if(reappearLeft)
		{
			for (var yView = 0; yView < nbLines; yView++)
			{
				let index = this.getViewAtCoordinates(nbColumns - 1, yView);
				let quad = this.views[index];

				quad.program.bind();
				this.views.splice(index, 1)
				this.views.splice(index - nbColumns + 1, 0, quad);
			}
		}

		for (var i = 0; i < this.pointsQuad.length; i++)
		{
			this.findNeighbours(this.pointsQuad[i]);
		}

		// assign the quad points dinamycally
		for (var y = 0; y < nbLines; y++)
		{
			for (var x = 0; x < nbColumns; x++)
			{
				let pts = [];
				pts.push(this.pointsQuad[this.getPointsAtCoordinates(x, y)]);
				pts.push(this.pointsQuad[this.getPointsAtCoordinates(x + 1, y)]);
				pts.push(this.pointsQuad[this.getPointsAtCoordinates(x + 1, y + 1)]);
				pts.push(this.pointsQuad[this.getPointsAtCoordinates(x, y + 1)]);

				let index = this.getPointsAtCoordinates(x, y);
				let indexView = this.getViewAtCoordinates(x, y);

				let quad = this.views[indexView];

				quad.attachPointRef(pts);
			}
		}

		this.physics.update(this.pointsGrid);


		if(this.debug)
		{
			for (var i = 0; i < this.pointsGrid.length; i++)
			{
				this.pointsGrid[i].render(this.debug);

				this.pointsGrid[i].temp = false;
				if(!this._isDown)
				{
					this.pointsGrid[i].accZ = 0;
				}
			}
		}

		this.program.bind();
		// POLY.GL.draw(this.viewRay);

		// console.log(this.cubeTest.position);
		POLY.GL.draw(this.sphereIntersection);
		// POLY.GL.draw(this.cubeTest);
	}

	map(val, inputMin, inputMax, outputMin, outputMax)
    {
                /*
                var inputRange = inputMax - inputMin

                var inputFraction = (val - inputMin)/inputRange

                var outputRange = outputMax - outputMin

                var output = (outputRange * inputFraction) + outputMin

                return output
                */

        return ((outputMax - outputMin) * ((val - inputMin)/(inputMax - inputMin))) + outputMin;
    }

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
