import * as POLY from 'poly/Poly';
import vert from '../shaders/fbo1.vert';
import frag from '../shaders/fbo1.frag';

export default class ViewFBO
{
    constructor(texture)
    {
        this.program = new POLY.Program(vert, frag);

        this.bigTriangle = new POLY.geometry.BigTriangle(this.program);
    }

    setPos(x, y)
    {
        this.bigTriangle.position.x = x;
        this.bigTriangle.position.y = y;
    }
    render(texture, ind)
    {
        this.program.bind();
        texture.bind(ind);
        POLY.GL.draw(this.bigTriangle);
    }
}
