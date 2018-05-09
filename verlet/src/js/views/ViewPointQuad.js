import * as POLY from 'poly/Poly';
import Link from './Link';
import frag from '../shaders/pointColor.frag';

export default class ViewPointQuad
{
    constructor(xPos, yPos)
    {
        this.origin = {
            x: xPos,
            y: yPos
        }

        this.gridPos = {
            x: 0,
            y: 0,
        }
        this.x = xPos;
        this.y = yPos;
        this.z = 0;
        this.easeZ = 0;
        this.targetSpeedX = 0;
        this.speedX = 0;
        this.speedY = 0;

        this.id = Math.floor(Math.random() * 2000)

        this.program = new POLY.Program(null, frag, {
            color: {
                value: [1, 1, 1],
                type: 'vec3'
            }
        });
        this.view = new POLY.geometry.Cube(this.program);
        this.view.position.x = 1;
        this.view.scale.set(.05);
    }

    setSpeed(speedX, speedY)
    {
        // if(speed > this.speedX)
        // {
            this.speedX = speedX;
            this.speedY = speedY;
        // }
    }

    getPoint()
    {
        return this;
    }

    setZ(value, force)
    {
        if(this.donotupdate) return;
        this.easeZ = value;

        if(force)
        {
            this.z = value;
        }
    }
    render(debug)
    {
        // this.z = this.easeZ;

        // this.speedX += (this.targetSpeedX - this.speedX) * 1
        // this.targetSpeedX *= .9;
        // this.targetSpeedX *= .7;
        this.z += (this.easeZ - this.z) * .3;
        this.program.bind();
        this.view.position.x = this.x;
        this.view.position.y = this.y;
        this.view.position.z = this.z;

        // if(debug)
        // {
        // }
        // POLY.GL.draw(this.view);

    }
}
