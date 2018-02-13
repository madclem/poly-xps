import * as POLY from 'poly/Poly';
import vert from '../shaders/background.vert';
import frag from '../shaders/background.frag';

export default class ViewBg
{
    constructor(texture)
    {
        this.program = new POLY.Program(vert, frag);

        let state = new POLY.State(this.program.gl);
        // state.depthTest = true;
        this.geom = new POLY.geometry.Quad(this.program, null, state);
        this.geom.addAttribute(this.geom.uvs, 'aUv', 2);

        this.texture = new POLY.Texture(texture);
    }

    render()
    {
        this.program.bind();
        this.texture.bind();
        POLY.GL.draw(this.geom);
    }
}
