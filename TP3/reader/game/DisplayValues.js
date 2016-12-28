function DisplayValues(scene, initialNumber) {
	CGFobject.call(this,scene);

	this.textures = [];
    
	this.saveTexture();
}

DisplayValues.prototype = Object.create(CGFobject.prototype);
DisplayValues.prototype.constructor = DisplayValues;

DisplayValues.prototype.saveTextures = function() {
	
	for(var i = 0; i < 10; i++){
		var textPath = "resources\number" + i + ".png";
		this.textures[i] = new CGFtexture(scene, textPath);
	}
}

DisplayValues.prototype.display = function() {
		
};

DisplayValues.prototype.setValue = function(value) {
    
};


DisplayValues.prototype.update = function(currTime) {
		
};