import * as POLY from 'poly/Poly';
import vert from '../shaders/background.vert';
import frag from '../shaders/background.frag';

export default class ViewUnderWater
{
    constructor(texture)
    {
        this.program = new POLY.Program();

        this.cubes = [];

        for (var i = 0; i < 5; i++) {
            let cube = new POLY.geometry.Sphere(this.program, {
                radius: Math.random() * .35 + .1
            });

            cube.position.x = Math.random() * 2 - 2/2;
            cube.position.y = -Math.random() * .2 - .4;
            cube.position.z = Math.random() * 2 - 2/2;

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
