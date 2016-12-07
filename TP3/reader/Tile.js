const numPieces = 3;

/**
	Tile's constructor - Abstract
*/
function Tile(scene) {    
    if (this.constructor === Tile) {
      throw new Error("Can't instantiate abstract class!");
    }
    CGFobject.call(this,scene);
    this.pieces = [];
}

Tile.prototype = Object.create(CGFnurbsObject.prototype);
Tile.prototype.constructor = Tile;


//Updates the Tile
Tile.prototype.update = function(dSec){

}

//Sets the texture's coordinates (in this case this function does nothing)
Tile.prototype.setTexCoords = function(length_t, length_s){

}

Tile.prototype.hasPiece = function(type) {
    for( var i = 0; i < this.pieces.length; i++ ) {
        if( this.pieces[i].type == type )
            return true;
    }
    return false;
}

Tile.prototype.log = function() {
    console.debug("--Tile--");
    for( var i = 0; i < this.pieces.length; i++ )
        this.pieces[i].log();
}

function RoundTile(scene) {
    Tile.apply(this, arguments);
}

RoundTile.prototype = Object.create(Tile.prototype);
RoundTile.prototype.constructor = RoundTile;

RoundTile.prototype.addPiece = function(type) {
    if( !this.hasPiece(type) )
        this.pieces.push( new RoundPiece(this.scene, type) );
}

RoundTile.prototype.fill = function() {
    this.addPiece(small);
    this.addPiece(medium);
    this.addPiece(large);
}


/* 
        display
*/

//Returns the next available piece
Tile.prototype.registerForPick = function(id){
    var nId = id;
    for( var i = 0; i < this.pieces.length; i++ ) {
        this.pieces[i].registerForPick(nId);
        nId++;
    }
    return nId;
}

//Displays the Tile with the respective shader
Tile.prototype.display = function(){
    for( var i = 0; i < this.pieces.length; i++ )
        this.pieces[i].display();
}