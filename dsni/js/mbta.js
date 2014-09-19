//1485 dudley st @ langdon st
//1498 dudley st @ dennis st
//1499 dudley st @ w. cottage st
//1484 dudley st @ e. cottage st
(function() {

	var baseUrl = 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictionsForMultiStops&a=mbta';

	window.$mbta = {
		getPredictions: function(route, callback) {
			//create query string
			var url = baseUrl + '&stops=' + route + '|1484&stops=' + route +  '|1499';
			$.ajax({
				url: url,
				success: function(xml) {
					//convert xml results to json
					var json = $.xml2json(xml),
						results = {};

					//go thru both stops
					for(var i = 0; i < json.predictions.length; i++) {
						var stop = json.predictions[i],
							stopId = stop.stopTag.toString();

						var noPredictionsTitle = stop.dirTitleBecauseNoPredictions;
						
						//no predictions
						if(noPredictionsTitle) {
							var viaIndex = noPredictionsTitle.indexOf(' via '),
								removeViaFromTitle = noPredictionsTitle.substring(0,viaIndex);
							
							var selText = noPredictionsTitle.toLowerCase().replace(/[^a-zA-Z]/g, '');
							selText = selText.replace(/ +?/g, '');

							results[stopId] = [{
								selector: selText,
								title: removeViaFromTitle,
								minutes: 'no prediction'
							}];
						} else {
							//since converting from xml, stop.directions either object or array
							var directions = [];

							if(stop.direction.length) {
								directions = stop.direction;
							} else {
								directions.push(stop.direction);
							}

							results[stopId] = [];

							//go thru each bus direction (different end destinations, same route)
							for(var d = 0; d < directions.length; d++) {
								var dir = directions[d],
									busTitle = dir.title.toLowerCase(),
									prediction;
								
								//grab the upcoming prediction (there can be multiple for a given direction)
								if(dir.prediction.length) {
									prediction = dir.prediction[0];
								} else {
									prediction = dir.prediction;
								}
								//get selector to update data
								var selText = busTitle.replace(/[^a-zA-Z]/g, '');
								selText = selText.replace(/ +?/g, '');

								var viaIndex = dir.title.indexOf(' via ');
								var removeViaFromTitle = dir.title.substring(0,viaIndex);

								results[stopId].push({
									selector: selText,
									title: removeViaFromTitle,
									minutes: prediction.minutes
								});
							}
						}
					}
					callback(false,results);
				},
				error: function() {
					callback(true);
				}
			});
		}
	};
    
})();

// backup http://proximobus.appspot.com/
// function _update() {
// 		//put up no data available in case
// 		$('.nodata').show();
// 		$('.minutes').hide();

// 		_getStatus(15);
// 		_getStatus(41);
// 		setTimeout(_update, updateInterval);
// 	}
	
// 	_update();
// var	selector = $('.' + selText + ' .minutes'),
							// 	selectorNoData = $('.' + selText + ' .nodata');

							// var text = 'arriving in ' + prediction.minutes + ' minutes';
							// selector.text(text).show();
							// selectorNoData.hide();