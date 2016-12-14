const numPieces = 3;

/**
	Tile's constructor - Abstract
*/
function Tile(scene, coords) {    
    if (this.constructor === Tile) {
      throw new Error("Can't instantiate abstract class!");
    }
    CGFobject.call(this,scene);
    this.pieces = [];
    this.coords = coords;

    this.obj = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
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

Tile.prototype.registerTileForPick = function(id){
    this.scene.pushMatrix();

    this.scene.translate(this.coords[0], this.coords[1], this.coords[2]);
    this.scene.registerForPick(id, this);
    this.obj.display();

    this.scene.popMatrix();
}

//Returns the next available piece
Tile.prototype.registerForPick = function(){
    this.scene.pushMatrix();

    this.scene.translate(this.coords[0], this.coords[1], this.coords[2]);

    for( var i = 0; i < this.pieces.length; i++ ) {
        this.pieces[i].registerForPick();
    }

    this.scene.popMatrix();
}

//Displays the Tile with the respective shader
Tile.prototype.display = function(){
    this.scene.pushMatrix();

    this.scene.translate(this.coords[0], this.coords[1], this.coords[2]);

    for( var i = 0; i < this.pieces.length; i++ )
        this.pieces[i].display();

    this.scene.popMatrix();
}