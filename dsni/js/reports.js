var all_reports,
	requestTypes = ['General Request', 'Graffiti Removal', 'Request for Pothole Repair', 'Sidewalk Repair', 'Sign Repair','Street Light','Student'];

(function() {
	window.$reports = {
		init: function() {
			//create map
			$map.init();
			var mapReady = function() {
				if($map.ready) {
					_loadData();
				} else {
					setTimeout(mapReady, 100);
				}
			};
			mapReady();
		}
	};
	$reports.init();
})();

function _loadData() {
	d3.csv('../data/roxbury.csv',function(data) {
		all_reports = data;
		for(var i = 0; i < data.length; i++) {
			//clean up and add necessary date for map
			all_reports[i].index = i;
			all_reports[i].title = '';
			all_reports[i].html = '<h3>Request Type: ' + data[i].type + '</h3>';
			all_reports[i].html += '<p>@' + data[i].location + '</p>';

			if(all_reports[i].status === 'Closed') {
				all_reports[i].markerImage = 'markerb0.png';
				all_reports[i].html += '<p>closed on ' + data[i].closed + '</p>';
			} else {
				all_reports[i].markerImage = 'markerb1.png';
				all_reports[i].html += '<p>opened on ' + data[i].opened + '</p>';
			}
			$map.addMarker(all_reports[i], {index: i});
		}
	});
}