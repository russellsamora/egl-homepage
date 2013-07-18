//handles all user inputs
(function() {
	var _preventMovement,
		_preventMovementTimeout;

	var input = $game.input = {

		maxScroll: null,
		width: null,
		height: null,
		ready: false,

		init: function() {
			//reset scroll top
			$SCROLL_ELEMENT.scrollTop(0);
			input.ready = true;
			console.log('input ready');
		},

		forceResize: function() {
			_resize();
		}
	};
	
	input.init();
	_bindEvents();

	//private functions
	function _bindEvents() {
		$BODY.on('click', '.playGameButton', function(e) {
			e.preventDefault();
			$('.playGame').hide();
			$('.loading').show();
			$game.startTick();
			return false;
		});

		$BODY.on('click', '#game .soundcloud a', function(e) {
			_preventMove();
		});

		//clicking on gameboard for move
		$BODY.on('click touch', '#game', function(e) {
			if($game.items.showingBio) {
				$('#bioCard').hide();	
			}
			if(!$game.player.inTransit && $game.playing && !_preventMovement) {
				e.preventDefault();
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
				return false;
			}
		});

		//clicking on item, show message or do action
		$BODY.on('click touch', '#game .item', function(e) {
			if(!$game.player.inTransit && $game.playing) {
				_preventMove();
				var key = $(this).attr('data-key');
				$game.items.clickedItem(key, this);
			}
		});

		$BODY.on('click touch', '#game .person', function(e) {
			if(!$game.player.inTransit && $game.playing) {
				_preventMove();
				var key = $(this).attr('data-key');
				$game.items.clickedPerson(key, this);
			}
		});

		$BODY.on('click touch', '#bioCard', function() {
			$(this).hide();
		});

		$(window).on('resize', _resize);

		//save out any important info on exit
		$(window).on('beforeunload', function() {
			$game.exitAndSave();
		});
	}

	function _resize() {
		input.width = $(window).width();
		input.height = $(window).height();
		input.longest = (input.width + input.height) * 2;
		input.maxScroll = { 
			left: Math.max(0,GAMEBOARD_WIDTH - input.width),
			top: Math.max(0,GAMEBOARD_HEIGHT - input.height + NAVBAR_HEIGHT)
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