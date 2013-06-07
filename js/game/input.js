(function() {
	var $BODY = $('body');

	$BODY.on('click', '.playGameButton', function(e) {
		e.preventDefault();
		$('#pregame').fadeOut('fast');
		return false;
	});

	$BODY.on('click touch', '#game', function(e) {
		console.log(e.clientX);
	});
}());