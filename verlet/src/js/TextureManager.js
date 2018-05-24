import * as POLY from 'poly/Poly';
import Signal from 'signals';

export default new class TextureManager
{
    constructor()
    {
        this.textures = {}
        this.currentTextureToLoad = null;
    }

    getTexture(id)
    {
        return this.textures[id];
    }

    addTextures(arrayTextures, cb)
    {
        this.idFunc = POLY.utils.loop.add(this.update.bind(this))
        this.indexImageLoaded = 0;
        this.arrayTextures = arrayTextures;
        this.loadNext();

        this.cb = cb;
    }

    loadNext()
    {
        if(this.arrayTextures[this.indexImageLoaded])
        {
            this.textures[this.arrayTextures[this.indexImageLoaded]] = new POLY.Texture(this.arrayTextures[this.indexImageLoaded]);
            this.currentTextureToLoad = this.textures[this.arrayTextures[this.indexImageLoaded]];
        }
        else
        {
            POLY.utils.loop.remove(this.idFunc)

            if(this.cb)
            {
                this.cb();
                this.cb = null;
            }
        }
        // for (var i = 0; i < arrayTextures.length; i++) {
        //     this.textures[arrayTextures[i]] = new POLY.Texture(arrayTextures[i]);
        // }
    }

    update()
    {
        if(this.currentTextureToLoad)
        {
            if(this.currentTextureToLoad._loaded)
            {
                this.currentTextureToLoad.bind();
                this.indexImageLoaded++;
                this.loadNext();
                console.log('here');
                // this.currentTextureToLoad = null;
            }
        }
    }
}
