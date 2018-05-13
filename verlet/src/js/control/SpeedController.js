
class SpeedController
{
	constructor()
  {
		this.tick = 0;
		this.previousPos = {x: 0, y: 0};
		this.previousTime = false;
		this.pos = {x: 0, y: 0};
		this.pos = {x: 0, y: 0};
		this.lastSpeed = 0;
		this.speed = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.targetSpeed = 0;
	}


	onUp()
  	{
		this.isDown = false;

	}
	onDown(pt)
  	{
		this.isDown = true;

		this.previousPos.x = this.pos.x = pt.x;
		this.previousPos.y = this.pos.y = pt.y;
		this.speed =  this.lastSpeed = 0;
	}

	calculateSpeed()
  {
		var x =  this.pos.x;
		var y = this.pos.y;
		var new_x;
		var new_y;
		var new_t;

		var x_dist;
		var y_dist, interval,vx, vy, t, negX, negY, velocity;

		if (!this.previousTime) { return 0;}
		// if (!this.previousTime || (this.previousTime - this.tick) > -2 ) { return 0;}
		t = this.previousTime;
		new_x = this.previousPos.x;
		new_y = this.previousPos.y;
		new_t = this.tick;;


		x_dist = new_x - x;


		y_dist = new_y - y;
		interval = new_t - t;
		negX = x_dist < 0 ? 1: -1;
		negY = y_dist < 0 ? 1: -1;
          // update values:

		if(interval > 2) interval = 1;

		vx = (negX * Math.sqrt(x_dist*x_dist))/ (interval/6);
		vy = (negY * Math.sqrt(y_dist*y_dist))/ (interval/6);

		x = new_x;
		y = new_y;

		if(isNaN(vx)) vx = 0;
		if(isNaN(vy)) vy = 0;

		this.speedX = vx;
		this.speedY = vy;

		velocity = Math.sqrt(x_dist*x_dist+y_dist*y_dist)/ (interval/20);
		//
		if(isNaN(velocity)) velocity = 0;

		return velocity;
	}

	onMove(pt)
	{

		this.tick++;


		if(!this.isDown) return;

		this.pos.x = pt.x;
		this.pos.y = pt.y;

		let speed = Math.abs(this.calculateSpeed());

		if (speed > 60) {
			speed = 60;
		}
		speed /= 60;

		speed = this.easeInOutSine(speed, 0, 1, 1);
		this.speed += (speed - this.lastSpeed) * .1;

		this.tickMove++;

		this.lastSpeed = this.speed;
		// }
		this.previousTime = this.tick;

		this.previousPos.x = this.pos.x;
		this.previousPos.y = this.pos.y;
	}
	// }

	update()
	{
		this.tick++;
		this.speedX *= .9;
		this.speedY *= .9;
	}

	easeInOutSine (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}

	easeOutSine(t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	}
}


export default new SpeedController();
