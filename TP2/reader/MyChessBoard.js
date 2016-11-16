function MyChessBoard(scene, du, dv, textureref, su, sv, rgbaC1, rgbaC2, rgbaCS) {
	this.scene = scene;
	this.du = du; 
	this.dv = dv; 
	this.textureref = textureref;
	this.su = su;
	this.sv = sv;
	this.rgbaC1 = rgbaC1;
	this.rgbaC2 = rgbaC2;
	this.rgbaCS = rgbaCS;

	var UPARTS= 5;
	this.partsU = du * UPARTS;

	var VPARTS = 5;
	this.partsV = dv * VPARTS;

	MyPlane.call(this, scene, 1, 1, this.partsU, this.partsV);
};

MyChessBoard.prototype = Object.create(CGFnurbsObject.prototype);
MyChessBoard.prototype.constructor = MyChessBoard;