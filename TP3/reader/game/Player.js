
function Player(scene, id, state, coords, material) {
    this.scene = scene;
    this.state = state;

    this.pieces = new AuxiliarBoard(scene, coords, material);
    this.selectedPiece = null;
};



/**
 *  GAME MECHANICS
 */

Player.prototype.changeState = function() {
    switch( this.state ) {
        case PlayerState.ChoosePiece:
            this.state = PlayerState.PieceConfirmation;
            break;
        case PlayerState.PieceConfirmation:
            this.state = PlayerState.ChooseTile;
            break;
        case PlayerState.ChooseTile:
            this.state = PlayerState.TileConfirmation;
            //this.state = PlayerState.Wait;
            break;
        case PlayerState.TileConfirmation:
            this.state = PlayerState.Wait;
            break;
        case PlayerState.Wait:
            this.state = PlayerState.ChoosePiece;
            break;
    }
}

Player.prototype.choosePiece = function (id) {
    var piece = this.pieces.getPiece(id);
    if( piece == null ) {//For debug purposes if a bug comes up 
        throw new Error("Found no piece with the id: " + id);
        return false;
    }
    this.selectedPiece = piece;
    return true;
}

Player.prototype.confirmPiece = function (id) {
    //Second click should be on the wanted piece
    //If it's not then revert to the first state
    if( this.selectedPiece.id != id ) {
        this.state = PlayerState.ChoosePiece;
        this.selectedPiece = null;
        return false;
    }
    return true;
}

Player.prototype.pickObj = function(id) {
    if( this.state == PlayerState.ChoosePiece )
        return this.choosePiece(id);
    else if( this.state == PlayerState.PieceConfirmation )
        return this.confirmPiece(id);
}

Player.prototype.placePiece = function() {
    if( !this.pieces.removePiece(this.selectedPiece) ) //For debug purposes if a bug comes up
        throw new Error("Couldn't remove piece with the id: " + this.selectedPiece.id);
    this.selectedPiece = null;
}