// ViewSave.js

import * as POLY from 'poly/Poly';
import vert from '../shaders/sim.vert';
import frag from '../shaders/sim.frag';

export default class ViewSim
{

	constructor()
    {
        this.time = Math.random() * 0xFF;

        this.program = new POLY.Program(vert, frag, {
            textureVel: {
                type: 'texture',
                value: 0
            },
            texturePos: {
                type: 'texture',
                value: 1
            },
            textureExtra: {
                type: 'texture',
                value: 2
            },
            maxRadius: {
                type: 'float',
                value: 5
            },
            time: {
                type: 'float',
                value: this.time
            },
        });

		this.mesh = new POLY.geometry.BigTriangle(this.program, null, 0);
	}


	render(textureVel, texturePos, textureExtra) {
		this.program.bind();

        this.time += .0001;
        this.program.uniforms.time = this.time;
		textureVel.bind(0);
		texturePos.bind(1);
		textureExtra.bind(2);

		POLY.GL.draw(this.mesh);
	}


}
