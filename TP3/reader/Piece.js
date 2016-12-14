const small = 0;
const medium = 1;
const large = 2;

const smallCoord = 0.1;
const mediumCoord = 0.225;
const largeCoord = 0.35;

var pieceId = 1;

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
    this.id = pieceId;
    pieceId++;
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
    this.obj = new MyTorus( this.scene, 0.05, coord, 40, 40 );
}


/*
        display
*/

Piece.prototype.registerForPick = function(){
    this.scene.pushMatrix();
    
    this.scene.translate(0, 0, 0.05);
    this.scene.registerForPick(this.id, this);
    this.display();

    this.scene.popMatrix();
}

//Displays the Piece with the respective shader
Piece.prototype.display = function(){
    this.scene.pushMatrix();

    this.scene.translate(0, 0, 0.05);
    this.obj.display();

    this.scene.popMatrix();
}