(function() {
	var _currentSong = 0,
		_numSongs = 3,
		_songTransition = false;

	var self = $game.audio = {
		fx: null,
		music: [],
		ready: false,
		isPlaying: false,
		
		init: function() {
			self.fx = new Howl({
				urls: ['/audio/sprites.mp3'],
				sprite: {
					jump: [0, 700]
				}
			});
			for (var s = 0; s < _numSongs; s++) {
				var file = '/audio/song' + s + '.mp3';
				//TODO ogg files when we have final audio
				self.music[s] = new Howl({
					urls: [file],
					loop: true,
					onload: function() {
						//audio ready if first song is loaded
						if(this._src === '/audio/song0.mp3') {
							self.ready = true;
						}
					}
				});
			}
		},

		startMusic: function() {
			if(!self.isPlaying) {
				self.isPlaying = true;
				_songTransition = true;
				self.music[_currentSong].fadeIn(0.3, 2000, function() {
					_songTransition = false;
				});
			} else {
				self.nextSong();
			}
		},

		nextSong: function() {
			if(!_songTransition) {
				_songTransition = true;
				self.music[_currentSong].fadeOut(0.0, 1000, function() {
					_currentSong++;
					if(_currentSong >= _numSongs) { _currentSong = 0; }
					self.music[_currentSong].fadeIn(0.3, 2000, function() {
						_songTransition = false;
					});
				});
			}
		}
	};

	self.init();

})();