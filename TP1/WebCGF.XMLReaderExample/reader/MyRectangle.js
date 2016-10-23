//Rectangle's constructor
function MyRectangle(scene, x1, y1, x2, y2) {
    CGFobject.call(this,scene);

    this.minS = 0.0;
    this.maxS = 1.0;
    this.minT = 0.0;
    this.maxT = 1.0;

    this.initBuffers(x1, y1, x2, y2);
}


MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function (x1, y1, x2, y2) {
	this.vertices = [
        x1, y1, 0, 	//A - 0
        x1, y2, 0,	//B - 1
        x2, y2, 0,	//C - 2
        x2, y1, 0	//D - 3
	];

	this.indices = [
        2, 1, 0,
		3, 2, 0,
        0, 1, 2,
        0, 2, 3
    ];

    this.normals = [
    	0, 0, 1,
    	0, 0, 1,
    	0, 0, 1,
    	0, 0, 1
    ];

    this.texCoords = [
        this.minS, this.maxT,
        this.minS, this.minT,
        this.maxS, this.minT,
        this.maxS, this.maxT
    ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}

MyRectangle.prototype.setTexCoords = function (minS, minT, maxS, maxT) {
    this.minS = minS;
    this.maxS = maxS;
    this.minT = minT;
    this.maxT = maxT;

    this.texCoords = [
        this.minS, this.minT,
        this.minS, this.maxT,
        this.maxS, this.maxT,
        this.maxS, this.minT
    ];

    this.updateTexCoordsGLBuffers();
}
