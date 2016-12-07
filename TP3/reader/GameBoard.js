const numTiles = 3;
/**
	GameBoard's constructor
*/
function GameBoard(scene) {
    CGFobject.call(this,scene);
    this.init();
};

GameBoard.prototype = Object.create(CGFnurbsObject.prototype);
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.log = function() {
    console.debug("--Board--");
    console.debug(this.tiles);
    for( var i = 0; i < numTiles; i++ ) {
        for( var j = 0; j < numTiles; j++ ) {
            this.tiles[i][j].log();
        }
    }
}

GameBoard.prototype.init = function() {
    this.tiles = [];
    for( var i = 0; i < numTiles; i++ ) {
        var line = [];
        for( var j = 0; j < numTiles; j++ ) {
            line.push( new RoundTile(this.scene) );
        }
        this.tiles.push( line );
    }
}

//Sets the shader values
GameBoard.prototype.setValuesShader = function(){

}

//Updates the GameBoard
GameBoard.prototype.update = function( dSec ){

}

//Sets the texture's coordinates (in this case this function does nothing)
GameBoard.prototype.setTexCoords = function(length_t, length_s){
	
}


/*
        display
*/

//Displays the GameBoard with the respective shader
GameBoard.prototype.display = function(){
    
}