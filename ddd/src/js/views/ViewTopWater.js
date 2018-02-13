import * as POLY from 'poly/Poly';
import vert from '../shaders/world.vert';
import frag from '../shaders/world.frag';

export default class ViewTopWater
{
    constructor(texture)
    {
        this.program = new POLY.Program(vert, frag, {
            clipY: {
                type: 'float',
                value: 0
            },
            dir: {
                type: 'float',
                value: 0.0
            }
        });

        this.cubes = [];

        for (var i = 0; i < 5; i++) {
            let h = Math.random() * .35 + .8;
            let cube = new POLY.geometry.Cube(this.program, {
                w: Math.random() * .35 + .1,
                h: h,
                d: Math.random() * .35 + .1
            });

            cube.position.x = Math.random() * 5 - 5/2;
            cube.position.y = h/2 + Math.random() * .3;
            cube.position.z = Math.random() * 5 - 5/2;

            this.cubes.push(cube);
        }

    }

    render()
    {
        this.program.bind();

        for (var i = 0; i < this.cubes.length; i++)
        {
            POLY.GL.draw(this.cubes[i]);
        }
    }
}
