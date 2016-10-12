/**
 * MyInterface
 * @constructor
 */
 
 
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	this.gui = new dat.GUI();	

	//ver erro!!!
	/*for(var i = 0; i < this.scene.graph.nLights; i++) {
		var groupLights = this.gui.addFolder ( 'Light '+ (i+1) );
		groupLights.add(this.scene, 'enabled');
		groupLights.add(this.scene, 'disabled');
	}*/
	
	return true;
};



/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyUp = function(event) {
	
	CGFinterface.prototype.processKeyUp.call(this, event);

	//If lower case letter than calculate its upper case equal
	var code = (event.keyCode >= 97 && event.keyCode <= 122)? event.keyCode - 32 : event.keyCode;
	code = (code >= 97 && code <= 122) ? code - 32 : code;

	switch (code)
	{
		case (77): 		// M key
			this.scene.changeViews();
			break;
		case (86): 		// V key
			//this.scene.
			break;
		
	};	
};

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyDown = function(event) {

	CGFinterface.prototype.processKeyDown.call(this, event);
	
	//If lower case letter than calculate its upper case equal
	var code = (event.keyCode >= 97 && event.keyCode <= 122)? event.keyCode - 32 : event.keyCode;
	code = (code >= 97 && code <= 122) ? code - 32 : code;

	switch (code)
	{
		case (77): 		// M key
			this.scene.changeViews();
			break;
		case (86): 		// V key
			//this.scene.drone.turn( -1 );
			break;
	};	
};

