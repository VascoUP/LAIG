var GameState = {
    Menu : 0,
    CameraToP2 : 1,
    Player1 : 2,
    CameraToP1 : 3,
    Player2 : 4,
    EndGame : 5
};

const MAX_UNDOS = 1;

/**
 *  Game's constructor
 */
function Game(scene, materialBoard, materialBox1, materialBox2, materialPieces1, materialPieces2) {
    this.scene = scene;

    this.materialBoard = materialBoard;
    this.materialBox1 = materialBox1;
    this.materialBox2 = materialBox2;
    this.materialPieces1 = materialPieces1;
    this.materialPieces2 = materialPieces2;

    this.init();
	this.otrio = new Otrio();

    this.cameraAnimation = null;
    this.cameraFirstAnimation = true;

	this.material = new CGFappearance(this.scene);
};

Game.prototype.init = function() {
    this.gameBoard = new GameBoard(this.scene, this.materialBoard);
    this.player1 = new Player(this.scene, 1, PlayerMode.Player, PlayerState.ChoosePiece, [0, 0, -5], this.materialBox1, this.materialPieces1);
    this.player2 = new Player(this.scene, 2, PlayerMode.Player, PlayerState.Wait, [0, 0, 5], this.materialBox2, this.materialPieces2);

    this.gameState = GameState.Menu;
    this.gameSequence = new GameSequence();

    this.currMove = new GameMove( this.player1 );

    this.nUndos = 0;
};



/**
 *  INTERFACE
 */
Game.prototype.changeButtons = function() {
    switch(this.gameState) {
        case GameState.Menu:
        case GameState.EndGame:
            this.menuButtons();
            break;
        case GameState.CameraToP2:
        case GameState.CameraToP1:
        case GameState.Player1:
        case GameState.Player2:
            this.gameButtons();
            break;
    }
};

Game.prototype.menuButtons = function() {
    if( this.undoButton )
        this.scene.myInterface.gui.remove(this.undoButton);
    if( this.redoButton )
        this.scene.myInterface.gui.remove(this.redoButton);
    if( this.quitButton )
        this.scene.myInterface.gui.remove(this.quitButton);

    this.playButton = this.scene.myInterface.gui.add(this.scene.game,'play').name("Play Game");
	
    this.modePlayer1 = this.scene.myInterface.gui.add(this.scene.game.player1, 'playerMode', PlayerMode).name("Player 1 Mode");
	this.modePlayer2 = this.scene.myInterface.gui.add(this.scene.game.player2, 'playerMode', PlayerMode).name("Player 2 Mode");
};

Game.prototype.gameButtons = function() {
    if( this.playButton )
        this.scene.myInterface.gui.remove(this.playButton);
    if( this.modePlayer1 && this.modePlayer2 ){
		this.scene.myInterface.gui.remove(this.modePlayer1);
		this.scene.myInterface.gui.remove(this.modePlayer2);
	}

    this.undoButton = this.scene.myInterface.gui.add(this.scene.game,'undoMove').name("Undo");
    this.quitButton = this.scene.myInterface.gui.add(this.scene.game,'quit').name("Quit");
};



/**
 *  MISC
 */
Game.prototype.logHistory = function() {
    this.gameSequence.show();
};

//Sets the texture's coordinates (in this case this function does nothing)
Game.prototype.setTexCoords = function(length_t, length_s){
};



/**
 *  UPDATE
 */
Game.prototype.update = function( dSec ){
    this.checkRequests(dSec);
    this.updateCamera(dSec);
    this.updateAnimations(dSec);
};

Game.prototype.checkRequests = function (dSec) {
    if( !this.otrio.waitingResponse && this.otrio.responseReceived )
        this.receivedResponse();
    else if( this.otrio.waitingResponse ) {
        this.otrio.counter += dSec;

        if( this.otrio.counter > MaxSeconds ) {    
            this.otrio.counter = 0;

            this.responseReceived = false;
            this.waitingResponse = false;

            console.error("Connection Timeout");

            // Try again
            this.request();
        }
    }
};

Game.prototype.updateCamera = function (dSec) {
    if( (   this.gameState == GameState.Menu || 
            this.gameState == GameState.EndGame || 
            this.gameState == GameState.CameraToP2 || 
            this.gameState == GameState.CameraToP1 ) 
        &&  this.cameraAnimation != null ) {

        this.cameraAnimation.update(dSec);

        if( this.cameraAnimation.lastFrame )
            this.animateCamera();
    }
};

