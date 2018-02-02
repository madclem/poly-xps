import * as POLY from 'poly/Poly';
import MainScene from './scenes/MainScene';
import { Loader } from 'utils';

const Manifests = require('./manifests/manifest.json');

window.ASSET_URL = '../../assets/';

export default class App
{
	constructor()
	{
		let canvas = document.getElementById("canvas");

    	POLY.init(canvas);
	    this.gl = POLY.gl;
	    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	    this.loader = new Loader();
	    this.loader.addManifest(Manifests.default, window.ASSET_URL);
	    this.loader.onComplete.add(this._loadComplete, this);
	    this.loader.load();
	}

	_loadComplete(resources)
	{
		POLY.loadedResources = resources;
		this.scene = new MainScene();	
		this.scene.resize();

	    POLY.utils.loop.add(this._update.bind(this));
	}

	resize()
	{
		POLY.GL.resize(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);

		if(this.scene)
		{
			this.scene.resize();
		}
	}

	_update()
	{
		this.gl.clearColor(0,0,0,1);
	    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.scene.render();
	}
}
