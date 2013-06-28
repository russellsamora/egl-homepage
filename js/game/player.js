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
	
	var self = $game.player = {
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

		init: function (file) {
			var d = document.createElement('div');
			var i = new Image();
			i.onload = function() {
				d.setAttribute('class', self.class);
				d.setAttribute('id', self.id);
				$(d).css({
					position: 'absolute',
					top: self.y,
					left: self.x,
					width: self.w,
					height: self.h,
					backgroundImage: 'url(' + i.src + ')',
					backgroundPosition: '-800px'
				});
				$GAMEBOARD.append(d);
				self.selector = $('#player');
				self.otherSelector = document.getElementById('player');
				self.ready = true;
			}
			i.src = '../../img/player/' + file + '.png';
		},


		//figure out where to move the player and move em!
		movePlayer: function(input) {
			self.inTransit = true;
			
			//do some spatial calculations to find distance and speed
			var diffX =  input.x - self.x,
				diffY = input.y - self.y,
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
					// _direction = self.w * 4;
					_direction = self.w * 4;
				} else {
					//up
					_direction = self.w * 6;
				}
			} else {
				if(diffX > 0) {
					//right
					// _direction = self.w * 2;
					_direction = self.w * 2;
				} else {
					//left
					// _direction = self.w * 1;
					_direction = 0;
				}
			}
			//TODO: what is this for?? come on russell...
			input.w = absDiffX + self.w;
			input.h = absDiffY + self.h;
			
			//set the z-indexes to the right value
			$game.items.setZIndex(input);

			//reset the frame
			_currentFrame = 0;
			_steps = 0;


			//for hitting AND for flipping index
			$game.items.hitTest();


			//set the animation so the player moves
			self.selector.stop().animate({
				top: input.y,
				left: input.x
			}, speed, 'linear', function() {
				//on walk completion, set new coordinates and change sprite
				self.inTransit = false;
				self.x = input.x;
				self.y = input.y;
				self.selector.css({
					'background-position': -self.w * 8
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
			self.inTransit = false;
			//only need to reset stuff if player started moving
			self.selector.stop(true).css({
			'background-position': -self.w * 8
			});
			$SCROLL_ELEMENT.stop(true);
			self.x = prevMove.x;
			self.y = prevMove.y;
			self.selector.css({
				top: prevMove.y,
				left: prevMove.x
			});
			//showMessage({el: player.otherSelector, messages: ['Ouch!']});
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

	//private functions
	//switch out sprite for walk cycle
	function _animateWalkCycle() {
		if(self.inTransit) {
			_steps++;
			_currentFrame++;
			if(_currentFrame >= _numFrames) {
				_currentFrame = 0;
			}
			var pos = -(_direction + _currentFrame * self.w) + 'px';
			self.selector.css('background-position', pos);
			clearTimeout(_walkTimeout);
			_walkTimeout = setTimeout(_animateWalkCycle, 170);
		}
	}

	//check for page edge clicking to animate scroll!
	function _slideScreen(input) {
		if(self.inTransit) {
			var destX, destY;
			//make sure transition isn't too fast.
			var speed = Math.max(500,input.speed);

			//check for CLICKS on edge of screen
			//left edge
			if(input.edgeX < self.w && pageXOffset > 0) {
				destX = Math.max(pageXOffset - $game.input.width / 2, 0);
			}
			//right edge
			else if( input.edgeX > $game.input.width - self.w) {
				destX = Math.min(pageXOffset + $game.input.width / 2, $game.input.maxScroll.left);
			}
			//top edge
			if(input.edgeY < self.h && pageYOffset > 0) {
				destY = Math.max(pageYOffset - $game.input.height / 2, 0);
			} 
			//bottom edge
			else if( input.edgeY > $game.input.height - self.h) {
				destY = Math.min(pageYOffset + $game.input.height / 2, $game.input.maxScroll.top);
			}
			//must account for wall since can't click on it...
			else if(pageYOffset > 0 && input.y < NAVBAR_HEIGHT + WALL_HEIGHT + self.h) {
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