Game.prototype.updateAnimations = function(dSec) {
    if( this.currMove.piece && this.currMove.piece.animation ) {
        this.currMove.piece.animation.update(dSec);

        if( this.currMove.piece.animation.lastFrame ) {
            if( this.currMove.player.state == PlayerState.PieceAnimation ) 
                this.changePlayerState();

            else if( this.currMove.player.state == PlayerState.PieceToTile ) {
                    this.currMove.moveTile();
                    this.gameSequence.addMove(this.currMove);

                    this.changePlayerState();
            }
        }
    }
};



/**
 *  GAME MECHANICS
 */
Game.prototype.play = function () {
    this.changeState();
    this.changeButtons();
    this.cameraAnimation.lastFrame = true;
};

Game.prototype.quit = function () {
    this.init();
    this.changeButtons();
    this.cameraAnimation.lastFrame = true;
};

Game.prototype.end = function () {
    this.init();
    this.changeButtons();
    this.cameraAnimation.lastFrame = true;
}

Game.prototype.playerMode = function(playerMode){
	switch(playerMode){
		case PlayerMode.Player:
			//Player Mode
			break;
		case PlayerMode.Easy:
			//easy computer
			break;
		case PlayerMode.Hard:
			//hard computer
			break;
	}
}

Game.prototype.getCurrPlayer = function() {
    var player;

    if( this.player1.state != PlayerState.Wait )
        player = this.player1;
    else 
        player = this.player2;

    return player;
};

Game.prototype.changePlayerState = function() {
    this.currMove.player.changeState();

    if( this.currMove.player.state == PlayerState.EndGame ) {
        this.request();
        return ;
    } else if( this.currMove.player.state == PlayerState.PieceAnimation ) {
        this.animatePiece();
        return ;
    }

    if( this.currMove.player.playerMode == PlayerMode.Player )
        return ;

    switch(this.currMove.player.state) {
        case PlayerState.ChoosePiece:
            this.request();
            break;
        case PlayerState.ChooseTile:
            // Choose given tile
            this.chooseTile(this.currMove.tileDst);
            this.gameBoard.selectTile(null);
            // Confirmed tile
            this.currMove.player.changeState();

            //Add animation to the piece
            this.pieceToBoard();
            break;
    }
};

Game.prototype.changeState = function() {
    switch( this.gameState ) {
        case GameState.Menu:
            this.gameState = GameState.CameraToP1;
            break;
        case GameState.Player1:
            this.gameState = GameState.CameraToP2;

            this.player1.changeState();
            this.player2.changeState();

            this.currMove.player = this.getCurrPlayer();
            this.nUndos = 0;

            break;
        case GameState.CameraToP2:
            this.gameState = GameState.Player2;
            this.nextMove();

            break;
        case GameState.Player2:
            this.gameState = GameState.CameraToP1;

            this.player1.changeState();
            this.player2.changeState();

            this.currMove.player = this.getCurrPlayer();
            this.nUndos = 0;

            break;
        case GameState.CameraToP1:
            this.gameState = GameState.Player1;
            this.nextMove();

            break;
        case GameState.EndGame:
            this.gameState = GameState.Menu;
            break;
        default:
            return;
    }
};

Game.prototype.nextMove = function() {
    // Wait for input if player mode is player
    if( this.currMove.player.playerMode == PlayerMode.Player )
        return ;

    // If it's computer then request a play to the prolog program
    this.request();
}

Game.prototype.undoMove = function() {
    if( this.currMove.player.state > PlayerState.PieceToTile ) {
        // At this point the player can't undo anything
        return ;
    } else if( this.currMove.player.state > PlayerState.PieceConfirmation ) {
        // Undo the current move (deselect piece)
        this.currMove.player.state = PlayerState.ChoosePiece;
        this.gameBoard.selectTile(null);
        this.currMove.revertPiece();
        this.currMove.revertTile();
    } else {
        if( this.nUndos >= MAX_UNDOS )
            return ;
        if( this.gameSequence.undoMove(this.currMove.player) )
            this.nUndos++;
    }
};

