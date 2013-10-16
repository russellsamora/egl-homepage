//main game loop stuff
(function() {
	//private vars
	var _messageTimeout = null,
		_gotGame = null,
		_numFrames = 64,
		_currentFrame = 0,
		_numDrawings = 0,
		_discoMode = false,
		_maxMsgWidth = 520;

	window.$game = {

		ready: false,
		playing: false,
		started: false,
		user: null,
		targetOrder: ['stephen','eric','christina','russell','sam','aidan','jedd','jesse'],
		iconNames: {
			dongle: 'bolt',
			trophy: 'trophy',
			badge: 'star'
		},
		
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
			//add link for bio
			var topOffset = 50,
				msgLength = data.message.length + 3;

			if(!$game.localStore.playing) {
				if(data.bioKey) {
					data.message += ' <a href"#" data-key="' + data.bioKey + '">view bio</a>';
					msgLength += 10;
				}

				if(data.crat) {
					data.message += ' <a href"#" data-key="crat">play now</a>';
					msgLength += 10;
				}

				$MESSAGE_TEXT.html(data.message);
				
				if(data.bioKey || data.crat) {
					$game.input.bindMessageLink();
				}
			} else {
				if(data.crat) {
					data.message +=  ' <a href"#" data-key="crat">stop</a>';
					msgLength += 5;
				}
				if(data.target) {
					data.message += ' <a href"#>view</a>';
					msgLength += 5;
				}
				$MESSAGE_TEXT.html(data.message);
				
				if(data.target) {
					$game.input.bindChallengeLink();
				}
				if(data.crat) {
					$game.input.bindMessageLink();
				}
			}

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
			var realMsgLength = Math.min(msgLength * 9, _maxMsgWidth);
			var realMsgWidth = Math.min(msgLength * 9, _maxMsgWidth);
			var msgLeft = Math.floor(mid - realMsgLength / 2);

			var duration = 300 + msgLength * 100;
			//clear old messages and change position and show and add fade out timer
			$game.hideMessage();
			$MESSAGE_TEXT.removeClass('centerText');
			if(realMsgWidth < _maxMsgWidth) {
				$MESSAGE_TEXT.addClass('centerText');
			}
			$MESSAGE_BOX.css({
				top: top,
				left: msgLeft,
				width: realMsgWidth
			}).show();

			if(!data.crat && !data.target) {
				_messageTimeout = setTimeout(function() {
					$game.hideMessage();
				}, duration);
			}
		},

		hideMessage: function() {
			clearTimeout(_messageTimeout);
			$MESSAGE_BOX.hide();
		},

		hidePopup: function() {
			$('#popupBox .wiki').hide();
			$('#popupBox .soundcloud').hide();
			$('#popupBox .bio').hide();
			$('#popupBox .gameInstructions').hide();
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
				$game.started = true;
				$('#help').show();
				// $('#blogTease').show();
				// setTimeout(function() {
				// 	$('#blogTease').fadeOut(function() {
				// 		$(this).remove();
				// 	});
				// }, 10000);
				setTimeout(function() {
					$('#help').hide().remove();
				}, 3000);
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
			localStorage.setItem('egl-game', JSON.stringify($game.localStore));
		},

		showGameInstructions: function() {
			$game.hideMessage();
			$game.hidePopup();
			$('#popupBox .gameInstructions').show();
			$('#popupBox').show();
			$game.localStore.started = true;
			$game.localStore.playing = true;
			$('#cover').show();
			$game.localStore.targetPerson = $game.targetOrder[$game.localStore.targetIndex];
			if($game.localStore.targetIndex > 0) {
				$game.localStore.previousPerson = $game.targetOrder[$game.localStore.targetIndex -1];
			} else {
				$game.localStore.previousPerson = null;
			}
			$game.updateStorage();
		},

		stopPlaying: function() {
			$game.localStore.playing = false;
			$('#cover').hide();
			$game.updateStorage();
		},

		toggleDiscoMode: function() {
			_discoMode = !_discoMode;
			if(!_discoMode) {
				$('#cover').css('background','rgba(0,0,0,.4)');
			}
		},

		spawnReward: function(reward) {
			var html = '<p class="reward">+' + reward.count + ' <i class="icon-' + $game.iconNames[reward.name] + '"></i></p>';
			$GAMEBOARD.append(html);
			//add to inventory
			var selector = '.' + reward.name;
			for(var i = 0; i < reward.count; i++) {
				$(selector).append('<i class="icon-' + $game.iconNames[reward.name] + '">');
			}

			//animated it off
			$('.reward').animate({
				opacity: 1
			}, 500, function() {
				$(this).animate({
					opacity: 0,
					top: '0px',
				},2000, function() {
					$(this).remove();
				});
				$('#inventoryButton p i').animate({opacity: 0.5}, 500, function() {
					$('#inventoryButton p i').animate({opacity: 1},500);
				});
			});
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
		window.DEV_MODE = false;
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
			$game.playing = true;
			_tick();
		} else {
			requestAnimationFrame(_beginGame);
		}
	}

	function _checkReturning() {
		//TODO: remove this dev thing
		localStorage.clear();
		var storage = localStorage.getItem('egl-game');
		if(storage) {
			$game.localStore = JSON.parse(storage);
		} else {
			var id = Math.random().toString(36).slice(2);
			$game.localStore = {
				id: id, 
				people: {}, 
				targetIndex: 0, 
				answers: [], 
				tasks: {stephen: true, eric: false, christina: false, sam: false, russell: true, aidan: false, jedd: false, jesse: false},
				inventory: {
					trophies: 0,
					dongles: 0,
					badges: 0
				}
			};

			$game.updateStorage();
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
				if(_discoMode) {
					var r = Math.floor(Math.random() * 255),
						g = Math.floor(Math.random() * 255),
						b = Math.floor(Math.random() * 255);
					var col = 'rgba(' + r +','+g+','+b+',0.4)';
					$('#cover').css('background', col);
				}
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
			//$('#blogTease p').last().remove();

			$('#blogTease a').attr('href', 'blog/');

			//get the text to truncate
			var textP = $('#blogTease p').eq(1),
				allText = textP.text();
			var sub = allText.substring(0,144) + '... <a target="_blank" href="blog/">[view post]</a>';
			textP.html(sub);

			//remove everything after first text paragraph
			var sliced = $('#blogTease p').slice(2);
			sliced.each(function(i) {
				$(this).remove();
			});
			$('#blogTease').append('<p style="text-align:center;"><button style="width: 30%;" id="hideBlog" class="btn" type="button">HIDE</button><p>');
			
			$('#hideBlog').on('click', function() {
				$('#blogTease').fadeOut(function() {
					$(this).remove();
				});
			});
		});
	}
})();