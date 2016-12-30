/**
*	Game sequence's constructor
*/
function GameSequence() {
    this.sequence = [];
}

//Add a movement to the game's sequence
GameSequence.prototype.addMove = function(move) {
    var m = move.copy();
    this.sequence.push( m );
}

//Undo the movement and updates the game's sequence
GameSequence.prototype.undoMove = function(player) {
    if( this.sequence.length == 0 )
        return false;

    var n = -1;
    for( var i = 0; i < this.sequence.length; i++ ) {
        if( this.sequence[this.sequence.length - i - 1].player.id == player.id ) {
            n = i+1;
            break;
        }
    }
    this.undoMoves(n);
    return n > 0;
}

//Undo movements and updates the game's sequence
GameSequence.prototype.undoMoves = function(n) {
    for( var i = 0; i < n; i++ ) {
        if( this.sequence.length == 0 )
            return ;
        this.sequence[this.sequence.length - 1].undoMove();
        this.sequence.pop();
    }
}

//Shows the game's sequence
GameSequence.prototype.show = function() {
    console.debug(this.sequence);
    for( var i = 0; i < this.sequence.length; i++ )
        this.sequence[i].show();
}