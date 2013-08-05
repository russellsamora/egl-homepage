//main game loop stuff
(function() {
	//private vars
	var _messageTimeout = null,
		_gotGame = null,
		_numFrames = 64,
		_currentFrame = 0,
		_numDrawings = 0;

	window.$game = {

		ready: false,
		playing: false,
		started: false,
		user: null,
		
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
				_checkReturning();
				_getFeed();
				_beginGame();
			}
		},

		showMessage: function(data) {
			$MESSAGE_TEXT.text(data.message);
			var topOffset = 50,
				msgLength = data.message.length + 3;
			
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

			// var msgWidth = parseInt($MESSAGE_BOX.css('width'), 10),
			var msgLeft = Math.floor(mid - msgLength * 8 / 2);
			
			var duration = 300 + msgLength * 100;
			//clear old messages and change position and show and add fade out timer
			$game.hideMessage();
			$MESSAGE_BOX.css({
				top: top,
				left: msgLeft,
				width: msgLength * 8
			}).show();
			_messageTimeout = setTimeout(function() {
				$game.hideMessage();
			}, duration);
		},

		hideMessage: function() {
			clearTimeout(_messageTimeout);
			$MESSAGE_BOX.hide();
		},

		hidePopup: function() {
			$('#popupBox .wiki').hide();
			$('#popupBox .soundcloud').hide();
			$('#popupBox .bio').hide();
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
			if(!$game.ready) {
				requestAnimationFrame($game.startTick);
			} else {
				$('#pregame').fadeOut();
				$game.playing = true;
				$game.started = true;
				$('#blogTease').show();
				setTimeout(function() {
					$('#blogTease').fadeOut(function() {
						$(this).remove();
					});
				}, 10000);
				_tick();
			}
			// $.get('/db/drawingCount.php',
			// 	function(data) {
			// 		_numDrawings = parseInt(data, 10);
			// 		console.log(_numDrawings);
			// 	}, 'text');
		},

		exitAndSave: function() {
			console.log('goodbye');
			$game.updateStorage();
		},

		updateStorage: function() {
			localStorage.setItem('egl-user', JSON.stringify($game.user));
		}
	};

	//private functions
	function _setupGlobals() {
		window.$BODY = $('body');
		window.$GAMEBOARD = $('#game');
		window.$SCROLL_ELEMENT = $('html, body');
		window.$MESSAGE_BOX = $('#message');
		window.$MESSAGE_TEXT = $('#message .messageText');
		window.NAVBAR_HEIGHT = 80;
		window.GAMEBOARD_WIDTH = 2800;
		window.GAMEBOARD_HEIGHT = 1000;
		window.HEIGHT_BUFFER = 10;
		window.WALL_HEIGHT = 200;
		window.DEV_MODE = true;
	}

	function _beginGame() {
		if($game.input.ready && $game.items.ready && $game.audio.ready  && $game.player.ready && $game.whiteboard.ready && $game.tv.ready) {
			$game.input.forceResize();
			$game.ready = true;
			$game.items.checkScreen();
			if(DEV_MODE) {
				$('.character').addClass('devHitBoundP');
				// $('.item, .character, .person').addClass('devBottomBound');
			}
		} else {
			requestAnimationFrame(_beginGame);
		}
	}

	function _checkReturning() {
		//TODO: remove this dev thing
		localStorage.clear();
		var storage = localStorage.getItem('egl-user');
		if(storage) {
			$game.user = JSON.parse(storage);
		} else {
			var id = Math.random().toString(36).slice(2);
			$game.user = {id: id, game: { people: {} }};
			localStorage.setItem('egl-user', JSON.stringify($game.user));
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
			.script('js/game/whiteboard.js')
			.script('js/game/tv.js')
			.script('js/game/wiki.js')
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
			//add / remove items from onscreen rendering
			if($game.player.inTransit) {
				$game.items.checkScreen();
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
		$('#blogTease').rssfeed('http://engagementgamelab.wordpress.com/feed/', {
			limit: 1,
			header: false,
			dateformat: 'date',
			snippet: false,
			// media: false,
			errormsg: 'russell made an error.'
		}, function() {
			$('iframe').remove();
			// //remove the last paragraph tag (super hack!)
			$('#blogTease p').first().remove();
			$('#blogTease br').remove();
			$('#blogTease ul li a').last().remove();
			$('#blogTease ul li img').last().remove();
			$('#blogTease p').last().remove();

			$('#blogTease a').attr('href', 'blog/');
			var s = $('#blogTease p').text();
			var sub = s.substring(0,144) + '... <a target="_blank" href="blog/">[view post]</a>';
			$('#blogTease p').html(sub);
			$('#blogTease').append('<p style="text-align:center;"><button style="width: 30%;" id="hideBlog" class="btn" type="button">HIDE</button><p>');
			$('#hideBlog').on('click', function() {
				$('#blogTease').fadeOut(function() {
					$(this).remove();
				});
			});
		});
	}
})();