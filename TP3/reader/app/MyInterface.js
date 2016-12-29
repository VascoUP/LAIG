//Interface's constructor
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	this.gui = new dat.GUI();
	
	this.createMenu();

	return true;
};

MyInterface.prototype.createMenu = function(){
	/*var mode = { mode:function(){ console.log("clicked") }};
	var undo = { undo:function(){ console.log("clicked") }};
	var redo = { redo:function(){ console.log("clicked") }};
	var fgfg = { fgfg:function(){ console.log("fgergertg") }};
	
	this.gui.add(this.scene.game,'play').name("Play Game");
	this.gui.add(mode, 'mode', { 'Human vs Human' : 0, 'Human vs PC': 1, 'PC vs PC': 2 }).name("Game Mode");
	this.gui.add(undo,'undo').name("Undo");
	this.gui.add(redo,'redo').name("Redo");
	this.gui.add(this.scene.game,'quit').name("Quit");
	this.gui.add(fgfg,'fgfg').name("fgfg");
	this.gui.remove();*/
	this.gui.add(this.scene, 'changeScene').name("Change Scene");

	this.scene.game.changeButtons();
};

MyInterface.prototype.processKeyboard = function(event) {
	
	CGFinterface.prototype.processKeyUp.call(this, event);

	//If lower case letter than calculate its upper case equal
	var code = (event.keyCode >= 97 && event.keyCode <= 122)? event.keyCode - 32 : event.keyCode;
	code = (code >= 97 && code <= 122) ? code - 32 : code;

	switch (String.fromCharCode(code))
	{
		case ("M"):
			this.scene.changeMaterial();
			break;
		case ("V"):
			this.scene.changeView();
			break;
		case ("Q"):
			this.scene.game.logHistory();
			break;
		case ("U"):
			this.scene.game.undoMove();
			break;
	};	
};