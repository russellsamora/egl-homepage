//player file
(function() {
	//private vars
	var _direction,
		_currentFrame,
		_numFrames = 2,
		_walkTimeout = null,
		_speedAmplifier = 7,
		_steps,
		_preventMovement,
		_preventMovementTimeout;
	
	var player = $game.player = {
		//public vars
		ready: false,
		inTransit: false,
		id: 'player',
		class: 'character',
		x: 550,
		y: 250,
		w: 100,
		h: 200,
		offset: {
			x: 50,
			y: 100
		},
		messages: ['I am you, you are me....woah.','What?! I am inside a computer?','I am so tired of walking...','Stop clicking on me, it tickles!'],
		score: 0,
		response: {},

		init: function () {
			var file = 'player0';
			var d = document.createElement('div');
			var i = new Image();
			i.onload = function() {
				d.setAttribute('class', player.class);
				d.setAttribute('id', player.id);
				$(d).css({
					position: 'absolute',
					top: player.y,
					left: player.x,
					width: player.w,
					height: player.h,
					backgroundImage: 'url(' + i.src + ')',
					backgroundPosition: '-800px 0'
				});
				$GAMEBOARD.append(d);
				player.selector = $('#player');
				player.otherSelector = document.getElementById('player');
				player.ready = true;
			}
			i.src = '../../img/player/' + file + '.png';
		},


		//figure out where to move the player and move em!
		movePlayer: function(input) {
			player.inTransit = true;
			
			//do some spatial calculations to find distance and speed
			var diffX =  input.x - player.x,
				diffY = input.y - player.y,
				absDiffX = Math.abs(diffX),
				absDiffY = Math.abs(diffY),
				distance =  Math.sqrt((diffX * diffX) + (diffY * diffY));
				speed = distance * _speedAmplifier;

			//add on speed to the input with the coords
			input.speed = speed;
			//calculate direction
			if(absDiffY / absDiffX > 1) {
				if(diffY > 0) {
					//down
					// _direction = player.w * 4;
					_direction = player.w * 4;
				} else {
					//up
					_direction = player.w * 6;
				}
			} else {
				if(diffX > 0) {
					//right
					// _direction = player.w * 2;
					_direction = player.w * 2;
				} else {
					//left
					// _direction = player.w * 1;
					_direction = 0;
				}
			}
			//TODO: what is this for?? come on russell...
			input.w = absDiffX + player.w;
			input.h = absDiffY + player.h;
			
			//set the z-indexes to the right value
			$game.items.setZIndex(input);

			//reset the frame
			_currentFrame = 0;
			_steps = 0;


			//for hitting AND for flipping index
			$game.items.hitTest();


			//set the animation so the player moves
			player.selector.stop().animate({
				top: input.y,
				left: input.x
			}, speed, 'linear', function() {
				//on walk completion, set new coordinates and change sprite
				player.inTransit = false;
				player.x = input.x;
				player.y = input.y;
				var pos = -player.w * 8 + 'px 0';
				player.selector.css({
					'background-position': pos
				});
			});
			//delay this so if we have a hit right away, we don't animate
			clearTimeout(_walkTimeout);
			setTimeout(function() {
					_animateWalkCycle();
					_slideScreen(input);
			}, 51);
		},

		stopMove: function(prevMove) {
			player.inTransit = false;
			//only need to reset stuff if player started moving
			var pos = -player.w * 8 + 'px 0';
			player.selector.stop(true).css({
			'background-position': pos
			});
			$SCROLL_ELEMENT.stop(true);
			player.x = prevMove.x;
			player.y = prevMove.y;
			player.selector.css({
				top: prevMove.y,
				left: prevMove.x
			});
			$game.showMessage({el: player.otherSelector, message: 'Ouch!'});
			$game.audio.playFx('thud');
		}

		// //perform a jump move!
		// jumpPlayer: function() {
		// 	inTransit = true;
		// 	player.selector.css('background-position', -720);
		// 	sound.fx.play('jump');
		// 	player.selector.animate({
		// 		top: player.y - 100
		// 	}, 250, function() {
		// 		$(this).animate({
		// 			top: player.y
		// 		},250, function() {
		// 			inTransit = false;
		// 			player.selector.css('background-position', -640);
		// 		});
		// 	});
		// },
	};
	player.init();
	//private functions
	//switch out sprite for walk cycle
	function _animateWalkCycle() {
		if(player.inTransit) {
			_steps++;
			_currentFrame++;
			if(_currentFrame >= _numFrames) {
				_currentFrame = 0;
			}
			var pos = -(_direction + _currentFrame * player.w) + 'px 0';
			player.selector.css('background-position', pos);
			clearTimeout(_walkTimeout);
			_walkTimeout = setTimeout(_animateWalkCycle, 170);
		}
	}

	//check for page edge clicking to animate scroll!
	function _slideScreen(input) {
		if(player.inTransit) {
			var destX, destY;
			//make sure transition isn't too fast or too slow
			var speed = Math.max(500,input.speed);
			speed = Math.min($game.input.longest, speed);
			//check for CLICKS on edge of screen
			//left edge
			if(input.edgeX < player.w && pageXOffset > 0) {
				destX = Math.max(pageXOffset - $game.input.width / 2, 0);
			}
			//right edge
			else if( input.edgeX > $game.input.width - player.w) {
				destX = Math.min(pageXOffset + $game.input.width / 2, $game.input.maxScroll.left);
			}
			//top edge
			if(input.edgeY < player.h && pageYOffset > 0) {
				destY = Math.max(pageYOffset - $game.input.height / 2, 0);
			} 
			//bottom edge
			else if( input.edgeY > $game.input.height - player.h) {
				destY = Math.min(pageYOffset + $game.input.height / 2, $game.input.maxScroll.top);
			}
			//must account for wall since can't click on it...
			else if(pageYOffset > 0 && input.y < NAVBAR_HEIGHT + WALL_HEIGHT + player.h) {
				destY = 0;
			}

			//choose which to animate (must lump together so it doesn't halt other)
			if(destX !== undefined && destY !== undefined) {
				$SCROLL_ELEMENT.stop().animate({
					scrollLeft: destX,
					scrollTop: destY
				}, speed,'linear');	
			} else if(destY !== undefined) {
				$SCROLL_ELEMENT.stop().animate({
					scrollTop: destY
				}, speed,'linear');	
			} else if(destX !== undefined) {
				$SCROLL_ELEMENT.stop().animate({
					scrollLeft: destX
				}, speed,'linear');	
			}
		}
	}
})();