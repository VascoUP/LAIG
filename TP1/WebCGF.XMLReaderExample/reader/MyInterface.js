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

	return true;
};

MyInterface.prototype.updateLights = function(nLights, lights, lightType) {
	var omniLights = this.gui.addFolder( 'Omni Lights' );
	var spotLights = this.gui.addFolder( 'Spot Lights' );
	
	for(var i = 0; i < nLights; i++){
		if(lightType[i+1] == 'omni'){
			var omni = omniLights.addFolder( 'Omni ' + (i+1));
			omni.add(lights[i], 'enabled');
		}
			
		else{
			var spot = spotLights.addFolder( 'Spot ' + (i+1));
			spot.add(lights[i], 'enabled');
		}
	}
}


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
			this.scene.changeMaterial();
			break;
		case (86): 		// V key
			this.scene.changeView();
			break;
		
	};	
};