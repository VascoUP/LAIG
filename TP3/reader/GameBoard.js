const numTiles = 3;
/**
	GameBoard's constructor
*/
function GameBoard(scene) {
    CGFobject.call(this,scene);
    this.board = new MyBoard(scene, 3, 3, null, -1, -1, 
                                [0.9, 0.9, 0.9, 1], 
                                [0.5, 0.5, 0.5, 1], 
                                [0.2, 0.2, 0.8, 1]);
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
    var x = -1, y = 1, z = 0;
    for( var i = 0; i < numTiles; i++ ) {
        var line = [];
        for( var j = 0; j < numTiles; j++ ) {
            line.push( new RoundTile(this.scene, [x, y, z]) );
            x++;
        }
        y--;
        x = -1;
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
    this.scene.pushMatrix();

    this.scene.scale(3, 3, 1);
    this.board.display();

    this.scene.popMatrix();
    this.scene.pushMatrix();
    
    for( var i = 0; i < numTiles; i++ ) {
        for( var j = 0; j < numTiles; j++ ) {
            this.tiles[i][j].display();
        }
    }

    this.scene.popMatrix();
}

GameBoard.prototype.registerForPick = function(){
    var id = 1;
    this.scene.pushMatrix();
    for( var i = 0; i < numTiles; i++ ) {
        for( var j = 0; j < numTiles; j++ ) {
            this.tiles[i][j].registerTileForPick(id);
            id++;
        }
    }
    this.scene.popMatrix();
}