import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import Physics from '../Physics';
import PointMass from '../views/ViewPointMass';
import PointQuad from '../views/ViewPointQuad';
import ViewQuad from '../views/ViewQuad';
import {mat3, mat4, vec3} from 'gl-matrix';

let target = vec3.create();

// generic function to get cursor position
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

		this.orbitalControl = new POLY.control.OrbitalControl(this.camera.matrix, 1);
		this.orbitalControl.lock(true);
		// this.orbitalControl.lockZoom(true);
		POLY.GL.setCamera(this.camera);

		this.projectionMatrix = mat4.create();

		this._bPlanes = new POLY.helpers.BatchPlanes();


		this.gridHeight = 6;
		this.gridWidth = 8;
		this.restingDistances = 1;
		this.stiffnesses = .01;

		this.pointsGrid = [];
		this.pointsQuad = [];
		this.views = [];
		this.viewsVerlet = [];
		this.pos = {x:0, y:0}
		this.previousPos = {x:0, y:0}
		this.speedX = 0;
		this.speedY = 0;

		this.physics = new Physics();
		this.createGridPoints();
		this.createQuads();

		this.limitMinY = -(this.gridHeight * this.restingDistances)/2 + this.restingDistances/2;
		this.limitMinX = -(this.gridWidth * this.restingDistances)/2 + this.restingDistances/2;

		this.program = new POLY.Program();
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


		let intersection = this.findIntersection(origin, target);
		this.intersection = intersection;
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
					let depth = this.map(dist, 0, minDist, -.002, 0);
					// pG.program.uniforms.color = [.2, .2, .2]

                    if(depth < -.002)
                    {
                        depth = -.002
                    }
                    console.log('depth', depth);

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

	calculateSpeed()
  {
		var x =  this.pos.x;
		var y = this.pos.y;
		var new_x;
		var new_y;
		var new_t;

		var x_dist;
		var y_dist, interval,vx, vy, t, negX, negY, velocity;

		if (this.previousTime === false) {return 0;}
		t = this.previousTime;
		new_x = this.previousPos.x;
		new_y = this.previousPos.y;
		new_t = Date.now();

		x_dist = new_x - x;


		y_dist = new_y - y;
		interval = new_t - t;
		negX = x_dist < 0 ? 1: -1;
		negY = y_dist < 0 ? 1: -1;
          // update values:
		x = new_x;
		y = new_y;

		vx = negX * Math.sqrt(x_dist*x_dist)/ (interval);
		vy = negY * Math.sqrt(y_dist*y_dist)/ (interval);

		this.speedX = vx;
		this.speedY = vy;

		if(isNaN(vx)) vx = 0;
		if(isNaN(vy)) vy = 0;

		velocity = Math.sqrt(x_dist*x_dist+y_dist*y_dist)/ (interval);
		//
		if(isNaN(velocity)) velocity = 0;

		return velocity;
	}

	_onDown(e)
	{
		if(this._isDown) return;

		this._isDown = true;

		let pt = getCursorPos(e);
		let x = (pt.x / POLY.gl.viewportWidth) * 2 - 1;
		let y = - (pt.y / POLY.gl.viewportHeight) * 2 + 1;

		this.firstPos = {
			x, y
		};

		this.speed =  this.lastSpeed = 0;
	}

	_onMove(e)
	{
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

			let x0 = p1P.x;
			let y0 = p1P.y;
			let z0 = p1P.z

			let x = p1.x;
			let y = p1.y;

			let v1 = [p2P.x - p1P.x, p2P.y - p1P.y, p2P.z - p1P.z]
			let v2 = [p3P.x - p2P.x, p3P.y - p2P.y, p3P.z - p2P.z]

		let abc = vec3.create();
		vec3.cross(abc, v1, v2)
		let z = (abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * x  -  abc[1] * y) / abc[2];


    	 if(p1.setZ)
    	 {
    		 p1.setZ(z);
    	 }
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
        this.pos.x = this.sphereIntersection.position.x;
        this.pos.y = this.sphereIntersection.position.y;

        // this.calculateSpeed()

        if(this._isDown)
        {
            this.speedX = this.pos.x - this.previousPos.x;
            this.speedY = this.pos.y - this.previousPos.y;

            if(this.intersection)
            {
                this.findNeighbours(this.intersection);
                this.impactVerlet(this.intersection);
            }
        }
        else {
            this.speedX *= .9;
            this.speedY *= .9;
        }

        // this.previousTime = Date.now();

        this.previousPos.x = this.pos.x;
        this.previousPos.y = this.pos.y;
		// this.speedX *= .92;
		// this.speedY *= .92;

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

				if(this.speedX && !isNaN(this.speedX))
				{
					pointquad.x += this.speedX;
				}
				if(this.speedY && !isNaN(this.speedY))
				{
					pointquad.y += this.speedY;
				}

				if(pointquad.y < this.limitMinY)
				{
					reappearTop = true;
				}
				else if(pointquad.y > this.limitMinY + this.gridHeight)
				{
					reappearBottom = true;
				}

				if(pointquad.x <= this.limitMinX)
				{
					reappearRight = true;
				}
				else if(pointquad.x > this.limitMinX + this.gridWidth)
				{
					reappearLeft = true;
				}

				pointquad.render();
			}
		}

		// REORDER THE ACTUAL QUADS
		if(reappearBottom)
		{
            let farPoint = this.pointsQuad[this.getPointsAtCoordinates(0, 0)];
            let farY = farPoint.y;

			for (var i = 0; i < this.gridWidth; i++)
			{
                let pt = this.pointsQuad.pop();
                pt.y = farY - this.restingDistances;
				this.pointsQuad.unshift(pt);
			}

			this.beenIn = true;
			for (var xView = 0; xView < nbColumns; xView++)
			{
				this.views.splice(0, 0, this.views.pop());
				// this.view.program.uniforms.color = [1,0,0];
				// this.beenIn
			}

            this.temp = true;

		}
		else if(reappearTop)
		{
            let farPoint = this.pointsQuad[this.getPointsAtCoordinates(0, this.gridHeight - 1)];
            let farY = farPoint.y;

			for (var i = 0; i < this.gridWidth; i++)
			{
                let pt = this.pointsQuad.shift();
                pt.y = farY + this.restingDistances;

				this.pointsQuad.push(pt);
			}

			for (var xView = 0; xView < nbColumns; xView++)
			{
				this.views.push(this.views.shift());
			}
		}

		if(reappearRight)
		{
            let farPoint = this.pointsQuad[this.getPointsAtCoordinates(this.gridWidth - 1, 0)];
            let farX = farPoint.x;
            for (var y = 0; y < this.gridHeight; y++) {
                let indexPt = this.getPointsAtCoordinates(0, y);
                let pt = this.pointsQuad[indexPt];

                pt.x = farX + this.restingDistances;
                // pt.x = this.limitMinX + this.gridWidth;
                this.pointsQuad.splice(indexPt, 1);
                this.pointsQuad.splice(indexPt + this.gridWidth -1, 0, pt);
            }
			for (var yView = 0; yView < nbLines; yView++)
			{
				let index = this.getViewAtCoordinates(0, yView);
				let quad = this.views[index];

				this.views.splice(index, 1)
				this.views.splice(index + this.gridWidth - 2, 0, quad);
			}

            // this.temp = true;
		}
		else if(reappearLeft)
		{
            let farPoint = this.pointsQuad[this.getPointsAtCoordinates(0, 0)];
            let farX = farPoint.x;
            for (var y = 0; y < this.gridHeight; y++)
            {
                let indexPt = this.getPointsAtCoordinates(this.gridWidth-1, y);
                let pt = this.pointsQuad[indexPt];
                pt.x = farX - this.restingDistances;
                this.pointsQuad.splice(indexPt, 1)
                this.pointsQuad.splice(indexPt - this.gridWidth + 1, 0, pt);

            }

			for (var yView = 0; yView < nbLines; yView++)
			{
				let index = this.getViewAtCoordinates(nbColumns - 1, yView);
				let quad = this.views[index];

				quad.program.bind();
				this.views.splice(index, 1)
				this.views.splice(index - nbColumns + 1, 0, quad);
			}

            // this.temp = true;
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

		POLY.GL.draw(this.sphereIntersection);
	}

	map(val, inputMin, inputMax, outputMin, outputMax)
    {
        return ((outputMax - outputMin) * ((val - inputMin)/(inputMax - inputMin))) + outputMin;
    }

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);

	}
}
