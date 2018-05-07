import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import Physics from '../Physics';
import PointMass from '../views/ViewPointMass';
import PointQuad from '../views/ViewPointQuad';
import ViewQuad from '../views/ViewQuad';
import {mat3, mat4, vec3} from 'gl-matrix';
import Math2 from '../utils/Math2';

let target = vec3.create();
let pointsOrdered = [];

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
        this.objects = [];
		this.camera = new POLY.cameras.PerspectiveCamera();
		this.camera.perspective(45, POLY.GL.aspectRatio, 0.1, 100.0)

		this.orbitalControl = new POLY.control.OrbitalControl(this.camera.matrix, 1.4);
		this.orbitalControl.lock(true);
		// this.orbitalControl.lockZoom(true);
		POLY.GL.setCamera(this.camera);

		this.projectionMatrix = mat4.create();

		this._bPlanes = new POLY.helpers.BatchPlanes();


		this.gridHeight = 8;
		this.gridWidth = 12;

		this.gridQuadsHeight = 8;
		this.gridQuadsWidth = 12;
		this.restingDistancesVerlet = 1;
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
		this.createQuadsPoints(this.gridQuadsWidth, this.gridQuadsHeight);
		this.createQuads();


		this.limitMinY = -(this.gridQuadsHeight * this.restingDistances)/2 + this.restingDistances/2;
		this.limitMinX = -(this.gridQuadsWidth * this.restingDistances)/2 + this.restingDistances/2;

		this.program = new POLY.Program();
		this.sphereIntersection = new POLY.geometry.Sphere(this.program);
		this.sphereIntersection.scale.set(.05);





        this.cubeCrossProduct = new POLY.geometry.Cube(this.program);
		this.cubeCrossProduct.scale.set(.1);

		this.rayCamera = new POLY.core.Ray();

		this.mouse = { x: 0, y: 0}

        this.plane = [[0,0,0], [1,1,0], [0, -1,0]];

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

		let intersection = Math2.intersectionLinePlane([origin, target], this.plane);
        this.sphereIntersection.position.set(intersection.x, intersection.y, intersection.z);
		this.intersection = intersection;
	}

	impactVerlet(pt)
	{
		// optimise here, dont loop through all the points
		let minDist = this.restingDistancesVerlet;

		for (let y = 0; y < this.gridHeight; y++)
		{
			for (let x = 0; x < this.gridWidth; x++)
			{
				let index = this.getPointsAtCoordinates(x, y);

				let pG = this.pointsGrid[index];

				let dist = Math.pow(pt.x - pG.x, 2) + Math.pow(pt.y - pG.y, 2);


				if(dist <= minDist)
				{
					let depth = Math2.map(dist, 0, minDist, -.012, 0);
                    if(depth < -.012)
                    {
                        depth = -.012
                    }

                    pG.accZ = depth;
				}
                else
                {
                    pG.accZ = 0;
                }
			}
		}
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
				let pointmass = new PointMass((-(this.gridWidth - 1) / 2) * this.restingDistancesVerlet + x * this.restingDistancesVerlet, (-(this.gridHeight - 1)/2) * this.restingDistancesVerlet + y * this.restingDistancesVerlet);
                pointmass.setColor(1,0,0)
				if (x != 0)
					pointmass.attachTo(this.pointsGrid[this.pointsGrid.length-1], this.restingDistancesVerlet, this.stiffnesses);
				if (y != 0)
					pointmass.attachTo(this.pointsGrid[(y - 1) * (this.gridWidth) + x], this.restingDistancesVerlet, this.stiffnesses);
                // if (x == 0 || y == 0)
                if (x == 0 || y == 0 || x == (this.gridWidth - 1) || y == (this.gridHeight - 1))
					pointmass.pinTo(pointmass.x, pointmass.y, 0, true);

                // pointmass.z = (Math.random())

				this.pointsGrid.push(pointmass);
			}
		}

	}

	createQuadsPoints(w, h)
	{
		for (let y = 0; y < h; y++)
		{
			for (let x = 0; x < w; x++)
			{
				let pointquad = new PointQuad((-(w - 1) / 2) * this.restingDistances +  x * this.restingDistances, (-(h - 1)/2) * this.restingDistances + y * this.restingDistances);
				this.pointsQuad.push(pointquad);
			}
		}
	}

    getCenterPoint(p1, p2)
    {
        let x = p1.x + (p2.x - p1.x) / 2;
        let y = p1.y + (p2.y - p1.y) / 2;
        let z = p1.z + (p2.z - p1.z) / 2;

        return { x, y, z };
    }


	findNeighbours(p1, debug)
	{

		for (let x = 0; x < this.gridWidth; x++)
        {
            for (let y = 0; y < this.gridHeight; y++)
            {
                let index = this.getPointsAtCoordinates(x, y);
                let pG = this.pointsGrid[index];
                pG.program.bind();
            }
        }

		// find column

        let points = [];
        for (var x = 0; x < this.gridWidth - 1; x++) {
            for (var y = 0; y < this.gridHeight - 1; y++) {
                let indexBL = this.getPointsAtCoordinates(x, y);
                let indexBR = this.getPointsAtCoordinates(x + 1, y);
                let indexTR = this.getPointsAtCoordinates(x + 1, y + 1);
                let indexTL = this.getPointsAtCoordinates(x, y + 1);
                let pBL = this.pointsGrid[indexBL];
                let pBR = this.pointsGrid[indexBR];
                let pTR = this.pointsGrid[indexTR];
                let pTL = this.pointsGrid[indexTL];

                let inTriangle1 = Math2.isPointInTriangle(p1, pTL, pTR, pBR);
                let inTriangle2 = Math2.isPointInTriangle(p1, pBL, pTL, pBR);

                if(inTriangle1 || inTriangle2)
                {
                        points.push(pTL);
                        points.push(pTR);
                        points.push(pBL);
                        points.push(pBR);


                        break;
                }
            }

        }

        if(points.length === 0) return;


        let centroid;
        if(points.length > 3)
        {
            centroid = Math2.findCentroid(points);
        }

        if(points.length < 4) return;


        if(points[0].x < points[1].x)
        {
            pointsOrdered[0] = points[0];
            pointsOrdered[1] = points[1];
        }
        else {
            pointsOrdered[1] = points[0];
            pointsOrdered[0] = points[1];
        }

        if(points[2].x < points[3].x)
        {
            pointsOrdered[3] = points[2];
            pointsOrdered[2] = points[3];
        }
        else {
            pointsOrdered[2] = points[2];
            pointsOrdered[3] = points[3];
        }

        // find the correct triangle (between points quadrilateral shape + cendroid)
        if(p1.x > centroid.x)
        {
            if(p1.y > centroid.y)
            {
                // return;
                let inTriangle1 = Math2.isPointInTriangle(p1, centroid, pointsOrdered[0], pointsOrdered[1]);

                if(inTriangle1)
                {
                    points[0] = pointsOrdered[0];
                    points[1] = pointsOrdered[1];
                }
                else {

                    points[0] = pointsOrdered[1];
                    points[1] = pointsOrdered[2];
                }
            }
            else if(p1.y < centroid.y){
                let inTriangle1 = Math2.isPointInTriangle(p1, centroid, pointsOrdered[1], pointsOrdered[2]);

                if(inTriangle1)
                {
                    points[0] = pointsOrdered[1];
                    points[1] = pointsOrdered[2];
                }
                else {

                    points[0] = pointsOrdered[2];
                    points[1] = pointsOrdered[3];
                }
            }
        }
        else if(p1.x < centroid.x){
            if(p1.y > centroid.y)
            {
                let inTriangle1 = Math2.isPointInTriangle(p1, centroid, pointsOrdered[0], pointsOrdered[3]);

                if(inTriangle1)
                {
                    points[0] = pointsOrdered[0];
                    points[1] = pointsOrdered[3];
                }
                else {

                    points[0] = pointsOrdered[0];
                    points[1] = pointsOrdered[1];
                }
            }
            else if(p1.y < centroid.y){
                let inTriangle1 = Math2.isPointInTriangle(p1, centroid, pointsOrdered[0], pointsOrdered[3]);

                if(inTriangle1)
                {
                    points[0] = pointsOrdered[0];
                    points[1] = pointsOrdered[3];
                }
                else {

                    points[0] = pointsOrdered[3];
                    points[1] = pointsOrdered[2];
                }
            }
        }

        if(points.length >= 3)
		{

			let p1P = points[0];
			let p2P = points[1];
			let p3P = centroid;

			let x0 = p2P.x;
			let y0 = p2P.y;
			let z0 = p2P.z

			let x = p1.x;
			let y = p1.y;

			let v1 = [p2P.x - p1P.x, p2P.y - p1P.y, p2P.z - p1P.z]
			let v2 = [p2P.x - p3P.x, p2P.y - p3P.y, p2P.z - p3P.z]

            let abc = vec3.create();
            vec3.cross(abc, v1, v2)
            // abc = Math2.cross(v1, v2);

            // equation of the plane is:
            // abc[0] * (x - x0) + abc[1] * (y - y0) + abc[2] * (z - z0) = 0;
            let z = (abc[0] * x - abc[0] * x0 + abc[1] * y - abc[1] * y0 - abc[2] * z0) / -abc[2];

            if(p1.setZ)
            {
                p1.setZ(z);
            }
		}
	}

	createQuads()
	{
		let nbColumns = this.gridQuadsWidth - 1;
		let nbLines = this.gridQuadsHeight - 1;

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

    getPointsQuadAtCoordinates(x, y)
	{
		let index = x + (this.gridQuadsWidth) * y;
		return index;
	}

	getViewAtCoordinates(x, y)
	{
		let index = x + (this.gridQuadsWidth - 1) * y;
		return index;
	}

	render()
	{
        this.physics.update(this.pointsGrid);

        this.pos.x = this.sphereIntersection.position.x;
        this.pos.y = this.sphereIntersection.position.y;

        if(this._isDown)
        {
            this.speedX = this.pos.x - this.previousPos.x;
            this.speedY = this.pos.y - this.previousPos.y;

            if(this.intersection)
            {
                this.findNeighbours(this.intersection, true);
                this.impactVerlet(this.intersection);
            }
        }
        else {
            this.speedX *= .9;
            this.speedY *= .9;
        }

        this.previousPos.x = this.pos.x;
        this.previousPos.y = this.pos.y;

		let nbColumns = this.gridQuadsWidth - 1;
		let nbLines = this.gridQuadsHeight - 1;

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


		for (let y = 0; y < this.gridQuadsHeight; y++)   // due to the way PointMasss are attached, we need the y loop on the outside
		{
			for (let x = 0; x < this.gridQuadsWidth; x++)
			{
				let index = this.getPointsQuadAtCoordinates(x, y);
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
				else if(pointquad.y > this.limitMinY + this.gridQuadsHeight)
				{
					reappearBottom = true;
				}

				if(pointquad.x <= this.limitMinX)
				{
					reappearRight = true;
				}
				else if(pointquad.x > this.limitMinX + this.gridQuadsWidth)
				{
					reappearLeft = true;
				}

                this.findNeighbours(pointquad);
				pointquad.render();
			}
		}

		// REORDER THE ACTUAL QUADS
		if(reappearBottom)
		{
            let farPoint = this.pointsQuad[this.getPointsQuadAtCoordinates(0, 0)];
            let farY = farPoint.y;

			for (var i = 0; i < this.gridQuadsWidth; i++)
			{
                let pt = this.pointsQuad.pop();
                pt.y = farY - this.restingDistances;
				this.pointsQuad.unshift(pt);
			}

			this.beenIn = true;
			for (var xView = 0; xView < nbColumns; xView++)
			{
				this.views.splice(0, 0, this.views.pop());
			}

            this.temp = true;

		}
		else if(reappearTop)
		{
            let farPoint = this.pointsQuad[this.getPointsQuadAtCoordinates(0, this.gridQuadsHeight - 1)];
            let farY = farPoint.y;

			for (var i = 0; i < this.gridQuadsWidth; i++)
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
            let farPoint = this.pointsQuad[this.getPointsQuadAtCoordinates(this.gridQuadsWidth - 1, 0)];
            let farX = farPoint.x;
            for (var y = 0; y < this.gridQuadsHeight; y++)
            {
                let indexPt = this.getPointsQuadAtCoordinates(0, y);
                let pt = this.pointsQuad[indexPt];

                pt.x = farX + this.restingDistances;
                this.pointsQuad.splice(indexPt, 1);
                this.pointsQuad.splice(indexPt + this.gridQuadsWidth -1, 0, pt);
            }
			for (var yView = 0; yView < nbLines; yView++)
			{
				let index = this.getViewAtCoordinates(0, yView);
				let quad = this.views[index];

				this.views.splice(index, 1)
				this.views.splice(index + this.gridQuadsWidth - 2, 0, quad);
			}
		}
		else if(reappearLeft)
		{
            let farPoint = this.pointsQuad[this.getPointsQuadAtCoordinates(0, 0)];
            let farX = farPoint.x;
            for (var y = 0; y < this.gridQuadsHeight; y++)
            {
                let indexPt = this.getPointsQuadAtCoordinates(this.gridQuadsWidth-1, y);
                let pt = this.pointsQuad[indexPt];
                pt.x = farX - this.restingDistances;
                this.pointsQuad.splice(indexPt, 1)
                this.pointsQuad.splice(indexPt - this.gridQuadsWidth + 1, 0, pt);

            }

			for (var yView = 0; yView < nbLines; yView++)
			{
				let index = this.getViewAtCoordinates(nbColumns - 1, yView);
				let quad = this.views[index];

				quad.program.bind();
				this.views.splice(index, 1)
				this.views.splice(index - nbColumns + 1, 0, quad);
			}
		}


		// assign the quad points dinamycally
		for (var y = 0; y < nbLines; y++)
		{
			for (var x = 0; x < nbColumns; x++)
			{
				let pts = [];
				pts.push(this.pointsQuad[this.getPointsQuadAtCoordinates(x, y)]);
				pts.push(this.pointsQuad[this.getPointsQuadAtCoordinates(x + 1, y)]);
				pts.push(this.pointsQuad[this.getPointsQuadAtCoordinates(x + 1, y + 1)]);
				pts.push(this.pointsQuad[this.getPointsQuadAtCoordinates(x, y + 1)]);

				let index = this.getPointsQuadAtCoordinates(x, y);
				let indexView = this.getViewAtCoordinates(x, y);

				let quad = this.views[indexView];

				quad.attachPointRef(pts);
			}
		}


		for (var i = 0; i < this.pointsGrid.length; i++)
		{
			if(!this._isDown)
			{
				this.pointsGrid[i].accZ = 0;
			}
            if(this.debug) this.pointsGrid[i].render();
		}

		this.program.bind();


		POLY.GL.draw(this.sphereIntersection);

        if(!this.objects) return;

        for (var i = 0; i < this.objects.length; i++) {
            POLY.GL.draw(this.objects[i]);
        }
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);
	}
}
