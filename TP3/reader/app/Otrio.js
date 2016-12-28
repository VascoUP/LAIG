const MaxSeconds = 5;

function Otrio(){
	this.counter = 0;
	this.responseReceived = false;
	this.waitingResponse = false;
	this.client = new Client("Starting Otrio ...");
}

Otrio.prototype.constructor = Otrio;

Otrio.prototype.getPlayerMove = function(board, line, column, pair, player, mv, mv2){
	var otrio = this;
	this.waitingResponse = true;

	this.client.getPrologRequest("next_cicle(" + board + "," + line + "," + column + "," +  pair + "," 
								+ player + "," + mv + "," + mv2 + ")", function(data) {	
		otrio.playerMove = data.target.response;
		otrio.waitingResponse = false;
		otrio.responseReceived = true;
	});
}

Otrio.prototype.getComputerMove = function(difficulty, board, mV, player, mV2) {
	var otrio = this;
	this.waitingResponse = true;

	this.client.getPrologRequest("e_play(" + difficulty + "," + board + "," + mV + "," + player
								+ "," + mv2 + ")", function(data) {
		otrio.computerPlaying = data.target.response;
		otrio.waitingResponse = false;
		otrio.responseReceived = true;
	});
}

Otrio.prototype.getEndGame = function(board, player) {
	var otrio = this;
	this.waitingResponse = true;

	this.client.getPrologRequest("end_game(" + board + "," + player + ")", function(data) {
		otrio.endGame = data.target.response;
		otrio.waitingResponse = false;
		otrio.responseReceived = true;
	});
}

Otrio.prototype.getChangeTurn = function(replay, board, player, nPlayer, nMV1, nMV2, modeGame1, modeGame2) {
	var otrio = this;
	this.waitingResponse = true;
	
	this.client.getPrologRequest("change_turn(" + replay + "," + board + "," + player + "," +
									nPlayer + "," + nMV1 + "," + nMV2 + "," + modeGame1 + "," +
									modeGame2 + ")", function(data) {
		otrio.playerTurn = data.target.response;
		otrio.waitingResponse = false;
		otrio.responseReceived = true;
	});
}