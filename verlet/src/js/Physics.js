
export default class Physics
{
    constructor()
    {
        this.circles = [];
        this.previousTime = 0;
        this.currentTime = 0;

        this.fixedDeltaTime = 4;
        this.fixedDeltaTimeSeconds = this.fixedDeltaTime / 1000.0;
        this.leftOverDeltaTime = 0;
        this.constraintAccuracy = 10;
    }

    update(pointmasses)
    {
        this.currentTime = Date.now();
        let deltaTimeMS = this.currentTime - this.previousTime;

        this.previousTime = this.currentTime; // reset previous time

        // break up the elapsed time into manageable chunks
        let timeStepAmt = (deltaTimeMS + this.leftOverDeltaTime) / this.fixedDeltaTime;

        // limit the timeStepAmt to prevent potential freezing
        timeStepAmt = Math.min(timeStepAmt, 5);

        // store however much time is leftover for the next frame
        this.leftOverDeltaTime = deltaTimeMS - (timeStepAmt * this.fixedDeltaTime);

        // How much to push PointMasses when the user is interacting

        // update physics
        for (let iteration = 1; iteration <= timeStepAmt; iteration++) {
          // solve the constraints multiple times
          // the more it's solved, the more accurate.
          for (let x = 0; x < this.constraintAccuracy; x++) {
            for (let i = 0; i < pointmasses.length; i++) {
              let pointmass = pointmasses[i];
              pointmass.solveConstraints();
            }
          }

          // update each PointMass's position
          for (let i = 0; i < pointmasses.length; i++) {
            let pointmass = pointmasses[i];
            // pointmass.updateInteractions();
            pointmass.updatePhysics(this.fixedDeltaTimeSeconds);
          }
        }
    }
}


  //
  // void addCircle (Circle c) {
  //   circles.add(c);
  // }
  // void removeCircle (Circle c) {
  //   circles.remove(c);
  // }
