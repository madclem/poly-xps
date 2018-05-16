import * as POLY from 'poly/Poly';
import TextureManager from './TextureManager';
import MainScene from './scenes/MainScene';
import Easings from './utils/Easings';
import PointCollisionScene from './scenes/PointCollisionScene';
import { Loader } from 'utils';
import dat from 'dat-gui';
import {TweenMax, Power2, TimelineLite} from "gsap";


const Manifests = require('./manifests/manifest.json');

window.ASSET_URL = '../../assets/';

export default class App
{
	constructor()
	{

		window.Easings = Easings.instance;

		let canvas = document.getElementById("canvas");
		POLY.init(canvas);
	    this.gl = POLY.gl;


	    this.loader = new Loader();
	    this.loader.addManifest(Manifests.default, window.ASSET_URL);

		this._textures = [
window.ASSET_URL + 'image/arcade.jpg',
window.ASSET_URL + 'image/christmas_experiment1.jpg',
window.ASSET_URL + 'image/christmas_experiment2.jpg',
window.ASSET_URL + 'image/cooking.jpg',
window.ASSET_URL + 'image/dangermouse.jpg',
window.ASSET_URL + 'image/ddd-2018.jpg',
window.ASSET_URL + 'image/denis.jpg',
window.ASSET_URL + 'image/dreamy1.jpg',
window.ASSET_URL + 'image/dreamy2.jpg',
window.ASSET_URL + 'image/fighter1.jpg',
window.ASSET_URL + 'image/fighter2.jpg',
window.ASSET_URL + 'image/fighter3.jpg',
window.ASSET_URL + 'image/giugiu.jpg',
window.ASSET_URL + 'image/gumble.jpg',
window.ASSET_URL + 'image/icon_glasses.jpg',
window.ASSET_URL + 'image/icon_rugby.jpg',
window.ASSET_URL + 'image/icon_trumpet.jpg',
window.ASSET_URL + 'image/lego.jpg',
window.ASSET_URL + 'image/night-eye.jpg',
window.ASSET_URL + 'image/sherrifcali.jpg',
window.ASSET_URL + 'image/sleigher3000.jpg',
window.ASSET_URL + 'image/starwars_rebels.jpg',

		]
	    this.loader.addAssets(this._textures);
	    this.loader.onComplete.add(this._loadComplete, this);
	    this.loader.load();

		// setTimeout(()=>{
		// 	let container = document.getElementById("containerTitle");
		// 	let text = document.getElementById("test");
		//
		// 	TweenLite.to("#containerTitle", 1, {
		// 		opacity: 1,
		// 		y: 0,
		// 		ease: Back.easeOut.config(1.2)
		// 	});
		//
		// 	text.addEventListener("mouseenter", ()=>{
		// 		TweenLite.to("#containerTitle", 1, {
		// 			scaleY: .9,
		// 			ease: Back.easeOut.config(1.2)
		// 		});
		//
		// 		TweenLite.to("#test", 1, {
		// 			letterSpacing: 12,
		// 			autoRound:false,
		// 			ease: Back.easeOut.config(1.2)
		// 		});
		// 	});
		//
		// 	text.addEventListener("mouseleave", ()=>{
		// 		TweenLite.to("#containerTitle", .6, {
		// 			scaleY: 1,
		// 			ease: Back.easeOut.config(1.2)
		// 		});
		//
		// 		TweenLite.to("#test", .6, {
		// 			letterSpacing: 2,
		// 			autoRound:false,
		// 			ease: Back.easeOut.config(1.2)
		// 		});
		// 	});
		// }, 1000)

		// window.gui = new dat.GUI({ width:300 });
	}

	_loadComplete(resources)
	{
		POLY.loadedResources = resources;
		// this.scene = new PointCollisionScene();


		TextureManager.addTextures(this._textures, ()=>{
			let loader = document.getElementById('loader');
			loader.style.display = "none";

			this.scene = new MainScene();
			this.scene.resize();
		});

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

		if(this.scene)
		{
			// console.log('here');
			this.scene.render();
		}

	}
}
