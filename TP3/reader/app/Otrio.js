function Otrio(){

	this.client = new Client();

	this.nextCicle = null;
	this.computerPlaying = null;
	this.endGame = null;
	this.playerTurn = null;
}

Otrio.prototype.constructor = Otrio;

Otrio.prototype.getNextCicle = function(){
  var otrio = this;

  this.client.getPrologRequest("next__cicle", function(data) {
    otrio.nextCicle = data.target.responseText;
  });
}

Otrio.prototype.getComputerMode = function() {
	var otrio = this;
	this.client.getPrologRequest("e_play", function(data) {
		otrio.computerPlaying = data.target.responseText;
	});
}

Otrio.prototype.getEndGame = function() {
	var otrio = this;
	this.client.getPrologRequest("end_game", function(data) {
		otrio.endGame = data.target.responseText;
	});
}

Otrio.prototype.getPlayerTurn = function() {
	var otrio = this;
	this.client.getPrologRequest("change_turn", function(data) {
		otrio.playerTurn = data.target.responseText;
	});
}