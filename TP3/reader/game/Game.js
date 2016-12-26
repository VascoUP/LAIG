var GameState = {    
    Player1 : 0,
    P1ToP2 : 1,
    Player2 : 2,
    P2ToP1 : 3
};

var PlayerState = {
    ChoosePiece : 0,
    PieceConfirmation : 1,
    ChooseTile : 2,
    TileConfirmation : 3,
    Wait : 4
};


/**
 *  Game's constructor
 */
function Game(scene, materialBoard, materialBox1, materialBox2, materialPieces1, materialPieces2) {
    this.scene = scene;

    this.gameBoard = new GameBoard(scene, materialBoard);
    this.player1 = new Player(scene, 1, PlayerState.ChoosePiece, [-4, -4, 0], materialBox1, materialPieces1);
    this.player2 = new Player(scene, 2, PlayerState.Wait, [4, 4, 0], materialBox2, materialPieces2);

    this.gameState = GameState.Player1;
    this.gameSequence = new GameSequence();

	this.material = new CGFappearance(this.scene);
};

Game.prototype.logHistory = function() {
    this.gameSequence.show();
}

//Updates the Game
Game.prototype.update = function( dSec ){

}

//Sets the texture's coordinates (in this case this function does nothing)
Game.prototype.setTexCoords = function(length_t, length_s){
	
}



/**
 *  GAME MECHANICS
 */

Game.prototype.getCurrPlayer = function() {
     var player;
    switch(this.gameState) {
        case GameState.Player1:
            player = this.player1;
            break;
        case GameState.Player2:
            player = this.player2;
            break;
        default:
            player = null;
            break;
    }
    return player;
}

Game.prototype.changeState = function() {
        switch( this.gameState ) {
            case GameState.Player1:
                this.gameState = GameState.Player2;
                break;
            case GameState.Player2:
                this.gameState = GameState.Player1;
                break;
            default:
                return;
        }

        //The one that is in the state ChooseTile changes to the state Wait
        //The other changes from the state Wait to ChoosePiece
        this.player1.changeState();
        this.player2.changeState();
}

Game.prototype.confirmTile = function(obj, player) {
    //Check if selected tile is the same as the one that was confirmed
    if( obj.id == this.gameBoard.selectedTile.id ) {
        this.gameSequence.makeMove(player, player.selectedPiece, player.selectedTile, this.gameBoard.selectedTile);

        player.placedPiece();
        this.changeState();
    //If the tile is not the same then go back to choosing a tile
    } else
        player.state = PlayerState.ChooseTile;
    //Either way the game board shouldn't end this function with a selected tile
    this.gameBoard.selectTile(null);

}

Game.prototype.chooseTile = function(tile, player) {
    console.debug(tile);
    this.gameBoard.selectTile(tile);
    player.changeState();
}

Game.prototype.pickObj = function(obj) {
    var player = this.getCurrPlayer();
    if( player == null ) //For debug purposes if a bug comes up
        throw new Error("Game is corrupted");

    if( player.state == PlayerState.TileConfirmation) {
        this.confirmTile(obj, player)
    } else if( player.state == PlayerState.ChooseTile ) {
        this.chooseTile(obj, player);
    } else {
        if( player.pickObj(obj) )
            player.changeState();
    }
}

Game.prototype.undoMove = function() {
    var player = this.getCurrPlayer();
    this.gameSequence.undoMove(player);
}


/**
 *  DISPLAY FUNCTIONS
 */

Game.prototype.registerForPick = function() {
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0.2);
    if( this.player1.state == PlayerState.ChoosePiece || 
        this.player1.state == PlayerState.PieceConfirmation )
        this.player1.pieces.registerForPick();

    else if( this.player2.state == PlayerState.ChoosePiece || 
             this.player2.state == PlayerState.PieceConfirmation )
        this.player2.pieces.registerForPick();

    else if( this.player1.state == PlayerState.ChooseTile || 
            this.player1.state == PlayerState.TileConfirmation || 
            this.player2.state == PlayerState.ChooseTile || 
            this.player2.state == PlayerState.TileConfirmation )
        this.gameBoard.registerForPick();
    this.scene.popMatrix();
}

//Displays the Game with the respective shader
Game.prototype.display = function(){
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0.2);
    this.gameBoard.display();
    this.player1.pieces.display();
    this.player2.pieces.display();
    this.scene.popMatrix();
}