
function Player(scene, id, playerMode, state, coords, materialBox, materialPieces) {
    this.scene = scene;
    this.state = state;
    this.id = id;
    this.playerMode = playerMode;

    this.pieces = new AuxiliarBoard(scene, coords, materialBox, materialPieces);
};

Player.prototype.getColor = function() {
    return this.id == 1 ? 'r' : 'b';
}


/**
 *  GAME MECHANICS
 */

Player.prototype.changeState = function() {
    switch( this.state ) {
        case PlayerState.ChoosePiece:
            this.state = PlayerState.PieceConfirmation;
            break;
        case PlayerState.PieceConfirmation:
            this.state = PlayerState.PieceAnimation;
            break;
        case PlayerState.PieceAnimation:
            this.state = PlayerState.ChooseTile;
            break;
        case PlayerState.ChooseTile:
            this.state = PlayerState.TileConfirmation;
            break;
        case PlayerState.TileConfirmation:
            this.state = PlayerState.PieceToTile;
            break;
        case PlayerState.PieceToTile:
            this.state = PlayerState.Wait;
            break;
        case PlayerState.Wait:
            this.state = PlayerState.ChoosePiece;
            break;
    }
}


Player.prototype.pickPiece = function(piece, move) {
    if( this.state == PlayerState.ChoosePiece )
        return this.choosePiece(piece, move);
    else if( this.state == PlayerState.PieceConfirmation )
        return this.confirmPiece(piece, move);
}

Player.prototype.choosePiece = function (piece, move) {
    move.piece = piece;
    move.piece.selected = true;
    move.tileSrc = this.pieces.getTilePiece(piece.id);

    return true;
}

Player.prototype.confirmPiece = function (piece, move) {
    move.piece.selected = false;

    //Second click should be on the wanted piece
    //If it's not then revert to the first state
    if( move.piece.id != piece.id ) {
        this.state = PlayerState.ChoosePiece;
        return false;
    }

    move.removePiece();

    return true;
}