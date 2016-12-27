function GameSequence() {
    this.sequence = [];
}

GameSequence.prototype.makeMove = function(move) {
    var m = move.copy();
    m.moveTile();
    m.removePiece();
    this.sequence.push( m );
}

GameSequence.prototype.undoMove = function(player) {
    if( this.sequence.length == 0 )
        return ;

    var n = -1;
    for( var i = 0; i < this.sequence.length; i++ ) {
        if( this.sequence[this.sequence.length - i - 1].player.id == player.id )
            n = i+1;
    }

    this.undoMoves(n);
}

GameSequence.prototype.undoMoves = function(n) {
    for( var i = 0; i < n; i++ ) {
        if( this.sequence.length == 0 )
            return ;

        this.sequence[this.sequence.length - 1].undoMove();
        this.sequence.pop();
    }
}

GameSequence.prototype.show = function() {
    console.debug(this.sequence);
    for( var i = 0; i < this.sequence.length; i++ )
        this.sequence[i].show();
}