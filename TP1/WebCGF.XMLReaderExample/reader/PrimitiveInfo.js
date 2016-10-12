function PrimitiveInfo(id) {
	this.id = id;
	this.type;
}

PrimitiveInfo.prototype.setRectangle = function(x1, y1, x2, y2) {
	this.rectangle = [x1, y1, x2, y2];
}

PrimitiveInfo.prototype.setTriangle = function(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	this.triangle = [x1, y1, z1, x2, y2, z2, x3, y3, z3];
}

PrimitiveInfo.prototype.setCylinder = function(base, top, heigth, slices, stack) {
	this.cylinder = [base, top, heigth, slices, stack];
}

PrimitiveInfo.prototype.setSphere = function(radius, slices, stack) {
	this.sphere = [radius, slices, stack];
}

PrimitiveInfo.prototype.setTorus = function(inner, outer, slices, loops) {
	this.torus = [inner, outer, slices, loops];
}