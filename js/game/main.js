//main game loop stuff
(function() {
	//private vars
	var _messageTimeout = null,
		_gotGame = null,
		_numFrames = 64,
		_currentFrame = 0,
		_numDrawings = 0,
		_drawingSaved = false;

	window.$game = {

		ready: false,
		playing: false,
		started: false,
		
		init: function() {
			//see if the game should be started up based on screen size
			var gameOn = $('#game').css('display');
			if(gameOn !== 'none') {
				//do a check for browser capabilities
				//modernizr...
				//start tick to see if everytthing is loaded up
				_setupGlobals();
				_gotGame = true;
			} else {
				//must handle resize different if we don't initially load game
				$(window).on('resize', _resize);
				_gotGame = false;
			}
			return _gotGame;
		},

		beginGame: function() {
			if(_gotGame) {
				_getFeed();
				_beginGame();
			}
		},

		showMessage: function(data) {
			$MESSAGE_TEXT.text(data.message);
			var topOffset = 50;
			
			if(data.soundcloud) {
				$('.soundcloud').show();
				$('.soundcloud p').html('<a target="_blank" href="' + data.soundcloud.link + '">' + data.soundcloud.user + '</a>');
				topOffset = 100;
			} else {
				$('.soundcloud').hide();
			}
			
			//figure out how to align it center
			var	top = parseInt(data.el.style.top,10) - topOffset,
				left = parseInt(data.el.style.left,10),
				mid = left + parseInt(data.el.style.width,10) / 2;

			var msgWidth = parseInt($MESSAGE_BOX.css('width'), 10),
				msgLeft = Math.floor(mid - msgWidth / 2);
			
			var duration = 500 + data.message.length * 100;
			//clear old messages and change position and show and add fade out timer
			$game.hideMessage();
			$MESSAGE_BOX.css({
				top: top,
				left: msgLeft
			});

			$MESSAGE_BOX.show();
			_messageTimeout = setTimeout(function() {
				$game.hideMessage();
			}, duration);
		},

		hideMessage: function() {
			clearTimeout(_messageTimeout);
			$MESSAGE_BOX.hide();
		},

		pauseGame: function() {
			$game.playing = false;
			$game.audio.pause();
		},

		resumeGame: function() {
			$game.playing = true;
			$game.audio.resume();
			_tick();
		},

		startTick: function() {
			$game.playing = true;
			$game.started = true;
			$('#blog').show();
			_tick();
			$.get('/db/drawingCount.php',
				function(data) {
					_numDrawings = parseInt(data, 10);
					console.log(_numDrawings);
				}, 'text');
		},

		exitAndSave: function() {
			console.log('goodbye');
			$game.saveDrawing();
		},

		saveDrawing: function() {
			var whiteboard = document.getElementById('whiteboardCanvas'),
				url = whiteboard.toDataURL('img/png');
			$.post('/db/saveDrawing.php', {image: url},
				function(res) {
					if(res === 'good') {
						_drawingSaved = true;
					}
				}, 'text');
		}
	};

	//private functions
	function _setupGlobals() {
		window.$BODY = $('body');
		window.$GAMEBOARD = $('#game');
		window.$SCROLL_ELEMENT = $('html, body');
		window.$MESSAGE_BOX = $('#message');
		window.$MESSAGE_TEXT = $('#message .messageText');
		window.NAVBAR_HEIGHT = 72;
		window.GAMEBOARD_WIDTH = 2000;
		window.GAMEBOARD_HEIGHT = 1000;
		// window.HEIGHT_BUFFER = 20;
		window.WALL_HEIGHT = 200;
		window.DEV_MODE = false;
	}

	function _beginGame() {
		if($game.input.ready && $game.items.ready && $game.audio.ready  && $game.player.ready) {
			$game.input.forceResize();
			$game.ready = true;
			$('.playGameButton').text('play!');

			if(DEV_MODE) {
				$('.character').addClass('devHitBoundP');
				// $('.item, .character, .person').addClass('devBottomBound');
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

	function _resize() {
		var gameOn = $('#game').css('display');
		if(gameOn !== 'none') {
			//dissable resize function to trigger game start
			$(window).off('resize');
			_setupGlobals();
			_gotGame = true;
			//load the rest of the scripts
			$LAB
			.script('js/game/input.js')
			.script('js/game/audio.js')
			.script('js/game/items.js')
			.script('js/game/player.js').wait(function() {
				$game.beginGame();
			});
		}
	}

	function _tick() {
		if($game.playing) {
			_currentFrame++;
			if(_currentFrame >= _numFrames) {
				_currentFrame = 0;
			}
			if(_currentFrame % 8 === 0) {
				$game.items.updateItemAnimations();
				$game.player.idle();
			}
			requestAnimationFrame(_tick);
		}
	}
	//gets the blog feed and shows on screen
	function _getFeed() {
		$('#blog').rssfeed('http://engagementgamelab.wordpress.com/feed/', {
			limit: 1,
			header: false,
			dateformat: 'date',
			snippet: false,
			// media: false,
			errormsg: 'russell made an error.'
		}, function() {
			$('iframe').remove();
			// //remove the last paragraph tag (super hack!)
			$('#blog p').first().remove();
			$('#blog br').remove();
			$('#blog ul li a').last().remove();
			$('#blog ul li img').last().remove();
			$('#blog p').last().remove();

			$('#blog a').attr('href', 'blog/');
			var s = $('#blog p').text();
			var sub = s.substring(0,144) + '... <a target="_blank" href="blog/">[view post]</a>';
			$('#blog p').html(sub);
			$('#blog').append('<p style="text-align:center;"><button style="width: 30%;" id="hideBlog" class="btn btn-warning" type="button">hide</button><p>');
			$('#hideBlog').on('click', function() {
				$('#blog').fadeOut(function() {
					$(this).remove();
				});
			});
		});
	}
})();