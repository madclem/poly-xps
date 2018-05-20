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
	    // this.loader.addManifest(Manifests.default, window.ASSET_URL);

		this._textures = [

window.ASSET_URL + 'image/img001.jpg',
window.ASSET_URL + 'image/img002.jpg',
window.ASSET_URL + 'image/img003.jpg',
window.ASSET_URL + 'image/img004.jpg',
window.ASSET_URL + 'image/img005.jpg',
window.ASSET_URL + 'image/img006.jpg',
window.ASSET_URL + 'image/img007.jpg',
window.ASSET_URL + 'image/img008.jpg',
window.ASSET_URL + 'image/img009.jpg',
window.ASSET_URL + 'image/img010.jpg',
window.ASSET_URL + 'image/img011.jpg',
window.ASSET_URL + 'image/img012.jpg',
window.ASSET_URL + 'image/img013.jpg',
window.ASSET_URL + 'image/img014.jpg',

window.ASSET_URL + 'image/trunk_trunk001.jpg',
window.ASSET_URL + 'image/trunk_trunk002.jpg',
window.ASSET_URL + 'image/trunk_trunk003.jpg',
window.ASSET_URL + 'image/trunk_trunk004.jpg',
window.ASSET_URL + 'image/trunk_trunk005.jpg',
window.ASSET_URL + 'image/trunk_trunk006.jpg',
window.ASSET_URL + 'image/trunk_trunk007.jpg',
window.ASSET_URL + 'image/trunk_trunk008.jpg',
window.ASSET_URL + 'image/trunk_trunk009.jpg',
window.ASSET_URL + 'image/trunk_trunk010.jpg',
window.ASSET_URL + 'image/trunk_trunk011.jpg',
window.ASSET_URL + 'image/trunk_trunk012.jpg',
window.ASSET_URL + 'image/trunk_trunk013.jpg',
window.ASSET_URL + 'image/trunk_trunk014.jpg',
window.ASSET_URL + 'image/trunk_trunk015.jpg',
window.ASSET_URL + 'image/trunk_trunk016.jpg',
window.ASSET_URL + 'image/trunk_trunk017.jpg',
window.ASSET_URL + 'image/trunk_trunk018.jpg',
window.ASSET_URL + 'image/trunk_trunk019.jpg',
window.ASSET_URL + 'image/trunk_trunk020.jpg',
window.ASSET_URL + 'image/trunk_trunk021.jpg',
window.ASSET_URL + 'image/trunk_trunk022.jpg',
window.ASSET_URL + 'image/trunk_trunk023.jpg',

window.ASSET_URL + 'image/transition/dechire_00000.jpg',
window.ASSET_URL + 'image/transition/dechire_00001.jpg',
window.ASSET_URL + 'image/transition/dechire_00002.jpg',
window.ASSET_URL + 'image/transition/dechire_00003.jpg',
window.ASSET_URL + 'image/transition/dechire_00004.jpg',
window.ASSET_URL + 'image/transition/dechire_00005.jpg',
window.ASSET_URL + 'image/transition/dechire_00006.jpg',
window.ASSET_URL + 'image/transition/dechire_00007.jpg',
window.ASSET_URL + 'image/transition/dechire_00008.jpg',
window.ASSET_URL + 'image/transition/dechire_00009.jpg',
window.ASSET_URL + 'image/transition/dechire_00010.jpg',
window.ASSET_URL + 'image/transition/dechire_00011.jpg',
window.ASSET_URL + 'image/transition/dechire_00012.jpg',
window.ASSET_URL + 'image/transition/dechire_00013.jpg',
window.ASSET_URL + 'image/transition/dechire_00014.jpg',
window.ASSET_URL + 'image/transition/dechire_00015.jpg',
window.ASSET_URL + 'image/transition/dechire_00016.jpg',
window.ASSET_URL + 'image/transition/dechire_00017.jpg',
window.ASSET_URL + 'image/transition/dechire_00018.jpg',
window.ASSET_URL + 'image/transition/dechire_00019.jpg',
window.ASSET_URL + 'image/transition/dechire_00020.jpg',

// window.ASSET_URL + 'image/test-icon.png',
window.ASSET_URL + 'image/arcade.jpg',
window.ASSET_URL + 'image/christmas_experiment1.jpg',
window.ASSET_URL + 'image/christmas_experiment2.jpg',
window.ASSET_URL + 'image/cooking.jpg',
window.ASSET_URL + 'image/dangermouse.jpg',
window.ASSET_URL + 'image/ddd-2018.jpg',
window.ASSET_URL + 'image/particles_stream.jpg',
window.ASSET_URL + 'image/denis.jpg',
window.ASSET_URL + 'image/dreamy1.jpg',
window.ASSET_URL + 'image/dreamy2.jpg',
window.ASSET_URL + 'image/fighter1.jpg',
window.ASSET_URL + 'image/fighter2.jpg',
window.ASSET_URL + 'image/fighter3.jpg',
window.ASSET_URL + 'image/giugiu.jpg',
window.ASSET_URL + 'image/gumble.jpg',
window.ASSET_URL + 'image/icon_boss.jpg',
window.ASSET_URL + 'image/icon_catch.jpg',
window.ASSET_URL + 'image/icon_deer.jpg',
window.ASSET_URL + 'image/icon_dog.jpg',
window.ASSET_URL + 'image/icon_glasses.jpg',
window.ASSET_URL + 'image/icon_mom.jpg',
window.ASSET_URL + 'image/icon_movie.jpg',
window.ASSET_URL + 'image/icon_pen.jpg',
window.ASSET_URL + 'image/icon_rugby.jpg',
window.ASSET_URL + 'image/icon_saxo.jpg',
window.ASSET_URL + 'image/lego.jpg',
window.ASSET_URL + 'image/night-eye.jpg',
window.ASSET_URL + 'image/sherrifcali.jpg',
window.ASSET_URL + 'image/sleigher3000.jpg',
window.ASSET_URL + 'image/starwars_rebels.jpg',
window.ASSET_URL + 'image/test-icon.png',

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
