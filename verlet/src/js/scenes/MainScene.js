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

		this.debug = true;
		this.gl = null;
		this.tick = 0;
		this.gl = POLY.gl;

		this.camera = new POLY.cameras.PerspectiveCamera();
		this.camera.perspective(45, POLY.GL.aspectRatio, 0.1, 100.0)

		this.orbitalControl = new POLY.control.OrbitalControl(this.camera.matrix);
		// this.orbitalControl.lock(true);
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

		this.physics = new Physics();
		this.createGridPoints();
		this.createQuads();

		this.limitMinY = -(this.gridHeight * this.restingDistances)/2 + this.restingDistances/2;
		this.limitMinX = -(this.gridWidth * this.restingDistances)/2 + this.restingDistances/2;

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

				if (x == 0 || y == 0 || x == (this.gridWidth - 1) || y == (this.gridHeight - 1))
					pointmass.pinTo(pointmass.x, pointmass.y);

				this.pointsGrid.push(pointmass);
				this.pointsQuad.push(pointquad);
			}
		}
	}

	findNeighbours(p1)
	{
		p1.program.bind();

		if(this.debug) p1.program.uniforms.color = [1, 0, 0]

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

				points.push({
					p: p2,
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
			let A = points[0].p;
			let B = points[1].p;
			let C = points[2].p;

			let z = A.z + ((B.x - A.x) * (C.z - A.z) - (C.x - A.x) * (B.z - A.z)) / ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) * (p1.y - A.y)    -    ((B.y - A.y) * (C.z - A.z) - (C.y - A.y) * (B.z - A.z)) / ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) * (p1.x - A.x)
			p1.setZ(z);
		}
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
				quad.render();
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

				if(this.debug) pointquad.render();
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
			}
		}
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