Game.prototype.pickObj = function(obj) {
    if( this.currMove.player.state == PlayerState.TileConfirmation )
        this.confirmTile(obj);
    else if( this.currMove.player.state == PlayerState.ChooseTile )
        this.chooseTile(obj);
    else
        if( this.currMove.player.pickPiece(obj, this.currMove) )
            this.changePlayerState();
};

Game.prototype.confirmTile = function(obj) {
    if( this.otrio.waitingResponse || this.otrio.receivedResponse )
        return ;

    //Check if selected tile is the same as the one that was confirmed
    if( obj.id == this.currMove.tileDst.id ) {
        this.request();

    //If the tile is not the same then go back to choosing a tile
    } else {
        this.currMove.player.state = PlayerState.ChooseTile;
        this.gameBoard.selectTile(null);
    }
};

Game.prototype.chooseTile = function(tile) {
    this.gameBoard.selectTile(tile);
    this.currMove.player.changeState();
    this.currMove.tileDst = tile;
};



/**
 *  ANIMATIONS
 */
Game.prototype.animatePiece = function () {
    var oldCenter = this.currMove.player.pieces.coords.slice();
    oldCenter[1] += 0.15;
    var newCenter = this.currMove.player.pieces.coords.slice();

    var oldCoords = this.currMove.player.pieces.getTileCoords(this.currMove.tileSrc.id);
    oldCoords[1] += 0.15;
    var newCoords = this.currMove.player.pieces.getTileCoords(this.currMove.tileSrc.id);

    newCenter[1] += 1.0;
    newCoords[1] += 1.0;

    var c1 = new AnimationInfo(oldCenter, oldCoords, [1, 1, 1]);
    var c2 = new AnimationInfo(newCenter, newCoords, [1, 1, 1]);

    this.currMove.piece.animation = new CompleteAnimation("mvPiece", [c1, c2], 0.2);
};

Game.prototype.pieceToBoard = function () {
    var oldCenter = this.currMove.player.pieces.coords.slice();
    oldCenter[1] += 1;
    var middleCenter = [0, 1.2, 0];
    var newCenter = [0, 0.2, 0];

    var oldCoords = this.currMove.player.pieces.getTileCoords(this.currMove.tileSrc.id);
    oldCoords[1] += 1;
    var middleCoords = this.gameBoard.getTileCoords(this.currMove.tileDst.id);
    middleCoords[1] += 1;
    var newCoords = this.gameBoard.getTileCoords(this.currMove.tileDst.id);

    var c1 = new AnimationInfo(oldCenter, oldCoords, [1, 1, 1]);
    var c2 = new AnimationInfo(middleCenter, middleCoords, [sizeTile, sizeTile, 1]);
    var c3 = new AnimationInfo(newCenter, newCoords, [sizeTile, sizeTile, 1]);

    this.currMove.piece.animation = new CompleteAnimation("mvPiece", [c1, c2, c3], 1);
};

Game.prototype.animateToPlayer = function() {
    if( this.cameraFirstAnimation ) {
        // Translate
        // Get new coords
        var nTarget = this.currMove.player.pieces.coords.slice();
        nTarget[2] /= 2;
        var nPosition = this.cameraAnimation.position.slice();
        nPosition[0] += nTarget[0] - this.cameraAnimation.target[0];
        nPosition[1] += nTarget[1] - this.cameraAnimation.target[1];
        nPosition[2] += nTarget[2] - this.cameraAnimation.target[2];

        this.cameraAnimation.setTranslate(nPosition, nTarget, 0.3);

        this.cameraFirstAnimation = false;

    } else if( this.cameraAnimation.translate ) {
        // Rotate
        var angle = Math.atan((this.cameraAnimation.position[2] - this.cameraAnimation.target[2]) / 
                                (this.cameraAnimation.position[0] - this.cameraAnimation.target[0]));
        var desiredAngle = this.currMove.player.id == this.player1.id ? -Math.PI / 2 : Math.PI / 2;
        var rotateAngle = this.cameraAnimation.position[0] < 0 ? angle + desiredAngle : angle - desiredAngle;

        this.cameraAnimation.setRotate([0, 0, 1], rotateAngle, 0.2);
    } else {
        // End
        this.changeState();

        this.cameraFirstAnimation = true;
    }
};

