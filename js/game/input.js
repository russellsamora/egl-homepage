//handles all user inputs
(function() {
	var _preventMovement,
		_preventMovementTimeout;

	var self = $game.input = {

		maxScroll: null,
		width: null,
		height: null,
		ready: false,

		init: function() {
			//reset scroll top
			$SCROLL_ELEMENT.scrollTop(0);
			self.ready = true;
		},

		forceResize: function() {
			_resize();
		}
	};
	
	self.init();
	_bindEvents();

	//private functions
	function _bindEvents() {
		$BODY.on('click', '.playGameButton', function(e) {
			e.preventDefault();
			if($game.ready) {
				$('#pregame').fadeOut('fast', function() {
					$game.playing = true;
					$game.started = true;
				});
			}
			return false;
		});

		//clicking on gameboard for move
		$BODY.on('click touch', '#game', function(e) {
			e.preventDefault();
			if(!$game.player.inTransit && $game.playing && !_preventMovement) {
				//hide message boxes
				$game.hideMessage();
				//constrain to bounds of the room
				if(e.pageY < WALL_HEIGHT + NAVBAR_HEIGHT) { return false; }
				// if(e.pageY > GAMEBOARD_HEIGHT + NAVBAR_HEIGHT - $game.player.offset.y) { return false; }
				if(e.pageY > GAMEBOARD_HEIGHT + NAVBAR_HEIGHT) { return false; }
				if(e.pageX <  $game.player.offset.x) { return false; }
				if(e.pageX > GAMEBOARD_WIDTH - $game.player.offset.x) { return false; }

				// var y = e.pageY - $game.player.offset.y,
				var y = e.pageY - $game.player.h,
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

		//clicking on item, show message or do action
		$BODY.on('click touch', '#game .item', function(e) {
			if(!$game.player.inTransit && $game.playing) {
				_preventMove();
				var key = $(this).attr('data-key');
				$game.items.clicked(key, this);
			}
		});

		$BODY.on('click touch', '#player', function(e) {
			if(!$game.player.inTransit && $game.playing) {
				_preventMove();
			}
		});

		$(window).on('resize', _resize);
	}

	function _resize() {
		self.width = $(window).width();
		self.height = $(window).height();
		self.longest = (self.width + self.height) * 2;
		self.maxScroll = { 
			left: Math.max(0,GAMEBOARD_WIDTH - self.width),
			top: Math.max(0,GAMEBOARD_HEIGHT - self.height + NAVBAR_HEIGHT)
		};

		var gameOn = $('#game').css('display');
		//resuming game
		if(gameOn !== 'none' && !$game.playing && $game.started) {
			$game.resumeGame();
		} else if(gameOn === 'none' && $game.playing && $game.started) {
			$game.pauseGame();
		}
	}

	//this means an item was clicked on so we dont wanna move on it, but do its action
	function _preventMove () {
		clearTimeout(_preventMovementTimeout);
		_preventMovement = true;
		_preventMovementTimeout = setTimeout(function() {
			_preventMovement = false;
		}, 17);
	}

})();