import * as POLY from 'poly/Poly';
import vert from '../shaders/quadColor.vert';
import frag from '../shaders/quadColor.frag';

export default class ViewQuad
{
    constructor()
    {
        this.pointsRef = [];
        this.id = Math.floor(Math.random() * 2000)

        // let colors = [
        //     [1,1,1],
        //     [1,0,0],
        // ]

        // let color = colors[col] ? colors[col] : [Math.random(), Math.random(), Math.random()]
        let color = [Math.random(), Math.random(), Math.random()]
        // let color = [Math.random(), Math.random(), Math.random()]
        this.program = new POLY.Program(vert, frag, {
            color: {
                type: 'vec3',
                // value: [1,1,1]
                value: color
            }
        });
        this.quad = new POLY.geometry.Quad(this.program);
        this.quad.state.blend = true;
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

    render()
    {
        if(this.pointsRef.length > 0)
        {
            this.program.bind();

            let p1Pos = this.pointsRef[0].getPoint();
            let p2Pos = this.pointsRef[1].getPoint();
            let p3Pos = this.pointsRef[2].getPoint();
            let p4Pos = this.pointsRef[3].getPoint();

            this.positions = [
                p1Pos.x, p1Pos.y, p1Pos.z,
                p2Pos.x, p2Pos.y, p2Pos.z,
                p3Pos.x, p3Pos.y, p3Pos.z,
                p4Pos.x, p4Pos.y, p4Pos.z
            ];

            this.quad.updatePosition('aPosition', this.positions);

            POLY.GL.draw(this.quad);
        }

    }
}
