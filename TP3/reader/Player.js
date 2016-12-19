
function Player(scene, id, state, coords) {
    this.scene = scene;
    this.state = state;

    this.pieces = new AuxiliarBoard(scene, coords);
    this.selectedPiece = null;
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

Player.prototype.pickObj = function(id, piece) {
    var piece = this.pieces.getPiece(id);
    if( piece == null ) //For debug purposes if a bug comes up
        throw new Error("Found no piece with the id: " + id);
    this.selectedPiece = piece;
}

Player.prototype.placePiece = function() {
    if( !this.pieces.removePiece(this.selectedPiece) ) //For debug purposes if a bug comes up
        throw new Error("Couldn't remove piece with the id: " + this.selectedPiece.id);
    this.selectedPiece = null;
}