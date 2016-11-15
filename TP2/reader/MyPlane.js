function MyPlane(scene, dimX, dimY, partsX, partsY) {
	
	CGFobject.call(this,scene);

    this.scene = scene;
	
    this.dimX = dimX;
	this.dimY = dimY;
	this.partsX = partsX;
	this.partsY = partsY;
	
	this.controlPoints = [];

	this.patch = new MyPatch(this,scene, 1, 1, partsX, partsY, this.createControlPoints());
}

MyPlane.prototype = Object.create(CGFnurbsObject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.createControlPoints = function() {

	var dimX2 = this.dimX / 2;
	var dimY2 = this.dimY / 2;
	
	//Não sei se está certo, porque não sei se esta é a ordem dos pontos -> Mostrar ao Vasco o desenho que fiz
	//U = 0
	this.controlPoints.push([-dimX2, -dimY2, 0]);
	this.controlPoints.push([-dimX2, dimY2, 0]);
	
	//U = 1
	this.controlPoints.push([dimX2, -dimY2, 0]);
	this.controlPoints.push([dimX2, dimY2, 0]);	
	
	return controlPoints;   
};