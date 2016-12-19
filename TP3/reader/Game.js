var GameState = {    
    Player1 : 0,
    P1ToP2 : 1,
    Player2 : 2,
    P2ToP1 : 3
};

var PlayerState = {
    ChoosePiece : 0,
    ChooseTile : 1,
    Wait : 2
};


/**
 *  Game's constructor
 */
function Game(scene) {
    this.scene = scene;

    this.gameBoard = new GameBoard(scene);
    this.player1 = new Player(scene, 1, PlayerState.ChoosePiece, [0, -2.5, 0]);
    this.player2 = new Player(scene, 2, PlayerState.Wait, [0, 2.5, 0]);

    this.gameState = GameState.Player1;
};

//Updates the Game
Game.prototype.update = function( dSec ){

}

//Sets the texture's coordinates (in this case this function does nothing)
Game.prototype.setTexCoords = function(length_t, length_s){
	
}

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

Game.prototype.pickObj = function(id, obj) {
    var player = this.getCurrPlayer();
    if( player == null )
        return ;

    if( player.state == PlayerState.ChooseTile ) {
        // Do something on the game board
        if( !obj.addPiece(player.selectedPiece) ) {
            console.debug("Couldnt place piece");
            return ;
        }
        player.placePiece();
        this.changeState();
    } else {
        player.pickObj(id, obj);
        player.changeState();
    }
}



/**
 *  DISPLAY FUNCTIONS
 */

Game.prototype.registerForPick = function() {
    if( this.player1.state == PlayerState.ChoosePiece )
        this.player1.pieces.registerForPick();

    else if( this.player2.state == PlayerState.ChoosePiece )
        this.player2.pieces.registerForPick();

    else if( this.player1.state == PlayerState.ChooseTile || 
            this.player2.state == PlayerState.ChooseTile)
        this.gameBoard.registerForPick();
}

//Displays the Game with the respective shader
Game.prototype.display = function(){
    this.gameBoard.display();
    this.player1.pieces.display();
    this.player2.pieces.display();
}