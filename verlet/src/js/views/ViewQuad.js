import * as POLY from 'poly/Poly';
import vert from '../shaders/quadColor.vert';
import frag from '../shaders/quadColor.frag';

export default class ViewQuad
{
    constructor(index)
    {
        this.pointsRef = [];
        this.id = Math.floor(Math.random() * 2000)

        this.x = 0;
        this.y = 0;

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
            alpha: {
                type: 'float',
                value: 1.0 //Math.random() > .9 ? 0.0 : 1.0
            },
            active: {
                type: 'float',
                value: 0.0 //Math.random() > .9 ? 0.0 : 1.0
            }
        });


        this.quad = new POLY.geometry.Quad(this.program);
        this.quad.addAttribute(this.quad.uvs, 'aUv', 2);
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
        if(data.id === this.dataId) return;

        this.data = data;
        this.dataId = data.id;
        this.program.bind();
        this.program.uniforms.color = data.color;
    }

    render()
    {
        if(this.pointsRef.length > 0)
        {
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

            this.quad.updatePosition('aPosition', this.positions);

            POLY.GL.draw(this.quad);
        }

    }
}
