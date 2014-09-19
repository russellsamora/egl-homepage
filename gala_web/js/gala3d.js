(function() {
  var _ready = true,
    _verifying = false,
    _reco,
    _startTime,
    _waitTime = 250,
    _sound,
    _goalTime;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

    var dataRef = new Firebase("https://gala.firebaseio.com"),
        listRef = dataRef.child('pictures');

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

    function initSound() {
      _sound = new Howl({
        urls: ['../audio/camera.mp3', '../audio/camera.ogg'],
        sprite: {
          camera: [0,250]
        }
      });
    }

    function takePicture() {
      $('#scene').hide();
    _sound.play('camera');
    $('.say').text('THANKS! YOU\'RE ON THE ENGAGEMENT GAME CAM!');
    $('.say2').text('now you can "picture" yourself all over the lab!');
        context.drawImage(video, 0, 0);
        var img = canvas.toDataURL('image/png');

    var d = new Date(),
      file = 'face' + d.getTime() + '.png';

    $.post('upload.php', {image: img, file: file}, function(data) {
      console.log(data);
      var newPushRef = listRef.push();

      // Set some data to the generated location
      newPushRef.push({file: file});

      setTimeout(function() {
        context.clearRect(0,0,640,480);
        $('.say2').text('I am so lonely...');
        $('.say').text('GIVE ME A HIGH FIVE!');
        $('#scene').show();
        _ready = true;
      },5000);
    });
    }
    init();
    initSound();

      
  function move(node, posX, posY, posZ, rotX, rotY, rotZ) {
      var style = node.style;
      style.transform =
      style.webkitTransform = 'translate3d(' + posX + 'px, ' + posY + 'px, ' + posZ + 'px) ' +
                              'rotate3d(1, 0, 0, ' + rotX + 'deg) rotate3d(0, 0, 1, ' + rotZ + 'deg)';
    }

    function getNode(id, templateNode) {

      var node  = pool[id];
      if (!node) {
        node  = templateNode.cloneNode(true);
        node.id = id;
        node.style.backgroundColor = '#78cbd1';

        scene.appendChild(node);
        pool[id] = node;
      }

      return node;
    }

    function randomColor() {
      return Math.random() < 0.5 ? '#78cbd1' : '#ff5622';
    }

    var app = document.getElementById('app');
    var scene = document.getElementById('scene');
    var sphereTemplate = document.getElementById('sphere');
    var fingerTemplate = document.getElementById('finger');

    var pool = {};

    Leap.loop(function(frame) {
      var ids = {};
      var hands = frame.hands;
      var pointables = frame.pointables;
      var closeHand = -2000;

      for (var i = 0, hand; hand = hands[i++];) {
        var posX = (hand.palmPosition[0] * 2.5);
        var posY = (hand.palmPosition[2] * 2.5);
        var posZ = 500-(hand.palmPosition[1] * 2.5);
        var rotX = (hand._rotation[2] * 90);
        var rotY = (hand._rotation[1] * 90);
        var rotZ = (hand._rotation[0] * 90);

        var node = getNode(hand.id, sphereTemplate);
        if(posZ > closeHand) {
          closeHand = posZ;
        }

        move(node, posX, posY, posZ, rotX, rotY, rotZ);
        ids[hand.id] = true;
      }

      for (var i = 0, pointable; pointable = pointables[i++];) {
        var posX = (pointable.tipPosition[0] * 2.5);
        var posY = (pointable.tipPosition[2] * 2.5);
        var posZ = 500-(pointable.tipPosition[1] * 2.5);
        var dirX = -(pointable.direction[1] * 90);
        var dirY = -(pointable.direction[2] * 90);
        var dirZ = (pointable.direction[0] * 90);

        node = getNode(pointable.id, fingerTemplate);

        move(node, posX, posY, posZ, dirX, dirY, dirZ);

        ids[pointable.id] = true;
      }

      for (var id in pool) {
        if (!ids[id]) {
          scene.removeChild(pool[id]);
          delete pool[id];
        }
      }

      if(_ready) {
        var correctGesture = hands.length > 0 && pointables.length > 1 && closeHand > -300 ? true : false,
          d = new Date(),
          curTime = d.getTime();

          // console.log(correctGesture);
        //console.log(correctGesture, hands, fingers);
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
            $('.say').text('GIVE ME A HIGH FIVE!');
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
  // setTimeout(takePicture, 5000);
})();
 