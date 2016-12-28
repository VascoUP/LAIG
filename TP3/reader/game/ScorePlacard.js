function ScorePlacard(scene) {
	CGFobject.call(this,scene);

	this.placard = new Rectangle(scene, 0, 0, 10, 10);
	this.timePlay = new DisplayValues(scene, 60);
	this.redScore = new DisplayValues(scene, 0);
	this.blueScore = new DisplayValues(scene, 0);

  	this.scorePlacard = new CGFappearance(scene);
	this.scorePlacard.loadTexture("resources\scorePlacard.png");
}

ScorePlacard.prototype = Object.create(CGFobject.prototype);
ScorePlacard.prototype.constructor = ScorePlacard;


ScorePlacard.prototype.display = function() {
	this.scorePlacard.apply();
	this.placard.display();
	this.timePlay.display();
	this.redScore.display();
	this.blueScore.display();
};


ScorePlacard.prototype.updateTime = function(newTime) {
    this.timePlay.update(newTime);
};

ScorePlacard.prototype.resetTime = function() {
    this.timePlay.setValue(61);
};

ScorePlacard.prototype.getTime = function() {
   
};

ScorePlacard.prototype.redWinner = function() {
    this.redScore++;
};

ScorePlacard.prototype.blueWinner = function() {
    this.blueScore++;
};
