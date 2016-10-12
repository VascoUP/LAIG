function TextureInfo(id, file, length_t, length_s) {
	this.id = id;
	this.file = file;
	this.length_t = length_t;
	this.length_s = length_s;
}

TextureInfo.prototype.setLength = function(length_t, length_s) {
	this.length_t = length_t;
	this.length_s = length_s;
}