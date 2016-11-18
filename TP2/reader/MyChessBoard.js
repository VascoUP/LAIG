function MyChessBoard(scene, dU, dV, textureref, sU, sV, rgbaC1, rgbaC2, rgbaCS) {
	this.scene = scene;
	this.dU = dU; 
	this.dV = dV; 
	this.textureref = textureref;
	this.sU = sU;
	this.sV = sV;
	this.rgbaC1 = rgbaC1;
	this.rgbaC2 = rgbaC2;
	this.rgbaCS = rgbaCS;

	var UPARTS= 5;
	this.partsU = dU * UPARTS;

	var VPARTS = 5;
	this.partsV = dV * VPARTS;

	this.time = 0;
	
	var dimX = 1;
	var dimY = 1;

	this.plane = new MyPlane(this.scene, dimX, dimY, this.partsU*4, this.partsV*4);

	this.material = new CGFappearance(this.scene);
	this.material.setTexture( this.scene.graph.textures[this.textureref].texture );
	
	this.shader = new CGFshader(this.scene.gl, "shaders/chessboard.vert", "shaders/chessboard.frag");
	this.setValuesShader();
};

MyChessBoard.prototype = Object.create(CGFnurbsObject.prototype);
MyChessBoard.prototype.constructor = MyChessBoard;

MyChessBoard.prototype.setValuesShader = function(){	
	this.shader.setUniformsValues({dU: this.dU});
	this.shader.setUniformsValues({dV: this.dV});
	this.shader.setUniformsValues({sU: this.sU});
	this.shader.setUniformsValues({sV: this.sV});

	this.shader.setUniformsValues({c1: this.rgbaC1});
	this.shader.setUniformsValues({c2: this.rgbaC2});
	this.shader.setUniformsValues({cs: this.rgbaCS});
}

MyChessBoard.prototype.display = function(){
	this.material.apply();

	this.scene.setActiveShader(this.shader);
	this.plane.display();
	this.scene.setActiveShader(this.scene.defaultShader);
}


MyChessBoard.prototype.update = function( dSec ){
	this.time += dSec || 0.0;

	var NEXT = 0.1;
	// Every NEXT seconds change the selected piece's position
	if( this.time >= NEXT) {
		this.time -= NEXT;

		if(this.sU == this.dU - 1) {
			this.sU = 0;
			if( this.sV == this.dV - 1) 
				this.sV = 0
			else
				this.sV++;
		} else
			this.sU++;
			
		this.setValuesShader();
	}
}