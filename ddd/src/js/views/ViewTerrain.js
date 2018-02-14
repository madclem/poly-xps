import * as POLY from 'poly/Poly';
import Terrain from '../Terrain';
import PlaneTerrain from '../geometry/PlaneTerrain';
import vert from '../shaders/terrain.vert';
import frag from '../shaders/terrain.frag';

import {vec3} from 'gl-matrix';

export default class ViewTerrain
{
	constructor()
	{
		this.terrain = new Terrain(5);
    	this.terrain.generate(20);

    	// program
    	this.program = new POLY.Program(vert, frag);

		this.w = 10;
    	// quad
    	this.quad = new PlaneTerrain(this.program, {
    		w: this.w,
    		h: this.w,
    		widthSegment: this.terrain.size - 1,
    		heightSegment: this.terrain.size - 1,
    	});

    	this.quad.rotation.x = -Math.PI/2;
    	// this.quad = new POLY.geometry.Plane(this.program, {
    	// 	w: this.w,
    	// 	h: this.w,
    	// 	subdivision: this.terrain.size - 1
    	// });
    	// this.quad.rotation.x = Math.PI/2;



    	console.log(this.terrain.size - 1)

    	var min_height = Infinity;
	    var max_height = -Infinity;

	    let v = []

	    // console.log(this.quad._vertices.length)

		let maxd = 0;
		let middle = (this.terrain.size - 1) / 2;
		for (var y = 0; y < this.terrain.size; y++) {
	        for (var x = 0; x < this.terrain.size; x++) {

	            var height_val = this.terrain.get(x, y);
	            if ( height_val < min_height ) min_height = height_val;
	            if ( height_val > max_height ) max_height = height_val;
	            if ( height_val < 0 ) height_val = 0;
	            if (y === 0 || y === this.terrain.size || x === 0 || x === this.terrain.size ) height_val = 0.0;
	            if (y === 0 || y === this.terrain.size - 1 || x === 0 || x === this.terrain.size - 1) height_val = 0.0;

	            // var currentX = x * this.w / (this.terrain.size)// - this.w / 2;
	            // var currentY = y * this.w / (this.terrain.size)// - this.w / 2;
				//
				let d = Math.sqrt(Math.pow(middle - x, 2) + Math.pow(middle - y, 2) );
				if(d > maxd) maxd = d;
				let percentage = this.map(d, 0, 23, 0, 1)
	            // this.quad._vertices[(y * this.terrain.size + x) * 3] += (Math.random() * .4 - .4/2);
	            // this.quad._vertices[(y * this.terrain.size + x) * 3 + 1] += Math.random() * .4 - .4/2;
	            this.quad._vertices[(y * this.terrain.size + x) * 3 + 2] = height_val / 105 * Math.pow(percentage, 2);
	        }
	    }

	    this.quad.updateAttribute('aPosition', this.quad._vertices)

		this.quad.separateFaces();

		let normals = [];
	    for (var i = 0; i < this.quad._vertices.length; i+=9) {
	      let v1 = [this.quad._vertices[i], this.quad._vertices[i + 1], this.quad._vertices[i + 2]];
	      let v2 = [this.quad._vertices[i + 3], this.quad._vertices[i + 4], this.quad._vertices[i + 5]];
	      let v3 = [this.quad._vertices[i + 6], this.quad._vertices[i + 7], this.quad._vertices[i + 8]];

	      let v = [];
	      let w = [];
	      vec3.sub(w, v1, v2);
	      vec3.sub(v, v2, v3);


	      let normal = [];
	      vec3.cross(normal, v, w);

	      let a = []

	      a[0]=Math.abs(normal[0]/( Math.abs(normal[0]) + Math.abs(normal[1]) +Math.abs(normal[2])));
	      a[1]=Math.abs(normal[1]/( Math.abs(normal[0]) + Math.abs(normal[1]) +Math.abs(normal[2])));
	      a[2]=Math.abs(normal[2]/( Math.abs(normal[0]) + Math.abs(normal[1]) +Math.abs(normal[2])));
	      // a[0]=Math.abs(normal[0]/( Math.abs(normal[0]) + Math.abs(normal[1]) +Math.abs(normal[2])));
	      // // a[1]=Math.abs(normal[1]/( Math.abs(normal[0]) + Math.abs(normal[1]) +Math.abs(normal[2])));
	      // a[2]=Math.abs(normal[2]/( Math.abs(normal[0]) + Math.abs(normal[1]) +Math.abs(normal[2])));

	      normals.push(a[0], a[1], a[2]);
	      normals.push(a[0], a[1], a[2]);
	      normals.push(a[0], a[1], a[2]);
	      // normals.push(a, a, a);
	      // normals.push([Math.random(), Math.random() ,Math.random()]);
	      // normals.push([Math.random(), Math.random() ,Math.random()]);
	      // normals.push([Math.random(), Math.random() ,Math.random()]);
	    }

		console.log(normals[0]);
	    this.quad.addAttribute(normals, "aNormal", 3);
	}

	map(val, inputMin, inputMax, outputMin, outputMax)
    {
                /*
                var inputRange = inputMax - inputMin

                var inputFraction = (val - inputMin)/inputRange

                var outputRange = outputMax - outputMin

                var output = (outputRange * inputFraction) + outputMin

                return output
                */

        return ((outputMax - outputMin) * ((val - inputMin)/(inputMax - inputMin))) + outputMin;
    };

	render()
	{
		this.program.bind();
		POLY.GL.draw(this.quad);
	}
}
