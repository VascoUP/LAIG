var Animation = function() {
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
    Animation.apply(this, arguments);

    if( control_points.length < 1 ) {
        console.Error("Invalid number of control_points");
        return ;
    }

    this.control_points = control_points;
    this.duration = duration > 0 ? duration : 1;
    this.time = 0;

    this.calcVelocity();

    console.debug("Velocity: " + this.velocity);
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.calcVelocity = function() {
    var distance = 0;
    for( var i = 1; i < this.control_points.length; i++ ) {
        distance += Math.sqrt( Math.pow( this.control_points[i][0] - this.control_points[i-1][0], 2) + 
                                Math.pow( this.control_points[i][1] - this.control_points[i-1][1], 2) +
                                Math.pow( this.control_points[i][2] - this.control_points[i-1][2], 2) );
    }

    this.velocity = distance / this.duration;
}

LinearAnimation.prototype.animate = function( dTime ) {
    // Given the time, calculate the next point in the trajectory
    this.time += dTime;
    if( this.time >= this.duration ) { 
        //console.debug("Do nothing");
        return ;
    }
    //console.debug(this.time);
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
        //console.debug("Do nothing");
        return ;
    }
    //console.debug(this.time);
}
