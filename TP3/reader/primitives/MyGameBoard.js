/**
	Vehicle constructor
*/
function MyGameBoard(scene) {
    CGFobject.call(this,scene);

    this.cylinder = new MyCylinder(scene, 0.8, 0.6, 1.4, 5, 10);

    this.corner = new MyPatch(scene, 1, 2, 1, 50, [
        [0.5, -0.5, 0.0, 1.0], [-0.5, -0.5, 0.0, 1.0], [-0.5, 0.5, 0.0, 1.0],
        [0.5, -0.5, 1.0, 1.0], [-0.5, -0.5, 1.0, 1.0], [-0.5, 0.5, 1.0, 1.0]
    ]);    
    
    this.cornerTop = new MyPatch(scene, 1, 2, 1, 50, [
        [-0.5, 0.5, 1.0, 1.0], [-0.5, 0.5, 2.0, 1.0], [0.5, 0.5, 2.0, 1.0],
        [-0.5, -0.5, 1.0, 1.0], [-0.5, -0.5, 2.0, 1.0], [0.5, -0.5, 2.0, 1.0]
    ]);

    this.cornerIntersection = new MyPatch(scene, 2, 2, 50, 50, [
        [0.5, 0.5, 2.0, 1.0], [0.5, 0.5, 2.0, 1.0], [0.5, 0.5, 2.0, 1.0],
        [-0.5, 0.5, 2.0, 1.0], [-0.5, -0.5, 2.0, 1.0], [0.5, -0.5, 2.0, 1.0],
        [-0.5, 0.5, 1.0, 1.0], [-0.5, -0.5, 1.0, 1.0], [0.5, -0.5, 1.0, 1.0]
    ]);

    this.side = new MyPlane(scene, 1, 1, 1, 50);

    //Materials
    this.blackMaterial = new CGFappearance(scene);
    this.blackMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
    this.blackMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
    this.blackMaterial.setDiffuse(0.1, 0.1, 0.1, 1.0);
    this.blackMaterial.setShininess(20);

    this.greyMaterial = new CGFappearance(scene);
    this.greyMaterial.setAmbient(0.1, 0.1, 0.1, 1.0);
    this.greyMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
    this.greyMaterial.setDiffuse(0.3, 0.3, 0.3, 1.0);
    this.greyMaterial.setShininess(20);
};

MyGameBoard.prototype = Object.create(CGFobject.prototype);
MyGameBoard.prototype.constructor=MyGameBoard;

MyGameBoard.prototype.displayCorner = function() {
    this.scene.pushMatrix();
    this.scene.scale(0.25, 0.25, 0.1);
    this.scene.translate(-2.5, -2.5, -2);

    this.corner.display();
    this.cornerIntersection.display();
    this.scene.popMatrix();
}

MyGameBoard.prototype.displaySide = function() {    
    this.scene.pushMatrix();
    this.scene.scale(0.25, 1, 0.1);
    this.scene.translate(-2.5, 0, -2);

    this.cornerTop.display();
    this.scene.translate(-0.5, 0, 0.5);
    this.scene.rotate(-Math.PI / 2, 0, 1 ,0);
    this.side.display();

    this.scene.popMatrix();
}

MyGameBoard.prototype.display = function() {    
    this.scene.pushMatrix();

        this.displaySide();
        this.displayCorner();

        this.scene.rotate(Math.PI / 2, 0, 0, 1);

        this.displaySide();
        this.displayCorner();

        this.scene.rotate(Math.PI / 2, 0, 0, 1);

        this.displaySide();
        this.displayCorner();
                
        this.scene.rotate(Math.PI / 2, 0, 0, 1);

        this.displaySide();
        this.displayCorner();

    this.scene.popMatrix();
}

//Sets the texture's coordinates (in this case this function does nothing)
MyGameBoard.prototype.setTexCoords = function (length_s, length_t) {
}