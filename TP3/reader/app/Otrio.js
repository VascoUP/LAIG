function Otrio(){

	this.client = new Client();

	this.plogBoard = null;
}

Otrio.prototype.constructor = Otrio;

Otrio.prototype.getPlogBoard = function(){
  var otrio = this;

  this.client.getPrologRequest("board", function(data) {
    otrio.plogBoard = data.target.responseText;
  });
}