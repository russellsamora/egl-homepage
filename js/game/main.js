//main game loop stuff
(function() {
	var self = window.$game = {

		ready: false,
		
		init: function() {
			//see if the game should be started up based on screen size
			var gameOn = $('#game').css('display');
			if(gameOn !== 'none') {
				//do a check for browser capabilities
				//modernizr...
				//start tick to see if everytthing is loaded up
				_beginGame();
			} else {
				return;
			}
		}
	};
	_setupGlobals();

	//private functions
	function _setupGlobals() {
		window.$BODY = $('body');
		window.$GAMEBOARD = $('#game');
		window.$SCROLL_ELEMENT = $('html, body');
		window.NAVBAR_HEIGHT = 72;
		window.GAMEBOARD_WIDTH = 2000;
		window.GAMEBOARD_HEIGHT = 1000;
		window.HEIGHT_BUFFER = 20;
		window.WALL_HEIGHT = 200;
		window.DEV_MODE = false;
	}

	function _beginGame() {
		if($game.input.ready && $game.items.ready && $game.audio.ready  && $game.player.ready) {
			$game.ready = true;
			$('.playGameButton').text('play!');
		} else {
			requestAnimationFrame(_beginGame);
		}
	}
})();