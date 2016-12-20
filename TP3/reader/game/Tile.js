
//  Used to identify the tiles (autoincremented in the constructor)
var tileId = 1;

/**
 *  TILE - ABSTRACT CLASS
 */
function Tile(scene, coords, material) {    
    if (this.constructor === Tile) {
      throw new Error("Can't instantiate abstract class!");
    }
    CGFobject.call(this,scene);
    this.pieces = [];
    this.coords = coords;

    this.obj = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);

    this.material = material;

    this.id = tileId;
    tileId++;
}

Tile.prototype = Object.create(CGFnurbsObject.prototype);
Tile.prototype.constructor = Tile;


//Updates the Tile
Tile.prototype.update = function(dSec){

}

//Sets the texture's coordinates (in this case this function does nothing)
Tile.prototype.setTexCoords = function(length_t, length_s){

}



/**
 * GAME MECHANICS
 */
Tile.prototype.hasPiece = function(type) {
    for( var i = 0; i < this.pieces.length; i++ ) {
        if( this.pieces[i].type == type )
            return true;
    }
    return false;
}

Tile.prototype.getPiece = function(id) {
    for( var i = 0; i < this.pieces.length; i++ )
        if( this.pieces[i].id == id ) //If id equals this pieces id return the piece
            return this.pieces[i];
    return null; //Else return null
}

Tile.prototype.addPiece = function(piece) {
    if( this.hasPiece(piece.type) )
        return false;
    this.pieces.push(piece);
    return true;
}

Tile.prototype.removePiece = function(piece) {
    var index = this.pieces.indexOf(piece);
    if( index > -1 ) {
        this.pieces.splice(index, 1); //Removed one element from an index
        return true;
    }
    return false;
}



/**
 *  ROUND TILE - CHILD CLASS OF TILE
 */

function RoundTile(scene) {
    Tile.apply(this, arguments);
}

RoundTile.prototype = Object.create(Tile.prototype);
RoundTile.prototype.constructor = RoundTile;

RoundTile.prototype.initPiece = function(type) {
    if( !this.hasPiece(type) )
        this.pieces.push( new RoundPiece(this.scene, type, this.material) );
}

RoundTile.prototype.fill = function() {
    this.initPiece(small);
    this.initPiece(medium);
    this.initPiece(large);
}



/**
 *  DISPLAY FUNCTIONS
 */

Tile.prototype.registerTileForPick = function(){
    this.scene.pushMatrix();

    this.scene.translate(this.coords[0], this.coords[1], this.coords[2]);
    this.scene.registerForPick(this.id, this);
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