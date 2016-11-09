var Animation = function( ) {
    if (this.constructor === Animation) {
      throw new Error("Can't instantiate abstract class!");
    }
};

//Abstract method used by children classes to apply the animation
Animation.prototype.animate = function() {
    throw new Error("Abstract method!");
}


/*
    - LINEAR ANIMATION -
*/
var LinearAnimation = function ( control_points, duration ) {

    console.debug(control_points);
    
    Animation.apply(this, arguments);

    if( control_points.length < 1 ) {
        console.Error("Invalid number of control_points");
        return ;
    }

    this.control_points = control_points;
    console.debug("Control point");
    this.position = control_points[1];

    this.duration = duration > 0 ? duration : 1;
    this.time = 0;

    this.calcVelocity();

    console.debug("Velocity: " + this.velocity);
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.calcVelocity = function() {
    var distance = 0;
    var control_points_vel = [];

    for( var i = 2; i < this.control_points.length; i++ ) {
        var d = Math.sqrt( Math.pow( this.control_points[i][0] - this.control_points[i-1][0], 2) + 
                                Math.pow( this.control_points[i][1] - this.control_points[i-1][1], 2) +
                                Math.pow( this.control_points[i][2] - this.control_points[i-1][2], 2) );
        distance += d;
        console.debug("D:");
        console.debug(d);
        control_points_vel.push(d);
    }

    this.vel_dir = [];
    this.velocity = distance / this.duration;

    console.debug("Velocity directions");
    for( var i = 2; i < this.control_points.length; i++ ) {
        var d = control_points_vel[i-2];

        var vel = [ 
                //Duration of this control point
                this.duration * d / distance,
                //Velocity in x                                 
                this.velocity * (this.control_points[i][0] - this.control_points[i-1][0]) / d,
                //Velocity in y 
                this.velocity * (this.control_points[i][1] - this.control_points[i-1][1]) / d,
                //Velocity in z
                this.velocity * (this.control_points[i][2] - this.control_points[i-1][2]) / d,];
              
        console.debug( vel );
        this.vel_dir.push(vel);
    }
}

LinearAnimation.prototype.animate = function( dTime ) {
    // Given the time, calculate the next point in the trajectory
    this.time += dTime;
    if( this.time >= this.duration ) { 
        return ;
    }

    //console.debug("Got here");

    var dur = 0; //Current calculated duration
    for( var i = 0, dur; i < this.vel_dir.length; i++, dur += this.vel_dir[0] ) {

        if( this.time > dur + this.vel_dir[0] ) { //If the time is past this control point
            continue;
        }

        //If it gets here than this is the right stretch
        this.position = this.control_points[i+1];
        //console.debug(this.position);
        var t = this.time - dur;
        this.position[0] += this.vel_dir[1] * t;
        this.position[1] += this.vel_dir[2] * t;
        this.position[2] += this.vel_dir[3] * t;
        //console.debug(this.position);
        break;
    }
}


/*
    - CIRCULAR ANIMATION -
*/
var CircularAnimation = function( center, radius, init_angle, rotate_angle, duration ) {
    Animation.apply(this, arguments);    
    
    this.center = center;
    this.radius = radius;
    this.init_angle = init_angle;
    this.rotate_angle = rotate_angle;
    this.duration = duration > 0 ? duration : 1;
    this.time = 0;

    this.calcVelocity();

    console.debug("Velocity: " + this.velocity);
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.calcVelocity = function() {
    var distance = this.radius * this.rotate_angle;
    this.velocity = distance / this.duration;
}

CircularAnimation.prototype.animate = function( dTime ) {
    this.time += dTime;
    if( this.time >= this.duration ) { 
        return ;
    }
}
