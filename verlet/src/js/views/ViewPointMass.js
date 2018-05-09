import * as POLY from 'poly/Poly';
import Link from './Link';
import frag from '../shaders/pointColor.frag';

export default class ViewPointMass
{
    constructor(xPos, yPos)
    {
        this.x = xPos;
        this.y = yPos;
        this.z = 0;

        this.id = Math.floor(Math.random() * 2000)

        this.lastX = this.x;
        this.lastY = this.y;
        this.lastZ = this.z;

        this.accX = 0;
        this.accY = 0;
        this.accZ = 0;

        this.mass = 1;
        this.damping = 20;

        // An ArrayList for links, so we can have as many links as we want to this PointMass
        this.links = [];

        this.quads = [];

        this.pinned = false;
        this.pinX = 0;
        this.pinY = 0;

        this.velZ = 0;


        this.program = new POLY.Program(null, frag, {
            color: {
                value: [1, 1, 1],
                type: 'vec3'
            }
        });
        this.view = new POLY.geometry.Cube(this.program);
        this.view.state.depthTest = false;
        this.view.position.x = 1;
        this.view.scale.set(.05);
    }

    setColor(r,g,b)
    {
        this.program.bind();
        this.program.uniforms.color = [r,g,b];
    }

    updatePhysics(timeStep = 1)
    {
        // this.applyForce(0, 0)

        let velX = this.x - this.lastX;
        let velY = this.y - this.lastY;
        let velZ = this.z - this.lastZ + this.accZ;

        this.velZ += (velZ - this.velZ) * .6;

        // dampen velocity
        velX *= 0.99;
        velY *= 0.99;
        this.velZ *= 0.99;

        // calculate the next position using Verlet Integration
        let nextX = this.x + velX;
        let nextY = this.y + velY;
        let nextZ = this.z + this.velZ;

        // reset variables
        this.lastX = this.x;
        this.lastY = this.y;
        this.lastZ = this.z;

        this.x = nextX;
        this.y = nextY;
        this.z = nextZ;

        if(this.z > 0) this.z = 0;
    }

    resetLinks()
    {
        this.links.length = 0;
    }
    solveConstraints() {

        // return;
      /* Link Constraints */
      // Links make sure PointMasss connected to this one is at a set distance away
      for (let i = 0; i < this.links.length; i++) {
        let currentLink = this.links[i];
        currentLink.solve();
      }

      /* Boundary Constraints */
      // These if statements keep the PointMasss within the screen
      // if (y < 1)
      //   y = 2 * (1) - y;
      // if (y > height-1)
      //   y = 2 * (height - 1) - y;
      //
      // if (x > width-1)
      //   x = 2 * (width - 1) - x;
      // if (x < 1)
      //   x = 2 * (1) - x;

      /* Other Constraints */
      // make sure the PointMass stays in its place if it's pinned
      if (this.pinned) {
        this.x = this.pinX;
        this.y = this.pinY;
        this.z = this.pinZ;
      }
    }


    // attachTo can be used to create links between this PointMass and other PointMasss
    attachTo(P, restingDist, stiff) {
      this.attachTo(P, restingDist, stiff, 30, true);
    }
    attachTo(P, restingDist, stiff,  drawLink) {
      this.attachTo(P, restingDist, stiff, 30, drawLink);
    }
    attachTo(P, restingDist, stiff,  tearSensitivity) {
      this.attachTo(P, restingDist, stiff, tearSensitivity, true);
    }
    attachTo(P, restingDist, stiff,  tearSensitivity,  drawLink) {
      let lnk = new Link(this, P, restingDist, stiff, tearSensitivity, drawLink);
      this.links.push(lnk);
    }
    removeLink (lnk) {
      // this.links.splice(lnk);
    }

    unpin()
    {
        if(this.forever) return;
        this.pinned = false;
    }

    pinTo (pX, pY, pZ = 0, forever) {

      if(this.forever) return;
      this.pinned = true;
      this.pinX = pX || this.x;
      this.pinY = pY || this.y;
      this.pinZ = pZ;

      if(forever) this.forever = true;
    }

    getPoint()
    {
        return this;
    }

    map(val, inputMin, inputMax, outputMin, outputMax)
    {
        return ((outputMax - outputMin) * ((val - inputMin)/(inputMax - inputMin))) + outputMin;
    }

    render(debug)
    {
        this.program.bind();
        this.view.position.x = this.x;
        this.view.position.y = this.y;
        this.view.position.z = this.z;

        POLY.GL.draw(this.view);

    }
}
