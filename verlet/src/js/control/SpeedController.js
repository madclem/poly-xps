
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

		document.addEventListener('mousedown', this.onMouseDown.bind(this));
		document.addEventListener('touchstart', this.onMouseDown.bind(this));
		document.addEventListener('mouseup', this.onUp.bind(this));
		document.addEventListener('touchend', this.onUp.bind(this));
		document.addEventListener('mousemove', this.onMouseMove.bind(this));
		document.addEventListener('touchmove', this.onMouseMove.bind(this));
	}


	onUp()
  {
		this.isDown = false;

	}
	onMouseDown(e)
  {
		this.isDown = true;

		if(e.clientX){
			this.previousPos.x = this.pos.x = e.clientX;
			this.previousPos.y = this.pos.y = e.clientX;
		}
		else {
			this.previousPos.x = this.pos.x = e.targetTouches[0].pageX;
			this.previousPos.y = this.pos.y = e.targetTouches[0].pageY;

		}

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

		if (this.previousTime === false) {return 0;}
		t = this.previousTime;
		new_x = this.previousPos.x;
		new_y = this.previousPos.y;
		new_t = Date.now();

		x_dist = new_x - x;


		y_dist = new_y - y;
		interval = new_t - t;
		negX = x_dist < 0 ? 1: -1;
		negY = y_dist < 0 ? 1: -1;
          // update values:
		x = new_x;
		y = new_y;

		vx = negX * Math.sqrt(x_dist*x_dist)/ (interval/50);
		vy = negY * Math.sqrt(y_dist*y_dist)/ (interval/50);

		this.speedX = vx;
		this.speedY = vy;

		if(isNaN(vx)) vx = 0;
		if(isNaN(vy)) vy = 0;

		velocity = Math.sqrt(x_dist*x_dist+y_dist*y_dist)/ (interval/50);
		//
		if(isNaN(velocity)) velocity = 0;

		return velocity;
	}

	onMouseMove(e)
	{

		this.tick++;


		if(e.clientX)
    {
			this.pos.x = e.clientX;
			this.pos.y = e.clientY;
		}
		else {
			this.pos.x = e.targetTouches[0].pageX;
			this.pos.y = e.targetTouches[0].pageY;
		}



		// if(this.tick % 10 === 0)
    // {
      // let pos = e.data.getLocalPosition(this.view);

		// if(this.isDown) {
		let speed = Math.abs(this.calculateSpeed());



		if (speed > 60) {
			speed = 60;
		}
		speed /= 60;
      // speed = speed;

		speed = this.easeInOutSine(speed, 0, 1, 1);
		this.speed += (speed - this.lastSpeed) * .1;

		this.tickMove++;

		this.lastSpeed = this.speed;
		// }

		this.previousTime = Date.now();
		this.previousPos.x = this.pos.x;
		this.previousPos.y = this.pos.y;
	}
	// }


	// reset(view)
  // {
	//
	// }

	easeInOutSine (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}

	easeOutSine(t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	}
}


export default new SpeedController();