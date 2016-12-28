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

		console.debug(data);
		console.debug(otrio.waitingResponse);
		console.debug(otrio.responseReceived);
	});
}

Otrio.prototype.getComputerMove = function(difficulty, board, mV, player, mV2) {
	var otrio = this;
	this.waitingResponse = true;

	this.client.getPrologRequest("e_play(" + difficulty + "," + board + "," + mV + "," + player
								+ "," + mv2 + ")", function(data) {
		otrio.computerPlaying = JSON.parse(data.target.responseText);
		otrio.waitingResponse = false;
		otrio.responseReceived = true;
	});
	
	return otrio.computerPlaying;
}

Otrio.prototype.getEndGame = function(board, player) {
	var otrio = this;
	this.waitingResponse = true;

	this.client.getPrologRequest("end_game(" + board + "," + player + ")", function(data) {
		otrio.endGame = JSON.parse(data.target.responseText);
		otrio.waitingResponse = false;
		otrio.responseReceived = true;
	});
	
	return otrio.endGame;
}

Otrio.prototype.getChangeTurn = function(board, player, modeGame1, modeGame2) {
	var otrio = this;
	this.waitingResponse = true;
	
	/*var arrayNextCicle = this.getNextCicle();
	
	var replay = arrayNextCicle[4];
	var nPlayer = arrayNextCicle[1];
	var nMV1 = arrayNextCicle[2];
	var nMV2 = arrayNextCicle[3];*/
	
	this.client.getPrologRequest("change_turn(" + replay + "," + board + "," + player + "," +
									nPlayer + "," + nMV1 + "," + nMV2 + "," + modeGame1 + "," +
									modeGame2 + ")", function(data) {
		otrio.playerTurn = JSON.parse(data.target.responseText);
		otrio.waitingResponse = false;
		otrio.responseReceived = true;
	});
	
	return otrio.playerTurn;
}