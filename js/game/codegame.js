(function(){
	var _challenges = ['10','010','1011', '01101', '010110', 'var x = 42;'],
		_curChallenge,
		_playing;

	var codegame = $game.codegame = {
		ready: true,
		show: function() {
			if($game.reallyStarted) {
				$game.hideMessage();
				$('#codegame').empty().append('<p>Welcome to Russell\'s <b>coding challenge!</b>  Type the codes as fast as you can before they disappear. Binary! Awesome!</p><p><a href="#" class="beginCodeGame">Begin</a></p>');
				$('#codegame').show();
				_bindStartButton();
				setTimeout(function() {
					$game.input.preventMoveForever();
				}, 100);
			}
		},
		start: function() {
			$('#codegame').empty().append('<p class="codegameText"></p><p class="codegamePI"><input class="codegameInput"></p><p class="quitcodegame"><a href="#">quit</a></p>');
			$('.codegameText').css('opacity', 1);
			_bindQuitButton();
			_bindTypeCheck();
			_curChallenge = 0;
			_nextChallenge();
			_playing = true;
		}
	};

	function _fail() {
		_playing = false;
		$('.codegameText').text('Oh No! Try again.').css('opacity', 1);
		_curChallenge = 0;
		setTimeout(_nextChallenge, 2000);
	}

	function _win() {
		_playing = false;
		$('.codegameText').text('You did it!').css('opacity', 1);
		if($game.localStore.playing && $game.localStore.targetPerson === 'russell') {
			if(!$game.localStore.tasks.russell) {
				$game.taskComplete();	
			}
			$game.localStore.tasks.russell = true;
			$game.updateStorage();
		}
		setTimeout(function() {
			$('#codegame').hide();
		},2000);
		$game.input.enableMove();
	}

	function _nextChallenge() {
		_playing = true;
		$('.codegameInput').val('').focus();
		if(_curChallenge >= _challenges.length) {
			_win();
		} else {
			var timeout = 3000;
			if(_curChallenge === _challenges.length - 1) {
				timeout = 5000;
			}
			$('.codegameText').text(_challenges[_curChallenge]).css('opacity',1).animate({
				opacity: 0
			}, timeout, function() {
				_fail();
			});
		}
	}

	function _bindTypeCheck() {
		$('.codegameInput').on('input', function() {
			if(_playing) {
				var val = $(this).val().trim();
				if(val === _challenges[_curChallenge]) {
					//TODO correct
					_curChallenge += 1;
					$('.codegameText').stop();
					var sound;
					if(_curChallenge === _challenges.length) {
						sound = 'win6';
					} else {
						sound = 'win' + Math.floor(Math.random() * 6);
					}
					$game.audio.playFx(sound);
					_nextChallenge();
				}
			}
		});
	}

	function _bindQuitButton() {
		$BODY.on('click', '.quitcodegame a', function(e) {
			e.preventDefault();
			$('#codegame').hide();
			$('.codegameText').stop();
			_playing = false;
			$BODY.off('click', '.quitcodegame a');
			$('.codegameInput').off('input');
			return false;
		});
	}

	function _bindStartButton() {
		$BODY.on('click', '.beginCodeGame', function(e) {
			e.preventDefault();
			if(!_playing) {
				codegame.start();	
			}
			return false;
		});
	}
})();

