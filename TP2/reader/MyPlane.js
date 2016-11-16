function MyPlane(scene, dimX, dimY, partsX, partsY) {
    this.scene = scene;
	
    this.dimX = dimX;
	this.dimY = dimY;
	this.partsX = partsX;
	this.partsY = partsY;
	
	this.controlPoints = createControlPoints();
	
	 this.texCoords = [	0,1,
						1,1,
						0,0,
						1,0
					  ];

	MyPatch.call(this, this.scene, 1, 1, this.partsX, this.partsY, this.controlPoints);
}

MyPlane.prototype = Object.create(CGFnurbsObject.prototype);
MyPlane.prototype.constructor = MyPlane;

var createControlPoints = function() {
	
	var controlPoints = [];
	var dimX2 = this.dimX / 2;
	var dimY2 = this.dimY / 2;
	
	//U = 0
	controlPoints.push([-dimX2, -dimY2, 0, 1]);
	controlPoints.push([-dimX2, dimY2, 0, 1]);
	
	//U = 1
	controlPoints.push([dimX2, -dimY2, 0, 1]);
	controlPoints.push([dimX2, dimY2, 0, 1]);	
	
	return controlPoints;   
};