import * as POLY from 'poly/Poly';
import Terrain from '../Terrain';

export default class ViewTerrain
{
	constructor()
	{
		this.terrain = new Terrain(5);
    	this.terrain.generate(20);

    	// program
    	this.program = new POLY.Program();

    	// quad
    	this.quad = new POLY.geometry.Plane(this.program, {
    		w: 5,
    		h: 5,
    		subdivision: this.terrain.size - 1
    	});
    	this.quad.rotation.x = Math.PI/2;

    	console.log(this.terrain.size - 1)

    	var min_height = Infinity;
	    var max_height = -Infinity;

	    let radius = 10 / 2;
	    let v = []

	    console.log(this.quad._vertices.length)
	    for (var y = 0; y < this.terrain.size; y++) {
	        for (var x = 0; x < this.terrain.size; x++) {
	            var height_val = this.terrain.get(x, y);
	            if ( height_val < min_height ) min_height = height_val;
	            if ( height_val > max_height ) max_height = height_val;
	            if ( height_val < 0 ) height_val = 0;
	            if (y === 0 || y === this.terrain.size || x === 0 || x === this.terrain.size ) height_val = 0.0;
	            if (y === 0 || y === this.terrain.size - 1 || x === 0 || x === this.terrain.size - 1) height_val = 0.0;

	            var currentX = x * 10 / (this.terrain.size)// - 10 / 2;
	            var currentY = y * 20 / (this.terrain.size)// - 10 / 2;

	            let d = Math.sqrt(Math.pow(10 / 2 - currentX, 2) + Math.pow(10 / 2 - currentY, 2) ) / 6;
	            d = 1 - Math.cos(d);
	            height_val *= d;
	            // console.log(y * (this.terrain.size) + x)
	            v[y * (this.terrain.size) + x] = []
	           	v[y * (this.terrain.size) + x][0] = (Math.random() * .2 - .2/2);
            	v[y * (this.terrain.size) + x][2] = Math.random() * .2 - .2/2;
            	v[y * (this.terrain.size) + x][1] = height_val / 255;
	        }


	    }
	        console.log(v.length)
	        let vflat = []
	        for (var i = 0; i < v.length; i++) {
	        	// console.log(v[i])
	        	vflat.push(v[i][0], v[i][1], v[i][2]);
	        }
	        console.log(vflat.length, this.quad._vertices.length)

	        this.quad.updateAttribute('aPosition', this.quad._vertices)
	}

	render()
	{
		this.program.bind();
		POLY.GL.draw(this.quad);
	}
}