(function() {
	var self = $game.audio = {
		fx: null,
		music: null,
		
		init: function() {
			self.fx = new Howl({
				urls: ['/audio/sprites.mp3'],
				sprite: {
					jump: [0, 700]
				}
			});
			self.music = new Howl({
				urls: ['/audio/song0.mp3'],
				volume: 0.3,
				loop: true
			});
		}
	};

	self.init();

})();