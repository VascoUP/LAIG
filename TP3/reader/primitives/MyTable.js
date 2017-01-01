var h = 0.4; 			//Table's height
var topH = 0.05;		//Table top's height
var legH = h - topH;	//Table legs' height
var legD = 0.1;			//Leg's diameter

/**
	MyTable's constructor
*/
function MyTable(scene, length_s, length_t) {
    CGFobject.call(this,scene);

    this.length_s = Math.pow(length_s, -1.0) || 1.0;
    this.length_t = Math.pow(length_t, -1.0) || 1.0;
    this.topSizeS = 1 / Math.floor(this.length_s);
    this.topSizeT = 1 / Math.floor(this.length_s);

    this.square = new MyPlane(scene, 1, 1, 50, 50);
	/*this.normalMap = new CGFtexture(this.scene, "resources/normal_maps/rough_wood.png");

    //Creates the shader
	this.shader = new CGFshader(this.scene.gl, "shaders/normal_map-vertex.glsl", "shaders/normal_map-fragment.glsl");
	this.setValuesShader();*/
};

MyTable.prototype = Object.create(CGFobject.prototype);
MyTable.prototype.constructor=MyTable;

MyTable.prototype.setValuesShader = function() {
	this.shader.setUniformsValues({normalMap: this.normalMap});
    /*this.shader.setUniformsValues({sizeS: this.topSizeS});
    this.shader.setUniformsValues({sizeT: this.topSizeT});*/
}

//Displays the table's top
MyTable.prototype.displayTop = function() { 
    
    this.scene.pushMatrix();
    this.scene.setActiveShader(this.shader);
    this.scene.translate(0, 0, topH / 2);  
    this.square.display();
    this.scene.setActiveShader(this.scene.defaultShader);
    this.scene.popMatrix();
    /*
    for( var i = 0; i < 1.0; i += this.topSizeS ) {
        for( var j = 0; j < 1.0; j += this.topSizeT ) {
            this.scene.pushMatrix();
            this.scene.translate(-0.5 + i + this.topSizeS / 2, -0.5 + j + this.topSizeT / 2, topH / 2);
            this.scene.scale( this.topSizeS, this.topSizeT, 1);
            this.square.display();
            this.scene.popMatrix();
        }
    }
    
    for( var i = 0; i < 1.0; i += this.topSizeS ) {
        for( var j = 0; j < 1.0; j += this.topSizeT ) {
            this.scene.pushMatrix();
            this.scene.translate(-0.5 + i + this.topSizeS / 2, -0.5 + j + this.topSizeT / 2, -topH / 2);
            this.scene.scale( this.topSizeS, this.topSizeT, 1);
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.square.display();
            this.scene.popMatrix();
        }
    }

    for( var i = 0; i < 1.0; i += this.topSizeS ) {    
        this.scene.pushMatrix();
        this.scene.translate(-0.5 + i + this.topSizeS / 2, -0.5, 0);
        this.scene.scale(this.topSizeS, 1, topH);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.square.display();
        this.scene.popMatrix();
    }

    for( var i = 0; i < 1.0; i += this.topSizeS ) {    
        this.scene.pushMatrix();
        this.scene.translate(-0.5 + i + this.topSizeS / 2, 0.5, 0);
        this.scene.scale(this.topSizeS, 1, topH);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.square.display();
        this.scene.popMatrix();
    }

    this.scene.pushMatrix();
    this.scene.translate(0.5, 0, 0);
    this.scene.scale(1, 1, topH);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.square.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-0.5, 0, 0);
    this.scene.scale(1, 1, topH);
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.square.display();
    this.scene.popMatrix();
    */
}

//Displays the table's legs
MyTable.prototype.displayLeg = function() { 
    this.scene.pushMatrix();
    this.scene.translate(0, 0, -legH / 2);
    this.scene.scale(legD, legD, 1);
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.square.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, -legD / 2, 0);
    this.scene.scale(legD, 1, legH);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.square.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, legD / 2, 0);
    this.scene.scale(legD, 1, legH);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.square.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(legD / 2, 0, 0);
    this.scene.scale(1, legD, legH);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.rotate(-Math.PI / 2, 0, 0, 1);
    this.square.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-legD / 2, 0, 0);
    this.scene.scale(1, legD, legH);
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.rotate(-Math.PI / 2, 0, 0, 1);
    this.square.display();
    this.scene.popMatrix();
}

//Displays the table
MyTable.prototype.display = function() {
    this.scene.pushMatrix();
    //this.scene.rotate(-Math.PI / 2, 0, 0, 1);
    this.scene.pushMatrix();
    this.displayTop();
    /*this.scene.translate(0.35, 0.35, (-legH / 2) - (topH / 2));
    this.displayLeg();
    this.scene.translate(-0.7, 0, 0);
    this.displayLeg();
    this.scene.translate(0, -0.7, 0);
    this.displayLeg();
    this.scene.translate(0.7, 0, 0);
    this.displayLeg();*/
    this.scene.popMatrix();
    this.scene.popMatrix();
}

//Sets the texture's coordinates (in this case this function does nothing)
MyTable.prototype.setTexCoords = function (length_s, length_t) {

}