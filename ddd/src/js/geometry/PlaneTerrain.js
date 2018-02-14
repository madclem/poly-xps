// Finally change the main algo by the Three.js one, the one I had proved to be a bit scheisse

import * as POLY from 'poly/Poly';

let gl, pivotX, pivotY, axis;


export default class PlaneTerrain extends POLY.geometry.Mesh
{
    constructor(program, data, state, drawType = 4)
    {
        super(program)

        data = data || {};

        this.options =
        {
            w: data.w || 1,
            h: data.h || 1,
            widthSegment: data.widthSegment,
            heightSegment: data.heightSegment,
            positionAttributeName: data.positionAttributeName || 'aPosition',
            axis: 'xy'
        }

        this.planeTerrain();
    }

    planeTerrain()
    {
        let widthHalf = this.options.w / 2;
    	let heightHalf = this.options.h / 2;

    	let gridX = Math.floor( this.options.widthSegment ) || 1;
    	let gridY = Math.floor( this.options.heightSegment ) || 1;

        let gridX1 = gridX + 1;
        let gridY1 = gridY + 1;

        let segmentWidth = this.options.w / gridX;
        let segmentHeight = this.options.h / gridY;

        let indices = [];

        let index = 0;

        let offset = 0;

        let vertices = [];
        let normals = [];
        let uvs = [];

        for (let iy = 0; iy < gridY1; iy ++ )
        {
            let y = iy * segmentHeight - heightHalf;
            for (let ix = 0; ix < gridX1; ix ++ )
            {

                let x = ix * segmentWidth - widthHalf;

                if(this.options.axis === "xy")
                {
                    vertices.push( x, - y, 0 );
                    normals.push( 0, 0, 1 );
                }
                else
                {
                    vertices.push( x, 0, -y );
                    normals.push( 0, 1, 0 );
                }

                uvs.push( ix / gridX );
                uvs.push( 1 - ( iy / gridY ) );
            }
        }

        for (let iy = 0; iy < gridY; iy ++ )
        {
      		for (let ix = 0; ix < gridX; ix ++ )
            {

      			let a = ix + gridX1 * iy;
      			let b = ix + gridX1 * ( iy + 1 );
      			let c = ( ix + 1 ) + gridX1 * ( iy + 1 );
      			let d = ( ix + 1 ) + gridX1 * iy;

      			indices.push( a, b, d );
      			indices.push( b, c, d );
      		}
    	}

        this.addPosition(vertices, this.options.positionAttributeName);
        this.addIndices(indices, false);
    }

    separateFaces()
    {
        let ind = []

        let index = 0;
        for (var i = 0; i < this._indices.length; i+=3) {
          ind[index] = [this._indices[i], this._indices[i+1], this._indices[i+2]];
          index++;
        }
        let v = [];
        for (var i = 0; i < this._vertices.length; i+=3) {
            v.push([
                this._vertices[i],
                this._vertices[i + 1],
                this._vertices[i + 2]
            ]);
            // v.push(this._vertices[i+1]);
            // v.push(this._vertices[i+2]);
        }
        // console.log(v[1]);
        // console.log(this._vertices[3], this._vertices[4], this._vertices[5]);
        // let data = POLY.utils.FacesSeparator.separate(ind, this._vertices);
        let data = POLY.utils.FacesSeparator.separate(ind, v);
        let newVertices = [];

        for (var i = 0; i < data.vertices.length; i++) {
            let newV = data.vertices[i];
            for (var k = 0; k < newV.length; k++) {
                newVertices.push(newV[k]);
            }
        }
        let triangles = data.faces;


        console.log(triangles);

        this.updatePosition(this.options.positionAttributeName, newVertices);
        this.addIndices(triangles);
        // this.bufferVertex(newVertices, false);

    }
}
