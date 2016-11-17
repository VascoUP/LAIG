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
	
	var dimX = 1;
	var dimY = 1;

	MyPlane.call(this, this.scene, dimX, dimY, this.partsU, this.partsV);
	
	/*this.shader = new CGFshader(this.scene.gl, "shaders/chessboard.vert", "shaders/chessboard.frag");
	this.setValuesShader();*/
};

MyChessBoard.prototype = Object.create(CGFnurbsObject.prototype);
MyChessBoard.prototype.constructor = MyChessBoard;

/*MyChessBoard.prototype.setValuesShader = function(){	
	this.shader.setUniformsValues({dU: this.dU});
	this.shader.setUniformsValues({dV: this.dV});

	this.shader.setUniformsValues({sU: this.sU});
	this.shader.setUniformsValues({sV: this.sV});

	this.shader.setUniformsValues({rgbaC1: this.rgbaC1});
	this.shader.setUniformsValues({rgbaC2: this.rgbaC2});
	this.shader.setUniformsValues({rgbaCS: this.rgbaCS});
}*/

/*MyChessBoard.prototype.display = function(){
	//this.scene.setActiveShader(this.shader);
	//MyPlane.display();
	//this.scene.setActiveShader(this.scene.defaultShader);
}*/