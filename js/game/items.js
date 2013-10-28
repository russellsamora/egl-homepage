(function(){

	var _hitList,
		_prevMove = {},
		_animatedItemKeys = [],
		_pfx = ["webkit", "moz", "MS", "o", ""],
		_challengeSlide = 0;

	var items = $game.items = {
		itemKeys: null,
		itemData: null,
		ready: false,

		init: function() {
			_loadData();
			items.itemKeys = Object.keys(items.itemData);
			_setupItems(0);
		},

		setZIndex: function(input) {
			var minX = Math.min(input.x,$game.player.x),
				minY = Math.min(input.y,$game.player.y),
				playerBottom = $game.player.y + $game.player.h;

			if(DEV_MODE) {
				$('.devDirtyBound').remove();
				var d = document.createElement('div');
				d.setAttribute('class', 'devDirtyBound');
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
			for(var i = 0; i < items.itemKeys.length; i++) {
				var item = items.itemData[items.itemKeys[i]];
				//see if it will be in range of the new walk
				if ((minX + input.w >= item.x) && (minX <= item.x + item.w) && (minY + input.h >= item.y) && (minY <= item.y + item.h)) {
					item.flipped = false;
					item.kind = 'item';
					_hitList.push(item);
					//check to see which side the player is on (above or below)
					if(playerBottom < item.bottom) {
						//above
						item.selector.addClass('fgItem');
						//HACK
						//TODO
						// if(item.bind) {
						// 	items.peopleData[item.bind].selector.addClass('fgPerson');
						// }
						item.side = -1;
					} else {
						//below
						item.selector.removeClass('fgItem');
						item.side = 1;
						//TODO
						// if(item.bind) {
						// 	items.peopleData[item.bind].selector.removeClass('fgPerson');
						// }
					}
				}
			}
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
					//see if player has crossed Y plane and we need to switch zindex
					var yDiff = bottomY - other.bottom,
						diff =  yDiff < 0 ? -1 : 1;
					//check for collision (must do first so we don't flip if jump pos back)
					if ((tempX + $game.player.w >= other.x) && (tempX <= other.x + other.w) && (Math.abs(yDiff) < HEIGHT_BUFFER)) {
						//return prev position doubled so it doesn't overlap for next move
						var rateX = tempX - _prevMove.x,
							rateY = tempY - _prevMove.y;
						_prevMove.x -= rateX;
						_prevMove.y -= rateY;
						$game.player.stopMove(_prevMove);
						break;
					}
					if(diff !== other.side) {
						if(!other.flipped) {
							other.flipped = true;
							if(other.kind === 'item') {
								other.selector.toggleClass('fgItem');
								//HACK
								//TODO fix this
								// if(other.bind) {
								// 	items.peopleData[other.bind].selector.toggleClass('fgPerson');
								// 	//must find bound and set flipped so it doesn't flop HA
								// 	for(var h = 0; h < _hitList.length; h++) {
								// 		if(other.bind === _hitList[h].bindName) {
								// 			_hitList[h].flipped = true;
								// 		}
								// 	}
								// }
							}
						}
					}
				}
				//store the last step so we can place player there for no conflicts on next move
				_prevMove.x = tempX;
				_prevMove.y = tempY;

				requestAnimationFrame(items.hitTest);
			}
		},

		clickedItem: function(key, el) {
			var item = items.itemData[key];
			if(item.action) {
				item.action(el);
			}
			if(item.message) {
				$game.showMessage({el: el, message: item.message});	
			}
			if(!item.invisible) {
				$game.input.preventMove();
			}
		},

		checkScreen: function() {
			//get current window position
			var left = pageXOffset,
				top = pageYOffset;
			//compare each item and see if it is on screen
			for (var itemName in items.itemData) {
				var item = items.itemData[itemName];
				if(	top > (item.y + item.h) 
					|| (top + $game.input.height) < item.y 
					|| left > (item.x + item.w) 
					|| (left + $game.input.width) < item.x) {
					if(item.onScreen) {
						$(item.selector).addClass('offscreen');
					}
					item.onScreen = false;
				} else {
					if(!item.onScreen) {
						$(item.selector).removeClass('offscreen');
					}
					item.onScreen = true;
				}
			}
			//if it is AND it has changed state (off/on) then toggle class
		},

		updateAnimations: function() {
			for(var a = 0; a < _animatedItemKeys.length; a++) {
				var item = items.itemData[_animatedItemKeys[a]];
				_animateItem(item);
			}
		},
	};
	items.init();

	//private functions
	function _setupItems(index) {
		var key = items.itemKeys[index],
			info = items.itemData[key],
			item = document.createElement('div'),
			img = new Image();
		
		img.onload = function() {
			//set the background image and append
			item.setAttribute('id', key);
			item.setAttribute('class', info.class + ' item'); 
			item.setAttribute('data-key', key);
			var divWidth, divHeight;
			//set size, based on if it is animated or not
			if(info.frames) {
				//if animted, add it to animation list
				_animatedItemKeys.push(key);
				info.curFrame = Math.floor(Math.random() * info.frames);
				divWidth = Math.floor(img.width / info.frames);
				divHeight = img.height;
			} else {
				divWidth = img.width;
				divHeight = img.height;
			}
			//we are animating with css instead of spritesheet
			if(info.css) {
				divWidth = info.css.w;
				divHeight = info.css.h;
			}
			$(item).css({
				position: 'absolute',
				top: info.y,
				left: info.x,
				width: divWidth,
				height: divHeight,
				backgroundImage: 'url(' + img.src + ')'
			});
			$GAMEBOARD.append(item);
			if(info.css) {
				info.css.init();
			}
			info.selector = $('#' + key);
			info.w = divWidth;
			info.h = divHeight;
			info.bottom = info.y + info.h;
			info.onScreen = true;
			index++;
			if(index < items.itemKeys.length) {
				_setupItems(index);
			} else {
				console.log('items ready');
				items.ready = true;
			}
		}
		img.src = '../../img/items/' + info.class + '.png';
	}

	function _loadData() {
		items.itemData = {
			'marker2': {
				class: 'marker2',
				x: 1050,
				y: 173,
				message: 'Green marker, I choose you!',
				action: function() {
					$game.whiteboard.setColor('#78cbd1');
				}
			},
			'marker1': {
				class: 'marker1',
				x: 1100,
				y: 169,
				message: 'Red marker, go!',
				action: function() {
					$game.whiteboard.setColor('#ff5622');
				}
			},
			'eraser': {
				class: 'eraser',
				x: 850,
				y: 173,
				message: 'I feel just like Sisyphus...',
				action: function() {
					if($game.whiteboard.drawingExists) {
						$game.whiteboard.saveDrawing();
					}
					$game.whiteboard.clearBoard();
				}
			},
			'boombox': {
				class: 'boombox',
				x: 1450,
				y: 700,
				message: 'use my buttons to pump up the jams!'
			},
			'coffeemaker': {
				class: 'coffee',
				x: 50,
				y: 650,
				frames: 8,
				animation: [0,1,2,3,4,5,6,7],
				paused: false,
				message: 'Must make coffee!'
			},
			'discoball': {
				class: 'discoball',
				x: 1205,
				y: -150,
				frames: 8,
				animation: [0,1,2,3,4,5,6,7],
				paused: false,
				action: function(el) {
					$game.toggleDiscoMode();
					setTimeout(function() {
						$game.toggleDiscoMode();
					}, 5000);
					if($game.localStore.playing && $game.localStore.targetPerson === 'jesse') {
						if(!$game.localStore.tasks.jesse) {
							$game.taskComplete();	
						}
						$game.localStore.tasks.jesse = true;
						$game.updateStorage();
					} else {
						$game.showMessage({el: el, message: 'Disco Stu likes disco music.'});
					}
				}
			},
			'playButton': {
				class: 'playButton',
				x: 1492,
				y: 734,
				// message: 'booooombox',
				action: function() { $game.audio.play(); }
			},
			'stopButton': {
				class: 'stopButton',
				x: 1525,
				y: 734,
				// message: 'booooombox',
				action: function() { $game.audio.pause(); }
			},
			'upButton': {
				class: 'upButton',
				x: 2580,
				y: 145,
				action: function() { 
					//switch gif source
					var url = 'url(' + 'http://engagementgamelab.org/labGifs/fresh.gif)';
					$('#tele').css('background-image', url);
				}
			},
			'downButton': {
				class: 'downButton',
				x: 2600,
				y: 145,
				action: function() { 
					//switch gif source
					var url = 'url(' + 'img/other/panda.gif)';
					$('#tele').css('background-image', url);
					if($game.localStore.playing && $game.localStore.targetPerson === 'christina') {
						if(!$game.localStore.tasks.christina) {
							$game.taskComplete();	
						}
						$game.localStore.tasks.christina = true;
						$game.updateStorage();
					}
				}
			},
			'bookshelf': {
				class: 'bookshelf',
				x: 130,
				y: 0
			},
			'book': {
				class: 'book',
				x: 165,
				y: 68,
				action: function() {
					//open secret images page
					window.open('http://engagementgamelab.org/wearewatchingyou/index.html', '_blank');
					window.focus();
					if($game.localStore.playing && $game.localStore.targetPerson === 'jedd') {
						if(!$game.localStore.tasks.jedd) {
							$game.taskComplete();	
						}
						$game.localStore.tasks.jedd = true;
						$game.updateStorage();
					}
				}
			},
			'plant0': {
				class: 'plant0',
				x: -60,
				y: 130,
				invisible: true
				
			},
			'plant1': {
				class: 'plant1',
				x: 800,
				y: 650,
				invisible: true
				// bind: 'jesse',
				// bindName: 'plant1'
			},
			'couch': {
				class: 'couch',
				x: 1560,
				y: 150,
				invisible: true,
				bind: 'christina',
				bindName: 'couch'
			},
			'computer': {
				class: 'computer',
				x: 2420,
				y: 650,
				action: function(el) {
					if($game.localStore.playing && $game.localStore.targetPerson === 'russell') {
						$game.codegame.show();
					} else {
						$game.showMessage({el: el, message: 'Jony Ive hates me.'});
					}
				}
			},
			'water': {
				class: 'water',
				x: 2100,
				y: 50,
				// invisible: true,
				frames: 7,
				animation: [0,1,2,3,4,5,6],
				paused: false,
				message: 'I am just a water cooler...',
				playSound: function() {
					$game.audio.playFx('water');
				},
				sleep: function() {
					this.paused = true;
					var timeout = Math.floor(Math.random() * 40000 + 4000);
					setTimeout(function(self) {
						self.paused = false;
						self.playSound();
					}, timeout, this);
				}
			},
			'coffeetable': {
				class: 'coffeetable',
				x: 2500,
				y: 240,
				invisible: true
			},
			'crat': {
				class: 'crat',
				x: 600,
				y: 150,
				frames: 8,
				animation: [0,1,2,3,4,5,6,7],
				paused: false,
				sleep: function() {
					this.paused = true;
					var timeout = Math.floor(Math.random() * 6000 + 2000);
					setTimeout(function(self) {
						self.paused = false;
					}, timeout, this);
				},
				action: function(el) {
					var msg = 'I say, my good fellow! The Lab is your oyster. Explore to your heart\'s content. OR... if you\'re feeling adventurous, you can try out the once-in-a-lifetime experience of Game Mode. Ready to give it a go? ';
					if($game.localStore.playing) {
						msg = 'Game Mode Activated! Jolly good! You can EXIT Game Mode at any time by coming back to me. To begin your quest, search the lab for the staff member with THE MOST COFFEE. Good luck!';
					}
					$game.showMessage({el: el, message: msg, crat: true});
				}	
			},
			'rob': {
				class: 'rob',
				x: 1300,
				y: 30,
				frames: 5,
				animation: [0,1,2,3,4],
				paused: false,
				sleep: function() {
					this.paused = true;
					var timeout = Math.floor(Math.random() * 2000 + 2000);
					setTimeout(function(self) {
						self.paused = false;
					}, timeout, this);
				},
				action: function() {
					var wiki = $game.wiki.getWiki();
					$('#popupBox .wiki p').text(wiki);
					$game.hidePopup();
					$('#popupBox .wiki').show();
					$('#popupBox').show();
					setTimeout(function() {
						items.showingBio = true;
					}, 17);
					//only add as task done if steve is current target
					if($game.localStore.playing && $game.localStore.targetPerson === 'sam') {
						if(!$game.localStore.tasks.sam) {
							$game.taskComplete();
						}
						$game.localStore.tasks.sam = true;
						$game.updateStorage();
					}
				}	
			},
			'cloud0': {
				class: 'cloud0',
				x: 0,
				y: 75,
				css: {
					w: 52,
					h: 44,
					init: function() {
						var anim = document.getElementById('cloud0');
						_prefixedEvent(anim, "AnimationIteration", _animationListener);
						$(anim).css('background-image', 'url(/img/items/cloud0.png)');
					},
					imageIndex: 0,
					numImages: 3,
					updateImage: function() {
						// $('#cloud1').css('background-position', '-255px 44px');
						this.imageIndex++;
						if(this.imageIndex >= this.numImages) {
							this.imageIndex = 0;
							//update bg
						}
						var url = 'url(../../img/items/cloud' + this.imageIndex + '.png)';
						$('#cloud0').css({
							backgroundImage: url
						});
					}
				}
			},
			'cloud1': {
				class: 'cloud1',
				x: 449,
				y: 75,
				css: {
					w: 106,
					h: 44,
					init: function() {
						var anim = document.getElementById('cloud1');
						_prefixedEvent(anim, "AnimationIteration", _animationListener);
						$(anim).css('background-image', 'url(/img/items/cloud0.png)');
					},
					imageIndex: 0,
					numImages: 3,
					updateImage: function() {
						// $('#cloud1').css('background-position', '-255px 44px');
						this.imageIndex++;
						if(this.imageIndex >= this.numImages) {
							this.imageIndex = 0;
							//update bg
						}
						var url = 'url(../../img/items/cloud' + this.imageIndex + '.png)';
						$('#cloud1').css({
							backgroundImage: url
						});
					}
				}
			},
			'cloud2': {
				class: 'cloud2',
				x: 1447,
				y: 75,
				css: {
					w: 106,
					h: 44,
					init: function() {
						var anim = document.getElementById('cloud2');
						_prefixedEvent(anim, "AnimationIteration", _animationListener);
						$(anim).css('background-image', 'url(/img/items/cloud0.png)');
					},
					imageIndex: 0,
					numImages: 3,
					updateImage: function() {
						// $('#cloud2').css('background-position', '-255px 44px');
						this.imageIndex++;
						if(this.imageIndex >= this.numImages) {
							this.imageIndex = 0;
							//update bg
						}
						var url = 'url(../../img/items/cloud' + this.imageIndex + '.png)';
						$('#cloud2').css({
							backgroundImage: url
						});
					}
				}
			},
			'cloud3': {
				class: 'cloud2',
				x: 1948,
				y: 75,
				css: {
					w: 106,
					h: 44,
					init: function() {
						var anim = document.getElementById('cloud3');
						_prefixedEvent(anim, "AnimationIteration", _animationListener);
						$(anim).css('background-image', 'url(/img/items/cloud0.png)');
					},
					imageIndex: 0,
					numImages: 3,
					updateImage: function() {
						// $('#cloud1').css('background-position', '-255px 44px');
						this.imageIndex++;
						if(this.imageIndex >= this.numImages) {
							this.imageIndex = 0;
							//update bg
						}
						var url = 'url(../../img/items/cloud' + this.imageIndex + '.png)';
						$('#cloud3').css({
							backgroundImage: url
						});
					}
				}
			},
		};
	}

	function _animateItem(item) {
		//console.log(item.paused, item.curFrame, item.animation.length);
		if(!item.paused && item.onScreen) {
			item.curFrame++;
			if(item.curFrame >= item.animation.length) {
				item.curFrame = 0;
				if(item.sleep) {
					item.sleep();
				}
			}
			var position = - item.animation[item.curFrame] * item.w + 'px 0';
			// console.log(position);
			item.selector.css('background-position', position);
		}
	}

	function _prefixedEvent(element, type, callback) {
		for (var p = 0; p < _pfx.length; p++) {
		if (!_pfx[p]) type = type.toLowerCase();
		element.addEventListener(_pfx[p]+type, callback, false);
		}
	}

	function _animationListener(e) {
		var key = e.srcElement.id,
			item = items.itemData[key];

		if(typeof item.css.updateImage === 'function') {
			item.css.updateImage();
		}
	}
})();