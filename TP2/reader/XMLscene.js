//Scene's constructor
function XMLscene(myInterface) {
    CGFscene.call(this);
    this.myInterface = myInterface;
};

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.enableTextures(true);

	this.axis=new CGFaxis(this);

	this.materialRed = new CGFappearance(this);
    this.materialRed.setAmbient(1, 0, 0, 1);
    this.materialRed.setDiffuse(1, 0, 0, 1);
    this.materialRed.setSpecular(1, 0, 0, 1);    
    this.materialRed.setShininess(200);

    this.currentCamera = 0;

	var loaded = false;

	this.vehicle = new MyVehicle(this);

	/* 60 frames per second */
	this.setUpdatePeriod(1/60);
};

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	loaded = true;
	//Set axis length with the correspondent values
	this.axis = new CGFaxis(this, this.graph.axis_length);
	this.currentCamera = this.graph.default_view;

	for(var i = 0; i < this.graph.views.length; i++) {
		var v = this.graph.views[i];

		if( v.id == this.currentCamera ) {
			this.camera = new CGFcamera(v.angle, v.near, v.far, v.from , v.to);
			this.myInterface.setActiveCamera(this.camera);
		}
	}

	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

    for(var i = 0; i < this.graph.nLights; i++)
    	this.lights[i].setVisible(true);
	
	this.myInterface.updateLights(this.graph.nLights, this.lights, this.graph.lightType);
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk) {
		for(var i = 0; i < this.graph.nLights; i++)
			this.lights[i].update();
		//this.graph.graph.drawScene();
	}

	this.vehicle.display();
};

//Changes the cameras
XMLscene.prototype.changeView = function() {
	for(var i = 0; i < this.graph.views.length; i++) {
		if( this.graph.views[i].id == this.currentCamera ) {
			var indice;
			if( i == (this.graph.views.length-1) ) {
				indice = 0;
				this.currentCamera = this.graph.views[0].id;
			}
			
			else {
				indice = i + 1;
				this.currentCamera = this.graph.views[i+1].id;
			}
			
			this.camera = new CGFcamera(this.graph.views[indice].angle, this.graph.views[indice].near, this.graph.views[indice].far, this.graph.views[indice].from , this.graph.views[indice].to);
			this.myInterface.setActiveCamera(this.camera);
			break;
		}
	}
};

//Changes the materials
XMLscene.prototype.changeMaterial = function() {
	this.graph.graph.changeMaterials();
}


XMLscene.prototype.update = function( dTime ) {
	var dSec = dTime * Math.pow(10, -14);
	
	//Add cicle that iterates throught list of animations
	//...
	this.graph.graph.update(dSec);
}
