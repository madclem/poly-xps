import * as POLY from 'poly/Poly';

import vs from '../shaders/noise.vert'
import fs from '../shaders/noise.frag'

export default class ViewNoise
{
  constructor(width, height)
  {
    this.tick = 0;
    this.shader = new POLY.Program(vs, fs, {
        time: {
            type: 'float',
            value: 0,
        },
        height: {
            type: 'float',
            value: 0,
        },
        amplitude: {
            type: 'float',
            value: 0,
        }
    });
    // this.shader.bind();
    this.height = 1;
    this.tick = 0;
    this.position = [0, 0];
    this.amplitude = 0;
    this.a = 0;

    let positions = [];
		let coords = [];
		let indices = [];
		let extras = [];
		let count = 0;

		let numParticles = 200;
		let totalParticles = numParticles * numParticles;
		// console.debug('Total Particles : ', totalParticles);
		let ux, uy;
		let range = 30;

		for(let j = 0; j < width; j++) {
			for(let i = 0; i < height; i++) {
				positions.push(Math.random() * range  -range/2, Math.random() * range  -range/2, Math.random() * range  -range/2);

				ux = (i / width * 2.0 - 1.0) + 0.5 / width;
				uy = (j / height * 2.0 - 1.0) + 0.5 / height;

        // if(i == 0)  {
        //   console.log(ux, uy);
        // }
				coords.push(ux, uy);
				indices.push(count);
				count ++;

			}
		}

		this.mesh = new POLY.geometry.Mesh(this.shader, null, 0);
		this.mesh.addPosition(positions);
		this.mesh.addAttribute(coords, 'aUv', 2);
		this.mesh.addIndices(indices);

        this.speed = 0.01

  }


  render(t){

    this.shader.bind();
    // GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, t);
    this.tick  -= this.speed;

    this.a -= this.amplitude;
    this.amplitude *= .9;

    this.height += (this.amplitude - this.height) * .01;

    this.shader.uniforms.height = this.height;
    this.shader.uniforms.amplitude = this.a;
    this.shader.uniforms.time = this.tick;
    POLY.GL.draw(this.mesh);

  }
}
