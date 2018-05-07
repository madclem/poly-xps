import * as POLY from 'poly/Poly';
import ViewBg from '../views/ViewBg';
import Physics from '../Physics';
import PointMass from '../views/ViewPointMass';
import PointQuad from '../views/ViewPointQuad';
import ViewQuad from '../views/ViewQuad';
import {mat3, mat4, vec3} from 'gl-matrix';
import frag from '../shaders/pointColor.frag';

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

        this.gridWidth = 3;
        this.gridHeight = 3;
		this.camera = new POLY.cameras.PerspectiveCamera();
		this.camera.perspective(45, POLY.GL.aspectRatio, 0.1, 100.0)

		this.orbitalControl = new POLY.control.OrbitalControl(this.camera.matrix, 1.4);
		// this.orbitalControl.lock(true);
		// this.orbitalControl.lockZoom(true);
		POLY.GL.setCamera(this.camera);

		this.projectionMatrix = mat4.create();

		this._bPlanes = new POLY.helpers.BatchPlanes();


		this.pointsGrid = [];

		this.program = new POLY.Program(null, frag, {
            color: {
                type: 'vec3',
                value: [1,1,1]
            }
        });
		this.sphereIntersection = new POLY.geometry.Sphere(this.program);
		this.sphereIntersection.scale.set(.05);

        this.cubeTest = new POLY.geometry.Cube(this.program);
		this.cubeTest.scale.set(.05);
		this.cubeTest.rotation.x = Math.PI /4;
		this.cubeTest.rotation.y = Math.PI /4;

		this.rayCamera = new POLY.core.Ray();

		this.mouse = { x: 0, y: 0}
		this.planeP1 = [0,0,0]
		this.planeP2 = [1,1,0]
		this.planeP3 = [0, -1,0]

        this.createGridPoints();
		this.addEvents();

        this.cubeTests = [];

        for (var i = 0; i < 10; i++) {
            let cubeTest = new POLY.geometry.Cube(this.program);
    		cubeTest.tickX = Math.random() * 100;
    		cubeTest.tickY = Math.random() * 100;
    		cubeTest.speedX = Math.random() * .2 + 1;
    		cubeTest.speedY = Math.random() * .2 + 1;
    		cubeTest.scale.set(.05);
    		cubeTest.rotation.x = Math.PI /4;
    		cubeTest.rotation.y = Math.PI /4;

            this.cubeTests.push(cubeTest);
        }

	}

    setColor(cube, r,g,b)
    {
        cube.program.bind();
        // cube.program.uniforms.color[0] = r;
        // cube.program.uniforms.color[1] = g;
        cube.program.uniforms.color = [r, g, b]
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
                let program = new POLY.Program(null, frag, {
                    color: {
                        type: 'vec3',
                        value: [1,1,1]
                    }
                });

                let p = new POLY.geometry.Cube(program);
                p.program=program;
                // p.position.set(-1 + x, -1 + y, 0);
                p.position.set(-1 + x + Math.random() * .5 - .5/2, -1 + y, Math.random() * -2);
                // p.position.set(-1 + x, -1 + y, 0);
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
                // this.pointsGrid[i].scale.set(.05);
                // this.pointsGrid[i].setColor(1,1,1);
                // this.setColor(this.pointsGrid[i], 1, 1, 1);
            }

            function ptInTriangle(p, p0, p1, p2) {
                var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
                var sign = A < 0 ? -1 : 1;
                var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
                var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

                return s > 0 && t > 0 && (s + t) < 2 * A * sign;
            }


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

                    let inTriangle1 = ptInTriangle(p1, pTL.position, pTR.position, pBR.position);
                    let inTriangle2 = ptInTriangle(p1, pBL.position, pTL.position, pBR.position);
                    //
                    // if(x === 0 && y === 0)
                    // {
                    //     this.setColor(pTL, 1,0,0);
                    //     this.setColor(pTR, 0,1,0);
                    //     this.setColor(pBR, 0,0,1);
                    //     this.setColor(pBL, 1,1,1);
                    //     console.log(inTriangle1, inTriangle2);
                    // }
                    if(inTriangle1 || inTriangle2)
                    {
                            points.push({ p: pTL });
                            points.push({ p: pTR });
                            points.push({ p: pBL });
                            points.push({ p: pBR });


                            break;
                    }

                    // console.log(pTL, pTR, pBR, pBL);
                }

            }

            // return;

            if(points.length === 0) return;


            this.setColor(points[0].p, 1,1,1);
            this.setColor(points[1].p, 1,1,1);
            this.setColor(points[2].p, 1,1,1);
            this.setColor(points[3].p, 1,1,1);


            let ptIntersection;
            if(points.length > 3)
            {
                ptIntersection = this.findCentroid(points);
            }

            let pointsTop = [];
            let pointsBottom = [];
            let pointsOrdered = [];
            for (var i = 0; i < points.length; i++) {
                if(points[i].p.position.y > ptIntersection.y)
                {
                    pointsTop.push(points[i]);
                }
                else {
                    pointsBottom.push(points[i]);
                }
            }

            if(pointsTop[0].p.position.x < pointsTop[1].p.position.x)
            {
                pointsOrdered[0] = pointsTop[0];
                pointsOrdered[1] = pointsTop[1];
            }
            else {
                pointsOrdered[1] = pointsTop[0];
                pointsOrdered[0] = pointsTop[1];
            }

            if(pointsBottom[0].p.position.x < pointsBottom[1].p.position.x)
            {
                pointsOrdered[3] = pointsBottom[0];
                pointsOrdered[2] = pointsBottom[1];
            }
            else {
                pointsOrdered[2] = pointsBottom[0];
                pointsOrdered[3] = pointsBottom[1];
            }




            // function ptInTriangle(p, p0, p1, p2) {
            //     var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
            //     var sign = A < 0 ? -1 : 1;
            //     var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
            //     var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
            //
            //     return s > 0 && t > 0 && (s + t) < 2 * A * sign;
            // }


            let p1x = p1.position ? p1.position.x : p1.x;
            let p1y = p1.position ? p1.position.y : p1.y;
            if(p1x > ptIntersection.x)
            {
                // return;
                // console.log('here');
                // points could be
                // pt0, pt1
                // pt1, pt2
                // pt2, pt3
                if(p1y > ptIntersection.y)
                {
                    // return;
                    let inTriangle1 = ptInTriangle(p1, ptIntersection, pointsOrdered[0].p.position, pointsOrdered[1].p.position);

                    if(inTriangle1)
                    {
                        points[0] = pointsOrdered[0];
                        points[1] = pointsOrdered[1];

                        // this.setColor(points[0].p, 1,0,0);
                        // this.setColor(points[1].p, 0,1,0);
                    }
                    else {

                        let inTriangle2 = ptInTriangle(p1, ptIntersection, pointsOrdered[1].p.position, pointsOrdered[2].p.position);
                        points[0] = pointsOrdered[1];
                        points[1] = pointsOrdered[2];
                    }

                    this.setColor(points[0].p, 1,0,0);
                    this.setColor(points[1].p, 0,1,0);
                    // pt0, pt1
                    // pt1, pt2
                }

                else if(p1y < ptIntersection.y){
                    let inTriangle1 = ptInTriangle(p1, ptIntersection, pointsOrdered[1].p.position, pointsOrdered[2].p.position);

                    if(inTriangle1)
                    {
                        points[0] = pointsOrdered[1];
                        points[1] = pointsOrdered[2];
                    }
                    else {
                        let inTriangle2 = ptInTriangle(p1, ptIntersection, pointsOrdered[2].p.position, pointsOrdered[3].p.position);

                        points[0] = pointsOrdered[2];
                        points[1] = pointsOrdered[3];
                    }


                    // pt1, pt2
                    // pt2, pt3
                }
            }
            else if(p1x < ptIntersection.x){
                //pt0, pt1
                // pt0, pt3
                // pt3, pt2
                if(p1y > ptIntersection.y)
                {
                    let inTriangle1 = ptInTriangle(p1, ptIntersection, pointsOrdered[0].p.position, pointsOrdered[3].p.position);

                    if(inTriangle1)
                    {
                        points[0] = pointsOrdered[0];
                        points[1] = pointsOrdered[3];
                    }
                    else {
                        let inTriangle2 = ptInTriangle(p1, ptIntersection, pointsOrdered[0].p.position, pointsOrdered[1].p.position);

                        points[0] = pointsOrdered[0];
                        points[1] = pointsOrdered[1];
                    }
                    // pt0, pt3
                    // pt0, pt1
                }
                else if(p1y < ptIntersection.y){
                    let inTriangle1 = ptInTriangle(p1, ptIntersection, pointsOrdered[0].p.position, pointsOrdered[3].p.position);

                    if(inTriangle1)
                    {
                        points[0] = pointsOrdered[0];
                        points[1] = pointsOrdered[3];
                    }
                    else {
                        let inTriangle2 = ptInTriangle(p1, ptIntersection, pointsOrdered[3].p.position, pointsOrdered[2].p.position);

                        points[0] = pointsOrdered[3];
                        points[1] = pointsOrdered[2];
                    }
                    // pt0, pt3
                    // pt3, pt2
                }
            }

            this.setColor(points[0].p, 1,0,0);
            this.setColor(points[1].p, 0,1,0);

            // points.sort(compare);

    // console.log(points);
            if(points.length >= 3)
    		{


                // this.setColor(pointsOrdered[2].p, 0,0,1);
                // this.setColor(pointsOrdered[3].p, 1,1,1);

    			let p1P = points[0].p;
                // console.log(points);
    			let p2P = points[1].p;
    			let p3P = ptIntersection;



                // points[0].p.scale.set(.1)
                // points[1].p.scale.set(.1)
                // points[2].p.scale.set(.1)
                // points[3].p.scale.set(.1)

                // this.setColor(p1P, 1, 0, 0);
                // this.setColor(p2P, 1, 0, 0);

                // p1P.scale.set(.1)
                // p2P.scale.set(.1)
                // p3P.scale.set(.1)

                let x0 = p2P.position.x;
    			let y0 = p2P.position.y;
    			let z0 = p2P.position.z

    			let x = p1.position? p1.position.x : p1.x;
    			let y = p1.position? p1.position.y : p1.y;
    			// let y = p1.y;

    			let v1 = [p2P.position.x - p1P.position.x, p2P.position.y - p1P.position.y, p2P.position.z - p1P.position.z]
    			let v2 = [p3P.x - p2P.position.x, p3P.y - p2P.position.y, p3P.z - p2P.position.z]

                let abc = vec3.create();
                vec3.cross(abc, v1, v2)
                vec3.normalize(abc, abc)
                let z = (abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * x  -  abc[1] * y) / abc[2];

                // this.cubeTest.position.z = z;
                // this.cubeTest.position.z = z;

                if(p1.position)
                {
                    // console.log(z);
                    p1.position.z = z;
                }
                else {
                    p1.z = z;
                }

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

		// POLY.GL.draw(this.sphereIntersection);
        POLY.GL.draw(this.cubeTest);

        for (var i = 0; i < this.objects.length; i++) {
            POLY.GL.draw(this.objects[i]);
        }

        // for (var i = 0; i < 1; i++) {
        // // for (var i = 0; i < this.cubeTests.length; i++) {
        //     this.cubeTests[i].tickX += this.cubeTests[i].speedX;
        //     this.cubeTests[i].tickY += this.cubeTests[i].speedY;
        //     this.cubeTests[i].position.x = Math.sin(this.cubeTests[i].tickX / 100)
        //     this.cubeTests[i].position.y = Math.cos(this.cubeTests[i].tickY / 100)
        //     this.findNeighbours(this.cubeTests[i], true);
        //
        //
        //     POLY.GL.draw(this.cubeTests[i], true);
        // }

        for (var i = 0; i < this.pointsGrid.length; i++) {
            this.pointsGrid[i].program.bind();
            POLY.GL.draw(this.pointsGrid[i]);
        }

        // POLY.GL.draw(this.cubeCrossProduct);
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);
	}
}
