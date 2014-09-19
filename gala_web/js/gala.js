(function() {
	var _ready = true,
		_verifying = false,
		_reco,
		_startTime,
		_waitTime = 1000,
		_goalTime;
    //Compatibility
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        video = document.getElementById("video"),
        btnPhoto = document.getElementById("btnPhoto"),
        videoObj = {
            video: true,
            audio: false
        };

	function init() {
        var localMediaStream;

        if (navigator.getUserMedia) {
            navigator.getUserMedia(videoObj, function(stream) {
                video.src = (navigator.webkitGetUserMedia) ? window.webkitURL.createObjectURL(stream) : stream;
                localMediaStream = stream;
            }, function(error) {
                console.error("Video capture error: ", error.code);
            });
        }
    }

    function initSpeech() {
		_reco = new webkitSpeechRecognition();
		_reco.continuous = true;
		_reco.interimResults = true;
		_reco.lang = 'en';

		_reco.start();

		_reco.onstart = function() {
			console.log('start');
			_ready = true;
		};

		_reco.onend = function() {
			console.log('stop');

		};

		_reco.onerror = function(event) {
			console.log('error');
		};

		_reco.onresult = function(event) {
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				var word = event.results[i][0].transcript.toLowerCase();
				console.log(word);
				if(word.indexOf('cheese') > -1 && _ready) {
					_ready = false;
					takePicture();
				}
			}
		};
    }

    function takePicture() {
		$('.say').hide();
        context.drawImage(video, 0, 0);
        var img = canvas.toDataURL('image/png');

		$.post('upload.php', {image: img}, function(data) {
			console.log(data);
			setTimeout(function() {
				context.clearRect(0,0,640,480);
				$('.say').show();
				_ready = true;
			},4000);
		});
    }
    init();
    //initSpeech();
    var controller = new Leap.Controller();

    // Proving that the websocket is open
    controller.on( 'connect' , function(){
      console.log( 'Successfully connected.' );
    });

    // Proving that a device can be connected
    controller.on( 'deviceConnected' , function() {
      console.log('A Leap device has been connected.');
    });

    // And that it can be disconnected
    controller.on( 'deviceDisconnected' , function() {
      console.log( 'A Leap device has been disconnected.' );
    });

    // When the controller is ready, spawn the unicorn!
    controller.on( 'ready' , function(){

		Leap.loop(function(obj) {
			if(_ready) {
				var hands = obj.hands.length;
				var fingers = obj.pointables.length;

				var correctGesture = hands === 1 && fingers === 2 ? true : false,
					d = new Date(),
					curTime = d.getTime();

				console.log(correctGesture, hands, fingers);
				if(_verifying) {
					if(correctGesture) {
						//check if time is done
						if(curTime >= _goalTime) {
							_ready = false;
							_verifying = false;
							takePicture();
						}
					} else {
						//reset gesture holding time (tell them?)
						_verifying = false;
					}
				}
				else {
					if(correctGesture) {
						_goalTime = curTime + _waitTime;
						_verifying = true;
					}
				}
			}
		});
    });
	controller.connect();

})();