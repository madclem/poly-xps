import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import Physics from '../Physics';
import PointMass from '../views/ViewPointMass';
import PointQuad from '../views/ViewPointQuad';
import ViewQuad from '../views/ViewQuad';
import SpeedController from '../control/SpeedController';
import {mat3, mat4} from 'gl-matrix';


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
		this.gl = null;
		this.tick = 0;
		this.gl = POLY.gl;

		this.camera = new POLY.cameras.PerspectiveCamera();
		this.camera.perspective(45, POLY.GL.aspectRatio, 0.1, 100.0)

		this.orbitalControl = new POLY.control.OrbitalControl(this.camera.matrix);
		// this.orbitalControl.lock(true);
		// this.orbitalControl.lockZoom(true);
		POLY.GL.setCamera(this.camera);

		this.viewBg = new ViewBg(window.ASSET_URL + 'image/sky_gradient.jpg');
		this._bPlanes = new POLY.helpers.BatchPlanes();

		this.gridHeight = 7;
		this.gridWidth = 10;
		this.restingDistances = 1;
		this.stiffnesses = .6;

		this.pointsGrid = [];
		this.pointsQuad = [];
		this.views = [];
		this.physics = new Physics();
		this.createGridPoints();
		this.createQuads();


		this.position = {
			x: 4,
			y: 0,
		}
		this.cameraX = 0;

		gui.add(this, 'cameraX', -2, 2);

		this.limitMinY = -(this.gridHeight * this.restingDistances)/2 + this.restingDistances/2;
		this.limitMinX = -(this.gridWidth * this.restingDistances)/2 + this.restingDistances/2;
		this.limitMaxX = this.gridWidth * this.restingDistances/2 + this.restingDistances;
		// this.limitMinX = -(this.gridWidth * this.restingDistances)/2 + this.restingDistances;

		// this.addEvents();
	}

	addEvents()
	{
		window.addEventListener('mousedown', (e) => this._onDown(e));
        window.addEventListener('mouseup', () => this._onUp());
        window.addEventListener('mousemove', (e) => this._onMove(e));

        window.addEventListener('touchstart', (e) => this._onDown(e));
        window.addEventListener('touchend', () => this._onUp());
        window.addEventListener('touchmove', (e) => this._onMove(e));
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
		let offsetX = (this.firstPos.x - pt.x) / 100;

		this.speed.x = offsetX;
	}

	_onUp(e)
	{
		this._isDown = false;
	}

	createGridPoints()
	{
		for (let y = 0; y < this.gridHeight; y++) { // due to the way PointMasss are attached, we need the y loop on the outside
			for (let x = 0; x < this.gridWidth; x++) {
				let pointmass = new PointMass((-(this.gridWidth - 1) / 2) * this.restingDistances + x * this.restingDistances, (-(this.gridHeight - 1)/2) * this.restingDistances + y * this.restingDistances);
				let pointquad = new PointQuad((-(this.gridWidth - 1) / 2) * this.restingDistances +  x * this.restingDistances, (-(this.gridHeight - 1)/2) * this.restingDistances + y * this.restingDistances);

				// attach to
				// x - 1  and
				// y - 1
				//  *<---*<---*<-..
				//  ^    ^    ^
				//  |    |    |
				//  *<---*<---*<-..
				//
				// PointMass attachTo parameters: PointMass PointMass, float restingDistance, float stiffness
				// try disabling the next 2 lines (the if statement and attachTo part) to create a hairy effect
				if (x != 0)
					pointmass.attachTo(this.pointsGrid[this.pointsGrid.length-1], this.restingDistances, this.stiffnesses);
				// the index for the PointMasss are one dimensions,
				// so we convert x,y coordinates to 1 dimension using the formula y*width+x
				if (y != 0)
					pointmass.attachTo(this.pointsGrid[(y - 1) * (this.gridWidth) + x], this.restingDistances, this.stiffnesses);

				// we pin the very top PointMasss to where they are
				// if ((y == 0 && x == 0) || (y == 0 && x == (this.gridWidth - 1)) || (y == (this.gridHeight - 1) && x == (this.gridWidth - 1)) || (y == (this.gridHeight - 1) && x == 0))
				if (x == 0 || y == 0 || x == (this.gridWidth - 1) || y == (this.gridHeight - 1))
				{
					if(y == 0)
					{
						// console.log('pintTo', pointmass.y);
					}
					pointmass.pinTo(pointmass.x, pointmass.y);
				}

				// add to PointMass array
				this.pointsGrid.push(pointmass);
				this.pointsQuad.push(pointquad);
			}
		}

		this.pt = this.pointsGrid[25];

		this.pt.z = 1;
		this.pt.lastZ = 1;
		this.tick = 0;

		this.pt.z = this.pt.lastZ = -.4;
		this.pt.pinTo(null, null, -2);

		// this.ptQuad = this.pointsQuad[30];

		// this.findNeighbours(this.ptQuad);
	}

	findNeighbours(p1)
	{
		p1.program.bind();
		// p1.program.uniforms.color = [1, 0, 0]

		let sum = 0;
		let nbPoints = 0;

		let dists = []

		let points = [];
		let maxDist = 0;
		for (var i = 0; i < this.pointsGrid.length; i++)
		{
			// calculate distance between the points, if between restingDistances, keep them for next step
			let p2 = this.pointsGrid[i];
			let dist = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);

			if(dist < this.restingDistances)
			{
				if(dist > maxDist) maxDist = dist;
				p2.program.bind();
				p2.program.uniforms.color = [1, 0, 1]

				dists.push({
					dist,
					z: p2.z
				});
				// sum += p2.z *  (1 - dist/this.restingDistances);

				points.push({
					p: p2,
					dist
				});
				// console.log(nbPoints, p2.z, Math.floor((1 - dist/this.restingDistances) * 10)/10);
				// nbPoints++;

				// console.log('nbPoints', nbPoints);
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
			let A = points[0].p;
			let B = points[1].p;
			let C = points[2].p;

			let z = A.z + ((B.x - A.x) * (C.z - A.z) - (C.x - A.x) * (B.z - A.z)) / ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) * (p1.y - A.y)    -    ((B.y - A.y) * (C.z - A.z) - (C.y - A.y) * (B.z - A.z)) / ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) * (p1.x - A.x)
			p1.setZ(z);
			// p1.z = z;
		}
		// for (var i = 0; i < dists.length; i++)
		// {
		// 	let d = dists[i];
		//
		// 	let p = (1 - d.dist/maxDist);
		// 	sum += d.z *  (1 - d.dist/maxDist);
		//
		// 	console.log(d.z, p);
		// }


		// console.log('p2.z', p2.z);
		// console.log('sum', sum);
		// console.log(p1.z);
	}
	createQuads()
	{
		let nbColumns = this.gridWidth - 1;
		let nbLines = this.gridHeight - 1;

		let nbQuads = nbColumns * nbLines;

		for (var y = 0; y < nbLines; y++) {
			for (var x = 0; x < nbColumns; x++) {
				let pts = [];
				pts.push(this.pointsQuad[this.getPointsAtCoordinates(x, y)]);
				pts.push(this.pointsQuad[this.getPointsAtCoordinates(x + 1, y)]);
				pts.push(this.pointsQuad[this.getPointsAtCoordinates(x + 1, y + 1)]);
				pts.push(this.pointsQuad[this.getPointsAtCoordinates(x, y + 1)]);

				let viewQuad = new ViewQuad(pts, this.pointsGrid, y);

				this.views.push(viewQuad);
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

		// this.limitMinX += .01
		let nbColumns = this.gridWidth - 1;
		let nbLines = this.gridHeight - 1;

		this.orbitalControl.update();
		this._bPlanes.draw();

		// this.limitMinX += .01

		for (var yView = 0; yView < nbLines; yView++)
		{
			for (var xView = 0; xView < nbColumns; xView++)
			{
				let index = this.getViewAtCoordinates(xView, yView);
				let quad = this.views[index];
				quad.render();
			}
		}


		let reappearLeft = false;
		let reappearRight = false;
		let reappearTop = false;
		let reappearBottom = false;

		// console.log(this.pointsQuad);
		for (let y = 0; y < this.gridHeight; y++)   // due to the way PointMasss are attached, we need the y loop on the outside
		{
			// for (let x = 0; x < 2; x++)
			for (let x = 0; x < this.gridWidth; x++)
			{
				let index = this.getPointsAtCoordinates(x, y);
				let pointquad = this.pointsQuad[index];

				pointquad.y += .01;
				pointquad.x += .01;
				// pointquad.x = pointquad.origin.x + this.cameraX;

				// if(false)
				if(pointquad.y <= this.limitMinY)
				{
					pointquad.y += this.gridHeight;

					let from = index;
					let to =  index + (this.gridHeight) * (this.gridWidth) - x;

						console.log('from, to', from, to);
					pointquad.program.bind();
					pointquad.program.uniforms.color = [1,1,0];
					// this.pointsQuad.push(this.pointsQuad.shift());

					reappearTop = true;
				}
				else if(pointquad.y >= this.limitMinY + this.gridHeight)
				{
					pointquad.y = this.limitMinY;

					// let from = index;
					// let to =  index + (this.gridHeight) * (this.gridWidth) - x;
					//
					// 	console.log('from, to', from, to);
					pointquad.program.bind();
					pointquad.program.uniforms.color = [1,1,0];

					// this.pointsQuad.splice(index, 1)

					reappearBottom = true;

					// this.pointsQuad.splice(0, 1, this.pointsQuad.pop());
					//
					// reappearTop = true;
				}
				if(pointquad.x < this.limitMinX)
				{
					pointquad.x += this.gridWidth;

					this.pointsQuad.splice(index, 1)
					this.pointsQuad.splice(index + this.gridWidth, 0, pointquad);

					reappearRight = true;
				}
				else if(pointquad.x > this.limitMinX + this.gridWidth)
				{
					pointquad.x = this.limitMinX;

					pointquad.program.bind();
					pointquad.program.uniforms.color = [1,1,0];
					this.pointsQuad.splice(index, 1)
					this.pointsQuad.splice(index - this.gridWidth + 1, 0, pointquad);

					reappearLeft = true;
				}

				pointquad.render();
			}

			if(reappearTop)
			{
				this.wentIn = true;
			}

		}

		if(reappearBottom)
		{

			for (var i = 0; i < this.gridWidth; i++) {
				this.pointsQuad.splice(0, 0, this.pointsQuad.pop());
			}

			for (var yView = 0; yView < 1; yView++)
			{
				for (var xView = 0; xView < nbColumns; xView++)
				{

					console.log('here');
					let index = this.getViewAtCoordinates(xView, yView);
					let quad = this.views[index];

					// this.views.unshift();
					// this.views.push(this.views.shift());
					this.views.splice(0, 0, this.views.pop());
					// this.views.push(quad);

					// this.views.splice(index, 1)
					// this.views.push(index - 3 * (this.gridWidth), 0, quad);
					// this.views.splice(index + this.gridWidth - 1, 0, quad);
				}
			}
		}
		if(reappearTop)
		{

			for (var i = 0; i < this.gridWidth; i++) {
				let pointquad = this.pointsQuad.shift();
				this.pointsQuad.push(pointquad);
			}

			this.notIn = true;
			for (var yView = 0; yView < 1; yView++)
			{
				for (var xView = 0; xView < nbColumns; xView++)
				{
					let index = this.getViewAtCoordinates(xView, yView);
					let quad = this.views[index];

					// this.views.unshift();
					this.views.push(this.views.shift());
					// this.views.push(quad);

					// this.views.splice(index, 1)
					// this.views.push(index - 3 * (this.gridWidth), 0, quad);
					// this.views.splice(index + this.gridWidth - 1, 0, quad);
				}
			}
		}

		if(reappearRight)
		{
			this.notIn = true;
			for (var yView = 0; yView < nbLines; yView++)
			{
				for (var xView = 0; xView < 1; xView++)
				{

					let index = this.getViewAtCoordinates(xView, yView);
					let quad = this.views[index];

					this.views.splice(index, 1)
					this.views.splice(index + this.gridWidth - 1, 0, quad);
				}
			}
		}
		else if(reappearLeft)
		{
			for (var yView = 0; yView < nbLines; yView++)
			{
				for (var xView = nbColumns - 1; xView < nbColumns; xView++)
				{

					let index = this.getViewAtCoordinates(xView, yView);
					let quad = this.views[index];

					quad.program.bind();
					// quad.program.uniforms.color = [0,0,0];
					this.views.splice(index, 1)
					this.views.splice(index - nbColumns + 1, 0, quad);
				}
			}
		}


		// this.findNeighbours(this.ptQuad);
		for (var i = 0; i < this.pointsQuad.length; i++) {
			this.findNeighbours(this.pointsQuad[i]);
		}
		// this.findNeighbours(this.ptQuad);
		// for (var i = 0; i < this.points.length; i++) {
		// 	this.points[i]
		// }



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

		for (var i = 0; i < this.pointsGrid.length; i++)
		{
			this.pointsGrid[i].render();
		}

		// if(SpeedController.isDown)
		// {
			// for (var i = 0; i < this.pointsQuad.length; i++) {
			// 	this.pointsQuad[i].y -= this.cameraX;
			// 	this.pointsQuad[i].x -= this.cameraX;
			// }
		// }

		this.physics.update(this.pointsGrid);
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
