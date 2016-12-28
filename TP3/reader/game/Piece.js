const small = 0;
const medium = 1;
const large = 2;

const smallCoord = 0.1;
const mediumCoord = 0.25;
const largeCoord = 0.4;

const selectedColor = [0.2, 0.5, 1, 1];

//  Used to identify the pieces (autoincremented in the constructor)
var pieceId = 1;


/**
 *  PIECE - ABSTRACT CLASS
 */
function Piece(scene, type, material) {    
    if (this.constructor === Piece) {
      throw new Error("Can't instantiate abstract class!");
    }
    CGFobject.call(this,scene);
    this.type = type;
    this.obj = null;
    this.id = pieceId;

    this.material = material;

    this.selected = false;
    pieceId++;

    this.animation = null;
    
    //Creates the shader
	this.shader = new CGFshader(this.scene.gl, "shaders/piece.vert", "shaders/piece.frag");
	this.setValuesShader();
};

Piece.prototype = Object.create(CGFnurbsObject.prototype);
Piece.prototype.constructor = Piece;

//Sets the shader values
Piece.prototype.setValuesShader = function(){
	this.shader.setUniformsValues({color: selectedColor});
}

//Updates the Piece
Piece.prototype.update = function(dSec){

}

//Sets the texture's coordinates (in this case this function does nothing)
Piece.prototype.setTexCoords = function(length_t, length_s){

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

Piece.prototype.pieceToString = function() {
    var t;
    switch( this.type ) {
        case small:
            t = 's';
            break;
        case medium:
            t = 'm';
            break;
        case large:
            t = 'l';
            break;
        default:
            throw new Error("Unkown type for piece");
    }

    var p;
    if( this.id <= 18 )
        p = 'r';
    else
        p = 'b';

    return "(" + t + "," + p + ")";
}



/**
 *  ROUND PIECE - CHILD CLASS OF PIECE
 */

function RoundPiece(scene) {
    Piece.apply(this, arguments);
    this.init();
};

RoundPiece.prototype = Object.create(Piece.prototype);
RoundPiece.prototype.constructor = RoundPiece;

RoundPiece.prototype.init = function() {
    var coord = this.getCoord();
    this.obj = new MyTorus( this.scene, 0.05, coord, 40, 40 );
}



/**
 *  DISPLAY FUNCTIONS
 */

Piece.prototype.generalDisplay = function( func ){
    var activateShaders = false;

    this.scene.pushMatrix();
    //this.scene.translate(this.coords[0], this.coords[1], this.coords[2]);

    if( func == Piece.prototype.registerForPick ) {
        //Register for pick
        this.scene.registerForPick(this.id, this);

        this.obj.display();

    } else {
        //Display
        if( this.selected )
	        activateShaders = true;

        if( activateShaders )
            this.scene.setActiveShader(this.shader);

        this.material.apply();

        if( this.animation != null )
            this.animation.display(this.scene, this.obj);
        else
            this.obj.display();

        if( activateShaders )
            this.scene.setActiveShader(this.scene.defaultShader);

    }

    this.scene.popMatrix();
}

Piece.prototype.registerForPick = function(){
    this.generalDisplay( Piece.prototype.registerForPick );
}

//Displays the Piece with the respective shader
Piece.prototype.display = function(){
    this.generalDisplay( Piece.prototype.display );
}