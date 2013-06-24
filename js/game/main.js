//determine if we are playing the game based on some css attribute?
(function() {
	var self = window.$game = {

		init: function() {
			//see if the game should be started up based on screen size
			var gameOn = $('#game').css('display');
			if(gameOn !== 'none') {
				//do a check for browser capabilities
				//modernizr...
				$game.player.init('player0');
				console.log('start game');
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
	}

})();