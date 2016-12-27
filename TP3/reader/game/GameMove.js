function GameMove(player, piece, tileSrc, tileDst) {
    this.player = player;
    this.piece = piece;
    this.tileDst = tileDst;
    this.tileSrc = tileSrc;
}

GameMove.prototype.moveTile = function() {
    if( !this.tileDst.addPiece(this.piece) ) 
        throw new Error("Couldn't place piece on that position");
    this.piece.animation = null;
}

GameMove.prototype.removePiece = function() {
    this.tileSrc.removePiece(this.piece);
}

GameMove.prototype.undoMove = function() {
    this.tileSrc.addPiece(this.piece);
    this.tileDst.removePiece(this.piece);
}

GameMove.prototype.show = function() {
    console.log("Piece: " + this.piece.id + " - From: " + this.tileSrc.id + " - To: " + this.tileDst.id);
}

GameMove.prototype.copy = function( ) {
    return new GameMove(this.player, this.piece, this.tileSrc, this.tileDst);
}