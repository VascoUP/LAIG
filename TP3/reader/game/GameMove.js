/**
*	Game movements' constructor
*/
function GameMove(player, piece, tileSrc, tileDst) {
    this.player = player;
    this.piece = piece;
    this.tileDst = tileDst;
    this.tileSrc = tileSrc;
}

//Moves piece to tile
GameMove.prototype.moveTile = function() {
    if( !this.tileDst.addPiece(this.piece) ) 
        throw new Error("Couldn't place piece on that position");
    this.piece.animation = null;
}

//Remove piece
GameMove.prototype.removePiece = function() {
    if( this.tileSrc )
        this.tileSrc.removePiece(this.piece);
    this.piece.animation = null;
}

//Reverts the tile when a piece is removed
GameMove.prototype.revertTile = function() {
    if( this.tileDst )
        this.tileDst.removePiece(this.piece);
    this.piece.animation = null;
}

//Reverts the piece
GameMove.prototype.revertPiece = function() {
    if( this.tileSrc )
        this.tileSrc.addPiece(this.piece);
    this.piece.animation = null;
}

//Undo movement
GameMove.prototype.undoMove = function() {
    this.revertPiece();
    this.revertTile();
}

//Show the different movements
GameMove.prototype.show = function() {
    console.log("Piece: " + this.piece.id + " - From: " + this.tileSrc.id + " - To: " + this.tileDst.id);
}

//Copies the game move used
GameMove.prototype.copy = function() {
    return new GameMove(this.player, this.piece, this.tileSrc, this.tileDst);
}