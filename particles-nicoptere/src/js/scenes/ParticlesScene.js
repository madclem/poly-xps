import * as POLY from 'poly/Poly';
import frag from '../shaders/particles.frag';
import vert from '../shaders/particles.vert';
import simulation_fs from '../shaders/simulation_fs.frag';
import simulation_vs from '../shaders/simulation_vs.vert';
import render_fs from '../shaders/render.frag';
import render_vs from '../shaders/render.vert';
import test_fs from '../shaders/test.frag';
import test_vs from '../shaders/test.vert';
import {mat3, mat4} from 'gl-matrix';

export default class ParticlesScene
{
	constructor()
	{
		this.gl = null;
		this.program = null;
		this.sphere = null;
		this.rot = null;
		this.tick = 0;
		this.angle = null;

		this.modelMatrix = mat4.create();

		this.camera = new POLY.cameras.PerspectiveCamera();
		this.camera.perspective(45, POLY.GL.aspectRatio, 0.1, 100.0)
		this.orbitalControl = new POLY.control.OrbitalControl(this.camera.matrix);

		POLY.GL.setCamera(this.camera); // set camera to automatically update shader matrices

	    this.gl = POLY.gl;

		let stateRendering = new POLY.State(this.gl);
        stateRendering.depthTest = true;
        stateRendering.blend = true;
        stateRendering.blendMode = true;

		let width = 256;
		let height = 256;
		this.fbo = new POLY.FrameBuffer(width, height);
		let data = this.getImage(POLY.loadedResources[window.ASSET_URL + 'image/noise.jpg'].data, width, height, 100);
        this.dataTexture = new POLY.DataTexture(data, width, height, this.gl.RGB);

        this.simulationProgram = new POLY.Program(simulation_vs, simulation_fs);
        this.geomSim = new POLY.geometry.Quad(this.simulationProgram, null, stateRendering);

        this.renderingProgram = new POLY.Program(render_vs, render_fs, {
	        pointSize:
			{
	        	value: 1,
	        	type: 'float'
	        }
        });


        let l = (width) * (height);
		let vertices = new Float32Array(l * 3);
		for ( var i = 0; i < l; i++ )
		{
            var i3 = i * 3;
            vertices[ i3 ] = ( i % width ) / width;
            vertices[ i3 + 1 ] = ( i / width ) / height;
        }


        this.geomRendering = new POLY.geometry.Mesh(this.renderingProgram, stateRendering, POLY.gl.POINTS);
        this.geomRendering.addPosition(vertices);

		this.planes = new POLY.helpers.BatchPlanes();

	}

	getImage( img, width, height, elevation )
	{


    	var canvas = document.createElement( "canvas");
      	canvas.width = width;
      	canvas.height = height;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);


		var imgData = ctx.getImageData(0,0,width,height);
		var iData = imgData.data;

		var l = (width * height );
		var data = new Float32Array( l * 3 );
		for ( var i = 0; i < l; i++ ) {

		    var i3 = i * 3;
		    var i4 = i * 4;
		    data[ i3 ]      = ( ( i % width ) / width  -.5 ) * width;
		    data[ i3 ]      /= 100;
		    data[ i3 + 1 ]  = ( iData[i4] / 0xFF * 0.299 +iData[i4+1]/0xFF * 0.587 + iData[i4+2] / 0xFF * 0.114 ) * elevation;
		    data[ i3 + 1 ]  /= 100;
		    data[ i3 + 2 ]  = ( ( i / width ) / height -.5 ) * height;
		    data[ i3 + 2 ]  /= 100;
		}

		return data;
	}

	render()
	{
		this.tick++;

		this.orbitalControl.update();

		// this.fbo.bind();
		// this.simulationProgram.bind();
		// this.dataTexture.bind(0);
		// this.simulationProgram.uniforms.projectionMatrix = this.camera.projectionMatrix;
	    // this.simulationProgram.uniforms.viewMatrix = this.camera.matrix;
	   	// POLY.GL.draw(this.geomSim);
		// this.fbo.unbind();

		// POLY.gl.enable(POLY.gl.DEPTH_TEST);
		// POLY.gl.depthFunc(POLY.gl.LEQUAL);
		// POLY.gl.enable(POLY.gl.BLEND);
		// POLY.gl.blendEquation(POLY.gl.FUNC_ADD);
		// POLY.gl.blendFunc(POLY.gl.SRC_ALPHA, POLY.gl.ONE);
		this.planes.draw();

		this.renderingProgram.bind();
		// this.fbo.textures[0].bind(0);
		this.dataTexture.bind(0);
	    POLY.GL.draw(this.geomRendering);


	    this.fbo.clear();
	}

	resize()
	{
		this.camera.setAspectRatio(POLY.GL.aspectRatio);
	}
}
