function Graph (sceneGraph) {
	this.sceneGraph = sceneGraph;
	this.idHead = 0;
	this.nodes = {};
}

Graph.prototype.addNode = function( id, node ) {
	this.nodes[id] = node;
	node.graph = this;
};

Graph.prototype.connectedGraph = function( ) {

	var head = this.nodes[this.idHead];
	if( head == undefined )
		return "Couldn't find root node";

	if( this.connectedGraphNode( head ) )
		return "Error -> Couldn't find one of the nodes/primitives";

	for( var id in this.nodes ) {
		if( !this.nodes[id].visited )
			return "Error -> This graph is not connected (node = " + id + ")";
	}
}

Graph.prototype.connectedGraphNode = function( node, texture ) {
	node.visited = true;

	for( var i = 0; i < node.idChildren.length; i++ ) {
		var n = this.nodes[node.idChildren[i]];
		if( n == undefined || this.connectedGraphNode( n, node.texture ) )
			return true;
	}

	for( var i = 0; i < node.idPrimitives.length; i++ ) {
		if(this.sceneGraph.primitives[ node.idPrimitives[i] ] == undefined)
			return true;
	}

	// On success returns false
	return false;
}

Graph.prototype.applyTransformation = function( node ) {
	var arr = node.transformation.transforms;

	for( var i = 0; i < arr.length; i++ ) {
		switch(arr[i].type) {
			case 'rotate':
			this.sceneGraph.scene.rotate( arr[i].matrix[0], arr[i].matrix[1], arr[i].matrix[2] );
			break;
			case 'scale':
			this.sceneGraph.scene.scale( arr[i].matrix[0], arr[i].matrix[1], arr[i].matrix[2], arr[i].matrix[3] );
			break;
			case 'translate':
			this.sceneGraph.scene.translate( arr[i].matrix[0], arr[i].matrix[1], arr[i].matrix[2], arr[i].matrix[3] );
			break;
		}
	}
}

Graph.prototype.drawScene = function( ) {
	var head = this.nodes[this.idHead];
	if( head == undefined )
		return ;
	this.drawSceneNode( head );
}

Graph.prototype.drawSceneNode = function( node ) {
	this.sceneGraph.scene.pushMatrix();

	/* 
		Find the material id in the materials array 
	*/
	var mat = this.sceneGraph.materials[ node.idMaterials[node.currMaterialIndex] ];

	this.applyTransformation(node);

	for( var i = 0; i < node.idChildren.length; i++ )
		this.drawSceneNode( this.nodes[node.idChildren[i]] );

	if( mat != 'inherit' )
		mat.apply();

	for( var i = 0; i < node.idPrimitives.length; i++ ) {
		var prim = this.sceneGraph.primitives[ node.idPrimitives[i] ];
		prim.display();
	}

	this.sceneGraph.scene.popMatrix();
}

function Node (id) {
	this.idChildren = [];
	this.idPrimitives = [];
	this.idMaterials = [];
	this.texture;

	this.currMaterialIndex = 0;
	this.visited = false;
}

Node.prototype.setTransformationId = function( transformationId ) {
	this.transformationId = transformationId;
}

Node.prototype.addTransform = function( type, arr ) {
	if( this.transformation == undefined ) 
		this.transformation = new TransformationInfo();
	this.transformation.addTransform(type, arr);
}

Node.prototype.setTransformation = function( transformation ) {
	this.transformation = transformation;
}

Node.prototype.setTexture = function( textureId ) {
	this.texture = textureId;
}

Node.prototype.addIdMaterial = function( id ) {
	this.idMaterials.push( id );
}

Node.prototype.addIdChildren = function( id ) {
	this.idChildren.push( id );
}

Node.prototype.addIdPrimitive = function( id ) {
	this.idPrimitives.push(id);
}