function loadSound() {
	var self = {
		fx: null,
		init: function() {
			self.fx = new Howl({
				urls: ['../sound/sprites.mp3'],
				sprite: {
					jump: [0, 700]
				}
			});
		}
	};
	self.init();
	return self;
}