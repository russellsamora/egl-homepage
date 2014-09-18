//1485 dudley st @ Langdon st
//1498 dudley st @ Dennis st
//1499 dudley st @ w. cottage st
//1484 dudley st @ e. cottage st
(function() {
	var updateInterval = 65000,
		numImages = 25,
		slideshowInterval = 10000,
		currentSlide,
		currentElement,
		touchIntervalShow = 4000,
		touchIntervalHide = 15000,
		languages = ['english','spanish','portuguese'],
		currentLanguage = 0,
		// touchLeft,
		$allLanguages = $('.languages span'),
		$touchLeft = $('.touchLeft'),
		// $touchRight = $('.touchRight'),
		touchShowing;

	function _update() {
		$mbta.getPredictions(15, function(err,results) {
			if(err) {
				console.log(err);
			} else {
				var sortedEast = _sortByMinutes(results['1484']),
					sortedWest = _sortByMinutes(results['1499']),
					nextEast = sortedEast[0],
					nextWest = sortedWest[0];

				if(nextEast.minutes === 'no prediction') {
					$('.stop1484 .bus15 .prediction').hide();
					$('.stop1484 .bus15 .noPrediction').show();
				} else {
					$('.stop1484 .bus15 .prediction').show();
					$('.stop1484 .bus15 .noPrediction').hide();
				}
				if(nextWest.minutes === 'no prediction') {
					$('.stop1499 .bus15 .prediction').hide();
					$('.stop1499 .bus15 .noPrediction').show();
				} else {
					$('.stop1499 .bus15 .prediction').show();
					$('.stop1499 .bus15 .noPrediction').hide();
				}

				$('.stop1484 .bus15 .minutes').text(nextEast.minutes);
				$('.stop1499 .bus15 .minutes').text(nextWest.minutes);
				$('.stop1484 .bus15 .station').text(nextEast.title);
				$('.stop1499 .bus15 .station').text(nextWest.title);

				//add color
				$('.stop1484 .bus15 .data').removeClass('prox1 prox2');
				$('.stop1499 .bus15 .data').removeClass('prox1 prox2');
				
				if(nextEast.minutes < 6) {
					$('.stop1484 .bus15 .data').addClass('prox1');
				} else {
					$('.stop1484 .bus15 .data').addClass('prox2');
				}
				
				if(nextWest.minutes < 6) {
					$('.stop1499 .bus15 .data').addClass('prox1');
				} else {
					$('.stop1499 .bus15 .data').addClass('prox2');
				}
				
			}
		});
		$mbta.getPredictions(41, function(err, results) {
			if(err) {
				console.log(err);
			} else {
				var sortedEast = _sortByMinutes(results['1484']),
					sortedWest = _sortByMinutes(results['1499']),
					nextEast = sortedEast[0],
					nextWest = sortedWest[0];

				if(nextEast.minutes === 'no prediction') {
					$('.stop1484 .bus41 .prediction').hide();
					$('.stop1484 .bus41 .noPrediction').show();
				} else {
					$('.stop1484 .bus41 .prediction').show();
					$('.stop1484 .bus41 .noPrediction').hide();
				}
				if(nextWest.minutes === 'no prediction') {
					$('.stop1499 .bus41 .prediction').hide();
					$('.stop1499 .bus41 .noPrediction').show();
				} else {
					$('.stop1499 .bus41 .prediction').show();
					$('.stop1499 .bus41 .noPrediction').hide();
				}

				$('.stop1484 .bus41 .minutes').text(nextEast.minutes);
				$('.stop1499 .bus41 .minutes').text(nextWest.minutes);
				$('.stop1484 .bus41 .station').text(nextEast.title);
				$('.stop1499 .bus41 .station').text(nextWest.title);

				$('.stop1484 .bus41 .data').removeClass('prox1 prox2');
				$('.stop1499 .bus11 .data').removeClass('prox1 prox2');

				if(nextEast.minutes < 6) {
					$('.stop1484 .bus41 .data').addClass('prox1');
				} else {
					$('.stop1484 .bus41 .data').addClass('prox2');
				}
				
				if(nextWest.minutes < 6) {
					$('.stop1499 .bus41 .data').addClass('prox1');
				} else {
					$('.stop1499 .bus41 .data').addClass('prox2');
				}
				
			}
		});
		setTimeout(_update, updateInterval);
	}

	function _sortByMinutes(buses) {
		buses.sort(function(a, b){
			return b.minutes - a.minutes;
		});
		return buses;
	}

	function _loadImage(num) {
		var img = new Image();
		img.onload = function() {
			$('.slideshow').append(img);
			num++;
			if(num >= numImages) {
				_startSlideshow();
			} else {
				_loadImage(num);
			}
		};
		
			img.src = '../img/screensaver/quotes/' + num + '.png';
			img.style.cssFloat = "right";
		// img.src = 'http://placehold.it/720x360.png';
	}

	function _startSlideshow() {
		//show first image
		$('.slideshow img').first().show();
		currentSlide = 0;
		currentElement = $('.slideshow img').eq(currentSlide);
		//begin transition timeout
		setTimeout(_transitionSlideshow, slideshowInterval);
	}

	function _transitionSlideshow() {
		//fade out current image
		currentElement.fadeOut(function() {
			$(this).hide();
			currentSlide++;
			if(currentSlide >= numImages) {
				currentSlide = 0;
			}
			currentElement = $('.slideshow img').eq(currentSlide);
			currentElement.fadeIn();
			setTimeout(_transitionSlideshow, slideshowInterval);
		});
	}

	function _updateTouch() {
		//if it was showing, hide it, switch them
		if(touchShowing) {
			_hideTouch();
		} else {
			_showTouch();
		}

		touchShowing = !touchShowing;
	}

	function _hideTouch() {
		//transition off current one
		// if(touchLeft) {
		// 	$touchLeft.transition({x: 0, y: 0}, 1000 , 'ease');
		// } else {
		// 	$touchRight.transition({x: 0, y: 0}, 1000 , 'ease');
		// }
		$touchLeft.transition({x: 0, y: 0}, 1000 , 'ease');

		//swap for next time and change language
		// touchLeft = !touchLeft;
		currentLanguage++;

		if(currentLanguage >= languages.length) {
			currentLanguage = 0;
		}
		setTimeout(_updateTouch, touchIntervalHide);
	}

	function _showTouch() {
		//show next language
		var languageSel = $('.' + languages[currentLanguage]);
		$allLanguages.hide();
		languageSel.show();

		// if(touchLeft) {
		// 	$touchLeft.transition({x: 100, y: -200}, 1000 , 'ease');
		// } else {
		// 	$touchRight.transition({x: -100, y: -200}, 1000 , 'ease');
		// }
		$touchLeft.transition({x: 100, y: -380}, 1000 , 'ease', function() {
			$touchLeft.transition({scale:.95,delay:1000}, 200, function() {
				$touchLeft.transition({scale:1}, 200);
			});
		});
		setTimeout(_updateTouch, touchIntervalShow);
	}
	//start it up!
	_update();
	_updateTouch();
	_loadImage(0);

})();
