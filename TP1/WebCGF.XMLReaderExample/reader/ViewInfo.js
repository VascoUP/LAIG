function ViewInfo(id, near, far, angle) {
	this.id = id;
	this.near = near;
	this.far = far;
	this.angle = angle;
}

ViewInfo.prototype.setFrom = function(x, y, z) {
	this.from = vec3.fromValues(x, y, z);
}

ViewInfo.prototype.setTo = function(x, y, z) {
	this.to = vec3.fromValues(x, y, z);
}