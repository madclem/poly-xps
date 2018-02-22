import * as POLY from 'poly/Poly';
import vert from '../shaders/background.vert';
import frag from '../shaders/background.frag';

export default class ViewBg
{
    constructor(texture)
    {
        this.program = new POLY.Program(vert, frag, {
            texture: {
                type:'texture',
                value: 0
            },
            gradientMap: {
                type:'texture',
                value: 1
            }
        });

        let state = new POLY.State(this.program.gl);
        // state.depthTest = true;
        this.geom = new POLY.geometry.Quad(this.program, null, state);
        this.geom.addAttribute(this.geom.uvs, 'aUv', 2);

        this.texture = new POLY.Texture(texture);
        this.textureGradient = new POLY.Texture(window.ASSET_URL + 'image/gradient-map.jpg');
    }

    render()
    {
        this.program.bind();
        this.texture.bind(0);
        this.textureGradient.bind(1);
        POLY.GL.draw(this.geom);
    }
}
