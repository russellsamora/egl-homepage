var infoWindows = [],
	openWindow;

(function() {
	window.$map = {
		init: function() {
			google.maps.event.addDomListener(window, 'load', _mapReady);
			_createMap();
		},
		addMarker: function(data, params) {
			var coords = new google.maps.LatLng(data.latitude,data.longitude),
				markerImage = data.markerImage;
			
			var marker = new google.maps.Marker({
				position: coords,
				icon: '../img/' + markerImage,
				title: data.title
			});
			marker.setMap($map.googleMap);
			
			//if there is an event, set it up
			if(params) {
				_bindMarkerClick(data, marker, params);
			}
		}
	};
})();

function _createMap() {
	var center = new google.maps.LatLng(42.3297811,-71.0847631);
	var customStyles = [
		{
			stylers: [
				{ hue: '#00afe6' },
				{ saturation: -100 }
			]
		},{
			featureType: 'road',
			elementType: 'geometry',
			stylers: [
				{ lightness: 100 },
				{ visibility: 'simplified' }
			]
		},{
			featureType: 'road',
			elementType: 'labels.icon',
			stylers: [
				{ visibility: 'off' }
			]
		},{
			featureType: 'poi',
			elementType: 'labels',
			stylers: [
				{ visibility: 'off' }
			]
		}
	];

	var mapOptions = {
		zoom: 15,
		center: center,
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'dudleymap']
		},
		maxZoom: 18,
		minZoom: 5,
		disableDefaultUI: true
	};

	$map.googleMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	var styledMapOptions = { name: 'Dudley'};

	var customMapType = new google.maps.StyledMapType(customStyles, styledMapOptions);

	$map.googleMap.mapTypes.set('dudleymap', customMapType);
	$map.googleMap.setMapTypeId('dudleymap');
}

function _mapReady() {
	$map.ready = true;
}
function _bindMarkerClick(data, marker, params) {

    var infoWindow = new google.maps.InfoWindow({
        content: data.html
    });

    infoWindows[params.index] = infoWindow;
            
    google.maps.event.addListener(marker, 'click', function(){
        if(openWindow) {
			openWindow.close();
		}
        openWindow = infoWindows[params.index];
        infoWindow.open($map.googleMap, marker);
    });
}