const small = 0;
const medium = 1;
const large = 2;

const smallCoord = 0.25;
const mediumCoord = 0.5;
const largeCoord = 1;

/**
	Piece's constructor - Abstract
*/
function Piece(scene, type) {    
    if (this.constructor === Piece) {
      throw new Error("Can't instantiate abstract class!");
    }
    CGFobject.call(this,scene);
    this.type = type;
    this.obj = null;
};

Piece.prototype = Object.create(CGFnurbsObject.prototype);
Piece.prototype.constructor = Piece;

//Updates the Piece
Piece.prototype.update = function(dSec){

}

//Sets the texture's coordinates (in this case this function does nothing)
Piece.prototype.setTexCoords = function(length_t, length_s){

}

Piece.prototype.log = function() {
    console.debug("--Piece--");
    console.debug(this.type);
}

Piece.prototype.getCoord = function() {
    switch( this.type ) {
        case small:
            return smallCoord;
        case medium:
            return mediumCoord;
        case large:
            return largeCoord;
        default:
            throw new Error("Unkown type for piece");
    }
}

function RoundPiece(scene, type) {
    Piece.apply(this, arguments);
    this.init();
};

RoundPiece.prototype = Object.create(Piece.prototype);
RoundPiece.prototype.constructor = RoundPiece;

RoundPiece.prototype.init = function() {
    var coord = this.getCoord();
    this.obj = new MyRectangle( this.scene, -coord, -coord, coord, coord);
}


/*
        display
*/

Piece.prototype.registerForPick = function(id){
    this.scene.registerForPick(id, this);
    this.display();
}

//Displays the Piece with the respective shader
Piece.prototype.display = function(){
    this.scene.pushMatrix();

    var dY;
    if( this.type == large )
        dY = 0;
    else if( this.type == medium )
        dY = 2;
    else
        dY = 3;

    this.scene.translate(0, dY, 0);
    this.obj.display();

    this.scene.popMatrix();
}