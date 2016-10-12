/**
 * MySphere
 * @constructor
 */
 function MySphere(scene, radius, slices, stacks, minS, maxS, minT, maxT) {
 	CGFobject.call(this,scene);
	
	if( radius > 0 )
		this.radius = radius;
	else
		this.radius = 1;

	if( slices >= 3 )
		this.slices = slices;
	else
		this.slices = 3;
	if( stacks >= 2 )
		this.stacks = stacks;
	else
		this.stacks = 2;

	this.minS = minS || 0.0;
	this.maxS = maxS || 1.0;
	this.minT = minT || 0.0;
	this.maxT = maxT || 1.0;

 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() {

 	var xCoord = 0;
 	var yCoord = 0;
 	var zCoord = -this.radius;
 	var r = 0;

 	var ang = 0;
 	var dAng = 2 * Math.PI / this.slices;

 	var zAng = -Math.PI / 2;
 	var dZAng = Math.PI / this.stacks;

	var counter = 0;

	var dS = this.maxS - this.minS;
	var dT = this.maxT - this.minT;

	this.vertices = [];
 	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	for(var j = 1; j < this.stacks; j++) {
		if(j == 1) {
			this.vertices.push(xCoord, yCoord, zCoord);
			this.normals.push(0, -1, 0);
			this.texCoords.push( 0.5 * dS , 0.5 * dT );

			zAng += dZAng;
			xCoord = 1;
			yCoord = 0;
			zCoord = this.radius * Math.sin(zAng);
			r = this.radius * Math.cos(zAng);

			for(var i = 0; i < this.slices; i++) {
				this.vertices.push( xCoord * r, yCoord * r, zCoord );
				this.normals.push( r * Math.cos(ang), r * Math.sin(ang), zCoord );

				ang += dAng;

				yCoord = Math.sin(ang);
				xCoord = Math.cos(ang);

				counter++;

				if( i > 0 )
					this.indices.push( counter, counter - 1, 0 );

				if( i + 1 == this.slices ) 
					this.indices.push( 0, 1, counter );
			}
		}
 		else {
 			var s = 0.0;

			for (var i = 0; i < this.slices; i++) {
				this.vertices.push(xCoord * r, yCoord * r, zCoord);
				this.normals.push( r * Math.cos(ang), r * Math.sin(ang), zCoord );
				this.texCoords.push(((xCoord * r) / 2 + 0.5) * dS, ((yCoord * r) / 2 + 0.5) *  dT );

				counter++;

				if( i > 0 ) {
					this.indices.push( counter - 1, counter - this.slices - 1, counter - this.slices );
					this.indices.push( counter, counter - 1, counter - this.slices );
				}

				if( i + 1 == this.slices ) {
					this.indices.push( counter, counter - this.slices, counter - this.slices + 1 );
					this.indices.push( counter - this.slices + 1, counter - this.slices, counter - 2 * this.slices + 1 );					
				}

				ang += dAng;

				yCoord = Math.sin(ang);
				xCoord = Math.cos(ang);
			}
		}

		if( j + 1 == this.stacks ) {

			this.vertices.push( 0, 0, this.radius );
			this.normals.push( 0, 0, 1 );
			this.texCoords.push( 0.5 * dS , 0.5 * dT );

			counter++;

			for(var i = 0; i < this.slices; i++) {

				if( i == this.slices - 1)
					this.indices.push(counter, counter - this.slices + i, counter - this.slices);
				else
					this.indices.push(counter, counter - this.slices + i, counter - this.slices + i + 1);

			}
 		}
 		else {
			ang = 0;
			zAng += dZAng;
			xCoord = 1;
			yCoord = 0;
			zCoord = this.radius * Math.sin(zAng);
			r = this.radius * Math.cos(zAng);
		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };