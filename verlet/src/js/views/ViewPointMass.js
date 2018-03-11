import * as POLY from 'poly/Poly';
import Link from './Link';

export default class ViewPointMass
{
    constructor(xPos, yPos)
    {
        this.x = xPos;
        this.y = yPos;
        this.z = 0;

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

        this.pinned = false;
        this.pinX = 0;
        this.pinY = 0;

        this.program = new POLY.Program();
        this.view = new POLY.geometry.Cube(this.program);
        this.view.position.x = 1;
        this.view.scale.set(.05);
    }

    updatePhysics(timeStep = 1)
    {
        // this.applyForce(0, 0)

        this.velX = this.x - this.lastX;
        this.velY = this.y - this.lastY;
        this.velZ = this.z - this.lastZ;

        // dampen velocity
        this.velX *= 0.99;
        this.velY *= 0.99;
        this.velZ *= 0.99;

        let timeStepSq = timeStep * timeStep;

        // calculate the next position using Verlet Integration
        let nextX = this.x + this.velX + 0.5 * this.accX * timeStepSq;
        let nextY = this.y + this.velY + 0.5 * this.accY * timeStepSq;
        let nextZ = this.z + this.velZ + 0.5 * this.accZ * timeStepSq;

        // reset variables
        this.lastX = this.x;
        this.lastY = this.y;
        this.lastZ = this.z;

        this.x = nextX;
        this.y = nextY;
        this.z = nextZ;
    }

    solveConstraints() {
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

    pinTo (pX, pY, pZ = 0) {
      this.pinned = true;
      this.pinX = pX || this.x;
      this.pinY = pY || this.y;
      this.pinZ = pZ;
    }

    getPoint()
    {
        return this;
    }

    render()
    {
        this.program.bind();
        this.view.position.x = this.x;
        this.view.position.y = this.y;
        this.view.position.z = this.z;
        POLY.GL.draw(this.view);

    }
}
