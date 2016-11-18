function MyVehicle(scene) {
    CGFobject.call(this,scene);

    this.cylinder = new MyCylinder(scene, 0.8, 0.6, 2.0, 5, 10);

    this.front_half = new MyPatch(scene, 3, 3, 20, 20, [
        [2.0, 0.0, 0.0, 1.0], [2.0, 0.0, 0.0, 1.0], [2.0, 0.0, 0.0, 1.0], [2.0, 0.0, 0.0, 1.0],
        [1.9, 0.0, 0.05, 1.0], [1.9, -0.1, 0.05, 1.0], [1.9, -0.1, -0.05, 1.0], [1.9, 0.0, -0.05, 1.0], 
        [1.5, 0.0, 0.4, 1.0], [1.5, -0.4, 0.4, 1.0], [1.5, -0.4, -0.4, 1.0], [1.5, 0.0, -0.4, 1.0],
        [0.0, 0.0, 0.5, 1.0], [0.0, -0.5, 0.5, 1.0], [0.0, -0.5, -0.5, 1.0], [0.0, 0.0, -0.5, 1.0]
    ]);

    this.middle_half = new MyPatch(scene, 3, 2, 20, 20, [
        [0.1, 0.0, 0.5, 1.0], [0.1, -0.5, 0.0, 1.0], [0.1, 0.0, -0.5, 1.0],
        [0.0, 0.0, 0.1, 1.0], [0.0, -1.0, 0.0, 1.0], [0.0, 0.0, -0.1, 1.0],
        [-0.5, 0.0, 3.5, 1.0], [-0.5, -3.5, 0.0, 1.0], [-0.5, 0.0, -3.5, 1.0],
        [-4.0, 0.0, 1.5, 1.0], [0.0, -1.5, 0.0, 1.0], [-4.0, 0.0, -1.5, 1.0]
    ]);

    this.back_half = new MyPatch(scene, 3, 1, 20, 20, [
        [-4.0, 0.0, -1.5, 1.0], [-4.0, 0.0, -1.5, 1.0],
        [-1.33, -1.0, -0.5, 1.0], [-1.33, 1.0, -0.5, 1.0],
        [-1.33, -1.0, 0.5, 1.0], [-1.33, 1.0, 0.5, 1.0],
        [-4.0, 0.0, 1.5, 1.0], [-4.0, 0.0, 1.5, 1.0]
    ]);
};

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor=MyVehicle;

MyVehicle.prototype.display = function() {

    this.scene.pushMatrix();

    this.scene.translate(-0.4, 0.0, 0.0);
    this.scene.rotate(Math.PI/2,0,1,0);
    this.cylinder.display();

    this.scene.popMatrix();

    this.scene.pushMatrix();

    this.front_half.display();
    this.middle_half.display();
    this.back_half.display();
    this.scene.rotate(Math.PI,1,0,0);
    this.front_half.display();
    this.middle_half.display();

    this.scene.popMatrix();
}