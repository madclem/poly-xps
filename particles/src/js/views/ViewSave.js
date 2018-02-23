// ViewSave.js

import * as POLY from 'poly/Poly';
import vert from '../shaders/save.vert';
import frag from '../shaders/save.frag';


const random = function (min, max) { return min + Math.random() * (max - min);	};

export default class ViewSave
{

	constructor()
    {
        let positions = [];
		let coords = [];
		let indices = [];
		let extras = [];
		let count = 0;

		let numParticles = 256;
		let totalParticles = numParticles * numParticles;
		console.debug('Total Particles : ', totalParticles);
		let ux, uy;
		let range = 3;

		for(let j = 0; j < numParticles; j++)
        {
			for(let i = 0; i < numParticles; i++)
            {
				positions.push(random(-range, range), random(-range, range), random(-range, range));

				ux = i / numParticles * 2.0 - 1.0 + .5 / numParticles;
				uy = j / numParticles * 2.0 - 1.0 + .5 / numParticles;

				extras.push(Math.random(), Math.random(), Math.random());
				coords.push(ux, uy);
				indices.push(count);
				count ++;

			}
		}

        this.program = new POLY.Program(vert, frag);
		this.mesh = new POLY.geometry.Mesh(this.program, null, 0);

		this.mesh.addPosition(positions);
		this.mesh.addAttribute(extras, 'aExtra', 3);
		this.mesh.addAttribute(coords, 'aUv', 2);
		this.mesh.addIndices(indices);

        this.program.bind();
		POLY.GL.draw(this.mesh);
	}


	render(state = 0) {
		this.program.bind();
		POLY.GL.draw(this.mesh);
	}


}
