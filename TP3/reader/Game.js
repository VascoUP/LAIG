/**
	Game's constructor
*/
function Game(scene) {
    this.scene = scene;

    this.gameBoard = new GameBoard(scene);
    this.gameBoard.log();
    this.aux1 = new AuxiliarBoard(scene);
    this.aux1.log();
    this.aux2 = new AuxiliarBoard(scene);
    this.aux2.log();
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

Game.prototype.registerForPick = function(id){
    return nId = this.aux1.registerForPick(id);
}

//Displays the Game with the respective shader
Game.prototype.display = function(){
    this.aux1()
}