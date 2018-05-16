import * as POLY from 'poly/Poly';
import vert from '../shaders/quadColor.vert';
import frag from '../shaders/quadImage.frag';
import TextureManager from '../TextureManager';

export default class ViewQuad
{
    constructor(index)
    {
        this.pointsRef = [];
        this.id = Math.floor(Math.random() * 2000)

        this.zoom = 1;
        this.x = 0;
        this.y = 0;

        this.percentage = 0;
        this.percentageBlack = 0;
        this.percentageTransition = 0;
        this.speed = .2;
        this.count = .3;

        this.beenHere = 0;
        this.dataId = null;


        this.points = [];
        this.positions = [];
        this.dragSpeeds = {
            x:[],
            y:[]
        };

        this.program = new POLY.Program(vert, frag, {
            color: {
                type: 'vec3',
                value: [Math.random(),Math.random(), Math.random()]
                // value: [1,1,1]
            },
            colorGradient: {
                type: 'vec3',
                value: [Math.random(),Math.random(), Math.random()]
                // value: [1,1,1]
            },
            uDefaultImage: {
                type: 'texture',
                value: 0
            },
            uRevealImage: {
                type: 'texture',
                value: 1
            },
            uTransitionImage: {
                type: 'texture',
                value: 2
            },
            percentage: {
                type: 'float',
                value: this.percentage //Math.random() > .9 ? 0.0 : 1.0
            },
            percentageBlack: {
                type: 'float',
                value: this.percentageBlack //Math.random() > .9 ? 0.0 : 1.0
            },
            percentageTransition: {
                type: 'float',
                value: this.percentageTransition //Math.random() > .9 ? 0.0 : 1.0
            },
            active: {
                type: 'float',
                value: 0.0 //Math.random() > .9 ? 0.0 : 1.0
            },
            zoom: {
                type: 'float',
                value: 1.0 //Math.random() > .9 ? 0.0 : 1.0
            }
        });

        // this.texture = new POLY.Texture(window.ASSET_URL + 'image/giugiu.jpg');

        const uvs = [
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
		];
        this.quad = new POLY.geometry.Quad(this.program);
        this.quad.addAttribute(uvs, 'aUv', 2);


        this.revealTexture = new POLY.Texture(window.ASSET_URL + 'image/arcade.jpg');
        this.transitionImage = new POLY.Texture(window.ASSET_URL + 'image/transition/dechire_00000.jpg');


            // this.reveal(true);
    }


    reveal(show)
    {

        let tick = 0;
        Easings.to(this, .5, {
            delay: .2,
            percentageTransition: show ? 1.1 : 0,
            onUpdate: (obj, percentage)=>{
                let frame = Math.floor(20 * percentage);
                let id = frame < 10 ? '0' + frame : frame;
                this.transitionImage = TextureManager.getTexture(window.ASSET_URL + 'image/transition/dechire_000' + id + '.jpg')
                this.needsUpdate = true;
            }
        })

        // let obj = {
        //     tick: 0
        // }
        // Easings.to(obj, 2, {
        //     delay: .2,
        //     tick: 2,
        //     ease: Easings.easeOutSine,
        //     onUpdate: ()=>{
        //         this.needsUpdate = true;
        //     }
        // })
    }
    fade(value = 1)
    {
        Easings.to(this, 2, {
            percentage: value,
            ease: Easings.elasticOut,
            onUpdate: ()=>{
                this.needsUpdate = true;
            }
        })
    }

    shut(close = true)
    {
        Easings.to(this, .2, {
            percentageBlack: close ? 1 : 0,
            ease: Easings.easeOutCirc,
            onUpdate: ()=>{
                this.needsUpdate = true;
            }
        })
    }

    onHover()
    {
        // this.zoom = 1;
        return;
        Easings.killTweensOf(this);
        Easings.to(this, 2, {
            zoom: .8,
            ease: Easings.easeOutSine,
            onUpdate: ()=>{
                this.program.bind();
                this.program.uniforms.zoom = this.zoom;
            }
        });


    }

