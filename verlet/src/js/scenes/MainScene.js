import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import Physics from '../Physics';
import PointMass from '../views/ViewPointMass';
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
		this.physics = new Physics();
		this.createGridPoints();
	}

	createGridPoints()
	{
		// midWidth: amount to translate the curtain along x-axis for it to be centered
		// (gridWidth * restingDistances) = curtain's pixel width
		// let midWidth = (int) (width/2 - (gridWidth * restingDistances)/2);
		// Since this our fabric is basically a grid of points, we have two loops
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
				if (x != 0)
					pointmass.attachTo(this.pointsGrid[this.pointsGrid.length-1], this.restingDistances, this.stiffnesses);
				// the index for the PointMasss are one dimensions,
				// so we convert x,y coordinates to 1 dimension using the formula y*width+x
				if (y != 0)
					pointmass.attachTo(this.pointsGrid[(y - 1) * (this.gridWidth) + x], this.restingDistances, this.stiffnesses);

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

	render()
	{
		this.orbitalControl.update();
		// this.viewBg.render();
		this._bPlanes.draw();
		this.physics.update(this.pointsGrid);

		for (var i = 0; i < this.pointsGrid.length; i++) {
			this.pointsGrid[i].render();
		}



	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
