(function(){
	var	_canvas = null,
		_ctx = null,
		_drawing = false,
		_started = false,
		_doneTimer = null;

	var whiteboard = $game.whiteboard = {
		ready: false,
		drawingExists: false,

		init: function() {
			var board = document.createElement('canvas');
				board.setAttribute('id', 'whiteboardCanvas');
			$(board).css({
				position: 'absolute',
				top: 70,
				left: 820,
				width: 360,
				height: 165
			});
			$GAMEBOARD.append(board);

			_canvas = document.getElementById('whiteboardCanvas');
			_ctx = _canvas.getContext('2d');
			_ctx.lineWidth = 2;
			_ctx.strokeStyle = '#ff0000';

			//bind functions
			$('#whiteboardCanvas').mousemove(function(e) {
				if(_drawing) {
					var x,y;
					//TODO: firefox
					if(e.layerX || e.layerX == 0) { //firefox?
						x = e.layerX;
						y = e.layerY;
					} else {
						x = e.offsetX * 0.85;
						y = e.offsetY * 0.9;
					}
					if (!_started) {
						_ctx.beginPath();
						_ctx.moveTo(x, y);
						_started = true;
					} else {
						_ctx.lineTo(x, y);
						_ctx.stroke();
					}
				}
			});

			$('#whiteboardCanvas').mousedown(function(e) {
				whiteboard.drawingExists = true;
				_drawing = true;
				clearTimeout(_doneTimer);
			});
			$('#whiteboardCanvas').mouseup(function(e) {
				if(_started) {
					_doneTimer = setTimeout(function() {
						whiteboard.saveDrawing();
					}, 10000);
				}
				_drawing = false;
				_started = false;
			});
			$('#whiteboardCanvas').mouseout(function(e) {
				if(_started) {
					_doneTimer = setTimeout(function() {
						whiteboard.saveDrawing();
					}, 10000);
				}
				_started = false;
				_drawing = false;
			});

			console.log('whiteboard ready');
			whiteboard.ready = true;
		},

		clearBoard: function() {
			_ctx.clearRect(0,0,360,165);
			whiteboard.drawingExists = false;
			clearTimeout(_doneTimer);
		},

		setColor: function(color) {
			_ctx.strokeStyle = color;
		},

		saveDrawing: function() {
			if(whiteboard.drawingExists) {
				var url = _canvas.toDataURL('img/png');
				$.post('/db/saveDrawing.php', {image: url},
					function(res) {
						if(res === 'good') {
							console.log('saved');
						}
					}, 'text');
				}
		}
	};

	whiteboard.init();
})();