Game.prototype.gameCamera = function() {
    if( this.cameraAnimation.target[0].toFixed(5) != 0 || 
        this.cameraAnimation.target[1].toFixed(5) != 0.2 ||
        this.cameraAnimation.target[2].toFixed(5) != 0 ) {

        var nTarget = [0, 0.2, 0];
        var nPosition = this.cameraAnimation.position.slice();
        nPosition[0] += nTarget[0] - this.cameraAnimation.target[0];
        nPosition[1] += nTarget[1] - this.cameraAnimation.target[1];
        nPosition[2] += nTarget[2] - this.cameraAnimation.target[2];

        this.cameraAnimation.setTranslate(nPosition, nTarget, 0.25);    
    } else
        this.cameraAnimation.setRotate([0, 0, 1], Math.PI * 2, 8);
}

Game.prototype.animateCamera = function() {
    if( this.cameraAnimation == null )
        return ;

    switch( this.gameState ) {
        case GameState.Menu:
        case GameState.EndGame:
            this.gameCamera();
            break;
        case GameState.CameraToP1:
        case GameState.CameraToP2:
            this.animateToPlayer();
            break;
    }
};



/**
 *  SCORE MESSAGES
 */
Game.prototype.incrementScore = function() {
    if( this.currMove.player.id == 1 ) {
        var element = document.getElementById("Player1Score");
        var score = parseInt(document.getElementById("Player1Score").innerHTML);
    } else {
        var element = document.getElementById("Player2Score");
        var score = parseInt(document.getElementById("Player2Score").innerHTML);
    }

    element.innerHTML = (score+1) + "";
}

Game.prototype.changeMessage = function(message) {
    var statusElem = document.getElementById("StatusMessage");
    statusElem.innerHTML = message;
}

/**
 *  PROLOG VALIDATIONS
 */
    /**
     *  MAKE REQUESTS
     */
Game.prototype.request = function() {
    switch( this.currMove.player.state ) {
        case PlayerState.TileConfirmation:
            this.playerMove();
            break;
		case PlayerState.ChoosePiece:
			if(this.currMove.player.playerMode != PlayerMode.Player)
				this.computerMove();
			break;
		case PlayerState.EndGame:
			this.endGame();
			break;
		case PlayerState.ChangeTurn:
			this.changeTurn();
			break;
    }
};

Game.prototype.playerMove = function() {
    // Get board as array and stringify it to send it to the prolog predicate
    var board = this.gameBoard.boardToString();

    var position = this.gameBoard.getTilePos(this.currMove.tileDst.id);
    var line = position[1];
    var column = position[0];

    var pair = this.currMove.piece.pieceToString();

    var player;
    if( this.currMove.player.id == 1 )
        player = 'r';
    else
        player = 'b';

    var mv = this.currMove.player.pieces.piecesToString();
    var player2 = this.currMove.player.id == 1 ? this.player2 : this.player1;
    var mv2 = player2.pieces.piecesToString();

    this.otrio.getPlayerMove(board, line, column, pair, player, mv, mv2);
};

Game.prototype.computerMove = function() {
	// Get board as array and stringify it to send it to the prolog predicate
    var board = this.gameBoard.boardToString();

    var difficulty;
    // Assume that player mode is not Player
    if( this.currMove.player.playerMode == PlayerMode.Easy )
        difficulty = 'easy';
    else
        difficulty = 'hard';

    var player;
    if( this.currMove.player.id == 1 )
        player = 'r';
    else
        player = 'b';

    var mv = this.currMove.player.pieces.piecesToString();
    var player2 = this.currMove.player.id == 1 ? this.player2 : this.player1;
    var mv2 = player2.pieces.piecesToString();

    this.otrio.getComputerMove(difficulty, board, mv, player, mv2);
};

Game.prototype.endGame = function() {
	// Get board as array and stringify it to send it to the prolog predicate
    var board = this.gameBoard.boardToString();
  
    var player;
    if( this.currMove.player.id == 1 )
        player = 'r';
    else
        player = 'b';

    this.otrio.getEndGame(board, player);
};

Game.prototype.changeTurn = function() {
    // Get board as array and stringify it to send it to the prolog predicate
    var board = this.gameBoard.boardToString();

    var player;
    if( this.currMove.player.id == 1 )
        player = 'r';
    else
        player = 'b';
	
	//TO CONCLUDE
};

    /**
     *  RECEIVE RESPONSES
     */
