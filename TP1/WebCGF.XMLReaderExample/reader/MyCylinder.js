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
	var r = this.base;
	var dR = ( this.top - this.base ) / this.stacks;
	var xCoord = r;
	var yCoord = 0;
	var zCoord = 0;
	var dZ = this.height / this.stacks;
	var ang = 0;
	var dAng = 2 * Math.PI / this.slices;
	var counter = 0;

	var dS = ( this.maxS - this.minS ) / this.slices;
	var dT = ( this.maxT - this.minT ) / (this.stacks + 2);
	var t = this.minT + dT;

 	this.vertices = [];
 	this.indices = [];
	this.normals = [];
	//this.texCoords = [];

 	for(var j = -1; j < this.stacks; j++) {
		var s = this.minS;
		for (var i = 0; i <= this.slices; i++) {

			this.vertices.push(xCoord, yCoord, zCoord);
			this.normals.push(Math.cos(ang), Math.sin(ang), 0);

			//this.texCoords.push(s, t);

			if( j >= 0 && i > 0 ) {
				this.indices.push( counter, counter - 1, counter - this.slices - 1 );
				this.indices.push( counter - this.slices - 2, counter - this.slices - 1, counter - 1 );
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
/*
	r = this.base;
	xCoord = r;
	yCoord = 0;
	zCoorbased = 0;
	
	ang = 0;
	var s = this.minS;
	var nIndices = this.vertices.length;
	for(var i = 0; i < this.slices; i++) {
			this.vertices.push(0, 0, 0);
			//this.texCoords.push(s, this.minT);
			s += dS;
	}
	s = this.minS;
	var nIndices2 = this.vertices.length;
	for (var i = 0; i <= this.slices; i++) {
		
			this.vertices.push(xCoord, yCoord, zCoord);
			this.normals.push(0, 0, -1);

			if(i > 0)
				this.indices.push(nIndices + i - 1, nIndices2 + i - 2, nIndices2 + i -1);

			//this.texCoords.push(s, this.minT + dT);

			ang += dAng;
			yCoord = r * Math.sin(ang);
			xCoord = r * Math.cos(ang);

			s += dS;
	}
	
	r = this.top;
	xCoord = r;
	yCoord = 0;
	zCoord = 0;
	
	ang = 0;
	s = this.minS;	
	nIndices = this.vertices.length;
	for(var i = 0; i < this.slices; i++) {
			this.vertices.push(0, 0, this.height);
			//this.texCoords.push(s, this.maxT);
			s += dS;
	}
	s = this.minS;	
	nIndices2 = this.vertices.length;
	for (var i = 0; i <= this.slices; i++) {
		
			this.vertices.push(xCoord * this.base, yCoord * this.base, this.height);
			this.normals.push(0, 0, 1);

			if(i > 0)
				this.indices.push(nIndices + i - 1, nIndices2 + i - 2, nIndices2 + i -1);

			//this.texCoords.push(s, this.maxT - dT);

			ang += dAng;
			yCoord = r * Math.sin(ang);
			xCoord = r * Math.cos(ang);

			s += dS;

			counter++;
	}

	console.debug(nIndices);
	console.debug(nIndices2 + this.slices - 1);
	console.debug(this.vertices.length);*/


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

 MyCylinder.prototype.setTexCoords = function (minS, minT, maxS, maxT) {

    this.updateTexCoordsGLBuffers();
 }