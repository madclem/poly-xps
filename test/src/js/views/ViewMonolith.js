import * as POLY from 'poly/Poly';
import vert from '../shaders/monolith.vert';
import frag from '../shaders/monolith.frag';

export default class ViewTopWater
{
    constructor(texture)
    {
        this.program = new POLY.Program(vert, frag, {
            texture: {
				type: "texture",
				value: 0
			},
            gradientMap: {
				type: "texture",
				value: 0
			},
            clipY: {
                type: 'float',
                value: 0
            },
            dir: {
                type: 'float',
                value: 0.0
            },
            ambientLight : {
                type: "vec3",
                value: [.5, .5, .5]
            },
            directionalLightColor : {
                type: "vec3",
                value: [1., 1., 1.]
            },
            directionalVector : {
                type: "vec3",
                value: [1., -1., -0.5]
            },
        });

        this.textureTop = new POLY.Texture(window.ASSET_URL + 'image/texture-monolyth.jpg');
        this.textureGradient = new POLY.Texture(window.ASSET_URL + 'image/gradient-map.jpg');
		let buffers = POLY.loaders.OBJLoader.parse(POLY.loadedResources[window.ASSET_URL + 'model/monolith.obj'].data);

		this.monolith = new POLY.geometry.Mesh(this.program);
		this.monolith.addPosition(buffers.positions);
		this.monolith.addIndices(buffers.indices);
		this.monolith.addAttribute(buffers.coords, 'aUv', 2);
		this.monolith.addAttribute(buffers.normals, 'aNormal', 3);
		this.monolith.scale.set(.006)
		this.monolith.position.y = 0.2;
		this.monolith.rotation.y = -Math.PI/4;
    }

    render()
    {
        this.program.bind();
        this.textureTop.bind(0);
        this.textureGradient.bind(1);
		POLY.GL.draw(this.monolith);
    }
}