Game.prototype.receivedResponse = function() {
    switch( this.currMove.player.state ) {
        case PlayerState.TileConfirmation:
            // Only happens when the player is human
            this.playerMoveResponse();
            break;
		case PlayerState.ChoosePiece:
            // Only happens when the player is a computer
			this.computerMoveResponse();
			break;
        case PlayerState.EndGame:
            this.endGameResponse();
            break;
		case PlayerState.ChangeTurn:
			this.changeTurnResponse();
			break;
    }
    this.otrio.responseReceived = false;
    this.otrio.counter = 0;
};

Game.prototype.playerMoveResponse = function() {
    // Received response
    var response = this.otrio.playerMove;
    response = response.substring(1, response.length - 1);
    response = response.split(',');


    for( var i = 0; i < response.length; i++ ) {
        var values = response[i].split(':');

        switch(values[0]) {
            case 'NPlayer':
                var newPlayer = values[1];
                break;
            case 'Rep':
                var replay = values[1];
                break;
        }
    }

    if( newPlayer == this.currMove.player.getColor() || replay == "true" )
        this.currMove.player.state = PlayerState.ChooseTile;
    else {
        this.changePlayerState();

        //Add animation to the piece
        this.pieceToBoard();
    }

    //Either way the game board shouldn't end this function with a selected tile
    this.gameBoard.selectTile(null);
};

Game.prototype.computerMoveResponse = function() {
    // Received response
    var response = this.otrio.computerPlaying;
    response = response.substring(1, response.length - 1);
    response = response.split(',');

    for( var i = 0; i < response.length; i++ ) {
        var values = response[i].split(':');
	
        switch(values[0]) {
			case 'Line':
				var line = values[1];
				break;
			case 'Column':
				var column = values[1];
				break;
			case 'Piece':
				var piece = values[1];
                if( piece == 's' )
                    piece = small;
                else if( piece == 'm' )
                    piece = medium;
                else
                    piece = large;
				break;
            case 'NPlayer':
                var newPlayer = values[1];
                break;
            case 'Rep':
                var replay = values[1];
                break;
        }
    }

    // Select piece
    this.currMove.player.computerChoosePiece(piece, this.currMove);
    this.currMove.player.changeState();

    // And confirm it
    this.currMove.player.confirmPiece(this.currMove.piece, this.currMove);
    this.currMove.player.changeState();
    // Let the animation run
    this.animatePiece();

    // Store the destination tile
    this.currMove.tileDst = this.gameBoard.getPosTile(line, column);
};

Game.prototype.endGameResponse = function() {
    // Received response
    var response = this.otrio.endGame;
    if( response == 'true' ) {
        this.incrementScore();
        this.changeMessage("PLAYER " + this.currMove.player.id + " WON");
        this.end();
    }
    else 
        this.changeState();
};

Game.prototype.changeTurnResponse = function() {
    // Received response
    var response = this.otrio.playerTurn;
    response = response.substring(1, response.length - 1);
    response = response.split(',');

	var values = response[0].split(':');
	var newPlayer = values[1];

    //PUT CHANGE TURN FUNCTIONS
};



/**
 *  DISPLAY FUNCTIONS
 */
Game.prototype.registerForPick = function() {
    if( this.gameState == GameState.EndGame || this.gameState == GameState.Menu ||
        // If it's a computer playing then don't register anything for pick
        this.currMove.player.playerMode != PlayerMode.Player )
        return ;
        
    this.scene.pushMatrix();

    if( this.currMove.player.state == PlayerState.ChoosePiece || 
        this.currMove.player.state == PlayerState.PieceConfirmation ) {
        this.currMove.player.pieces.registerForPick();
    }

    else if( this.currMove.player.state == PlayerState.ChooseTile || 
            this.currMove.player.state == PlayerState.TileConfirmation ) {
        this.gameBoard.registerForPick();
    }

    this.scene.popMatrix();
};

//Displays the Game with the respective shader
Game.prototype.display = function(){
    this.scene.pushMatrix();

    this.gameBoard.display();
    this.player1.pieces.display();
    this.player2.pieces.display();
    
    if( this.currMove.piece && this.currMove.piece.animation != null )
            this.currMove.piece.display();

    this.scene.popMatrix();
};