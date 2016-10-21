/**
 * MyTorus
 * @constructor
 */
function MyTorus(scene, inner, outer, slices, loops) {
	CGFobject.call(this, scene);
	this.outer = outer;
	this.inner = inner;
	this.slices = slices;
	this.loops = loops;

	this.initBuffers();
};

MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor = MyTorus;

MyTorus.prototype.initBuffers = function () {
	this.vertices = [];
	this.normals = [];
	this.indices = [];
	this.texCoords = [];

	var pi2 = 2 * Math.PI;
	
	//vertexes, normals and texCoords
	for (j = 0; j <= this.loops; j++) {
		for (i = 0; i <= this.slices; i++) {
			
			//Vertexes
			var u = (i / this.slices) * pi2;
			var v = (j / this.loops) * pi2;
			
			var x = (this.outer + this.inner * Math.cos(v)) * Math.cos(u);
			var y = (this.outer + this.inner * Math.cos(v)) * Math.sin(u);
			var z = this.inner * Math.sin(v);
			
			this.vertices.push(x, y, z);
			
			//TexCoords
			this.texCoords.push(1 - i/this.slices, 1 - j/this.loops);
			
			//Normals
			
			//tangent vector with respect to big circle
			var tx = -Math.sin(u);
			var ty = Math.cos(u);
			var tz = 0;
			
			//tangent vector with respect to little circle
			var sx = Math.cos(u)*( -Math.sin(v));
			var sy = Math.sin(u)*( -Math.sin(v));
			var sz = Math.cos(u);
			
			//normal is cross-product of tangents
			var nx = ty*sz - tz*sy;
			var ny = tz*sx - tx*sz;
			var nz = tx*sy - ty*sx;

            this.normals.push(nx, ny, nz);
		}
	}

	//Indexes
    for (var l = 1; l <= this.loops; l++) {
        for (var k = 1; k <= (this.slices); k++) {
			var i1 = (this.slices + 1) * l + (k - 1);
			var i2 = (this.slices + 1) * (l - 1) + (k - 1); 
			var i3 = (this.slices + 1) * (l - 1) + k;
			var i4 = (this.slices + 1) * l + k;
			
			this.indices.push(i1, i2, i4);
			this.indices.push(i2, i3, i4);
		}
    }
	
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
