const numTilesBoard = 3;


/**
 *  GameBoard's constructor
 */
function GameBoard(scene, material) {
    CGFobject.call(this,scene);
    this.board = new MyBoard(scene, 3, 3, null, -1, -1, 
                                [0.9, 0.9, 0.9, 1], 
                                [0.5, 0.5, 0.5, 1], 
                                [0.2, 0.2, 0.8, 1]);
    this.support = new MyGameBoard(scene);
    this.material = material;
    this.material.setTextureWrap('REPEAT', 'REPEAT');
    this.material.setTexture(new CGFtexture(this.scene, "resources/purty_wood.png"));

    this.init();
    this.selectedTileId = null;
};

GameBoard.prototype = Object.create(CGFnurbsObject.prototype);
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.init = function() {
    this.tiles = [];
    var x = -1, y = -1, z = 0;
    for( var i = 0; i < numTilesBoard; i++ ) {
        var line = [];
        for( var j = 0; j < numTilesBoard; j++ ) {
            line.push( new RoundTile(this.scene, [x, y, z]) );
            x++;
        }
        y++;
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



/**
 *  GAME MECHANICS
 */

GameBoard.prototype.selectTile = function(id) {
    if( id == null ) {
        this.board.sV = -1;
        this.board.sU = -1;
    } else {
        this.board.sV = Math.floor((id - 1) / numTilesBoard);
        this.board.sU = (id - 1) - (this.board.sV * numTilesBoard);
    }
    this.selectedTileId = id;
}



/**
 *  DISPLAY FUNCTIONS
 */

//Displays the GameBoard with the respective shader
GameBoard.prototype.display = function(){
    this.scene.pushMatrix();

    this.scene.scale(3, 3, 1);
    this.material.apply();
    this.board.display();
    this.material.apply();
    this.support.display();

    this.scene.popMatrix();
    this.scene.pushMatrix();
    
    for( var i = 0; i < numTilesBoard; i++ ) {
        for( var j = 0; j < numTilesBoard; j++ ) {
            this.tiles[i][j].display();
        }
    }

    this.scene.popMatrix();
}

GameBoard.prototype.registerForPick = function(){
    this.scene.pushMatrix();
    for( var i = 0; i < numTilesBoard; i++ )
        for( var j = 0; j < numTilesBoard; j++ )
            this.tiles[i][j].registerTileForPick();
    this.scene.popMatrix();
}