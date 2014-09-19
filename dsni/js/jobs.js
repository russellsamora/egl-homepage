//1485 dudley st @ langdon st
//1498 dudley st @ dennis st
(function() {
	function _loadData() {
		d3.csv('../data/jobs.csv',function(data) {
			console.log(data);
		});
		// var url = 'http://data.cityofboston.gov/resource/8sq6-p7et.json?%24limit=30';
		// $.ajax({
		// 	url: url,
		// 	success: function(data) {
		// 		console.log(data);
		// 	},
		// 	error: function(err) {
		// 		console.log('error', err);
		// 	}
		// });
	}
	_loadData();
})();

