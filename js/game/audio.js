(function() {
	var _playlist,
		_currentTrack = -1,
		_songTransition = false,
		_wasPlaying = false;

	var audio = $game.audio = {
		fx: null,
		music: [],
		ready: false,
		isPlaying: false,
		
		init: function() {
			audio.fx = new Howl({
				urls: ['/audio/sprites.mp3'],
				sprite: {
					jump: [0, 600],
					thud: [650, 810]
				}
			});
			_soundcloud();
		},

		toggleMusic: function(el) {
			audio.isPlaying = !audio.isPlaying;

			if(audio.isPlaying) {
				_nextSong(el, true);
			}
			else {
				_playlist.tracks[_currentTrack].song.pause();
			}
		},

		resume: function() {
			if(_wasPlaying) {
				_playlist.tracks[_currentTrack].song.play();
			}
		},

		pause: function() {
			if(audio.isPlaying) {
				_wasPlaying = true;
				_playlist.tracks[_currentTrack].song.pause();
				
			} else {
				_wasPlaying = false;
			}
		},

		playFx: function(sound) {
			audio.fx.play(sound);
		}
	};

	audio.init();

	function _soundcloud() {
		//5436979055fc8ee5a906b359a5e5439f
		//beec0f87e6d1f3d31a65a699f6576c0e
		SC.initialize({ client_id: '5436979055fc8ee5a906b359a5e5439f' });
		// SC.stream('/tracks/87515856', function(sound){
		// 	window.soundd = sound;
		// 	sound.play();
		// });
		SC.get('/playlists/7571022', function(playlist){
			_playlist = {
				numTracks: playlist.track_count,
				tracks: playlist.tracks
			};
			audio.ready = true;
		});
	}

	function _loadSong() {
		_songTransition = true;
		var url = '/tracks/' + _playlist.tracks[_currentTrack].id;
		SC.stream(url, function(song) {
			_songTransition = false;
			_playlist.tracks[_currentTrack].song = song;
			_playlist.tracks[_currentTrack].song.play();
		});
	}

	function _nextSong(el, turnOn) {
		if(!turnOn) {
			_playlist.tracks[_currentTrack].song.pause();
		}
		_currentTrack++;
		if(_currentTrack >= _playlist.numTracks) { _currentTrack = 0; }
		var msg = _playlist.tracks[_currentTrack].title,
			link = _playlist.tracks[_currentTrack].permalink_url,
			user = _playlist.tracks[_currentTrack].user.username;
		$game.showMessage({el: el, message: msg, soundcloud: { link: link, user: user}});
		if(_playlist.tracks[_currentTrack].song) {
			setTimeout(function() {
				_playlist.tracks[_currentTrack].song.play();
			}, 250);
		} else {
			_loadSong();
		}
	}

})();