/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, base, top, height, slices, stacks, minS, maxS, minT, maxT) {
 	CGFobject.call(this,scene);
	
	this.base = base;
	this.top = top;
	this.height = height
	this.slices = slices;
	this.stacks = stacks;

	this.minS = minS || 0.0;
	this.maxS = maxS || 1.0;
	this.minT = minT || 0.0;
	this.maxT = maxT || 1.0;

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/

	var r = this.base;
	var dR = ( this.top - this.base ) / this.stacks;
	var xCoord = r;
	var yCoord = 0;
	var zCoord = 0;
	var dZ = this.height / this.stacks;
	var ang = 0;
	var dAng = 2 * Math.PI / this.slices;
	var counter = 0;

	var dS = ( this.maxS - this.minT ) / this.slices;
	var dT = ( this.maxT - this.minT ) / this.stacks;
	var t = this.minT;

 	this.vertices = [];
 	this.indices = [];
	this.normals = [];
	this.texCoords = [];

 	for(var j = -1; j < this.stacks; j++) {
		var s = this.minS;
		for (var i = 0; i <= this.slices; i++) {

			this.vertices.push(xCoord, yCoord, zCoord);
			this.normals.push(Math.cos(ang), Math.sin(ang), 0);

			this.texCoords.push(s, t);

			if( j >= 0 && i > 0 ) {

				this.indices.push( counter, counter - 1, counter - this.slices - 1 );
				this.indices.push( counter - this.slices - 1, counter - 1, counter );
				this.indices.push( counter - this.slices - 2, counter - this.slices - 1, counter - 1 );
				this.indices.push( counter - 1, counter - this.slices - 1, counter - this.slices - 2 );
			}

			ang += dAng;
			yCoord = r * Math.sin(ang);
			xCoord = r * Math.cos(ang);

			s += dS;

			counter++;
		}

		r += dR;

		xCoord = r;
		yCoord = 0;
		ang = 0;

		zCoord += dZ;

		t += dT;
	}


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };