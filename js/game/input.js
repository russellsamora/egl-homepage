//determine if we are playing the game based on some css attribute?
(function() {
	var self = window.events = {

		init: function() {
		}
	};
	
	self.init();
	bindEvents();

	//private functions
	function bindEvents() {
		$BODY.on('click', '.playGameButton', function(e) {
			e.preventDefault();
			$('#pregame').fadeOut('fast');
			return false;
		});

		$BODY.on('click touch', '#game', function(e) {
			e.preventDefault();
			return false;
		});
	}
})();