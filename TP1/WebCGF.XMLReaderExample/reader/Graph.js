function Graph (sceneGraph) {
	this.sceneGraph = sceneGraph;
	this.idHead = 0;
	this.nodes = [];
}

Graph.prototype.addNode = function( node ) {
	this.nodes.push(node);
	node.graph = this;
};

Graph.prototype.connectedGraph = function( ) {
	var i;
	for( var i = 0; i < this.nodes.length; i++ ) {
		if( this.idHead == this.nodes[i].id ) {
			if( this.connectedGraphNode( this.nodes[i], this.nodes[i].texture ) == -1 )
				return "Error -> Couldn't find one of the nodes/primitives";
			break;
		}
	}

	if( i == this.nodes.length )
		return "Couldn't find root node to draw the scene";

	for( var i = 0; i < this.nodes.length; i++ ) {
		if( !this.nodes[i].visited ) {
			return "Error -> This graph is not connected (node = " + this.nodes[i].id + ")";
		}
	}
}

Graph.prototype.connectedGraphNode = function( node, texture ) {
	node.visited = true;
	for( var i = 0; i < node.idChildren.length; i++ ) {
		var j;
		for( j = 0; j < this.nodes.length; j++ )
			if( node.idChildren[i] == this.nodes[j].id ) 
				break;

		if( j == this.nodes.length || this.connectedGraphNode( n, node.texture ) == -1 )
			return -1;
	}

	for( var i = 0; i < node.idPrimitives.length; i++ ) {
		if(this.sceneGraph.primitives[ node.idPrimitives[i] ] == undefined)
			return -1;
	}

	return 0;
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
	var i;
	for( i = 0; i < this.nodes.length; i++ ) {
		if( this.idHead == this.nodes[i].id ) {
			this.drawSceneNode( this.nodes[i] );
			break;
		}
	}
}

Graph.prototype.drawSceneNode = function( node ) {
	this.sceneGraph.scene.pushMatrix();

	/* 
		Find the material id in the materials array 
	*/
	var mat = this.sceneGraph.materials[ node.idMaterials[node.currMaterialIndex] ];
	if( mat != 'inherit' )
		mat.apply();

	this.applyTransformation(node);

	for( var i = 0; i < node.idChildren.length; i++ ) {
		var n;
		for( var j = 0; j < this.nodes.length; j++ ) {
			if( node.idChildren[i] == this.nodes[j].id )
				n = this.nodes[j];
		}

		this.drawSceneNode( n );
	}

	for( var i = 0; i < node.idPrimitives.length; i++ ) {
		var prim = this.sceneGraph.primitives[ node.idPrimitives[i] ];
		prim.display();
	}

	this.sceneGraph.scene.popMatrix();
}

function Node (id) {
	this.id = id;
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

Node.prototype.addChildren = function( id ) {
	this.idChildren.push( id );
}

Node.prototype.addIdPrimitive = function( id ) {
	this.idPrimitives.push(id);
}