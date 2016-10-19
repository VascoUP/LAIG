/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3/*minS, maxS, minT, maxT*/) {
    CGFobject.call(this,scene);
/*
    this.minS = minS || 0.0;
    this.maxS = maxS || 1.0;
    this.minT = minT || 0.0;
    this.maxT = maxT || 1.0;
*/

    this.minS = 0.0;
    this.maxS = 1.0;
    this.minT = 0.0;
    this.maxT = 1.0;

    this.initBuffers(x1, y1, z1, x2, y2, z2, x3, y3, z3);
};


MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function (x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	this.vertices = [
        x1, y1, z1, //A - 0
        x2, y2, z2,	//B - 1
        x3, y3, z3,	//C - 2
	];

	this.indices = [
        2, 1, 0,
        0, 1, 2
    ];

    var uX = x2 - x1;
    var uY = y2 - y1;
    var uZ = z2 - z1;
    var vX = x3 - x1;
    var vY = y3 - y1;
    var vZ = z3 - z1;

    this.normals = [
    	(uY * vZ) - (uZ * vY), (uZ * vX) - (uX * vZ), (uX * vY) - (uY * vX),
    	(uY * vZ) - (uZ * vY), (uZ * vX) - (uX * vZ), (uX * vY) - (uY * vX),
    	(uY * vZ) - (uZ * vY), (uZ * vX) - (uX * vZ), (uX * vY) - (uY * vX)
    ];

    this.texCoords = [
        this.minS, this.minT,
        this.minS, this.maxT,
        this.maxS, this.maxT
    ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
