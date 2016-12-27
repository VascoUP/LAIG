function Otrio(scene){

	this.client = new Client("Starting Otrio ...");
	this.scene = scene;
	this.game = this.scene.game;

}

Otrio.prototype.constructor = Otrio;

Otrio.prototype.getCoordinates = function(){
	var tile = this.game.gameBoard.selectedTile;
	
	this.board.line = Math.floor((tile.id - 1) / numTilesBoard); //numTilesBoard = 3
    this.board.column = (tile.id - 1) - (this.board.line * numTilesBoard);
}

Otrio.prototype.getInformation = function(){
	this.board = this.game.gameBoard;
	this.player = this.game.getCurrPlayer;
	
	if(this.player.id == 1){
		this.playerLetter = 'r';
		this.mV = this.player.pieces;
		this.mv2 = this.game.player2.pieces;
	}
	else{
		this.playerLetter = 'b';
		this.mV = this.player.pieces;
		this.mv2 = this.game.player1.pieces;
	}
	
	this.piece = this.player.selectedPiece.type; 
}

Otrio.prototype.getNextCicle = function(){
	var otrio = this;
	getCoordinates();
	getInformation();
	this.client.getPrologRequest("next_cicle(" + this.board + "," + this.board.line + "," + this.board.column + ",(" +  this.playerLetter + "," 
								+ this.piece + ")," + this.player + "," + this.mv + "," + this.mv2 + ")", function(data) {
		otrio.nextCicle = data.target.responseText;
	});
}

Otrio.prototype.getComputerMode = function(difficulty) {
	var otrio = this;
	getInformation();
	this.client.getPrologRequest("e_play(" + difficulty + "," + this.board + "," + this.mV + "," + this.player
								+ "," + this.mv2 + ")", function(data) {
		otrio.computerPlaying = data.target.responseText;
	});
}

Otrio.prototype.getEndGame = function() {
	var otrio = this;
	this.client.getPrologRequest("end_game(" + this.board + "," + this.player + ")", function(data) {
		otrio.endGame = data.target.responseText;
	});
}

Otrio.prototype.getPlayerTurn = function() {
	var otrio = this;
	this.client.getPrologRequest("change_turn", function(data) {
		otrio.playerTurn = data.target.responseText;
	});
}