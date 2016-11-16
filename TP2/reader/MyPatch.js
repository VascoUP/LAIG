function MyPatch(scene, orderU, orderV, partsU, partsV, controlPoints) 
{
	this.scene = scene;
	
	this.orderU = orderU; 
	this.orderV = orderV;
	this.partsU = partsU;
	this.partsV = partsV;
	this.controlPoints = controlPoints;

	this.patch = makeSurface();

	CGFnurbsObject.call(this, this.scene, this.patch, this.partsU, partsV);
};

MyPatch.prototype = Object.create(CGFnurbsObject.prototype);
MyPatch.prototype.constructor = MyPatch;

var getKnotsVector = function(degree) { 
	
	var v = new Array();
	for (var i=0; i<=degree; i++)
		v.push(0);
	
	for (var i=0; i<=degree; i++)
		v.push(1);
	
	return v;
}

var makeSurface = function () {
		
	var knotsU = getKnotsVector(this.orderU); 
	var knotsV = getKnotsVector(this.orderV);
		
	var nurbsSurface = new CGFnurbsSurface(this.orderU, this.orderv, knotsU, knotsV, this.controlPoints);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	return getSurfacePoint;		
}

/*
var getControlPoints = function(controlPoints)
{
	var newControlPoints = [];
	for(var i = 0; i <= this.orderU; i++)
	{
		var subArray = [];
		for(let j = 0; j <= this.orderV; j++)
		{
			var newControlPoint = controlPoints[i*(this.orderV + 1) + j];
			newControlPoint.push(1);
			subArray.push(newControlPoint);
		}
		newControlPoints.push(subArray);
	}
	
	return newControlPoints;
}*/