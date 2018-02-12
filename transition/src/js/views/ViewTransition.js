import * as POLY from 'poly/Poly';
import vert from '../shaders/transition.vert';
import frag from '../shaders/transition.frag';

export default class ViewBg
{
    constructor(texture)
    {
        this.program = new POLY.Program(vert, frag, {
            texture: {
                value: 0,
                type: 'texture'
            },
            cutoff: {
                value: 0,
                type: 'float'
            }
        });

        // let state = new POLY.State(this.program.gl);
        // state.blendMode = true;
        // state.blend = true;
        // state.depthTest = false;

        this.geom = new POLY.geometry.Quad(this.program);
        this.geom.state.blend = true;

        this.geom.addAttribute(this.geom.uvs, 'aUv', 2);

        gui.add(this.program.uniforms, 'cutoff', 0, 1.01).step(0.1);

        this.texture = new POLY.Texture(texture);
    }

    render()
    {
        this.program.bind();
        this.texture.bind(0);

        POLY.GL.draw(this.geom);
    }
}
