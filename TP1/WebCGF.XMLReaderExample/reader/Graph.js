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
	this.sceneGraph.scene.multMatrix( matrix );
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

Graph.prototype.changeMaterials = function() {
	for(var key in this.nodes)
		this.nodes[key].changeMaterial();
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

Node.prototype.changeMaterial = function() {
	for(var i = 0; i < this.idMaterials.length; i++){
		if(i == (this.idMaterials.length - 1))
			this.currMaterialIndex = 0;
		else
			this.currMaterialIndex++;
	}
}