const numTilesBoard = 3;

const scaleXY = 4;
const sizeTile = scaleXY / 3; 


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

    this.boardTexture = new CGFtexture(this.scene, "resources/board_texutre.png");
    this.generalTexture = new CGFtexture(this.scene, "resources/purty_wood.png");
    //this.normalMap = new CGFtexture(this.scene, "resources/normal_maps/board_texutre.png");

    //Creates the shader
	//this.shader = new CGFshader(this.scene.gl, "shaders/normal_map-vertex.glsl", "shaders/normal_map-fragment.glsl");
	//this.setValuesShader();

    this.init();
};	

/*GameBoard.prototype.setValuesShader = function() {
	this.shader.setUniformsValues({normalMap: this.normalMap});
}*/

GameBoard.prototype = Object.create(CGFnurbsObject.prototype);
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.init = function() {
    this.tiles = [];
    var x = -1, y = -1, z = 0.05;
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

GameBoard.prototype.getTilePos = function(id) {
    var fId = this.tiles[0][0].id;
    var dId = id - fId;

    var line = Math.floor(dId / numTilesBoard);
    var column = dId - (line * numTilesBoard);

    return [column, line];
}

GameBoard.prototype.getTileCoords = function(id) {
    var pos = this.getTilePos(id);

    var x = pos[0] * sizeTile - sizeTile;
    var y = pos[1] * sizeTile - sizeTile;

    return [x, y, 0.2];
}



/**
 *  GAME MECHANICS
 */

GameBoard.prototype.selectTile = function(tile) {
    if( tile == null ) {
        this.board.sV = -1;
        this.board.sU = -1;
    } else {
        this.board.sV = Math.floor((tile.id - 1) / numTilesBoard);
        this.board.sU = (tile.id - 1) - (this.board.sV * numTilesBoard);
    }
}



/**
 *  DISPLAY FUNCTIONS
 */

//Used so that, when we change something, we don't have to change it in both functions
GameBoard.prototype.generalDisplay = function( func ){
    
    this.scene.pushMatrix();

    this.scene.scale(scaleXY, scaleXY, 1);
    this.scene.translate(0, 0, 0.2);

    if( func == Tile.prototype.display ) {
        this.material.setTexture( this.boardTexture );
        this.material.apply();
        this.board.display();
        this.material.setTexture( this.generalTexture );
        this.material.apply();
        this.support.display();
    }

    this.scene.pushMatrix();
    this.scene.scale(1/3, 1/3, 1);
    for( var i = 0; i < numTilesBoard; i++ )
        for( var j = 0; j < numTilesBoard; j++ )
            func.call(this.tiles[i][j]);
    this.scene.popMatrix();

    this.scene.popMatrix();
}

GameBoard.prototype.registerForPick = function(){
    this.generalDisplay( Tile.prototype.registerTileForPick );
}

GameBoard.prototype.display = function(){
    this.generalDisplay( Tile.prototype.display );
}