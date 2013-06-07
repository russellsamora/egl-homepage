(function() {
	var $BODY = $('body');

	$BODY.on('click', '.playGameButton', function(e) {
		e.preventDefault();
		$('#pregame').fadeOut('fast');
		return false;
	});
}());