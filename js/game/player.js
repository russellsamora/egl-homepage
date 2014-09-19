//player file
(function() {
	//private vars
	var _direction,
		_currentFrame,
		_numFrames = 8,
		_idleFrame = 0,
		_idleData = [0,2,2,0,2,2,1,0,2,0,2,2,1,2,0,2,2,0,2],
		_numIdleFrames = _idleData.length,
		_walkTimeout = null,
		_speedAmplifier = 3.5,
		_steps,
		_preventMovement,
		_preventMovementTimeout;

	var player = $game.player = {
		//public vars
		ready: false,
		inTransit: false,
		animating: false,
		id: 'player',
		class: 'character',
		x: 450,
		y: -180,
		w: 80,
		h: 160,
		offset: {
			x: 40,
			y: 80
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
					backgroundPosition: '0 0'
				});
				$GAMEBOARD.append(d);
				player.selector = $('#player');
				player.otherSelector = document.getElementById('player');
				player.ready = true;
				console.log('player ready');
			}
			i.src = '../../img/player/' + file + '.png';
		},

		entrance: function() {
			player.y = 250;
			player.selector.delay(1000).animate({
				top: 250
			},1500, 'swing', function() {
				$game.input.enableMove();
			});
		},

		//figure out where to move the player and move em!
		movePlayer: function(input) {

			//pathfinding (jay)
			var grid = GRID.clone(),
				finder = new PF.AStarFinder({
			    	allowDiagonal: true,
			    	dontCrossCorners: true
				});

			//generates a path for the player to walk (jay)
			setDestination = function(destX, destY) {
				var roundedX = Math.round(player.x / TILE_SIZE),
					roundedY = Math.round(player.y / TILE_SIZE),
					iroundedX = Math.round(destX / TILE_SIZE),
					iroundedY = Math.round(destY / TILE_SIZE);

				//early exit if the player clicked on the robot
				if (roundedX == iroundedX && roundedY == iroundedY) return [[]];
				
				var failsafe = 100,
					iteratex = true,
					xdiff, ydiff;

				//if the player clicked on a spot that is unwalkable, set the direction to search for the closest walkable spot
				if (roundedX > iroundedX) {
					xdiff = -1;
				} else {
					xdiff = 1;
				}
				if (roundedY > iroundedY) {
					ydiff = -1;
				} else {
					ydiff = 1;
				}

				// loop until we find a walkable spot
				while (!grid.isWalkableAt(iroundedX, iroundedY)) {
					if (iteratex) {
						iroundedX += xdiff;
					} else {
						iroundedY += ydiff;
					}
					iteratex = !iteratex;
					
					// if we can't find a walkable spot in 100 tries, don't move (so the browser doesn't hang)
					failsafe --;
					if (failsafe < 1) {
						iroundedX = roundedX;
						iroundedY = roundedY;
					}
				}
				var p = finder.findPath(roundedX, roundedY, iroundedX, iroundedY, grid),
					np = PF.Util.smoothenPath(grid, p);
				return np;
			}

			var path = setDestination(input.x, input.y),
				pathPosition = 0;

			totalSpeed = function(path) {
				var s = 0;
				for (var i = 1; i < path.length; i ++) {
					var diffX = path[i][0] - path[i - 1][0],
						diffY = path[i][1] - path[i - 1][1],
						distance = Math.sqrt((diffX * diffX) + (diffY * diffY));
					s += distance * TILE_SIZE;
				}
				s *= _speedAmplifier;
				return s;
			}

			stepPlayer = function(step) {

				//destination
				var xx = step[0] * TILE_SIZE,
					yy = step[1] * TILE_SIZE;

				//do some spatial calculations to find distance and speed
				var diffX = xx - player.x,
					diffY = yy - player.y,
					startY = player.y,
					prevY = startY,
					absDiffX = Math.abs(diffX),
					absDiffY = Math.abs(diffY),
					distance =  Math.sqrt((diffX * diffX) + (diffY * diffY));
					speed = distance * _speedAmplifier;
				
				//calculate direction
				if(absDiffY / absDiffX > 1) {
					if(diffY > 0) {
						//down
						_direction = player.h * 2;
					} else {
						//up
						_direction = player.h * 1;
					}
				} else {
					if(diffX > 0) {
						//right
						_direction = player.h * 4;
					} else {
						//left
						_direction = player.h * 3;
					}
				}
				//console.log(xx / TILE_SIZE, yy / TILE_SIZE);
				//TODO: what is this for?? come on russell...
				input.w = absDiffX + player.w;
				input.h = absDiffY + player.h;
				
				//set the z-indexes to the right value
				$game.items.setZIndex(input);
				$game.people.setZIndex(input);

				//set the animation so the player moves
				player.selector.stop().animate({
					top: yy,
					left: xx
				}, {
					duration: speed, 
					easing: 'linear', 
					complete: function() {
						//on walk completion, set new coordinates
						player.x = xx;
						player.y = yy;

						//move to the next position on the path if we haven't reached the end yet (jay)
						pathPosition ++;
						if (pathPosition < path.length) {
							stepPlayer(path[pathPosition]);
						} else {
							player.inTransit = false;
							player.animating = false;

							//face forward when path complete
							var pos = '0 0';
							player.selector.css({
								'background-position': pos
							});
						}
					},
					progress: function(a, p, c) {
						//if the player's y has changed in the last step, update the zindex of the items & people (jay)
						var newY = Math.round(startY + p * (yy - startY));
						if (newY != Math.round(player.y)) {
							player.y = newY;
							_setZIndex(input);
						}
					}
				});
			}

			if (path.length > 1) {
				//move and animate the robot, slide the screen
				player.inTransit = true;
				stepPlayer(path[pathPosition]);
				_startAnimating();
				_slideScreen(input, totalSpeed(path));
			} else {
				//if the player clicked on the robot, don't move
				player.x = input.x;
				player.y = input.y;
			}
		},

		stopMove: function(prevMove) {
			player.inTransit = false;
			//only need to reset stuff if player started moving
			var pos = '0 0';
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
			//$game.showMessage({el: player.otherSelector, message: 'Ouch!'});
			$game.audio.playFx('thud');
		},

		idle: function() {
			if(!player.inTransit) {
				_idleFrame++;
				if(_idleFrame >= _numIdleFrames) {
					_idleFrame = 0;
				}
				var frame = _idleData[_idleFrame],
					pos = -(frame * player.w) + 'px ' + '0';
				player.selector.css('background-position', pos);
			}
		},

		tick: function() {
			_animateWalkCycle();
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
	function _setZIndex(input) {
		$game.items.setZIndex(input);
		$game.people.setZIndex(input);
	}

	function _startAnimating() {
		if(!player.animating && player.inTransit) {
			_steps = 0;
			_currentFrame = 0;
			player.animating = true;
		}
	}
	//switch out sprite for walk cycle
	function _animateWalkCycle() {
		if (player.animating && player.inTransit) {
			_steps++;
			_currentFrame++;
			if(_currentFrame >= _numFrames) {
				_currentFrame = 0;
			}
			var pos = -(_currentFrame * player.w) + 'px ' + -_direction + 'px';
			player.selector.css('background-position', pos);
			//clearTimeout(_walkTimeout);
			//_walkTimeout = setTimeout(_animateWalkCycle, 170);
		}
	}

	function _slideScreen(input, totalSpeed) {
		var destX, destY,
			left = 0,
			top = 0,
			right = GAMEBOARD_WIDTH - $game.input.width,
			bottom = GAMEBOARD_HEIGHT - ($game.input.height / 1.1), //HACK is GAMEBOARD_HEIGHT not accurate?
			borderY = GAMEBOARD_HEIGHT * 0.133,
			borderX = GAMEBOARD_WIDTH * 0.133,
			screenW = $game.input.width,
			screenH = $game.input.height;

		destX = Math.min(Math.max(left, input.x - (screenW / 2)), right);
		destY = Math.min(Math.max(top, input.y + player.h - (screenH / 2)), bottom);
		
		//if we're close to the edges, snap to them!!
		if (destY < borderY) {
			destY = top;
		} else if (destY > GAMEBOARD_HEIGHT - screenH + borderY * 0.25) {
			destY = bottom;
		}
		if (destX < borderX) {
			destX = left;
		} else if (destX > GAMEBOARD_WIDTH - screenW - borderX) {
			destX = right;
		}

		totalSpeed = Math.max(1000, totalSpeed);

		//animate the scroll
		if(destX !== undefined && destY !== undefined) {
			if (destX > 0 || destY > 0) {
				$game.hasScrolled = true;
			}
			$SCROLL_ELEMENT.stop().animate({
				scrollLeft: destX,
				scrollTop: destY
			}, totalSpeed,'swing');	
		}
	}
})();