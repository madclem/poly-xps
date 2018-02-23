// ViewSave.js

import * as POLY from 'poly/Poly';
import vert from '../shaders/render.vert';
import frag from '../shaders/render.frag';


const random = function (min, max) { return min + Math.random() * (max - min);	};

export default class ViewRender
{

	constructor()
    {
        this.time = 0;
        let positions = [];
		let indices = [];
		let count = 0;

		let numParticles = 256;
		let totalParticles = numParticles * numParticles;
		let ux, uy;

		for(let j = 0; j < numParticles; j++) {
			for(let i = 0; i < numParticles; i++) {
				ux = i / numParticles * 2.0 - 1.0 + .5 / numParticles;
				uy = j / numParticles * 2.0 - 1.0 + .5 / numParticles;

                positions.push(ux, uy, 0);

				indices.push(count);
				count ++;

			}
		}

        this.program = new POLY.Program(vert, frag, {
            textureCurr: {
                type: 'texture',
                value: 0
            },
            textureNext: {
                type: 'texture',
                value: 1
            },
            textureExtra: {
                type: 'texture',
                value: 2
            },
            percent: {
                type: 'float',
                value: 0
            },
            time: {
                type: 'float',
                value: 0
            },
            viewport: {
                type: 'vec2',
                value: [0,0]
            }
        });

        let stateRendering = new POLY.State(POLY.gl);
        stateRendering.depthTest = true;
        stateRendering.blend = true;
        stateRendering.blendMode = true;

		this.mesh = new POLY.geometry.Mesh(this.program, stateRendering, 0);
		this.mesh.addPosition(positions);
		this.mesh.addIndices(indices);
	}


	render(textureCurr, textureNext, p, textureExtra) {
        this.time += 0.1;

        this.program.bind();

		textureCurr.bind(0);
		textureNext.bind(1);
		textureExtra.bind(2);

		this.program.uniforms.viewport =  [POLY.gl.canvas.width, POLY.gl.canvas.height];

		this.program.uniforms.percent =  p;
		this.program.uniforms.time =  this.time;

		POLY.GL.draw(this.mesh);
	}


}
