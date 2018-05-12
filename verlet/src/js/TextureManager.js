import * as POLY from 'poly/Poly';

export default new class TextureManager
{
    constructor()
    {
        this.textures = {}
    }

    getTexture(id)
    {
        return this.textures[id];
    }

    addTextures(arrayTextures)
    {
        for (var i = 0; i < arrayTextures.length; i++) {
            this.textures[arrayTextures[i]] = new POLY.Texture(arrayTextures[i]);
        }
    }
}
