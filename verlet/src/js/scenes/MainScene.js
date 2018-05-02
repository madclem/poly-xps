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
        this.createQuadsVerlet();


		this.limitMinY = -(this.gridQuadsHeight * this.restingDistances)/2 + this.restingDistances/2;
		this.limitMinX = -(this.gridQuadsWidth * this.restingDistances)/2 + this.restingDistances/2;

		this.program = new POLY.Program();
		this.sphereIntersection = new POLY.geometry.Sphere(this.program);
		this.sphereIntersection.scale.set(.05);

        this.cubeTest = new POLY.geometry.Cube(this.program);
		this.cubeTest.scale.set(.1);




        this.cubeCrossProduct = new POLY.geometry.Cube(this.program);
		this.cubeCrossProduct.scale.set(.1);

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
					let depth = this.map(dist, 0, minDist, -.004, 0);
                    if(depth < -.004)
                    {
                        depth = -.004
                    }


					pG.test = true;
					pG.accZ = depth;

                    // break;
				}
				// else
                // {
				// 	// pG.accZ = 0;
				// }

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
				if (x != 0)
					pointmass.attachTo(this.pointsGrid[this.pointsGrid.length-1], this.restingDistancesVerlet, this.stiffnesses);
				if (y != 0)
					pointmass.attachTo(this.pointsGrid[(y - 1) * (this.gridWidth) + x], this.restingDistancesVerlet, this.stiffnesses);
                if (x == 0 || y == 0 || x == (this.gridWidth - 1) || y == (this.gridHeight - 1))
					pointmass.pinTo(pointmass.x, pointmass.y, 0, true);

                pointmass.z = (Math.random())

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

    getLineEquation()
    {

    }

    getCentroid(triangle, debug)
    {
        let x = (triangle[0].x + triangle[1].x + triangle[2].x) / 3;
        let y = (triangle[0].y + triangle[1].y + triangle[2].y) / 3;
        let z = (triangle[0].z + triangle[1].z + triangle[2].z) / 3;

        if(debug) {
            // console.log(triangle);
        }
        return { x, y, z }
    }
    getIntersection(p1, p2, p3, p4)
    {
        let equation1
    }

    findCentroid(points, debug)
    {
        // first diagonal
        // console.log(points);
        let p1P = points[0].p;
        let p4P = points[3].p;

        let tri1 = [points[0].p, points[1].p, points[3].p]
        let centroid1 = this.getCentroid(tri1);
        // let median2 = this.getCenterPoint(tri1[1], tri1[2]);
        // let median3 = this.getCenterPoint(tri1[0], tri1[2]);
        // let median1 = this.getCenterPoint(tri1[0], tri1[1]);
        // let median2 = this.getCenterPoint(tri1[1], tri1[2]);
        // let median3 = this.getCenterPoint(tri1[0], tri1[2]);

        let tri2 = [points[0].p, points[2].p, points[3].p];
        let centroid2 = this.getCentroid(tri2, true);

        // gives to triangles
        let p2P = points[1].p;
        let p3P = points[2].p;

        let tri3 = [points[1].p, points[0].p, points[2].p]
        let centroid3 = this.getCentroid(tri3);

        let tri4 = [points[1].p, points[3].p, points[2].p]
        let centroid4 = this.getCentroid(tri4);

        // let c1 = new POLY.geometry.Cube(this.program);
        // c1.position.set(centroid1.x,centroid1.y,centroid1.z);
		// c1.scale.set(.05);
        // let c2 = new POLY.geometry.Cube(this.program);
        // c2.position.set(centroid2.x,centroid2.y,centroid2.z);
		// c2.scale.set(.05);
        // let c3 = new POLY.geometry.Cube(this.program);
        // c3.position.set(centroid3.x,centroid3.y,centroid3.z);
		// c3.scale.set(.05);
        // let c4 = new POLY.geometry.Cube(this.program);
        // c4.position.set(centroid4.x,centroid4.y,centroid4.z);
		// c4.scale.set(.05);

        // console.log(centroid2.x,centroid2.y,centroid2.z);
        //
        // this.objects.push(c1, c2, c3, c4);


        let c1c2 = { x: centroid2.x - centroid1.x, y: centroid2.y - centroid1.y, z: centroid2.z - centroid1.z };
        let c3c4 = { x: centroid4.x - centroid3.x, y: centroid4.y - centroid3.y, z: centroid4.z - centroid3.z };

        // intersection verifie:
        // TOP c1c2.x * k - c1.x = c3c4.x * k2 - c3.x
        // MID c1c2.y * k - c1.y = c3c4.y * k2 - c3.y
        // BOT c1c2.z * k - c1.z = c3c4.z * k2 - c3.z


        // (1) k = (c3c4.x * k2 - c3.x + c1.x) / c1c2.x
        // (2) k = (c3c4.y * k2 - c3.y + c1.y) / c1c2.y

        // (2) - (1) => (c3c4.x * k2 - c3.x + c1.x) / c1c2.x - (c3c4.y * k2 - c3.y + c1.y) / c1c2.y = 0
        // (2) - (1) => (c3c4.x * k2 / c1c2.x) - c3.x/c1c2.x + c1.x / c1c2.x - (c3c4.y * k2 / c1c2.y) + c3.y/c1c2.y - c1.y / c1c2.y = 0
        // (2) - (1) => (c3c4.x * k2 / c1c2.x)  - (c3c4.y * k2 / c1c2.y) = c3.x/c1c2.x - c1.x / c1c2.x - c3.y/c1c2.y + c1.y / c1c2.y
        // (2) - (1) => k2 * (c3c4.x / c1c2.x  - c3c4.y / c1c2.y) = c3.x/c1c2.x - c1.x / c1c2.x - c3.y/c1c2.y + c1.y / c1c2.y
        // (2) - (1) => k2 = (c3.x/c1c2.x - c1.x / c1c2.x - c3.y/c1c2.y + c1.y / c1c2.y) / (c3c4.x / c1c2.x  - c3c4.y / c1c2.y)
        let k2 = (centroid3.x/c1c2.x - centroid1.x / c1c2.x - centroid3.y/c1c2.y + centroid1.y / c1c2.y) / (c3c4.x / c1c2.x  - c3c4.y / c1c2.y)

        // putting it back in (2)
        // k = (c3c4.y * k2 - c3.y + c1.y) / c1c2.y
        let k = (c3c4.y * k2 - centroid3.y + centroid1.y) / c1c2.y;

        // so now we verify in BOT if it intersects or not
        let l = (c1c2.z * k - centroid1.z) ;
        let r = (c3c4.z * k2 - centroid3.z) ;

        // if( l === r)
        // {

            let ptIntersection = {
                x: -(c1c2.x * k - centroid1.x),
                y: -(c1c2.y * k - centroid1.y),
                z: -(c1c2.z * k - centroid1.z),
            }
        // }

        if(debug)
        {
            this.objects2 = [];
            let c5 = new POLY.geometry.Cube(this.program);
            c5.position.set(ptIntersection.x, ptIntersection.y, ptIntersection.z);
            c5.scale.set(.2);
            this.objects2.push(c5);
        }


        return ptIntersection;






        // k  = (c3c4.x * k2 - c3.x + c1.x) / c1c2.x
        // c1c2.y * ((c3c4.x * k2 - c3.x + c1.x) / c1c2.x) - c1.y = c3c4.y * k2 - c3.y
        // c1c2.y * ((c3c4.x * k2) / c1c2.x - c3.x / c1c2.x + c1.x / c1c2.x) - c1.y = c3c4.y * k2 - c3.y
        // c1c2.y * ((c3c4.x  / c1c2.x) * k2 - c3.x / c1c2.x + c1.x / c1c2.x) - c1.y = c3c4.y * k2 - c3.y

        // k * c1c2.y * (c3c4.x  / c1c2.x) + c1c2.y * c1.x / c1c2.x - c1c2.y * c3.x / c1c2.x - c1.y = c3c4.y * k2 - c3.y


        // c1c2.y * ((c3c4.x * k2) / c1c2.x) - c1c2.y * (c3.x / c1c2.x) + c1c2.y * (c1.x / c1c2.x) - c1.y = c3c4.y * k2 - c3.y
        // c1c2.y * ((c3c4.x * k2) / c1c2.x) - c3c4.y * k2 = - c3.y + c1c2.y * (c3.x / c1c2.x) - c1c2.y * (c1.x / c1c2.x) + c1.y
        // c1c2.y * (c3c4.x / c1c2.x * k2) - c3c4.y * k2 = - c3.y + c1c2.y * (c3.x / c1c2.x) - c1c2.y * (c1.x / c1c2.x) + c1.y
        // k2 * (c1c2.y * c3c4.x / c1c2.x) = - c3.y + c1c2.y * (c3.x / c1c2.x) - c1c2.y * (c1.x / c1c2.x) + c1.y + c3c4.y * k2


        // TOO FAR k2 * (c1c2.y * c3c4.x / c1c2.x - c3c4.y) = - c3.y + c1c2.y * (c3.x / c1c2.x) - c1c2.y * (c1.x / c1c2.x) + c1.y
        // TOO FAR k2 = (- c3.y + c1c2.y * (c3.x / c1c2.x) - c1c2.y * (c1.x / c1c2.x) + c1.y) / (c1c2.y * c3c4.x / c1c2.x - c3c4.y)



        // 2 * ( (3 * x) / 5) - 4 * k
        // 2 * (3/5)x - 4x
        // x ( 2 * 3/5 - 4)
        // x ( 2 * 3/5 - 4)

        // let vector1 = vec3.create();
        // vector1[0] = centroid1.x;
        // vector1[1] = centroid1.y;
        // vector1[2] = centroid1.z;
        //
        // let vector2 = vec3.create();
        // vector2[0] = centroid1.x;
        // vector2[1] = centroid1.y;
        // vector2[2] = centroid1.z;
        //
        // let vector2 = vec3.create();
        // vector2[0] = centroid1.x;
        // vector2[1] = centroid1.y;
        // vector2[2] = centroid1.z;

    }

	findNeighbours(p1, debug)
	{

        // let points = [];

		for (let x = 0; x < this.gridWidth; x++)
        {
            for (let y = 0; y < this.gridHeight; y++)
            {
                let index = this.getPointsAtCoordinates(x, y);
                let pG = this.pointsGrid[index];
                // let dist = Math.pow(p1.x - pG.x, 2) + Math.pow(p1.y - pG.y, 2);

                pG.program.bind();
                pG.program.uniforms.color = [1,1,1]
                //
				// points.push({
				// 	p: pG,
				// 	dist
				// });
            }
        }

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
		for (let y = lastY; y <= lastY + 1; y++)
		{
			for (let x = lastX; x <= lastX + 1; x++)
			{
				let index = this.getPointsAtCoordinates(x, y);
				let pG = this.pointsGrid[index];
                // pG.program.bind();
                // pG.program.uniforms.color = [1,0,0];

				// pG.temp = true;

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




        // if(debug)
        // {
        //     p1.program.bind();
        //     p1.program.uniforms.color = [1,1,0];
        // }
        // else if(p1.program){
        //     p1.program.bind();
        //     p1.program.uniforms.color = [1,1,1];
        // }

        // console.log('dist p0: ', points[0].dist);
        // if(points[0].dist < 0.05)
        // {
        //     let z = points[0].p.z;

        //     if(p1.setZ)
        //     {
        //         p1.setZ(z);
        //     }
        // }

        let ptIntersection;
        if(points.length > 3)
        {

            // console.log(points.length, 'points.length');
            // console.log(points.length);
            ptIntersection = this.findCentroid(points);
        }
        points.sort(compare);

// console.log(points);
        if(points.length >= 3)
		{

            // this.findCentroid(points);

			let p1P = points[0].p;
            // console.log(points);
			let p2P = points[1].p;
			let p3P = ptIntersection;
			// let p3P = points[2].p;
			// let p4P = points[3].p;

            if(debug)
            {
                p1P.program.bind();
                p1P.program.uniforms.color = [0,1,0];
                p2P.program.bind();
                p2P.program.uniforms.color = [0,1,0];

                // let c1 = new POLY.geometry.Cube(this.program);
                // c1.position.set(p1P.x,p1P.y,p1P.z);
        		// c1.scale.set(.05);
                // let c2 = new POLY.geometry.Cube(this.program);
                // c2.position.set(p2P.x,p2P.y,p2P.z);
        		// c2.scale.set(.05);
                let c3 = new POLY.geometry.Cube(this.program);
                c3.position.set(p3P.x,p3P.y,p3P.z);
        		c3.scale.set(.1);
                this.objects = [];
                this.objects.push(c3);

                // p3P.program.bind();
                // p3P.program.uniforms.color = [0,1,0];
                // p4P.program.bind();
                // p4P.program.uniforms.color = [0,1,0];
            }


			let x0 = p2P.x;
			let y0 = p2P.y;
			let z0 = p2P.z

			let x = p1.x;
			let y = p1.y;

			let v1 = [p2P.x - p1P.x, p2P.y - p1P.y, p2P.z - p1P.z]
			let v2 = [p3P.x - p2P.x, p3P.y - p2P.y, p3P.z - p2P.z]

            let abc = vec3.create();
            vec3.cross(abc, v1, v2)
            vec3.normalize(abc, abc)

            // this.cubeCrossProduct.position.x = abc[0];
            // this.cubeCrossProduct.position.y = abc[1];
            // this.cubeCrossProduct.position.z = abc[2];

            // let abc = [(v1[1] * v2[2] + v1[2] * v2[1]), - (v1[0] * v2[2] + v1[2] * v2[0]) ,  -(v1[0] * v2[1] + v1[1] * v2[0])]


            let z = (abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * x  -  abc[1] * y) / abc[2];

            this.cubeTest.position.z = z;
            if(debug)
            {
                // console.log(z);
            }



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

                // let quadVerlet = this.viewsVerlet[index];
                // quadVerlet.render();
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

        this.cubeTest.position.x = this.sphereIntersection.position.x;
        this.cubeTest.position.y = this.sphereIntersection.position.y;

		POLY.GL.draw(this.sphereIntersection);
        POLY.GL.draw(this.cubeTest);

        if(!this.objects) return;

        for (var i = 0; i < this.objects.length; i++) {
            POLY.GL.draw(this.objects[i]);
        }
        if(!this.objects2) return;
        for (var i = 0; i < this.objects2.length; i++) {
            POLY.GL.draw(this.objects2[i]);
        }
        // POLY.GL.draw(this.cubeCrossProduct);
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
