const numTilesAux = 6;


/**
 *  AuxiliarBoard's constructor
 */
function AuxiliarBoard(scene, coords, materialBoard, materialPieces) {
    CGFobject.call(this,scene);
    this.init(materialPieces);

    // Transformation
    this.coords = coords;
    this.rotation = -Math.PI / 4;
    this.scale = [1, 1, 1];

    this.material = materialBoard;

    this.box = new MyBox(scene);
};

AuxiliarBoard.prototype = Object.create(CGFnurbsObject.prototype);
AuxiliarBoard.prototype.constructor = AuxiliarBoard;

AuxiliarBoard.prototype.init = function(material) {
    this.tiles = [];
    var x = -1, y = -0.5, z = 0.05;
    for( var i = 0; i < numTilesAux; i++ ) {
        if( i == numTilesAux / 2 ) {
            x = -1;
            y += 1;
        }
        var tile = new RoundTile(this.scene, [x, y, z], material);
        tile.fill();
        this.tiles.push(tile);
        x += 1;
    }
}

//Updates the AuxiliarBoard
AuxiliarBoard.prototype.update = function( dSec ){

}

//Sets the texture's coordinates (in this case this function does nothing)
AuxiliarBoard.prototype.setTexCoords = function(length_t, length_s){
	
}



/**
 * GAME MECHANICS
 */

AuxiliarBoard.prototype.getPiece = function(id) {
    var piece;
    for( var i = 0; i < numTilesAux; i++ )
        if((piece = this.tiles[i].getPiece(id)) != null)
            return piece;
    return null;
}

AuxiliarBoard.prototype.removePiece = function(piece) {
    for( var i = 0; i < numTilesAux; i++ )
        if(this.tiles[i].removePiece(piece))
            return true;
    return false;
}



/**
 *  DISPLAY FUNCTIONS
 */

AuxiliarBoard.prototype.registerForPick = function(){
    this.scene.pushMatrix();
    this.scene.translate(this.coords[0], this.coords[1], this.coords[2]);
    for( var i = 0; i < numTilesAux; i++ )
        this.tiles[i].registerForPick();
    this.scene.popMatrix();
}

//Displays the AuxiliarBoard with the respective shader
AuxiliarBoard.prototype.display = function(){
    this.scene.pushMatrix();

    this.scene.translate(this.coords[0], this.coords[1], this.coords[2]);
    this.scene.rotate(this.rotation, 0, 0, 1);
    this.scene.scale(this.scale[0], this.scale[1], this.scale[2]);


    this.scene.pushMatrix();

    this.material.apply();
    this.scene.translate(0, 0, -0.2);
    

    this.scene.pushMatrix();

    this.scene.scale(4, 3, 0.5)
    this.box.display();

    this.scene.popMatrix();


    for( var i = 0; i < numTilesAux; i++ )
        this.tiles[i].display();

    this.scene.popMatrix();


    this.scene.popMatrix();
}