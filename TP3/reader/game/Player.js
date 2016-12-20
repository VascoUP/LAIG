
function Player(scene, id, state, coords, materialBox, materialPieces) {
    this.scene = scene;
    this.state = state;
    this.id = id;

    this.pieces = new AuxiliarBoard(scene, coords, materialBox, materialPieces);
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

Player.prototype.choosePiece = function (piece) {
    this.selectedPiece = piece;
    piece.selected = true;
    return true;
}

Player.prototype.confirmPiece = function (piece) {
    //Second click should be on the wanted piece
    //If it's not then revert to the first state
    if( this.selectedPiece.id != piece.id ) {
        this.state = PlayerState.ChoosePiece;
        this.selectedPiece.selected = false;
        this.selectedPiece = null;
        return false;
    }
    this.selectedPiece.selected = false;
    return true;
}

Player.prototype.pickObj = function(piece) {
    if( this.state == PlayerState.ChoosePiece )
        return this.choosePiece(piece);
    else if( this.state == PlayerState.PieceConfirmation )
        return this.confirmPiece(piece);
}

Player.prototype.placePiece = function() {
    if( !this.pieces.removePiece(this.selectedPiece) ) //For debug purposes if a bug comes up
        throw new Error("Couldn't remove piece with the id: " + this.selectedPiece.id);
    this.selectedPiece = null;
}