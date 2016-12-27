function AnimationInfo ( center, objCoords, scale ) {
    this.center = center;
    this.objCoords = objCoords;
    this.scale = scale;

    this.calcInit();
}

AnimationInfo.prototype.calcInit = function () {
    this.radius = Math.sqrt(Math.pow(this.center[0] - this.objCoords[0], 2) + 
                            Math.pow(this.center[1] - this.objCoords[1], 2) +
                            Math.pow(this.center[2] - this.objCoords[2], 2));
    console.debug(1);
    if( this.objCoords[1] == this.center[1] ) {
        if(this.objCoords[2] == this.center[2]) {
            if( this.objCoords[0] < this.center[0] )
            //For negative values
                this.angleXY = Math.PI;    
            console.debug(2);
            return ;
        }

        if(this.objCoords[0] == this.center[0]) {    
            console.debug(3);
            this.angleXY = Math.PI / 2;
        }
        else {
            var slopeXZ = Math.abs((this.objCoords[2] - this.center[2]) / (this.objCoords[0] - this.center[0]));
            this.angleXY = Math.atan(slopeXZ);
            if( this.objCoords[0] < this.center[0] ) {    
                console.debug(4);
                this.angleXY = Math.PI - this.angleXY; //Math.PI / 2;
            }
        }
        
        this.angleYZ = this.objCoords[2] > this.center[2] ? Math.PI / 2 : -Math.PI / 2;
        return ;
    }

    if(this.objCoords[0] == this.center[0]) {    
        console.debug(5);
        if( this.objCoords[1] != this.center[1] ) {    
            console.debug(6);
            this.angleXY = Math.PI / 2;
        }
    }
    else {
        var slopeXY = Math.abs((this.objCoords[1] - this.center[1]) / (this.objCoords[0] - this.center[0]));
        this.angleXY = Math.atan(slopeXY);
        if( this.objCoords[0] < this.center[0] ) {    
            console.debug(8);
            this.angleXY = Math.PI - this.angleXY;
        }
    }

    if(this.objCoords[1] == this.center[1]) {
        console.debug(9);
        if( this.objCoords[2] != this.center[2]) {
            console.debug(10);
            this.angleYZ = Math.PI / 2;
        }
    }
    else {
        var slopeYZ = Math.abs((this.objCoords[2] - this.center[2]) / (this.objCoords[1] - this.center[1]));
        this.angleYZ = Math.atan(slopeYZ);
        if( this.objCoords[2] < this.center[2] ) {
            console.debug(11);
            if(this.objCoords[1] < this.center[1]) {
                console.debug(12);
                this.angleYZ -= Math.PI;
            }
            else 
                this.angleYZ -= Math.PI / 2;
        }
        else if(this.objCoords[1] < this.center[1]) {
            console.debug(13);
            this.angleYZ = Math.PI - this.angleYZ;
        }
    }
}