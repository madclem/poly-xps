import * as POLY from 'poly/Poly';
import vert from '../shaders/floor.vert';
import frag from '../shaders/floor.frag';

export default class ViewUnderWater
{
    constructor(texture)
    {
        this.program = new POLY.Program();

        this.spheres = [];

        for (var i = 0; i < 5; i++) {
            let sphere = new POLY.geometry.Sphere(this.program, {
                radius: Math.random() * .35 + .1
            });
            sphere.state.depthTest = true;

            sphere.position.x = Math.random() * 2 - 2/2;
            sphere.position.y = -Math.random() * .2 - .4;
            sphere.position.z = Math.random() * 2 - 2/2;

            this.spheres.push(sphere);
        }

        this.programQuad = new POLY.Program(vert, frag, {
            texture: {
                type:"texture",
                value: 0
            }
        });
        this.floor = new POLY.geometry.Quad(this.programQuad);
        this.floor.state.depthTest = true;
        this.floor.position.y = -1;
        this.floor.scale.x = 4;
        this.floor.scale.y = 4;
        this.floor.scale.z = 4;
        this.floor.rotation.x = Math.PI/2;
        // this.floor.addAttribute(this.floor.uvs, 'aUv', 2);

        this.texture = new POLY.Texture(window.ASSET_URL + 'image/wood.jpg');

    }

    render()
    {
        this.program.bind();

        for (var i = 0; i < this.spheres.length; i++)
        {
            POLY.GL.draw(this.spheres[i]);
        }

        this.programQuad.bind();
        this.texture.bind();
        POLY.GL.draw(this.floor);

    }
}
