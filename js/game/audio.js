(function() {
	var _playlist,
		_currentTrack = 0,
		_songTransition = false,
		_wasPlaying = false,
		soundcloudEnable = false;

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
					thud: [650, 810],
					water: [1000, 1500]
				}
			});
			audio.ready = true;	
			console.log('audio ready');
			_soundcloud();
		},

		play: function() {
			if(_soundcloudEnabled) {
				if(!_songTransition) {
					_nextSong();	
				}
			}
		},

		pause: function() {
			if(audio.isPlaying) {
				_wasPlaying = true;
				_playlist.tracks[_currentTrack].song.pause();
				
			} else {
				_wasPlaying = false;
			}
			audio.isPlaying = false;
		},

		resume: function() {
			if(_wasPlaying && _soundcloudEnabled) {
				_playlist.tracks[_currentTrack].song.play();
			}
		},

		playFx: function(sound) {
			audio.fx.play(sound);
		}
	};

	audio.init();

	function _soundcloud() {
		SC.initialize({ client_id: '5436979055fc8ee5a906b359a5e5439f' });
		SC.get('/playlists/7571022', function(playlist, error){
			if(error) {
				console.log('soundcloud error', error);
				_soundcloudEnabled = false;
			} 
			else {
				_playlist = {
					numTracks: playlist.track_count,
					tracks: playlist.tracks
				};
				_soundcloudEnabled = true;
			}
		});
	}

	function _loadSong() {
		_songTransition = true;
		var url = '/tracks/' + _playlist.tracks[_currentTrack].id;
		SC.stream(url, function(song) {
			_songTransition = false;
			_playlist.tracks[_currentTrack].song = song;
			_playSong();
		});
	}

	function _nextSong(ended) {
		//we are skipping
		console.log(ended, audio.isPlaying);
		if(audio.isPlaying) {
			if(!ended) {
				_playlist.tracks[_currentTrack].song.pause();	
			}
			_currentTrack++;
		}
		if(_currentTrack >= _playlist.numTracks) { _currentTrack = 0; }
		var msg = _playlist.tracks[_currentTrack].title,
			link = _playlist.tracks[_currentTrack].permalink_url,
			user = _playlist.tracks[_currentTrack].user.username;
		//$game.showMessage({el: el, message: msg, soundcloud: { link: link, user: user}});
		if(_playlist.tracks[_currentTrack].song) {
			_playSong();
		} else {
			_loadSong();
		}
	}

	function _playSong() {
		audio.isPlaying = true;
		_playlist.tracks[_currentTrack].song.play({
			onfinish: function() {
				setTimeout(_nextSong, 100, true);
			}
		});
	}

})();