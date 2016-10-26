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

	return true;
};

//Updates and creates the lights' interface
MyInterface.prototype.updateLights = function(nLights, lights, lightType) {
	var omniLights = this.gui.addFolder( 'Omni Lights' );
	var spotLights = this.gui.addFolder( 'Spot Lights' );
	
	var countOmni = 0, countSpot = 0;
	
	for(var i = 0; i < nLights; i++){
		//Creates the "omni" lights
		if(lightType[i+1] == 'omni'){
			countOmni++;
			var omni = omniLights.addFolder( 'Omni ' + countOmni);
			omni.add(lights[i], 'enabled');
		}
		
		//Creates the "spot" lights
		else{
			countSpot++;
			var spot = spotLights.addFolder( 'Spot ' + countSpot);
			spot.add(lights[i], 'enabled');
		}
	}
}

MyInterface.prototype.processKeyboard = function(event) {
	
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