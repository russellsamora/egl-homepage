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
				$game.player.init('player0');
			} else {
				return;
			}
		}
	};
	setupGlobals();

	//private functions
	function setupGlobals() {
		window.$BODY = $('body');
		window.$GAMEBOARD = $('#game');
		window.$SCROLL_ELEMENT = $('html, body');
		window.NAVBAR_HEIGHT = 72;
		window.GAMEBOARD_WIDTH = 2000;
		window.GAMEBOARD_HEIGHT = 1000;
		window.HEIGHT_BUFFER = 20;
		window.WALL_HEIGHT = 200;
	}

})();