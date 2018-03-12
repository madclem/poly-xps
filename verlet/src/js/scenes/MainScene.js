import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import Physics from '../Physics';
import PointMass from '../views/ViewPointMass';
import ViewQuad from '../views/ViewQuad';
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

		this.gridHeight = 4;
		this.gridWidth = 8;
		this.restingDistances = 1;
		this.stiffnesses = .6;

		this.pointsGrid = [];
		this.views = [];
		this.physics = new Physics();
		this.createGridPoints();
		this.createQuads();

		this.limitX = -(this.gridWidth * this.restingDistances)/2 + this.restingDistances/2.;
	}

	createGridPoints()
	{
		for (let y = 0; y < this.gridHeight; y++) { // due to the way PointMasss are attached, we need the y loop on the outside
			for (let x = 0; x < this.gridWidth; x++) {
				let pointmass = new PointMass((-(this.gridWidth - 1) / 2) * this.restingDistances + x * this.restingDistances, (-(this.gridHeight - 1)/2) * this.restingDistances + y * this.restingDistances);

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
				// if (x != 0)
					// pointmass.attachTo(this.pointsGrid[this.pointsGrid.length-1], this.restingDistances, this.stiffnesses);
				// the index for the PointMasss are one dimensions,
				// so we convert x,y coordinates to 1 dimension using the formula y*width+x
				// if (y != 0)
					// pointmass.attachTo(this.pointsGrid[(y - 1) * (this.gridWidth) + x], this.restingDistances, this.stiffnesses);

				// we pin the very top PointMasss to where they are
				if ((y == 0 && x == 0) || (y == 0 && x == (this.gridWidth - 1)) || (y == (this.gridHeight - 1) && x == (this.gridWidth - 1)) || (y == (this.gridHeight - 1) && x == 0))
					pointmass.pinTo(pointmass.x, pointmass.y);

				// add to PointMass array
				this.pointsGrid.push(pointmass);
			}
		}

		this.pt = this.pointsGrid[12];

		this.pt.z = 1;
		this.pt.lastZ = 1;
		this.tick = 0;

		// this.pt.z = this.pt.lastZ = -.4;
		this.pt.pinTo(null, null, -.8);
	}

	createQuads()
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

				let viewQuad = new ViewQuad(pts, this.pointsGrid, x);

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

		// this.limitX += .01
		let nbColumns = this.gridWidth - 1;
		let nbLines = this.gridHeight - 1;

		this.orbitalControl.update();
		this._bPlanes.draw();
		this.physics.update(this.pointsGrid);



		let test = false;
		for (let y = 0; y < this.gridHeight; y++) { // due to the way PointMasss are attached, we need the y loop on the outside
			// test != test;


			for (let x = 0; x < this.gridWidth; x++) {

				let index = this.getPointsAtCoordinates(x, y);
				let indexView = this.getViewAtCoordinates(x, y);
				let pointmass = this.pointsGrid[index];

				if(pointmass.x <= this.limitX && pointmass.lastX <= this.limitX)
				{

					console.log('pointmass.id', pointmass.id);
					let xPt = pointmass.x + this.gridWidth;
					pointmass.x = pointmass.lastX = xPt;
					pointmass.program.bind();
					pointmass.program.uniforms.color = [1,0,0];
					pointmass.pinTo(xPt)

					this.pointsGrid.splice(index, 1)
					this.pointsGrid.splice(index + this.gridWidth, 0, pointmass);

					test = true;
				}
				else {
					// pointmass.render();

				}
			}

		}

		if(test)
		// if(test)
		{
			this.notIn = true;
			console.log('here2222');
			for (var yView = 0; yView < nbLines; yView++) {
				for (var xView = 0; xView < 1; xView++) {

					let index = this.getViewAtCoordinates(xView, yView);
					let quad = this.views[index];
					quad.MOVED = true;

					// quad.program.bind();
					// quad.program.uniforms.color = [1, 0, 0];
					// console.log('moved', index);
					// console.log('to', index + this.gridWidth - 1);
					this.views.splice(index, 1)
					this.views.splice(index + this.gridWidth - 1, 0, quad);

					// quad.attachPointRef(pts);
				}
			}

		}

		for (var yView = 0; yView < nbLines; yView++) {
			for (var xView = 0; xView < nbColumns; xView++) {

				let index = this.getViewAtCoordinates(xView, yView);
				let quad = this.views[index];
				quad.render();

				// quad.attachPointRef(pts);
			}
		}


		// assign the quad points dinamycally
		for (var y = 0; y < nbLines; y++) {
			for (var x = 0; x < nbColumns; x++) {
				let pts = [];
				pts.push(this.pointsGrid[this.getPointsAtCoordinates(x, y)]);
				pts.push(this.pointsGrid[this.getPointsAtCoordinates(x + 1, y)]);
				pts.push(this.pointsGrid[this.getPointsAtCoordinates(x + 1, y + 1)]);
				pts.push(this.pointsGrid[this.getPointsAtCoordinates(x, y + 1)]);

				let index = this.getPointsAtCoordinates(x, y);
				let indexView = this.getViewAtCoordinates(x, y);

				let quad = this.views[indexView];

				quad.attachPointRef(pts);
			}
		}


		for (var i = 0; i < this.pointsGrid.length; i++) {

				this.pointsGrid[i].render();
		}

		for (var i = 0; i < this.views.length; i++) {
			// this.views[i].render();
		}



	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
