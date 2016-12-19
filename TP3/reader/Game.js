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
function Game(scene, material1, material2) {
    this.scene = scene;

    this.gameBoard = new GameBoard(scene);
    this.player1 = new Player(scene, 1, PlayerState.ChoosePiece, [0, -2.5, 0], material1);
    this.player2 = new Player(scene, 2, PlayerState.Wait, [0, 2.5, 0], material2);

    this.gameState = GameState.Player1;

	this.material = new CGFappearance(this.scene);
};

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
    if( obj.id == this.gameBoard.selectedTileId ) {
        //Check if piece was added
        if( !obj.addPiece(player.selectedPiece) )
            //If not then that position was occupied, select other one
            player.state = PlayerState.ChooseTile;
        //If piece was added to the game board then remove it from the player's board
        else {
            player.placePiece();
            this.changeState();
        }
    //If the tile is not the same then go back to choosing a tile
    } else
        player.state = PlayerState.ChooseTile;
    //Either way the game board shouldn't end this function with a selected tile
    this.gameBoard.selectTile(null);

}

Game.prototype.chooseTie = function(id, player) {
        this.gameBoard.selectTile(id);
        player.changeState();
}

Game.prototype.pickObj = function(obj) {

    var player = this.getCurrPlayer();
    if( player == null ) //For debug purposes if a bug comes up
        throw new Error("Game is corrupted");

    if( player.state == PlayerState.TileConfirmation) {
        this.confirmTile(obj, player)
    } else if( player.state == PlayerState.ChooseTile ) {
        this.chooseTie(obj.id, player);
    } else {
        if( player.pickObj(obj.id) )
            player.changeState();
    }

}



/**
 *  DISPLAY FUNCTIONS
 */

Game.prototype.registerForPick = function() {
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
}

//Displays the Game with the respective shader
Game.prototype.display = function(){
    this.gameBoard.display();
    this.player1.pieces.display();
    this.player2.pieces.display();
}