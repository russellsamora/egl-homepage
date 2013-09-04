(function() {
	var _loaded = false;

	//init toolttips
	$('[rel=tooltip]').tooltip();

	var names = ['eric', 'russell', 'stephen', 'jesse', 'sam', 'aidan', 'jedd', 'christina', 'student'];
	
	//_preloadImages(0);
	_loaded = true;
	//hover events for swapping pics
	$('.headshot').on('mouseenter', function() {
		if(_loaded) {
			var src = '../../img/people/bio/real_' + $(this).attr('data-real') + '.jpg';
			$(this).attr('src', src);	
		}
		
	});

	$('.headshot').on('mouseout', function() {
		if(_loaded) {
			var src = '../../img/people/bio/' + $(this).attr('data-real') + '.jpg';
			$(this).attr('src', src);
		}
	});
	
	function _preloadImages(index) {
		img = new Image();

		img.onload = function() {
			index++;
			if(index < names.length) {
				_preloadImages(index);
			} else {
				loaded = true;
			}
		}
		img.src = '../../img/people/bio/real_' + names[index] + '.jpg';
	}

})();

