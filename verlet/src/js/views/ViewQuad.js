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

        this.idTween = null;
        this.percentage = 0;
        this.percentageBlack = 0;
        this.percentageTransition = 0;
        this.percentageX = 0;
        this.percentageY = 0;
        this.percentageLogoMenu = 0;
        this.TtoBorRtoL = 0; // TopToBottomOrRightToLeft
        this.speed = .2;
        this.count = .3;

        this.cbMenu = null;
        this.beenHere = 0;
        this.dataId = null;

        this.colorMenu = [1,0,0];
        this.isIcon = 1;
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
            },
            colorMenu: {
                type: 'vec3',
                value: [1, 0, 0]
            },
            colorGradient: {
                type: 'vec3',
                value: [Math.random(),Math.random(), Math.random()]
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
            isIcon: {
                type: 'float',
                value: this.isIcon
            },
            percentage: {
                type: 'float',
                value: this.percentage
            },
            percentageX: {
                type: 'float',
                value: 0
            },
            percentageY: {
                type: 'float',
                value: 0
            },
            percentageBlack: {
                type: 'float',
                value: this.percentageBlack
            },
            percentageTransition: {
                type: 'float',
                value: this.percentageTransition
            },
            percentageLogoMenu: {
                type: 'float',
                value: 0.0
            },
            active: {
                type: 'float',
                value: 0.0
            },
            TtoBorRtoL: {
                type: 'float',
                value: 0.0
            },
            zoom: {
                type: 'float',
                value: 1.0
            }
        });

        const uvs = [
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
		];
        this.quad = new POLY.geometry.Quad(this.program);
        this.quad.addAttribute(uvs, 'aUv', 2);

        this.transitionImage = new POLY.Texture(window.ASSET_URL + 'image/transition/dechire_00000.jpg');

        this.iconTexture = null;
    }


    showMenuIcon(x = 1, y = 0, TtoBorRtoL, delay = 0, data, cb)
    {
        this.TtoBorRtoL = TtoBorRtoL ? 1 : 0;

        this.cbMenu = cb;

        this.colorMenu = data.colorMenu;
        this.isMenuIcon = true;
        this.needsUpdate = true;
        Easings.to(this, .3, {
            delay,
            percentageX: x,
            percentageY: y,
            isIcon: -1,
            ease: Easings.easeInCirc,
            onUpdate: ()=>{
                this.needsUpdate = true;
            },
            onComplete:()=>{
                this.iconTexture = TextureManager.getTexture(window.ASSET_URL + 'image/' + data.icon);

                Easings.to(this, .3, {
                    percentageLogoMenu: 1,
                    ease: Easings.easeOutCirc,
                    onUpdate: ()=>{
                        this.needsUpdate = true;
                    }
                })
            }
        })
    }

    removeMenuIcon()
    {
        this.TtoBorRtoL *= -1;
        if(this.TtoBorRtoL < 0) this.TtoBorRtoL = 0;

        Easings.to(this, .4, {
            percentageLogoMenu: 0,
            ease: Easings.easeOutCirc,
            onUpdate: ()=>{
                this.needsUpdate = true;
            },
            onComplete: ()=>{
                this.isMenuIcon = false;
                this.iconTexture = null;

                this.needsUpdate = true;
                Easings.to(this, .6, {
                    percentageX: 0,
                    percentageY: 0,
                    isIcon: 1,
                    ease: Easings.easeOutCirc,
                    onUpdate: ()=>{
                        this.needsUpdate = true;
                    }
                })
            }
        })
    }

    reveal(show)
    {
        if(!this.data.icon) return;

        Easings.to(this, .5, {
            delay: show ? .2 : 0,
            percentageTransition: show ? 1 : 0,
            onUpdate: (obj, percentage)=>{
                let frame = Math.floor(20 * this.percentageTransition);
                let id = frame < 10 ? '0' + frame : frame;
                this.transitionImage = TextureManager.getTexture(window.ASSET_URL + 'image/transition/dechire_000' + id + '.jpg')
                this.needsUpdate = true;
            },
        })
    }

    fade(value = 1.1)
    {
        Easings.to(this, 2, {
            percentage: value,
            ease: Easings.elasticOut,
            onUpdate: ()=>{
                this.needsUpdate = true;
            }
        })
    }

    shut(close = true, delay = 0)
    {
        Easings.to(this, .8, {
            percentageBlack: close ? 1 : 0,
            delay: delay,
            ease: Easings.easeOutCirc,
            onUpdate: ()=>{
                this.needsUpdate = true;
            }
        })
    }

    onPress()
    {
        if(this.cbMenu && this.isMenuIcon)
        {
            this.cbMenu();
        }
    }

    onHover()
    {
        if(this.idTween !== null)
        {
            Easings.killTweensWithId(this.idTween);
            this.idTween = null;
        }

        this.idTween = Easings.to(this, 2, {
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
        if(this.idTween !== null)
        {
            Easings.killTweensWithId(this.idTween);
            this.idTween = null;
        }

        this.idTween = Easings.to(this, 2, {
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

        if(data.icon)
        {
            this.revealTexture = TextureManager.getTexture(window.ASSET_URL + 'image/' + data.images_hidden[0])
        }
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

            let texture;
            if(this.textures.length === 1)
            {
                texture = this.textures[0];
            }
            else
            {
                this.count += this.speed;
                let frame = Math.floor(this.count);
                texture = this.textures[frame % this.textures.length];
            }

            if(this.iconTexture !== null)
            {
                texture = this.iconTexture;
            }

            texture.bind(0);

            if(this.data.icon)
            {
                this.revealTexture.bind(1);
                this.transitionImage.bind(2);
            }

            this.program.bind();

            this.points[0] = this.pointsRef[0].getPoint();
            this.points[1] = this.pointsRef[1].getPoint();
            this.points[2] = this.pointsRef[2].getPoint();
            this.points[3] = this.pointsRef[3].getPoint();



            let ind = 0;
            for (var i = 0; i < this.points.length; i++) {
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

                this.program.uniforms.colorMenu = this.colorMenu;
                this.program.uniforms.percentageX = this.percentageX;
                this.program.uniforms.percentageY = this.percentageY;
                this.program.uniforms.TtoBorRtoL = this.TtoBorRtoL;
                this.program.uniforms.isIcon = this.isIcon;
                this.program.uniforms.percentageLogoMenu = this.percentageLogoMenu;

                if(this.data.icon)
                {
                    this.program.uniforms.percentageTransition = this.percentageTransition;
                }
            }

            this.quad.updatePosition('aPosition', this.positions);

            POLY.GL.draw(this.quad);

            this.needsUpdate = false;
        }

    }
}
