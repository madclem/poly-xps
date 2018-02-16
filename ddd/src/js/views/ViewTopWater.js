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

        this.tick = 0;

        this.cubes = [];

        for (var i = 0; i < 5; i++) {
            let rock = new POLY.geometry.Mesh(this.program);

            let nbEdges = 6
            // let h = Math.random() * .35 + .8;
            // let cube = new POLY.geometry.Cube(this.program, {
            //     w: Math.random() * .35 + .1,
            //     h: h,
            //     d: Math.random() * .35 + .1
            // });
            //
            // cube.position.x = Math.random() * 5 - 5/2;
            // cube.position.y = h/2 + Math.random() * .3;
            // cube.position.z = Math.random() * 5 - 5/2;
            //
            // this.cubes.push(cube);
        }

        let h = .2;
        let cube = new POLY.geometry.Cube(this.program, {
            w: .2,
            h: h,
            d: .1
        });

        cube.position.x = 0;//Math.random() * 5 - 5/2;
        cube.position.y = h/2;
        cube.position.z = 0; //Math.random() * 5 - 5/2;

        this.cubes.push(cube);

    }

    render()
    {
        this.program.bind();

        this.tick++;
        for (var i = 0; i < this.cubes.length; i++)
        {
            let c = this.cubes[i];
            c.position.y += Math.cos(this.tick/100) * .0008;
            c.rotation.y += .01;

            POLY.GL.draw(c);
        }
    }
}
