var GameState = {    
    Player1 : 0,
    Player2 : 1,
};

var PlayerState = {
    ChoosePiece : 0,
    PieceConfirmation : 1,
    PieceAnimation: 2,
    ChooseTile : 3,
    TileConfirmation : 4,
    PieceToTile: 5,
    Wait : 6
};


/**
 *  Game's constructor
 */
function Game(scene, materialBoard, materialBox1, materialBox2, materialPieces1, materialPieces2) {
    this.scene = scene;

    this.gameBoard = new GameBoard(scene, materialBoard);
    this.player1 = new Player(scene, 1, PlayerState.ChoosePiece, [0, -5, 0], materialBox1, materialPieces1);
    this.player2 = new Player(scene, 2, PlayerState.Wait, [0, 5, 0], materialBox2, materialPieces2);

    this.gameState = GameState.Player1;
    this.gameSequence = new GameSequence();

    this.currMove = new GameMove( this.player1 );
	this.otrio = new Otrio();

	this.material = new CGFappearance(this.scene);
};

Game.prototype.logHistory = function() {
    this.gameSequence.show();
}

//Updates the Game
Game.prototype.update = function( dSec ){
    if( this.currMove.player.state == PlayerState.PieceAnimation ) {
        this.currMove.piece.animation.update(dSec);
        if( this.currMove.piece.animation.lastFrame )
            this.currMove.player.changeState();
    } else if( this.currMove.player.state == PlayerState.PieceToTile ) {
        this.currMove.piece.animation.update(dSec);
        if( this.currMove.piece.animation.lastFrame )
            this.changeState();
    }
}

//Sets the texture's coordinates (in this case this function does nothing)
Game.prototype.setTexCoords = function(length_t, length_s){
	
}



/**
 *  GAME MECHANICS
 */

Game.prototype.getCurrPlayer = function() {
    var player;
    switch(this.gameState) {
        case GameState.Player1:
            player = this.player1;
            break;
        case GameState.Player2:
            player = this.player2;
            break;
        default:
            player = null;
            break;
    }
    return player;
}

Game.prototype.changeState = function() {
    this.currMove.moveTile();

    switch( this.gameState ) {
        case GameState.Player1:
            this.gameState = GameState.Player2;
            break;
        case GameState.Player2:
            this.gameState = GameState.Player1;
            break;
        default:
            return;
    }

    //The one that is in the state ChooseTile changes to the state Wait
    //The other changes from the state Wait to ChoosePiece
    this.player1.changeState();
    this.player2.changeState();

    this.currMove.player = this.getCurrPlayer();
}

Game.prototype.undoMove = function() {
    this.gameSequence.undoMove(this.currMove.player);
}


Game.prototype.pickObj = function(obj) {
    if( this.currMove.player.state == PlayerState.TileConfirmation)
        this.confirmTile(obj)
    else if( this.currMove.player.state == PlayerState.ChooseTile )
        this.chooseTile(obj);
    else
        if( this.currMove.player.pickPiece(obj, this.currMove) ) {
            this.currMove.player.changeState();

            if( this.currMove.player.state == PlayerState.PieceAnimation )
                this.animatePiece();
        }
}

Game.prototype.confirmTile = function(obj) {
    //Check if selected tile is the same as the one that was confirmed
    if( obj.id == this.currMove.tileDst.id ) {
        //this.gameSequence.makeMove(this.currMove);

        this.currMove.player.changeState();
        //this.changeState();

        //Add animation to the piece
        this.pieceToBoard();

    //If the tile is not the same then go back to choosing a tile
    } else
        this.currMove.player.state = PlayerState.ChooseTile;

    //Either way the game board shouldn't end this function with a selected tile
    this.gameBoard.selectTile(null);
}

Game.prototype.chooseTile = function(tile) {
    this.gameBoard.selectTile(tile);
    this.currMove.player.changeState();
    this.currMove.tileDst = tile;
}

Game.prototype.animatePiece = function () {
    var oldCenter = this.currMove.player.pieces.coords.slice();
    var newCenter = this.currMove.player.pieces.coords.slice();

    var oldCoords = this.currMove.player.pieces.getTileCoords(this.currMove.tileSrc.id);
    var newCoords = this.currMove.player.pieces.getTileCoords(this.currMove.tileSrc.id);

    newCenter[2] += 1.0;
    newCoords[2] += 1.0;

    var c1 = new AnimationInfo(oldCenter, oldCoords, [1, 1, 1]);
    var c2 = new AnimationInfo(newCenter, newCoords, [1, 1, 1]);

    this.currMove.piece.animation = new CompleteAnimation("mvPiece", [c1, c2], 0.25);
}

Game.prototype.pieceToBoard = function () {
    var oldCenter = this.currMove.player.pieces.coords.slice();
    oldCenter[2] += 1.0;
    
    var newCenter = [0, 0, 0.2];

    var oldCoords = this.currMove.player.pieces.getTileCoords(this.currMove.tileSrc.id);
    oldCoords[2] += 1.0;

    var newCoords = this.gameBoard.getTileCoords(this.currMove.tileDst.id);

    var c1 = new AnimationInfo(oldCenter, oldCoords, [1, 1, 1]);
    var c2 = new AnimationInfo(newCenter, newCoords, [sizeTile, sizeTile, 1]);

    this.currMove.piece.animation = new CompleteAnimation("mvPiece", [c1, c2], 1);
}


/**
 *  DISPLAY FUNCTIONS
 */

Game.prototype.registerForPick = function() {
    this.scene.pushMatrix();

    if( this.player1.state == PlayerState.ChoosePiece || 
        this.player1.state == PlayerState.PieceConfirmation )
        this.player1.pieces.registerForPick();

    else if( this.player2.state == PlayerState.ChoosePiece || 
             this.player2.state == PlayerState.PieceConfirmation )
        this.player2.pieces.registerForPick();

    else if( this.player1.state == PlayerState.ChooseTile || 
            this.player1.state == PlayerState.TileConfirmation || 
            this.player2.state == PlayerState.ChooseTile || 
            this.player2.state == PlayerState.TileConfirmation )
        this.gameBoard.registerForPick();

    this.scene.popMatrix();
}

//Displays the Game with the respective shader
Game.prototype.display = function(){
    this.scene.pushMatrix();

    this.gameBoard.display();
    this.player1.pieces.display();
    this.player2.pieces.display();
    
    if( this.currMove.piece && this.currMove.piece.animation != null )
            this.currMove.piece.display();

    this.scene.popMatrix();
}