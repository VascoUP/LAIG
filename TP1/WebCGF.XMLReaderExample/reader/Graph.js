function Graph (sceneGraph, idHead) {
	this.sceneGraph = sceneGraph;
	this.idHead = idHead;
	this.nodes = [];
}

Graph.prototype.addHead = function( node ) {
	this.head = node;
	this.addNode(node);
};

Graph.prototype.addNode = function( node ) {
	this.nodes.push(node);
};

Graph.prototype.connectedGraph = function( ) {
	for( var i = 0; i < this.nodes.length; i++ ) {
		if( this.idHead == this.nodes[i] ) {
			if( this.connectedGraph( this.nodes[i], this.nodes[i].texture ) == -1 )
				return -1;
			break;
		}
	}

	for( var i = 0; i < this.nodes.length; i++ ) {
		if( !this.nodes[i].visited ) {
			console.error("Components error: Node " + this.nodes[i].idChildren[i] + " not found");	
			return -1;
		}
	}

	return 0;
}

Graph.prototype.connectedGraph = function( node, texture ) {
	for( var i = 0; i < this.node.idChildren.length; i++ ) {
		var j;
		for( j = 0; j < this.nodes.length; j++ )
			if( this.node.idChildren[i] == this.nodes[j].id ) 
				break;

		if( j == this.nodes.length ) {
			console.error("Components error: Node " + this.node.idChildren[i] + " not found");	
			return -1;
		}
		
		this.nodes[j].visited = true;
		if( this.connectedGraph( n, node.texture ) == -1 )
			return -1;
	}

	for( var i = 0; i < this.node.primitives.length; i++ ) 
		this.node.primitives[i].display();

	return 0;
}

Graph.prototype.applyTransformation = function( node ) {
	var arr = node.transformation.transforms;

	for( var i = 0; i < arr.length; i++ ) {
		switch(arr[i]) {
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
	for( var i = 0; i < this.nodes.length; i++ ) {
		if( this.idHead == this.nodes[i].id ) {
			this.drawScene( this.nodes[i] );
			break;
		}
	}
}

Graph.prototype.drawScene = function( node ) {
	this.sceneGraph.scene.pushMatrix();

	/* 
		Find the material id in the materials array 
	*/
	for( var i = 0; i < this.sceneGraph.materials.length; i++ ) {
		if( this.sceneGraph.materials[i].id == node.materials[node.currMaterialIndex] )
			this.sceneGraph.materials[i].material.apply();
	}

	this.applyTransformation(node);

	for( var i = 0; i < this.node.idChildren.length; i++ ) {
		var n;
		for( var j = 0; j < this.nodes.length; j++ ) {
			if( this.node.idChildren[i] == this.nodes[j].id )
				n = this.nodes[j];
		}

		this.drawScene( n );
	}

	for( var i = 0; i < this.node.primitives.length; i++ ) 
		this.node.primitives[i].display();

	this.sceneGraph.scene.popMatrix();
}


function Node (id) {
	this.id = id;
	this.idCildren = [];
	this.primitives = [];
	this.materials = [];
	this.texture;

	this.currMaterialIndex = 0;
	this.visited = false;
}

Node.prototype.setTransformation = function( transformation ) {
	this.transformation = transformation;
}

Node.prototype.setTexture = function( textureId ) {
	this.texture = textureId;
}

Node.prototype.addMaterial = function( materialId ) {
	this.materials.push( materialId );
}


Node.prototype.addChildren = function( id ) {
	this.idChildren.push( id );
}

Node.prototype.addPrimitives = function( primitive ) {
	this.primitives.push( primitive );
}