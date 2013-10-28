(function() {
	var _playlist,
		_currentTrack = 0,
		_songTransition = false,
		_wasPlaying = false,
		soundcloudEnable = false,
		_infoTimer = null;

	var audio = $game.audio = {
		fx: null,
		music: [],
		ready: false,
		isPlaying: false,
		
		init: function() {
			audio.fx = new Howl({
				urls: ['../../audio/sprites.mp3','../../audio/sprites.ogg'],
				sprite: {
					jump: [0, 600],
					thud: [650, 350],
					water: [1000, 500],
					win0: [1600, 700],
					win1: [2300, 700],
					win2: [3000, 600],
					win3: [3600, 700],
					win4: [4300, 800],
					win5: [5100, 900],
					win6: [6000, 1500],
					win7: [7500, 1400],
					win8: [8900, 1100],
					taskcomplete: [11000, 1400],
					pop: [13000, 200]
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
		
		//show loading info
		$('#popupBox .soundcloud .songTitle').text('');
		$('#popupBox .soundcloud .user').text('loading jam...');
		$game.hidePopup();
		$('#popupBox .soundcloud').show();
		$('#popupBox').show();

		SC.stream(url, function(song) {
			_songTransition = false;
			_playlist.tracks[_currentTrack].song = song;
			_playSong();
		});
	}

	function _nextSong(ended) {
		//if game mode then mark as complete
		if($game.localStore.playing && $game.localStore.targetPerson === 'eric') {
			if(!$game.localStore.tasks.eric) {
				$game.taskComplete();	
			}
			$game.localStore.tasks.eric = true;
			$game.updateStorage();
		}
		if(audio.isPlaying) {
			if(!ended) {
				_playlist.tracks[_currentTrack].song.pause();	
			}
			_currentTrack++;
		}
		if(_currentTrack >= _playlist.numTracks) { _currentTrack = 0; }
		if(_playlist.tracks[_currentTrack].song) {
			_playSong();
		} else {
			_loadSong();
		}
	}

	function _playSong() {
		audio.isPlaying = true;
		_playlist.tracks[_currentTrack].song.setVolume(30);
		_playlist.tracks[_currentTrack].song.play({
			onfinish: function() {
				setTimeout(_nextSong, 100, true);
			}
		});

		//display info
		var song = _playlist.tracks[_currentTrack].title,
			link = _playlist.tracks[_currentTrack].permalink_url,
			user = _playlist.tracks[_currentTrack].user.username,
			html = '<a href="' + link + '" target="_blank">' + song + '</a>';

		$('#popupBox .soundcloud .songTitle').html(html);
		$('#popupBox .soundcloud .user').text(user);

		$game.hidePopup();
		$('#popupBox .soundcloud').show();		
		$('#popupBox').show();
		clearTimeout(_infoTimer);
		_infoTimer = setTimeout(function() {
			$('#popupBox').hide();
		}, 4000);
	}

})();