function TransformationInfo(id) {
	this.id = id;
	this.transforms = [];
}

TransformationInfo.prototype.addTransform = function( type, arr ) {
	var t = new Transform(type);
	t.setMatrix(arr);

	this.transforms.push(t);
};

function Transform(type) {
	this.type = type;
}

Transform.prototype.setMatrix = function( arr ) {
	if( this.type == 'rotate' && arr.length != 2 || this.type != 'rotate' && arr.length != 3 )
		return ;
	else
		this.matrix = arr;
};