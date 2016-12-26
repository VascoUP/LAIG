function GameSequence() {
    this.sequence = [];
}

GameSequence.prototype.makeMove = function(piece, tileSrc, tileDst) {
    var move = new GameMove(piece, tileSrc, tileDst);
    move.makeMove();
    this.sequence.push( move );
}

GameSequence.prototype.undoMove = function() {
    if( this.sequence.length == 0 )
        return ;
        
    this.sequence[this.sequence.length - 1].undoMove();
    this.sequence.pop();
}

GameSequence.prototype.show = function() {
    for( var i = 0; i < this.sequence.length; i++ )
        this.sequence[i].show();
}