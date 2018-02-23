import Application from './App';
import * as POLY from 'poly/Poly';


let App;
let _init = ()=>
{
	let canvas = document.getElementById("canvas");
	POLY.init(canvas, true);

    App = new Application();
    window.addEventListener('resize', resize);

    resize();
}

let resize = ()=>
{
	App.resize();
}

_init();
