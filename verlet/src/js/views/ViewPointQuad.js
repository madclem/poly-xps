import * as POLY from 'poly/Poly';
import Link from './Link';
import frag from '../shaders/quadColor.frag';

export default class ViewPointQuad
{
    constructor(xPos, yPos)
    {
        this.origin = {
            x: xPos,
            y: yPos
        }
        this.x = xPos;
        this.y = yPos;
        this.z = 0;
        this.easeZ = 0;

        this.id = Math.floor(Math.random() * 2000)

        this.program = new POLY.Program(null, frag, {
            color: {
                value: [0, 0, 1],
                type: 'vec3'
            }
        });
        this.view = new POLY.geometry.Cube(this.program);
        this.view.position.x = 1;
        this.view.scale.set(.05);
    }

    getPoint()
    {
        return this;
    }

    setZ(value)
    {
        this.easeZ = value;
    }
    render()
    {

        this.z += (this.easeZ - this.z) * .1;
        this.program.bind();
        this.view.position.x = this.x;
        this.view.position.y = this.y;
        this.view.position.z = this.z;
        // POLY.GL.draw(this.view);

    }
}
