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
			if( this.connectedGraph( this.nodes[i] ) == -1 )
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

Graph.prototype.connectedGraph = function( node ) {
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
		if( this.connectedGraph(n) == -1 )
			return -1;
	}

	return 0;
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

	this.visited = false;
}

Node.prototype.setTransformation = function( transformation ) {
	this.transformation = transformation;
}

Node.prototype.setTexture = function( texture ) {
	this.texture = texture;
}

Node.prototype.addMaterial = function( material ) {
	this.materials.push(material);
}


Node.prototype.addChildren = function( id ) {
	this.idChildren.push( id );
}

Node.prototype.addPrimitives = function( primitive ) {
	this.primitives.push(primitive);
}