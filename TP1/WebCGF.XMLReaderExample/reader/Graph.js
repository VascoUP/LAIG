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
		return "Error -> Couldn't find at least one component element";

	for( var id in this.nodes ) {
		if( !this.nodes[id].visited )
			return "Error -> This graph is not connected (node = " + id + ")";
	}
}

Graph.prototype.connectedGraphNode = function( node, texture ) {
	node.visited = true;

	for( var i = 0; i < node.idChildren.length; i++ ) {
		var n = this.nodes[node.idChildren[i]];
		if( n == undefined ) {
			console.error("Node " + node.idChildren[i] + " not found.");
			return true;
		}

		if( this.connectedGraphNode( n, node.texture ) )
			return true;
	}

	for( var i = 0; i < node.idPrimitives.length; i++ ) {
		if(this.sceneGraph.primitives[ node.idPrimitives[i] ] == undefined) {
			console.error("Primitive " + node.idPrimitives[i] + " not found.");
			return true;
		}
	}

	var mat = this.sceneGraph.materials[ node.idMaterials[node.currMaterialIndex] ];
	if( node.idMaterials[node.currMaterialIndex] != 'inherit' && mat == undefined ) {
		console.error("Material " + node.idMaterials[node.currMaterialIndex] + " not found.");
		return true;
	}

	// On success returns false
	return false;
}

Graph.prototype.applyTransformation = function( node ) {

	var matrix;
	if( node.transformation == undefined )
		matrix = this.sceneGraph.transformations[ node.transformation.transformationId ];
	else
		matrix = node.transformation;
	console.debug(matrix);
	this.sceneGraph.scene.multMatrix( matrix );
/*
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
*/
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

	if( node.idMaterials[node.currMaterialIndex] != 'inherit' )
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
	this.idTexture;

	this.currMaterialIndex = 0;
	this.visited = false;
}

Node.prototype.setTransformationId = function( transformationId ) {
	this.transformationId = transformationId;
}

Node.prototype.addTransform = function( type, arr ) {
	if( this.transformation == undefined ) 
		this.transformation = mat4.create();

	switch(type) {
		case 'rotate':
		mat4.rotate( this.transformation, this.transformation, arr[0], arr[1] == 'x' ? [1, 0, 0] : arr[1] == 'y' ? [0, 1, 0] : [0, 0, 1] );
		break;
		case 'scale':
		mat4.scale( this.transformation, this.transformation, arr );
		break;
		case 'translate':
		mat4.translate( this.transformation, this.transformation, arr );
		break;
	}

	console.debug(this.transformation);

	//this.transformation.addTransform(type, arr);
}

Node.prototype.setTransformation = function( transformation ) {
	this.transformation = transformation;
}

Node.prototype.setIdTexture = function( idTexture ) {
	this.idTexture = idTexture;
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