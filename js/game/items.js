(function(){

	var _hitList,
		_prevMove = {};

	var self = $game.items = {
		itemKeys: null,
		data: null,

		init: function() {
			_loadData();
			self.itemKeys = Object.keys(self.data);
			_setupItems(0);
		},

		setZIndex: function(input) {
			var minX = Math.min(input.x,$game.player.x),
				minY = Math.min(input.y,$game.player.y),
				playerBottom = $game.player.y + $game.player.h;

			if(DEV_MODE) {
				$('.dirtyBound').remove();
				var d = document.createElement('div');
				d.setAttribute('class', 'dirtyBound');
				$(d).css({
					position: 'absolute',
					top: minY,
					left: minX,
					width: input.w,
					height: input.h
				});	
				$GAMEBOARD.append(d);
			}
			//reset hit list to empty and build it up, these are the items we will check for collision during walk
			_hitList = [];
			//items
			for(var i = 0; i < self.itemKeys.length; i++) {
				var item = self.data[self.itemKeys[i]];
				//see if it will be in range of the new walk
				if ((minX + input.w >= item.x) && (minX <= item.x + item.w) && (minY + input.h >= item.y) && (minY <= item.y + item.h)) {
					item.flipped = false;
					item.kind = 'item';
					_hitList.push(item);
					//check to see which side the player is on (above or below)
					if(playerBottom < item.bottom) {
						item.selector.addClass('fgItem');
					} else {
						item.selector.removeClass('fgItem');
					}
				}
			}
			// //people
			// for(var i = 0; i < peopleKeys.length; i++) {
			// 	var other = people[peopleKeys[i]];
			// 	if ((minX + input.w >= other.x) && (minX <= other.x + other.w) && (minY + input.h >= other.y) && (minY <= other.y + other.h)) {
			// 		other.flipped = false;
			// 		other.kind = 'person';
			// 		hitList.push(other);
			// 		//check to see which side the player is on (above or below)
			// 		if(playerBottom < other.bottom) {
			// 			other.selector.addClass('fgPerson');
			// 		} else {
			// 			other.selector.removeClass('fgPerson');
			// 		}
			// 	}
			// }
		},

		hitTest: function() {
			//only test if moving...
			if($game.player.inTransit) {
				//must pull the current position (yuck)
				var tempX = parseFloat($game.player.otherSelector.style.left),
					tempY = parseFloat($game.player.otherSelector.style.top),
					bottomY = tempY + $game.player.h;
				
				for(var h = 0; h < _hitList.length; h++) {
					var other = _hitList[h];
					//hit test for bottom of both rectangles
					if((bottomY >= other.bottom) && (bottomY <= other.bottom + HEIGHT_BUFFER)) {
						var readyToFlip;
						//if we just crossed hit the vertical intersection, switch the z-index, but only once
						if(!other.flipped) {
							readyToFlip = true;
						}
						//check for actual collision
						if ((tempX + $game.player.w >= other.x) && (tempX <= other.x + other.w)) {
							//return prev position doubled so it doesn't overlap for next move
							var rateX = tempX - _prevMove.x,
								rateY = tempY - _prevMove.y;
							_prevMove.x -= rateX;
							_prevMove.y -= rateY;
							$game.player.stopMove(_prevMove);
							break;
						}
						if(readyToFlip) {
							other.flipped = true;
							if(other.kind === 'item') {
								other.selector.toggleClass('fgItem');	
							} else if(other.kind === 'person') {
								other.selector.toggleClass('fgPerson');
							}
							//remove it from list so we stop detecting
							_hitList.splice(h,1);				
						}
					}
				}
				//store the last step so we can place player there for no conflicts on next move
				_prevMove.x = tempX;
				_prevMove.y = tempY;

				requestAnimationFrame(self.hitTest);
			}
		},

		clicked: function(key) {
			if(self.data[key].action) {
				self.data[key].action();
			} else {
				//TODO
				//showMessage({el: this, messages: items[key].messages});
			}
		}
	};
	self.init();

	//private functions
	function _setupItems(index) {
		var key = self.itemKeys[index],
			info = self.data[key];
		//create item, add to dom
		var item = document.createElement('div');
		var img = new Image();
		img.onload = function() {
			//set the background image and append
			item.setAttribute('id', key);
			item.setAttribute('class', info.class + ' item');
			item.setAttribute('data-key', key);
			var divWidth;
			//set size, based on if it is animated or not
			if(info.frames) {
				//if animted, add it to animation list
				//animatedItemList.push(key);
				info.curFrame = Math.floor(Math.random() * info.frames);
				divWidth = Math.floor(img.width / info.frames);
			} else {
				divWidth = img.width;
			}
			$(item).css({
				position: 'absolute',
				top: info.y,
				left: info.x,
				width: divWidth,
				height: img.height,
				backgroundImage: 'url(' + img.src + ')'
			});
			$GAMEBOARD.append(item);
			info.selector = $('#' + key);
			info.w = divWidth;
			info.h = img.height;
			info.bottom = info.y + info.h;
			index++;
			if(index < self.itemKeys.length) {
				_setupItems(index);
			} else {
				console.log('environment loaded');
			}
		}
		img.src = '/img/items/' + info.class + '.png';
	}

	function _loadData() {
		self.data = {
			'tree1': {
				class: 'tree',
				x: 200,
				y: 150,
				messages: ['I am tree!']
			},
			'desk1': {
				class: 'desk',
				x: 800,
				y: 250,
				messages: ['wahoo desk! wicked exciting.']
			},
			'whiteboard': {
				class: 'whiteboard',
				x: 500,
				y: 50,
				action: function() {
					whiteboard();
				}
			},
			'burger': {
				class: 'burger',
				x: 500,
				y: 350,
				frames: 6,
				messages: ['le cheezbooooger']
			},
			'boombox': {
				class: 'boombox',
				x: 700,
				y: 450,
				messages: ['booooombox'],
				action: function() {
					$game.audio.nextSong();
				}
			}
		};
	}
})();