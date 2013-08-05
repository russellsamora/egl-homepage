(function() {
	$('[rel=tooltip]').tooltip();
	var names = ['eric', 'russell', 'stephen', 'jesse', 'sam', 'aidan', 'jedd', 'christina'];
	//_preloadImages(0);
	$('.headshot').on('mouseenter', function() {
		var src = '/img/people/bio/real_' + $(this).attr('data-real') + '.jpg';
		// console.log(src);
		$(this).attr('src', src);
	});

	$('.headshot').on('mouseout', function() {
		var src = '/img/people/bio/' + $(this).attr('data-real') + '.jpg';
		// console.log(src);
		$(this).attr('src', src);
	});
	
	function _preloadImages(index) {
		img = new Image();

		img.onload = function() {
			index++;
			if(index < names.length) {
				_preloadImages(index);
			}
		}
		img.src = '/img/people/bio/real_' + names[index] + '.jpg';
	}

})();

