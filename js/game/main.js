//main game loop stuff
(function() {
	//private vars
	var _messageTimeout = null;

	var self = window.$game = {

		ready: false,
		playing: false,
		
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
		},

		showMessage: function(data) {
			$MESSAGE_TEXT.text(data.message);	
			
			//figure out how to align it center
			var	top = parseInt(data.el.style.top,10) - 50,
				left = parseInt(data.el.style.left,10),
				mid = left + parseInt(data.el.style.width,10) / 2;

			var msgWidth = parseInt($MESSAGE_BOX.css('width'), 10),
				msgLeft = Math.floor(mid - msgWidth / 2);
			
			//clear old messages and change position and show and add fade out timer
			clearTimeout(_messageTimeout);
			$MESSAGE_BOX.hide().css({
				top: top,
				left: msgLeft
			});

			var duration = data.message.length * 80;

			$MESSAGE_BOX.show();
			_messageTimeout = setTimeout(function() {
				$MESSAGE_BOX.fadeOut();
			}, duration);
		},

		hideMessage: function() {
			clearTimeout(_messageTimeout);
			$MESSAGE_BOX.fadeOut();
		}
	};
	_setupGlobals();

	//private functions
	function _setupGlobals() {
		window.$BODY = $('body');
		window.$GAMEBOARD = $('#game');
		window.$SCROLL_ELEMENT = $('html, body');
		window.$MESSAGE_BOX = $('#message');
		window.$MESSAGE_TEXT = $('#message p');
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
			if(DEV_MODE) {
				$('.character').addClass('devHitBoundP');
				$('.item, .character, .person').addClass('devBottomBound');
			}
		} else {
			requestAnimationFrame(_beginGame);
		}
	}

	function _checkReturning() {
		var test = localStorage.getItem('egl-game');
		if(test) {
			console.log(test);
			var d = JSON.parse(test);
			console.log(d);
		} else {
			var data = {name: 'russell', age: 26};
			localStorage.setItem('egl-game', JSON.stringify(data));
		}
	}
})();