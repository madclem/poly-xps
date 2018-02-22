import * as POLY from 'poly/Poly';
import MainScene from './scenes/MainScene';
import TerrainScene from './scenes/TerrainScene';
// import MainScene from './scenes/MainScene';
import { Loader } from 'utils';
import dat from 'dat-gui';

const Manifests = require('./manifests/manifest.json');

window.ASSET_URL = '../../assets/';

export default class App
{
	constructor()
	{
		// window.gui = new dat.GUI({ width:300 });
		window.gui = {
			add:()=>{}
		};

		let canvas = document.getElementById("canvas");

	    this.gl = POLY.gl;
	    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	    this.loader = new Loader();
	    this.loader.addManifest(Manifests.default, window.ASSET_URL);
		this.loader.addAssets([
			window.ASSET_URL + 'model/monolith.obj'
		]);
	    this.loader.onComplete.add(this._loadComplete, this);
	    this.loader.load();
	}

	_loadComplete(resources)
	{
		POLY.loadedResources = resources;
		this.scene = new MainScene();
		// this.scene = new TerrainScene();
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
