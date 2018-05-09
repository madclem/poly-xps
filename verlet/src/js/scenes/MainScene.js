import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import Physics from '../Physics';
import PointMass from '../views/ViewPointMass';
import PointQuad from '../views/ViewPointQuad';
import ViewQuad from '../views/ViewQuad';
import {mat3, mat4, vec3} from 'gl-matrix';
import Math2 from '../utils/Math2';
import SpeedController from '../control/SpeedController';
import DataManager from '../data/DataManager';

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
		this.debug = false;
		this.gl = null;
		this.tick = 0;
		this.gl = POLY.gl;
        this.objects = [];
		this.camera = new POLY.cameras.PerspectiveCamera();
		this.camera.perspective(45, POLY.GL.aspectRatio, 0.1, 100.0)

        this.easingValueX = 0;
        this.easingValueY = 0;

		this.orbitalControl = new POLY.control.OrbitalControl(this.camera.matrix, 2.5);
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

        this.intersection = {
            x: -10000,
            y: -10000,
        }
		this.pointsGrid = [];
		this.pointsQuad = [];
		this.views = [];
        this.viewsVerlet = [];
		this.pos = {x:0, y:0}
		this.previousPos = {x:0, y:0}
		this.speedX = 0;
		this.speedY = 0;
		this.dragSpeed = {x:0, y:0};
        this.cameraX = 0;
        this.cameraY = 0;

		this.physics = new Physics();
		this.createGridPoints();
		this.createQuadsPoints(this.gridQuadsWidth, this.gridQuadsHeight);
		this.createQuads();


		this.limitMinY = -(this.gridQuadsHeight * this.restingDistances)/2 + this.restingDistances/2;
		this.limitMinX = -(this.gridQuadsWidth * this.restingDistances)/2 + this.restingDistances/2;

        this.dataManager = new DataManager();
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

        // setTimeout(()=>{
        //     this.debug = true;
        // }, 6000)
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

				let dist = Math.pow(this.pos.x - pG.x, 2) + Math.pow(this.pos.y - pG.y, 2);


				if(dist <= minDist)
				{
					let depth = Math2.map(dist, 0, minDist, -.012, 0);
                    if(depth < -.012)
                    {
                        depth = -.012
                    }

                    pG.accZ = depth;

                    // break;
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
        window.addEventListener('mouseup', (e) => this._onUp(e));
        window.addEventListener('mousemove', (e) => this._onMove(e));

        window.addEventListener('touchstart', (e) => this._onDown(e));
        window.addEventListener('touchend', (e) => this._onUp(e));
        window.addEventListener('touchmove', (e) => this._onMove(e));
        window.addEventListener('keydown', (e) => this._onKeydown(e));
	}

	_onKeydown()
	{
	}

	_onDown(e)
	{

        // if(!this.beenIn)
        // {
        //     if (document.body.mozRequestFullScreen) {
        //         this.beenIn = true;
        //         // This is how to go into fullscren mode in Firefox
        //         // Note the "moz" prefix, which is short for Mozilla.
        //         document.body.mozRequestFullScreen();
        //     } else if (document.body.webkitRequestFullScreen) {
        //         this.beenIn = true;
        //         // This is how to go into fullscreen mode in Chrome and Safari
        //         // Both of those browsers are based on the Webkit project, hence the same prefix.
        //         document.body.webkitRequestFullScreen();
        //     }
        // }

		if(this._isDown) return;

        this.removeActiveQuad();


		this._isDown = true;

		let pt = getCursorPos(e);
        SpeedController.onDown(pt);
		let x = (pt.x / POLY.gl.viewportWidth) * 2 - 1;
		let y = - (pt.y / POLY.gl.viewportHeight) * 2 + 1;

		this.firstPos = {
			x: pt.x, y: pt.y
		};

		this.speed =  this.lastSpeed = 0;
	}


    removeActiveQuad(cb)
    {
        if(this.activeQuad)
        {
            this.activeQuad.program.bind();
            this.activeQuad.program.uniforms.active = 0.0;

            // this.activeQuad.points.donotupdate = false;
            for (var i = 0; i < this.activeQuad.points.length; i++) {
                let pt = this.activeQuad.points[i];
                Easings.to(pt, .2 + i * .1, {
                    onCompleteParams: {pt, i},
                    onComplete: (data)=>{
                        pt.donotupdate = false;


                        if(data.i === 0)
                        {
                            if(cb) cb();
                            cb = null;
                        }
                    },
                    easeZ: 0,
                    // delay: .2 + i * .1,
                    ease: Easings.easeOutCirc,
                });
            }
        }

        this.activeQuad = null;
    }

    onClick(ptx, pty)
    {
        if(this.activeQuad)
        {
            this.removeActiveQuad(()=>{
            });

            // this.onClick(ptx, pty);
            // return;
        }

        let nbColumns = this.gridQuadsWidth - 1;
		let nbLines = this.gridQuadsHeight - 1;

        let totalWidth = (nbColumns) * this.restingDistances + this.restingDistances;
        let totalHeight = nbLines * this.restingDistances;

        let widthColumn = totalWidth / nbColumns;


        let col = Math.floor((ptx + totalWidth/2) / this.restingDistances) - 1;
        let line = Math.floor((pty + totalHeight/2) / this.restingDistances);

        for (var x = col - 2; x < col + 2; x++) {
            for (var y = line - 2; y < line + 2; y++) {
                let indexView = this.getViewAtCoordinates(x, y);
                let quad = this.views[indexView];

                if(quad)
                {
                    // console.log(ptx, quad.x);
                    if( Math.abs(ptx - quad.x) <= this.restingDistances/2  && Math.abs(pty - quad.y) <= this.restingDistances/2 )
                    {
                        // quad.setColor(1,0,0);
                        this.activeQuad = quad;
                        quad.program.bind();
                        quad.program.uniforms.active = 1.0;

                        for (var i = 0; i < quad.points.length; i++) {
                            let pt = quad.points[i]


                            Easings.to(pt, .6 + i * .3, {
                                onStartParams: pt,
                                onStart: (pt)=>{

                                    pt.donotupdate = true;
                                },
                                easeZ: 1,
                                delay: .2 + i * .1,
                                onUpdateParams: pt,
                                ease: Easings.elasticOutSoft,
                            });
                        }

                        Easings.to(this, .8, {
                            cameraX: this.cameraX - quad.x,
                            ease: Easings.easeOutCirc,
                            onComplete: ()=>{

                            }
                        });

                        Easings.to(this, .8, {
                            cameraY: this.cameraY - quad.y,
                            ease: Easings.easeOutCirc
                            // cameraY:  100
                        });

                        console.log('here', this.cameraX - quad.x);
                        break;//
                    }
                }
            }
        }
    }

	_onMove(e)
	{

		let pt = getCursorPos(e);

        SpeedController.onMove(pt);

		let x = (pt.x / POLY.gl.viewportWidth) * 2 - 1;
		let y = - (pt.y / POLY.gl.viewportHeight) * 2 + 1;

		this.mouse.x = x;
		this.mouse.y = y;

        if(this._isDown)
        {
            // this.easingValueX = x - this.firstPos.x;
            // this.easingValueY = y - this.firstPos.y;

            // this.easingValueX *= .8;
            // this.easingValueX *= .8;
        }

		this.onTraceRay();
	}

	_onUp(e)
	{
		this._isDown = false;

        let pt = getCursorPos(e);

        if(Math.abs(this.firstPos.x - pt.x) < .1 && Math.abs(this.firstPos.y - pt.y) < .1)
        {
            this.onClick(this.intersection.x, this.intersection.y);
        }
        SpeedController.onUp();
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
					pointmass.attachTo(this.pointsGrid[this.pointsGrid.length-1], this.restingDistancesVerlet, this.stiffnesses * 2);
				if (y != 0)
					pointmass.attachTo(this.pointsGrid[(y - 1) * (this.gridWidth) + x], this.restingDistancesVerlet, this.stiffnesses * 2);
                // if (x == 0 || y == 0)
                // if ((x == 0 && y == 0)|| (x == (this.gridWidth - 1) && y === 0) || (y == (this.gridHeight - 1) && x == (this.gridWidth - 1)) || (y == (this.gridHeight - 1) && x == 0))
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

        if(p1.donotupdate) return;

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

        let index = 0;
		for (var i = 0; i < nbLines * nbColumns; i++)
		{
			let viewQuad = new ViewQuad(i * 2);
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
        SpeedController.update();

        this.physics.update(this.pointsGrid);

        this.pos.x = this.sphereIntersection.position.x;
        this.pos.y = this.sphereIntersection.position.y;

        if(this._isDown)
        {
            if(this.intersection)
            {
                this.findNeighbours(this.intersection, true);
                this.impactVerlet(this.intersection);
            }
        }

        this.speedX += ((SpeedController.speedX * 3)/ POLY.gl.viewportWidth - this.speedX) * .06;
        this.speedY += ((-SpeedController.speedY * 2)/ POLY.gl.viewportHeight - this.speedY) * .06;

        this.dragSpeed.x += ((SpeedController.speedX)/ POLY.gl.viewportWidth - this.dragSpeed.x) * .06;
        this.dragSpeed.y += ((SpeedController.speedY)/ POLY.gl.viewportHeight - this.dragSpeed.y) * .06;

        this.previousPos.x = this.pos.x;
        this.previousPos.y = this.pos.y;

		let nbColumns = this.gridQuadsWidth - 1;
		let nbLines = this.gridQuadsHeight - 1;

		this.orbitalControl.update();
		this._bPlanes.draw();

        this.cameraX += this.speedX;
        this.cameraY += this.speedY;



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

                // STRETCH
                let distY = Math.abs(this.intersection.y - pointquad.y);
                let distX = Math.abs(this.intersection.x - pointquad.x);
                if(distY > 4) distY = 4;

                let sx = 0;
                if(this.dragSpeed.x && !isNaN(this.dragSpeed.x) && distX < 4)
                {
                    let s = this.dragSpeed.x;
                    if(s > 2) s = 2;
                    if(s < -2) s = -2;

                    sx = s * 15 * 2 * (1 - distY/4) * (1 - distX / 4);
                }

                let distY2 = Math.abs(this.intersection.y - pointquad.y);
                let distX2 = Math.abs(this.intersection.x - pointquad.x);

                if(distX2 > 3) distX2 = 3;

                let sy = 0;
                if(this.dragSpeed.y && !isNaN(this.dragSpeed.y) && distY2 < 4)
                {
                    let s = -this.dragSpeed.y;
                    if(s > 1) s = 1;
                    if(s < -1) s = -1;

                    sy = s * 15 * (1 - distY2/4) * (1 - distX2 / 3);
                }
                pointquad.setSpeed(sx, sy);

                // set the quad's point position
                pointquad.x = (this.cameraX + pointquad.origin.x + pointquad.gridPos.x + pointquad.speedX)  %  (Math.abs(this.limitMinX) * 2) ;// this.speedX;
                pointquad.y = (this.cameraY + pointquad.origin.y + pointquad.gridPos.y + pointquad.speedY)  %  (Math.abs(this.limitMinY) * 2);// this.speedX;

                // reappearing stuff
				if(pointquad.y <= this.limitMinY)
				{
					reappearTop = true;
				}
				else if(pointquad.y > this.limitMinY + this.gridQuadsHeight)
				{
					reappearBottom = true;
				}
				if((pointquad.x - sx) < this.limitMinX)
				{
					reappearRight = true;
				}
				else if((pointquad.x) > this.limitMinX + this.gridQuadsWidth)
				{
					reappearLeft = true;
				}

                this.findNeighbours(pointquad); // to get the depth
				pointquad.render();
			}
		}

		// REORDER THE ACTUAL QUADS
		if(reappearBottom)
		{
			for (var i = 0; i < this.gridQuadsWidth; i++)
			{
                let pt = this.pointsQuad.pop();
                pt.gridPos.y -= (Math.abs(this.limitMinY) * 2 + this.restingDistances);
				this.pointsQuad.unshift(pt);
			}

			for (var xView = 0; xView < nbColumns; xView++)
			{
                let quad = this.views.pop();
                quad.skipRender = true;
				this.views.splice(0, 0, quad);
			}
		}
		else if(reappearTop)
		{
            for (var i = 0; i < this.gridQuadsWidth; i++)
			{
                let pt = this.pointsQuad.shift();
                pt.gridPos.y += Math.abs(this.limitMinY) * 2 + this.restingDistances;
				this.pointsQuad.push(pt);
			}

			for (var xView = 0; xView < nbColumns; xView++)
			{
                let quad = this.views.shift();
                quad.skipRender = true;
				this.views.push(quad);
			}
		}

		if(reappearRight)
		{
            for (var y = 0; y < this.gridQuadsHeight; y++)
            {
                let indexPt = this.getPointsQuadAtCoordinates(0, y);
                let pt = this.pointsQuad[indexPt];

                pt.gridPos.x += Math.abs(this.limitMinX) * 2 + this.restingDistances;
                this.pointsQuad.splice(indexPt, 1);
                this.pointsQuad.splice(indexPt + this.gridQuadsWidth -1, 0, pt);
            }
			for (var yView = 0; yView < nbLines; yView++)
			{
				let index = this.getViewAtCoordinates(0, yView);
				let quad = this.views[index];

                quad.skipRender = true;
				this.views.splice(index, 1)
				this.views.splice(index + this.gridQuadsWidth - 2, 0, quad);
			}
		}
		else if(reappearLeft)
		{
            for (var y = 0; y < this.gridQuadsHeight; y++)
            {
                let indexPt = this.getPointsQuadAtCoordinates(this.gridQuadsWidth-1, y);
                let pt = this.pointsQuad[indexPt];
                pt.gridPos.x -= (Math.abs(this.limitMinX) * 2 + this.restingDistances);
                this.pointsQuad.splice(indexPt, 1)
                this.pointsQuad.splice(indexPt - this.gridQuadsWidth + 1, 0, pt);
            }

			for (var yView = 0; yView < nbLines; yView++)
			{
				let index = this.getViewAtCoordinates(nbColumns - 1, yView);
				let quad = this.views[index];
                quad.skipRender = true;
				this.views.splice(index, 1)
				this.views.splice(index - nbColumns + 1, 0, quad);
			}
		}


		// DATA + GIVE QUAD CORRECT POINTS
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

                // loop datas
                let totalWidth = this.dataManager.size.width;
                let totalHeight = this.dataManager.size.height;
                let gridSize = 1;
                let xid = (-this.cameraX + quad.x - this.restingDistances / 2 + (this.gridWidth) / 2)/ gridSize;
                xid %= (totalWidth);
                if(xid < 0) xid += totalWidth;

                let yid = (-this.cameraY + quad.y - this.restingDistances / 2 + (this.gridHeight) / 2)/ gridSize;
                yid%= (totalHeight);
                if(yid < 0) yid += totalHeight;

                xid = Math.floor(xid);
                yid = Math.floor(yid);

                let data = this.dataManager.getDataAt(xid, yid);
                quad.setData(data);

                if(!quad.skipRender)
                {
                    quad.render();
                }

                quad.skipRender = false;
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
