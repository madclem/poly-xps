import * as POLY from 'poly/Poly';
// import vert from '../shaders/quadColor.vert';
import frag from '../shaders/quadColor.frag';

export default class ViewQuad
{
    constructor(pointsRef, pointsGrid)
    {
        this.pointsRef = pointsRef;
        this.pointsGrid = pointsGrid;

        this.program = new POLY.Program(null, frag, {
            color: {
                type: 'vec3',
                value: [Math.random(), Math.random(), Math.random()]
            }
        });
        this.quad = new POLY.geometry.Quad(this.program);

        let p1Pos = this.pointsRef[0].getPoint();
        let p2Pos = this.pointsRef[1].getPoint();
        let p3Pos = this.pointsRef[2].getPoint();
        let p4Pos = this.pointsRef[3].getPoint();

    }

    render()
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
