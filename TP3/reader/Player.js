
function Player(scene, id, state, coords) {
    this.scene = scene;
    this.state = state;

    this.pieces = new AuxiliarBoard(scene, coords);
    console.debug(coords);
    this.pieces.log();
};

Player.prototype.changeState = function() {
    switch( this.state ) {
        case PlayerState.ChoosePiece:
            this.state = PlayerState.ChooseTile;
            break;
        case PlayerState.ChooseTile:
            this.state = PlayerState.Wait;
            break;
        case PlayerState.Wait:
            this.state = PlayerState.ChoosePiece;
            break;
    }
}