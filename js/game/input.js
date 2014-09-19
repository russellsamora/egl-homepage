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
			_preventMovement = true;
			$SCROLL_ELEMENT.scrollTop(0);
			$SCROLL_ELEMENT.scrollLeft(0);
			input.ready = true;
			console.log('input ready');
		},

		forceResize: function() {
			_resize();
		},

		//this means an item was clicked on so we dont wanna move on it, but do its action
		preventMove: function () {
			clearTimeout(_preventMovementTimeout);
			_preventMovement = true;
			_preventMovementTimeout = setTimeout(function() {
				_preventMovement = false;
			}, 17);
		},

		preventMoveForever: function() {
			_preventMovement = true;
		},

		enableMove: function() {
			_preventMovement = false;
		},

		bindMessageLink: function() {
			$('.messageText a').on('click', function(e) {
				e.preventDefault();
				var key = $(this).attr('data-key');
				if(key === 'crat') {
					if($game.localStore.playing) {
						$('#inventoryButton').hide();
						$game.stopPlaying();	
					} else {
						$('#inventoryButton').show();
						$game.showGameInstructions();
					}
				} else if(key === 'nothanks') {
					//$('#message').hide();
					$game.hideMessage();
				} else if(key === 'reset') {
					$game.resetGame();
					//$('#message').hide();
					$game.hideMessage();
				} else {
					$game.people.showBioCard(key);	
				}
				input.preventMove();
				$('messageText a').off('click');
				return false;
			});
		},

		bindChallengeLink: function() {
			$('.messageText a').on('click', function(e) {
				e.preventDefault();
				$game.people.showChallenge();
				input.preventMove();
				$('messageText a').off('click');
				return false;
			});
		},

		bindNextSlide: function() {
			$('#challengeBox .nextSlide').on('click', function(e) {
				e.preventDefault();
				$('#challengeBox .nextSlide').off('click');
				$game.people.nextSlide();
				return false;
			});
		},
	};
	
	input.init();
	_bindEvents();

	//private functions
	function _bindEvents() {
		//disable scroll ipad?
		// document.ontouchmove = function(e){ e.preventDefault(); }
		
		$BODY.on('click', '.playGameButton', function(e) {
			e.preventDefault();
			//hide PLAY button show loading
			$('.playBig').hide();
			$('.loading').show();
			$game.startTick();
			return false;
		});

		$BODY.on('click', '#game .soundcloud a', function(e) {
			input.preventMove();
		});
		//clicking on gameboard for move
		$BODY.on('click touch', '#game', function(e) {
			if($game.people.showingBio) {
				$('#popupBox').hide();
				$game.people.showingBio = false;
			}
			if(!$game.player.inTransit && $game.playing && $game.started && !_preventMovement) {
				var playerOffsetX = $game.player.offset.x;
				e.preventDefault();
				//hide message boxes
				$game.hideMessage();
				//constrain to bounds of the room
				if(e.pageY < WALL_HEIGHT + NAVBAR_HEIGHT + 5) { return false; }
				// if(e.pageY > GAMEBOARD_HEIGHT + NAVBAR_HEIGHT - $game.player.offset.y) { return false; }
				if(e.pageY > GAMEBOARD_HEIGHT + NAVBAR_HEIGHT) { return false; }
				if(e.pageX <  playerOffsetX) { return false; }
				if(e.pageX > GAMEBOARD_WIDTH - playerOffsetX) { return false; }

				// var y = e.pageY - $game.player.offset.y,
				var y = e.pageY - $game.player.h - $game.player.offset.y,
					x = e.pageX - playerOffsetX;

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
				var key = $(this).attr('data-key');
				$game.items.clickedItem(key, this);
			}
		});

		$BODY.on('click touch', '#game .person', function(e) {
			if(!$game.player.inTransit && $game.playing) {
				input.preventMove();
				var key = $(this).attr('data-key');
				$game.people.clickedPerson(key, this);
			}
		});

		$BODY.on('click touch', '#popupBox', function() {
			$game.input.preventMove();
			$(this).hide();
		});

		$(window).on('resize', _resize);

		//save out any important info on exit
		$(window).on('beforeunload', function() {
			$game.exitAndSave();
		});		

		$BODY.on('click','.beginGame', function(e) {
			$game.reallyStarted = true;
			e.preventDefault();
			$('#popupBox').hide(); 
			return false;
		});

		$BODY.on('click', '#inventoryButton, #inventory', function(e) {
			e.preventDefault();
			$('#inventory').toggle();
			return false;
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
		$game.items.checkScreen();
		$game.people.checkScreen();
		var gameOn = $('#game').css('display');
		//resuming game
		if(gameOn !== 'none' && !$game.playing && $game.started) {
			$game.resumeGame();
		} else if(gameOn === 'none' && $game.playing && $game.started) {
			$game.pauseGame();
		}
	}

})();