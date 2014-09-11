//main game loop stuff
(function() {
	//private vars
	var _messageTimeout = null,
		_gotGame = null,
		_numFrames = 64,
		_currentFrame = 0,
		_numDrawings = 0,
		_discoMode = false,
		_maxMsgWidth = 520,
		_msgFadeDuration = 100;

	window.$game = {

		ready: false,
		playing: false,
		started: false,
		user: null,
		hasScrolled: false,
		targetOrder: ['stephen','eric','christina','russell','sam','aidan','jedd','jesse'],
		iconNames: {
			dongle: 'code-fork',
			award: 'trophy',
			shield: 'shield',
			bitcoin: 'bitcoin'
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
				//_getFeed();
				_beginGame();
			}
		},

		showMessage: function(data) {
			$game.hidePopup();
			//add link for bio
			var topOffset = 50,
				msgLength = data.message.length + 3;

			if(!$game.localStore.playing) {
				if(data.bioKey) {
					data.message += ' <br><a href"#" data-key="' + data.bioKey + '">view bio</a>';
					msgLength += 10;
					$game.audio.playFx('pop');
				}

				if(data.crat) {
					data.message += ' <br><a href"#" data-key="crat">play now</a><a href="#" class="nothanks" data-key="nothanks">no thanks</a>';
					msgLength += 10;
					$game.audio.playFx('pop');
				}

				$MESSAGE_TEXT.html(data.message);
				
				if(data.bioKey || data.crat) {
					$game.input.bindMessageLink();
				}
			} else {
				if(data.crat) {
					//data.message +=  ' <a href"#" data-key="crat">stop</a>';
					data.message +=  ' <a href"#" data-key="crat">stop</a><a href="#" class="nothanks" data-key="reset">reset</a>';
					msgLength += 5;
					$game.audio.playFx('pop');
				}
				if(data.target) {
					data.message += ' <a href"#>view</a>';
					msgLength += 5;
					$game.audio.playFx('pop');
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
			
			if(data.discoball) {
				topOffset = -150;
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
			$('#popupBox').hide();
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
				setTimeout(function() {
					$('#help').hide().remove();
					_flashHelpArrows(true);
				}, 3000);
				$game.player.entrance();
			}
		},

		exitAndSave: function() {
			console.log('goodbye');
			$game.updateStorage();
		},

		updateStorage: function() {
			sessionStorage.setItem('egl-game', JSON.stringify($game.localStore));
		},

		showGameInstructions: function() {
			$game.hideMessage();
			$game.hidePopup();
			$('#popupBox .gameInstructions').show();
			$('#popupBox').show();
			$game.localStore.started = true;
			$game.localStore.playing = true;
			$('#cover').fadeIn(1000, 'swing');
			$('.discoball').show();
			$('.discoball').animate({
				top: '-150px'
			});

			$game.localStore.targetPerson = $game.targetOrder[$game.localStore.targetIndex];
			if($game.localStore.targetIndex > 0) {
				$game.localStore.previousPerson = $game.targetOrder[$game.localStore.targetIndex -1];
			} else {
				$game.localStore.previousPerson = null;
			}
			$game.updateStorage();
		},

		stopPlaying: function() {
			clearTimeout(_messageTimeout);
			$game.hideMessage();
			$game.localStore.playing = false;
			$('#cover').fadeOut(1000, 'swing');
			//$('.discoball').hide();
			$('.discoball').animate({
				top: '-300px'
			}, function(){
				$('.discoball').hide();
			});
			$game.updateStorage();
			$game.reallyStarted = false;
		},

		resetGame: function() {
			sessionStorage.clear();
			var storage = sessionStorage.getItem('egl-game');
			var id = Math.random().toString(36).slice(2);
			$game.localStore = {
				id: id, 
				people: {}, 
				targetIndex: 0, 
				answers: [], 
				tasks: {
					stephen: true,
					eric: false,
					christina: false,
					sam: false,
					russell: false,
					aidan: false,
					jedd: false,
					jesse: false
				},
				inventory: {
					awards: 0,
					dongles: 0,
					badges: 0,
					coins: 0
				},
			};
			$game.stopPlaying();
		},

		toggleDiscoMode: function() {
			_discoMode = !_discoMode;
			if(!_discoMode) {
				$('.discoball').animate({
					top: '-150px'
				})
				$('#cover').css('background','rgba(0,0,0,.4)');
			} else {
				$('.discoball').animate({
					top: '-10px'
				},1000);
			}
		},

		spawnReward: function(reward) {
			var html = '<p class="reward">';
			for (var name in reward.count) {
				var count = reward.count[name];
				var icon = $game.iconNames[name];
				html += ' +' + count + '<i class="icon-' + icon + '"></i>';

				//add to inventory
				var selector = '.' + name;
				for(var i = 0; i < count; i++) {
					$(selector).append('<i class="icon-' + icon + '">');
				}
			}
			html += '</p>';
			 
			$GAMEBOARD.append(html);
			
			//animated it off
			$('.reward').animate({
				opacity: 1
			}, 500, function() {
				$(this).delay(500).animate({
					opacity: 0,
					top: '0px',
				},2000, function() {
					$(this).remove();
				});
				$('#inventoryButton p i').animate({opacity: 0.2}, 500, function() {
					$('#inventoryButton p i').animate({opacity: 1},500);
				});
			});
		},

		taskComplete: function() {
			var html = '<p class="taskcomplete">TASK COMPLETE</p>';
			$GAMEBOARD.append(html);
			$game.audio.playFx('taskcomplete');
			
			//animated it off
			$('.taskcomplete').delay(1000).fadeOut(function() {
				$(this).remove();
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
		window.TILE_SIZE = 25;
		window.GRID = new PF.Grid(GAMEBOARD_WIDTH / TILE_SIZE, GAMEBOARD_HEIGHT / TILE_SIZE);
	}

	function _beginGame() {
		if($game.input.ready && $game.items.ready && $game.people.ready && $game.audio.ready  && $game.player.ready && $game.whiteboard.ready && $game.tv.ready) {
			$game.input.forceResize();
			$game.ready = true;
			$game.items.checkScreen();
			$game.people.checkScreen();
			if(DEV_MODE) {
				$('.character').addClass('devHitBoundP');
				// $('.item, .character, .person').addClass('devBottomBound');
			}
			$game.playing = true;

			//if we're loading a previously started game, set game mode
			if ($game.localStore.playing) {
				$('#cover').show();
				$('.discoball').show();
				$('.discoball').top = '-150px';
				$('.discoball').animate({
					top: '-150px'
				});
				$game.reallyStarted = true;
			}
			_tick();
		} else {
			requestAnimationFrame(_beginGame);
		}
	}

	function _checkReturning() {
		//sessionStorage.clear();
		var storage = sessionStorage.getItem('egl-game');
		if(storage) {
			$game.localStore = JSON.parse(storage);
		} else {
			var id = Math.random().toString(36).slice(2);
			$game.localStore = {
				id: id, 
				people: {}, 
				targetIndex: 0, 
				answers: [], 
				tasks: {
					stephen: true,
					eric: false,
					christina: false,
					sam: false,
					russell: false,
					aidan: false,
					jedd: false,
					jesse: false
				},
				inventory: {
					awards: 0,
					dongles: 0,
					badges: 0,
					coins: 0
				},
			};
			// $game.localStore = {
			// 	id: id, 
			// 	people: {}, 
			// 	targetIndex: 7,
			// 	targetPerson: 'jesse', 
			// 	answers: [['a'],['b'],['c'],['d'],['e','f','z'],['g'],['h'],['i']],
			// 	tasks: {
			// 		stephen: true,
			// 		eric: true,
			// 		christina: true,
			// 		sam: true,
			// 		russell: true,
			// 		aidan: true,
			// 		jedd: true,
			// 		jesse: true
			// 	},
			// 	inventory: {
			// 		awards: 0,
			// 		dongles: 0,
			// 		badges: 0,
			// 		coins: 0
			// 	},
			// 	over: true
			// };
			$game.updateStorage();
		}
	}

	function _resize() {
		var gameOn = $('#game').css('display');
		if(gameOn !== 'none') {
			//disable resize function to trigger game start
			$(window).off('resize');
			_setupGlobals();
			_gotGame = true;
			//load the rest of the scripts
			$LAB
			.script('js/libs/pathfinding-browser.min.js')
			.script('js/game/input.js')
			.script('js/game/audio.js')
			.script('js/game/items.js')
			.script('js/game/people.js')
			.script('js/game/whiteboard.js')
			.script('js/game/tv.js')
			.script('js/game/wiki.js')
			.script('js/game/codegame.js')
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
				$game.people.checkScreen();
			}
			if(_currentFrame % 8 === 0) {
				$game.items.updateAnimations();
				$game.people.updateAnimations();
				$game.player.idle();
				$game.player.tick();
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

	function _flashHelpArrows(blink) {
		if($game.hasScrolled) {
			$('#helpArrows').fadeOut('slow', function(){
				$('#helpArrows').remove()
			});
		} else {
			$('#helpArrows').animate({ opacity: 0.2}, function() {$(this).animate({ opacity: 0.8}, function() {
				if(blink) {
					_flashHelpArrows();
				} else {
					if(!$game.hasScrolled) {
						setTimeout(function() {
							_flashHelpArrows(true);
						}, 100);
					} else {
						$('#helpArrows').fadeOut('slow', function(){
							$('#helpArrows').remove()
						});
					}
				}
			});
		});
		}
	}
})();