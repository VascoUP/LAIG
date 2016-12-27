function Otrio(){

	this.client = new Client("Starting Otrio ...");
	
	this.nextCicle = null;
	this.computerPlaying = null;
	this.endGame = null;
	this.playerTurn = null;
	
}

Otrio.prototype.constructor = Otrio;

Otrio.prototype.getNextCicle = function(board, line, column, pair, player, mv, mv2){
	var otrio = this;
	this.client.getPrologRequest("next_cicle(" + board + "," + line + "," + column + "," +  pair + "," 
								+ player + "," + mv + "," + mv2 + ")", function(data) {
		otrio.nextCicle = data.target.responseText;
		console.debug(otrio.nextCicle);
	});
	
	return otrio.nextCicle;
}

Otrio.prototype.getComputerMode = function(difficulty, board, mV, player, mV2) {
	var otrio = this;
	this.client.getPrologRequest("e_play(" + difficulty + "," + board + "," + mV + "," + player
								+ "," + mv2 + ")", function(data) {
		otrio.computerPlaying = data.target.responseText;
	});
	
	return otrio.computerPlaying;
}

Otrio.prototype.getEndGame = function(board, player) {
	var otrio = this;
	this.client.getPrologRequest("end_game(" + board + "," + player + ")", function(data) {
		otrio.endGame = data.target.responseText;
	});
	
	return otrio.endGame;
}

Otrio.prototype.getPlayerTurn = function(board, player, modeGame1, modeGame2) {
	var otrio = this;
	
	var arrayNextCicle = this.getNextCicle();
	
	var replay = arrayNextCicle[4];
	var nPlayer = arrayNextCicle[1];
	var nMV1 = arrayNextCicle[2];
	var nMV2 = arrayNextCicle[3];
	
	this.client.getPrologRequest("change_turn(" + replay + "," + board + "," + player + "," +
									nPlayer + "," + nMV1 + "," + nMV2 + "," + modeGame1 + "," +
									modeGame2 + ")", function(data) {
		otrio.playerTurn = data.target.responseText;
	});
	
	return otrio.playerTurn;
}