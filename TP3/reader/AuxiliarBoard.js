const numTilesAux = 3;

/**
	AuxiliarBoard's constructor
*/
function AuxiliarBoard(scene, coords) {
    CGFobject.call(this,scene);
    this.init();

    this.coords = coords;
};

AuxiliarBoard.prototype = Object.create(CGFnurbsObject.prototype);
AuxiliarBoard.prototype.constructor = AuxiliarBoard;

AuxiliarBoard.prototype.log = function() {
    console.debug("--Aux--");
    for( var i = 0; i < numTilesAux; i++ )
        this.tiles[i].log();
}

AuxiliarBoard.prototype.init = function() {
    this.tiles = [];
    var x = -1, y = 0, z = 0.05;
    for( var i = 0; i < numTilesAux; i++ ) {
        var tile = new RoundTile(this.scene, [x, y, z]);
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



/*
        display
*/

AuxiliarBoard.prototype.registerForPick = function(){
    this.scene.pushMatrix();
    this.scene.translate(this.coords[0], this.coords[1], this.coords[2]);
    for( var i = 0; i < this.tiles.length; i++ )
        this.tiles[i].registerForPick();
    this.scene.popMatrix();
}

//Displays the AuxiliarBoard with the respective shader
AuxiliarBoard.prototype.display = function(){
    this.scene.pushMatrix();
    this.scene.translate(this.coords[0], this.coords[1], this.coords[2]);
    for( var i = 0; i < this.tiles.length; i++ )
        this.tiles[i].display();
    this.scene.popMatrix();
}