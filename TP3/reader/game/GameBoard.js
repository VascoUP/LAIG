const numTilesBoard = 3;

const scaleXZ = 4;
const sizeTile = scaleXZ / 3; 


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

    this.init();
};	

GameBoard.prototype = Object.create(CGFnurbsObject.prototype);
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.init = function() {
    this.tiles = [];
    var x = -1, y = 0.05, z = 1;
    for( var i = 0; i < numTilesBoard; i++ ) {
        var line = [];
        for( var j = 0; j < numTilesBoard; j++ ) {
            line.push( new RoundTile(this.scene, [x, y, z]) );
            x++;
        }
        z--;
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
    var z = sizeTile - pos[1] * sizeTile;

    return [x, 0.2, z];
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

GameBoard.prototype.boardToString = function() {
    var str = '[';
    for( var i = 0; i < numTilesBoard; i++ ) {
        var line = '[';
        for( var j = 0; j < numTilesBoard; j++ ) {
            var tile = this.tiles[i][j].tileToString();
            if( j != 0 )
                line += ',';
            line += tile;
        }
        line += ']';

        if( i != 0 )
            str += ',';
        str += line;
    }

    str += ']';
    
    return str;
}


/**
 *  DISPLAY FUNCTIONS
 */

//Used so that, when we change something, we don't have to change it in both functions
GameBoard.prototype.generalDisplay = function( func ){
    
    this.scene.pushMatrix();

    this.scene.scale(scaleXZ, 1, scaleXZ);
    this.scene.translate(0, 0.2, 0);

    if( func == Tile.prototype.display ) {
        this.scene.pushMatrix();

        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.material.setTexture( this.boardTexture );
        this.material.apply();
        this.board.display();
        this.material.setTexture( this.generalTexture );
        this.material.apply();
        this.support.display();

        this.scene.popMatrix();
    }

    this.scene.pushMatrix();
    this.scene.scale(1/3, 1, 1/3);
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