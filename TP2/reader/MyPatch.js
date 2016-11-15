function MyPatch(scene, orderU, orderV, partsU, partsV, controlPoints) 
{
	CGFobject.call(this,scene);
	
	this.scene = scene;
	
	this.orderU = orderU; 
	this.orderV = orderV;
	this.partsU = partsU;
	this.partsV = partsV;
	this.controlPoints = this.createControlPoints(controlPoints);
	
	this.patch = this.makeSurface();	
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor=MyPatch;

MyPatch.prototype.getKnotsVector = function(degree) { 
	
	var v = new Array();
	for (var i=0; i<=degree; i++)
		v.push(0);
	
	for (var i=0; i<=degree; i++)
		v.push(1);
	
	return v;
}

MyPatch.prototype.makeSurface = function () {
		
	var knotsU = this.getKnotsVector(this.orderU); 
	var knotsV = this.getKnotsVector(this.orderV);
		
	var nurbsSurface = new CGFnurbsSurface(this.orderU, this.orderv, knotsU, knotsV, this.controlPoints);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	return new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);		
}

MyPatch.prototype.createControlPoints = function(controlPoints)

 //segundo o lightScene fornecido, os control vertexes sao um array, de array, de array
{
	var control = [];
	
	for(var i = 0; i <= this.orderU; i++){
		var controlPoint = [];
		
		for(var j = 0; j <= this.orderV; j++){
			controlPoint.push(controlPoints[j]);
    
		control.push(controlPoint);
  }

  return control;
}