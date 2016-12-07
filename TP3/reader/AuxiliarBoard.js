const numTilesAux = 3;

/**
	AuxiliarBoard's constructor
*/
function AuxiliarBoard(scene) {
    CGFobject.call(this,scene);
    this.init();
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
    for( var i = 0; i < numTilesAux; i++ ) {
        var tile = new RoundTile(this.scene);
        tile.fill();
        this.tiles.push(tile);
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

AuxiliarBoard.prototype.registerForPick = function(id){
    var nId = id;
    for( var i = 0; i < this.tiles.length; i++ ) {
        this.scene.pushMatrix();

        if( i == 0 )
            this.scene.translate(-3, 0, 0);
        else if( i == 2 )
            this.scene.translate(3, 0, 0);

        nId = this.tiles[i].registerForPick(nId);

        this.scene.popMatrix();
    }
    return nId;
}

//Displays the AuxiliarBoard with the respective shader
AuxiliarBoard.prototype.display = function(){
    for( var i = 0; i < numTilesAux; i++ )
        this.tiles[i].display();
}