    onOut()
    {
        return;

        Easings.killTweensOf(this);
        Easings.to(this, 2, {
            zoom: 1,
            ease: Easings.easeOutSine,
            onUpdate: ()=>{
                this.program.bind();
                this.program.uniforms.zoom = this.zoom;
            }
        });
    }

    attachPointRef(pts)
    {
        this.pointsRef = [];

        for (var i = 0; i < pts.length; i++)
        {
            this.pointsRef.push(pts[i]);
        }
    }

    setColor(r, g, b)
    {
        this.program.bind();
        this.program.uniforms.color = [r,g,b];
    }

    setData(data)
    {
        // if(!data) return;
        if(data.id === this.dataId) return;

        this.data = data;
        this.dataId = data.id;

        this.textures = [];

        for (var i = 0; i < data.images.length; i++)
        {
            this.textures.push(TextureManager.getTexture(window.ASSET_URL + 'image/' + data.images[i]));
        }
        // this.beenHere++;
        this.program.bind();
        this.program.uniforms.colorGradient = data.colorGradient;

        if(data.codeColor && data.codeColor.length > 0)
        {
            this.program.uniforms.color = data.codeColor;
        }
    }

    render()
    {
        if(!this.textures[0]) return;

        if(this.pointsRef.length > 0)
        {


            if(this.textures.length === 1)
            {
                this.textures[0].bind(0);
            }
            else
            {
                this.count += this.speed;
                let frame = Math.floor(this.count);
                let texture = this.textures[frame % this.textures.length];
                texture.bind(0);
            }

            this.revealTexture.bind(1);
            this.transitionImage.bind(2);

            this.program.bind();

            this.points[0] = this.pointsRef[0].getPoint();
            this.points[1] = this.pointsRef[1].getPoint();
            this.points[2] = this.pointsRef[2].getPoint();
            this.points[3] = this.pointsRef[3].getPoint();


            // this.positions = [
            //     p1Pos.x, p1Pos.y, p1Pos.z,
            //     p2Pos.x, p2Pos.y, p2Pos.z,
            //     p3Pos.x, p3Pos.y, p3Pos.z,
            //     p4Pos.x, p4Pos.y, p4Pos.z
            // ];

            let ind = 0;
            for (var i = 0; i < this.points.length; i++) {

                // if(this.points[i].speedX < minSpeedX) minSpeedX = this.points[i].speedX;
                // if(this.points[i].speedX > maxSpeedX) maxSpeedX = this.points[i].speedX;
                this.positions[ind] = this.points[i].x;
                this.positions[ind + 1] = this.points[i].y;
                this.positions[ind + 2] = this.points[i].z;

                this.dragSpeeds.x[i] = this.points[i].speedX;
                this.dragSpeeds.y[i] = this.points[i].speedY;

                ind+= 3;
            }

            // console.log(minSpeedX, maxSpeedX);

            let minY = 100000000000;
            let minX = 100000000000;
            let maxX = -100000000000;
            let maxY = -100000000000;
            for (var i = 0; i < this.positions.length; i+=3) {
                let dragSpeedX = this.dragSpeeds.x[i/3];
                let dragSpeedY = this.dragSpeeds.y[i/3];
                let x = this.positions[i] - dragSpeedX;
                if(x < minX) minX = x;
                else if(x > maxX) maxX = x;

                let y = this.positions[i + 1] - dragSpeedY;
                if(y < minY) minY = y;
                else if(y > maxY) maxY = y;
            }

            this.x = minX + (maxX - minX)/2;
            this.y = minY + (maxY - minY)/2;

            if(this.needsUpdate)
            {
                this.program.uniforms.percentage = this.percentage;
                this.program.uniforms.percentageBlack = this.percentageBlack;
                this.program.uniforms.percentageTransition = this.percentageTransition;
            }

            this.quad.updatePosition('aPosition', this.positions);

            POLY.GL.draw(this.quad);

            this.needsUpdate = false;
        }

    }
}
