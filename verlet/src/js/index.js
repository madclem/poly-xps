import Application from './App';
import * as POLY from 'poly/Poly';


let App;
let _init = ()=>
{
    App = new Application();
    window.addEventListener('resize', resize);

    resize();
}

let resize = ()=>
{
	App.resize();
}

_init();
