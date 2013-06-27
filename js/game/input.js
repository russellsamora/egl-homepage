//handles all user inputs
(function() {
	// var _preventMovement = false;

	var self = $game.input = {

		maxScroll: null,
		width: null,
		height: null,

		init: function() {
			_resize();
		}
	};
	
	self.init();
	_bindEvents();

	//private functions
	function _bindEvents() {
		$BODY.on('click', '.playGameButton', function(e) {
			e.preventDefault();
			$('#pregame').fadeOut('fast');
			return false;
		});

		$BODY.on('click touch', '#game', function(e) {
			e.preventDefault();
			if(!$game.player.inTransit) {
				// if(!_preventMovement) {
				
				//hide message boxes
				// clearTimeout(messageTimeout);
				// $messageBox.fadeOut();
				//constrain to bounds of the room
				console.log(e.pageY);
				if(e.pageY < WALL_HEIGHT + NAVBAR_HEIGHT) { return false; }
				if(e.pageY > GAMEBOARD_HEIGHT + NAVBAR_HEIGHT - $game.player.offset.y) { return false; }
				if(e.pageX <  $game.player.offset.x) { return false; }
				if(e.pageX > GAMEBOARD_WIDTH - $game.player.offset.x) { return false; }

				var y = e.pageY - $game.player.offset.y,
					x = e.pageX - $game.player.offset.x;

				var input = {
					x: x,
					y: y,
					edgeX: e.clientX,
					edgeY: e.clientY
				};
				$game.player.movePlayer(input);
			}
			return false;
		});

		$(window).on('resize', _resize);
	}

	function _resize() {
		self.width = $(window).width();
		self.height = $(window).height();
		self.maxScroll = { 
			left: Math.max(0,GAMEBOARD_WIDTH - self.width),
			top: Math.max(0,GAMEBOARD_HEIGHT - self.height + NAVBAR_HEIGHT)
		};
	}
})();