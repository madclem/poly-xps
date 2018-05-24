import * as POLY from 'poly/Poly';
import Device from './utils/Device';
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
window.ASSET_URL + 'image/icon_contact.jpg',
window.ASSET_URL + 'image/icon_pen.jpg',
window.ASSET_URL + 'image/icon_rugby.jpg',
window.ASSET_URL + 'image/icon_saxo.jpg',
window.ASSET_URL + 'image/lego.jpg',
window.ASSET_URL + 'image/night-eye.jpg',
window.ASSET_URL + 'image/sherrifcali.jpg',
window.ASSET_URL + 'image/sleigher3000.jpg',
window.ASSET_URL + 'image/starwars_rebels.jpg',
window.ASSET_URL + 'image/paw_patrol_music_maker.jpg',
window.ASSET_URL + 'image/lego_out_step.jpg',
window.ASSET_URL + 'image/spotbots_switched_on.jpg',
window.ASSET_URL + 'image/worst-witch.jpg',
window.ASSET_URL + 'image/plane_to_sphere.jpg',
window.ASSET_URL + 'image/test-icon.png',

window.ASSET_URL + 'image/blob_001.jpg',
window.ASSET_URL + 'image/blob_002.jpg',
window.ASSET_URL + 'image/blob_003.jpg',
window.ASSET_URL + 'image/blob_004.jpg',
window.ASSET_URL + 'image/blob_005.jpg',
window.ASSET_URL + 'image/blob_006.jpg',
window.ASSET_URL + 'image/blob_007.jpg',
window.ASSET_URL + 'image/blob_008.jpg',
window.ASSET_URL + 'image/blob_009.jpg',
window.ASSET_URL + 'image/blob_010.jpg',
window.ASSET_URL + 'image/blob_011.jpg',
window.ASSET_URL + 'image/blob_012.jpg',
window.ASSET_URL + 'image/blob_013.jpg',
window.ASSET_URL + 'image/blob_014.jpg',
window.ASSET_URL + 'image/blob_015.jpg',
window.ASSET_URL + 'image/blob_016.jpg',
window.ASSET_URL + 'image/blob_017.jpg',
window.ASSET_URL + 'image/blob_018.jpg',
window.ASSET_URL + 'image/blob_019.jpg',
window.ASSET_URL + 'image/blob_020.jpg',
window.ASSET_URL + 'image/blob_021.jpg',
window.ASSET_URL + 'image/blob_022.jpg',
window.ASSET_URL + 'image/blob_023.jpg',
window.ASSET_URL + 'image/blob_024.jpg',
window.ASSET_URL + 'image/blob_025.jpg',
window.ASSET_URL + 'image/blob_026.jpg',
window.ASSET_URL + 'image/blob_027.jpg',
window.ASSET_URL + 'image/blob_028.jpg',
window.ASSET_URL + 'image/blob_029.jpg',
window.ASSET_URL + 'image/blob_030.jpg',
window.ASSET_URL + 'image/blob_031.jpg',

window.ASSET_URL + 'image/line_animation.jpg',
window.ASSET_URL + 'image/confettis.jpg',
window.ASSET_URL + 'image/rogue_news.jpg',

window.ASSET_URL + 'image/handsup_001.jpg',
window.ASSET_URL + 'image/handsup_002.jpg',
window.ASSET_URL + 'image/handsup_003.jpg',
window.ASSET_URL + 'image/handsup_004.jpg',
window.ASSET_URL + 'image/handsup_005.jpg',
window.ASSET_URL + 'image/handsup_006.jpg',
window.ASSET_URL + 'image/handsup_007.jpg',
window.ASSET_URL + 'image/handsup_008.jpg',
window.ASSET_URL + 'image/handsup_009.jpg',
window.ASSET_URL + 'image/handsup_010.jpg',
window.ASSET_URL + 'image/handsup_011.jpg',
window.ASSET_URL + 'image/handsup_012.jpg',
window.ASSET_URL + 'image/handsup_013.jpg',
window.ASSET_URL + 'image/handsup_014.jpg',
window.ASSET_URL + 'image/handsup_015.jpg',
window.ASSET_URL + 'image/handsup_016.jpg',
window.ASSET_URL + 'image/handsup_017.jpg',
window.ASSET_URL + 'image/handsup_018.jpg',
window.ASSET_URL + 'image/handsup_019.jpg',
window.ASSET_URL + 'image/handsup_020.jpg',
window.ASSET_URL + 'image/handsup_021.jpg',
window.ASSET_URL + 'image/handsup_022.jpg',
window.ASSET_URL + 'image/handsup_023.jpg',
window.ASSET_URL + 'image/handsup_024.jpg',
window.ASSET_URL + 'image/handsup_025.jpg',
window.ASSET_URL + 'image/handsup_026.jpg',
window.ASSET_URL + 'image/handsup_027.jpg',
window.ASSET_URL + 'image/handsup_028.jpg',
window.ASSET_URL + 'image/handsup_029.jpg',
window.ASSET_URL + 'image/handsup_030.jpg',
window.ASSET_URL + 'image/handsup_031.jpg',
window.ASSET_URL + 'image/handsup_032.jpg',
window.ASSET_URL + 'image/handsup_033.jpg',
window.ASSET_URL + 'image/handsup_034.jpg',
window.ASSET_URL + 'image/handsup_035.jpg',

window.ASSET_URL + 'image/favourite_boss_revealed.jpg',
window.ASSET_URL + 'image/favourite_movie_revealed.jpg',
window.ASSET_URL + 'image/king_of_elks_revealed.jpg',
window.ASSET_URL + 'image/address_revealed.jpg',
window.ASSET_URL + 'image/email_revealed.jpg',
window.ASSET_URL + 'image/wrestler_revealed.jpg',
window.ASSET_URL + 'image/shades_revealed.jpg',
window.ASSET_URL + 'image/maman.jpg',

		]

		if(!Device.desktop)
		{
			this._textures.push(
				window.ASSET_URL + 'image/icon_aboutme_mobile.png',
				window.ASSET_URL + 'image/icon_experiment_mobile.png',
				window.ASSET_URL + 'image/icon_viewall_mobile.png',
				window.ASSET_URL + 'image/icon_work_mobile.png');
		}
		else
		{
			this._textures.push(
				window.ASSET_URL + 'image/icon_aboutme_text.png',
				window.ASSET_URL + 'image/icon_experiment_text.png',
				window.ASSET_URL + 'image/icon_viewall_text.png',
				window.ASSET_URL + 'image/icon_work_text.png',
				window.ASSET_URL + 'image/icon_aboutme.png',
				window.ASSET_URL + 'image/icon_experiment.png',
				window.ASSET_URL + 'image/icon_viewall.png',
				window.ASSET_URL + 'image/icon_work.png');
		}
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
		let loader = document.getElementById('loader');
		let header = document.getElementById('header');
		loader.style.opacity = 1;
		header.style.top = '-100px';


		TextureManager.addTextures(this._textures, ()=>{

			TweenLite.to("#loader", 1, {
				delay: 1,
				opacity: 0,
				onComplete:()=>{
					loader.style.display = "none";

					TweenLite.to("#header", .3, {
						top: 0,
						ease: Circ.easeOut
					})
				}
			})

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
