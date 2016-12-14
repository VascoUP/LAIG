/**
	Game's constructor
*/

var GameState = {    
    Player1 : 0,
    Player2 : 1,
    Transition : 2
};

var PlayerState = {
    ChoosePiece : 0,
    ChooseTile : 1,
    Wait : 2
};

function Game(scene) {
    this.scene = scene;

    this.gameBoard = new GameBoard(scene);
    this.player1 = new Player(scene, 1, PlayerState.ChoosePiece, [0, -2, 0]);
    this.player2 = new Player(scene, 2, PlayerState.Wait, [0, 2, 0]);

    this.gameState = GameState.Player1;
};

//Updates the Game
Game.prototype.update = function( dSec ){

}

//Sets the texture's coordinates (in this case this function does nothing)
Game.prototype.setTexCoords = function(length_t, length_s){
	
}

/*
        display
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