function Otrio(){

	this.client = new Client();

	this.plogBoard = null;
	this.playerCoordinates = null;
	this.playerTurn = nul;
	
	this.piece = null;
	this.coords = null;
	
	this.computerPlaying = null;
	this.analyzeBoard = null;
	
	this.tier = null;
	this.win = null;
	
	this.options = null;
}

Otrio.prototype.constructor = Otrio;

Otrio.prototype.getPlogBoard = function(){
  var otrio = this;

  this.client.getPrologRequest("board", function(data) {
    otrio.plogBoard = data.target.responseText;
  });
}

Otrio.prototype.getPlayerCoordinates = function(){
	var otrio = this;
	this.client.getPrologRequest("p_play", function(data) {
		otrio.playerCoordinates = data.target.responseText;
	});
}

Otrio.prototype.getPlayerTurn = function(){
	var otrio = this;
	this.client.getPrologRequest("next_player", function(data) {
		otrio.playerTurn = data.target.responseText;
	});
}

Otrio.prototype.getPiece = function() {
	var otrio = this;
	this.client.getPrologRequest("ask_piece", function(data) {
		otrio.piece = data.target.responseText;
	});
}

Otrio.prototype.getCoords = function() {
	var otrio = this;
	this.client.getPrologRequest("ask_coords", function(data) {
		otrio.coords = data.target.responseText;
	});
}

Otrio.prototype.getComputerMode = function() {
	var otrio = this;
	this.client.getPrologRequest("e_play", function(data) {
		otrio.computerPlaying = data.target.responseText;
	});
}

Otrio.prototype.getBoardAnalyze = function() {
	var otrio = this;
	this.client.getPrologRequest("analyze_board", function(data) {
		otrio.analyze_board = data.target.responseText;
	});
}

Otrio.prototype.getTier = function() {
	var otrio = this;
	this.client.getPrologRequest("play_tier", function(data) {
		otrio.tier = data.target.responseText;
	});
}

Otrio.prototype.getNextWin = function() {
	var otrio = this;
	this.client.getPrologRequest("next_win", function(data) {
		otrio.win = data.target.responseText;
	});
}

Otrio.prototype.getOptions = function() {
	var otrio = this;
	this.client.getPrologRequest("has_options", function(data) {
		otrio.options = data.target.responseText;
	});
}

