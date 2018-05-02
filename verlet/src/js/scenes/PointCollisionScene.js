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

export default class PointCollisionScene
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
		// this.orbitalControl.lock(true);
		// this.orbitalControl.lockZoom(true);
		POLY.GL.setCamera(this.camera);

		this.projectionMatrix = mat4.create();

		this._bPlanes = new POLY.helpers.BatchPlanes();


		this.pointsGrid = [];

		this.program = new POLY.Program();
		this.sphereIntersection = new POLY.geometry.Sphere(this.program);
		this.sphereIntersection.scale.set(.05);

        this.cubeTest = new POLY.geometry.Cube(this.program);
		this.cubeTest.scale.set(.1);
		this.cubeTest.rotation.x = Math.PI /4;
		this.cubeTest.rotation.y = Math.PI /4;

		this.rayCamera = new POLY.core.Ray();

		this.mouse = { x: 0, y: 0}
		this.planeP1 = [0,0,0]
		this.planeP2 = [1,1,0]
		this.planeP3 = [0, -1,0]

        this.createGridPoints();
		this.addEvents();

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

        for (var y = 0; y < 3; y++)
        {
            for (var x = 0; x < 3; x++)
            {
                let p = new POLY.geometry.Cube(this.program);
                // p.position.set(-1 + x, -1 + y, 0);
                p.position.set(-1 + x, -1 + y, Math.random() * -2);
                p.scale.set(.05);

                this.pointsGrid.push(p)
            }
        }
	}

    getPointsAtCoordinates(x, y)
	{
		let index = x + (3) * y;
		return index;
	}

    getCenterPoint(p1, p2)
    {
        let x = p1.x + (p2.x - p1.x) / 2;
        let y = p1.y + (p2.y - p1.y) / 2;
        let z = p1.z + (p2.z - p1.z) / 2;

        return { x, y, z };
    }

    getCentroid(triangle, debug)
    {
        let x = (triangle[0].x + triangle[1].x + triangle[2].x) / 3;
        let y = (triangle[0].y + triangle[1].y + triangle[2].y) / 3;
        let z = (triangle[0].z + triangle[1].z + triangle[2].z) / 3;

        return { x, y, z }
    }

    findCentroid(points)
    {
        // first diagonal
        // console.log(points);
        let p1P = points[0].p.position;
        let p4P = points[3].p.position;

        let tri1 = [points[0].p.position, points[1].p.position, points[3].p.position]
        let centroid1 = this.getCentroid(tri1);

        let tri2 = [points[0].p.position, points[2].p.position, points[3].p.position];
        let centroid2 = this.getCentroid(tri2, true);

        // gives to triangles
        let p2P = points[1].p.position;
        let p3P = points[2].p.position;


        let tri3 = [points[1].p.position, points[0].p.position, points[2].p.position]
        let centroid3 = this.getCentroid(tri3);

        let tri4 = [points[1].p.position, points[3].p.position, points[2].p.position]
        let centroid4 = this.getCentroid(tri4);
        this.objects = [];
        let c1c2 = { x: centroid2.x - centroid1.x, y: centroid2.y - centroid1.y, z: centroid2.z - centroid1.z };
        let c3c4 = { x: centroid4.x - centroid3.x, y: centroid4.y - centroid3.y, z: centroid4.z - centroid3.z };

        // intersection verifie:
        let k2 = (centroid3.x/c1c2.x - centroid1.x / c1c2.x - centroid3.y/c1c2.y + centroid1.y / c1c2.y) / (c3c4.x / c1c2.x  - c3c4.y / c1c2.y)
        let k = (c3c4.y * k2 - centroid3.y + centroid1.y) / c1c2.y;

        // so now we verify in BOT if it intersects or not
        let l = (c1c2.z * k - centroid1.z) ;
        let r = (c3c4.z * k2 - centroid3.z) ;

        let ptIntersection = {
            x: -(c1c2.x * k - centroid1.x),
            y: -(c1c2.y * k - centroid1.y),
            z: -(c1c2.z * k - centroid1.z),
        }

        this.objects = [];
        let c5 = new POLY.geometry.Cube(this.program);
        c5.position.set(ptIntersection.x, ptIntersection.y, ptIntersection.z);
        c5.scale.set(.05);
        this.objects.push(c5);

        return ptIntersection;

    }


	findNeighbours(p1, debug)
	{
            // let points = [];
            for (var i = 0; i < this.pointsGrid.length; i++) {
                this.pointsGrid[i].scale.set(.05);
            }


    		// find column

    		let lastX = -1;
    		for (let x = 0; x < 3; x++)
    		{
    			let index = this.getPointsAtCoordinates(x, 0);
    			let pG = this.pointsGrid[index];

    			if(pG.position.x > p1.x)
    			{
    				break;
    			}
                lastX = x;

    		}

            let lastY = -1;
    		for (let y = 0; y < 3; y++)
    		{
    			let index = this.getPointsAtCoordinates(0, y);
    			let pG = this.pointsGrid[index];

    			if(pG.position.y > p1.y)
    			{

    				break;
    			}

    			lastY = y;
    		}

            // console.log(lastX, lastY);

    		if(lastY < 0 || lastY >= (3 - 1) || lastX < 0 || lastX >= (3 - 1))
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

    				let dist = Math.pow(p1.x - pG.position.x, 2) + Math.pow(p1.y - pG.position.y, 2);

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





            let ptIntersection;
            if(points.length > 3)
            {
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

                // points[0].p.scale.set(.1)
                // points[1].p.scale.set(.1)
                // points[2].p.scale.set(.1)
                // points[3].p.scale.set(.1)
                p1P.scale.set(.1)
                p2P.scale.set(.1)
                // p3P.scale.set(.1)

                let x0 = p2P.position.x;
    			let y0 = p2P.position.y;
    			let z0 = p2P.position.z

    			let x = p1.x;
    			let y = p1.y;

    			let v1 = [p2P.position.x - p1P.position.x, p2P.position.y - p1P.position.y, p2P.position.z - p1P.position.z]
    			let v2 = [p3P.x - p2P.position.x, p3P.y - p2P.position.y, p3P.z - p2P.position.z]

                let abc = vec3.create();
                vec3.cross(abc, v1, v2)
                vec3.normalize(abc, abc)
                let z = (abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * x  -  abc[1] * y) / abc[2];

                this.cubeTest.position.z = z;


                if(p1.setZ)
                {
                    p1.setZ(z);
                }
            }





    		// points.sort(compare);
            //
			// let p1P = points[0].p.position;
			// let p2P = points[1].p.position;
			// let p3P = points[2].p.position;
			// let p4P = points[3].p.position;
            //
            // points[0].p.scale.set(.1)
            // points[1].p.scale.set(.1)
            // points[2].p.scale.set(.1)
            // points[3].p.scale.set(.1)
            //
            //
			// let x0 = p2P.x;
			// let y0 = p2P.y;
			// let z0 = p2P.z
            //
			// let x = p1.x;
			// let y = p1.y;
            //
			// let v1 = [p2P.x - p1P.x, p2P.y - p1P.y, p2P.z - p1P.z]
			// let v2 = [p3P.x - p2P.x, p3P.y - p2P.y, p3P.z - p2P.z]
            //
            // let abc = vec3.create();
            // vec3.cross(abc, v1, v2)
            // vec3.normalize(abc, abc)
            //
            //
            // // let abc = [(v1[1] * v2[2] + v1[2] * v2[1]), - (v1[0] * v2[2] + v1[2] * v2[0]) ,  -(v1[0] * v2[1] + v1[1] * v2[0])]
            // let z = (abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * x  -  abc[1] * y) / abc[2];
            //
            // this.cubeTest.position.z = z;
            //
            // console.log(z);
            //
            // if(p1.setZ)
            // {
            //     p1.setZ(z);
            // }

	}


	render()
	{
        // if(this._isDown)
        // {
            if(this.intersection)
            {
                this.findNeighbours(this.intersection, true);
            }
        // }


		this.orbitalControl.update();
		this._bPlanes.draw();


		this.program.bind();

        this.cubeTest.position.x = this.sphereIntersection.position.x;
        this.cubeTest.position.y = this.sphereIntersection.position.y;

        for (var i = 0; i < this.pointsGrid.length; i++) {
            POLY.GL.draw(this.pointsGrid[i]);
        }

		// POLY.GL.draw(this.sphereIntersection);
        POLY.GL.draw(this.cubeTest);

        for (var i = 0; i < this.objects.length; i++) {
            POLY.GL.draw(this.objects[i]);
        }
        // POLY.GL.draw(this.cubeCrossProduct);
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);
	}
}
