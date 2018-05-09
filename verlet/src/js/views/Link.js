
export default class Link
{
    constructor(which1, which2, restingDist, stiff, tearSensitivity, drawMe)
    {
        this.restingDistance = restingDist ;
        this.stiffness = stiff;
        this.tearSensitivity = tearSensitivity;

        this.p1 = which1;
        this.p2 = which2;
    }

    solve() {
      // calculate the distance between the two PointMasss
      let diffX = this.p1.x - this.p2.x;
      let diffY = this.p1.y - this.p2.y;
      let diffZ = this.p1.z - this.p2.z;
      let d = Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);

      // find the difference, or the ratio of how far along the restingDistance the actual distance is.
      let difference = (this.restingDistance - d) / d;
      // let difference = (this.restingDistance - d) / d;

      // if the distance is more than curtainTearSensitivity, the cloth tears
      // if (d > tearSensitivity)
      //   this.p1.removeLink(this);

      // Inverse the mass quantities
      let im1 = 1 / this.p1.mass;
      let im2 = 1 / this.p2.mass;
      let scalarP1 = (im1 / (im1 + im2)) * this.stiffness;
      let scalarP2 = this.stiffness - scalarP1;

      // Push/pull based on mass
      // heavier objects will be pushed/pulled less than attached light objects
      this.p1.x += diffX * scalarP1 * difference;
      this.p1.y += diffY * scalarP1 * difference;
      this.p1.z += diffZ * scalarP1 * difference;

      this.p2.x -= diffX * scalarP2 * difference;
      this.p2.y -= diffY * scalarP2 * difference;
      this.p2.z -= diffZ * scalarP2 * difference;
    }
}
