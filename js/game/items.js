(function(){

	var _hitList,
		_prevMove = {},
		_animatedItemKeys = [],
		_animatedPeopleKeys = [],
		_pfx = ["webkit", "moz", "MS", "o", ""],
		_challengeSlide = 0;

	var items = $game.items = {
		itemKeys: null,
		peopleKeys: null,
		itemData: null,
		peopleData: null,
		showingBio : false,
		ready: false,

		init: function() {
			_loadData();
			items.itemKeys = Object.keys(items.itemData);
			items.peopleKeys = Object.keys(items.peopleData);
			_setupItems(0); //this triggers setupPeple when done
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
						if(item.bind) {
							items.peopleData[item.bind].selector.addClass('fgPerson');
						}
						item.side = -1;
					} else {
						//below
						item.selector.removeClass('fgItem');
						item.side = 1;
						if(item.bind) {
							items.peopleData[item.bind].selector.removeClass('fgPerson');
						}
					}
				}
			}
			//people
			for(var j = 0; j < items.peopleKeys.length; j++) {
				var person = items.peopleData[items.peopleKeys[j]];
				if ((minX + input.w >= person.x) && (minX <= person.x + person.w) && (minY + input.h >= person.y) && (minY <= person.y + person.h)) {
					person.flipped = false;
					person.kind = 'person';
					_hitList.push(person);
					//check to see which side the player is on (above or below)
					if(playerBottom < person.bottom) {
						person.selector.addClass('fgPerson');
						person.side = -1;
					} else {
						person.selector.removeClass('fgPerson');
						person.side = 1;
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
								if(other.bind) {
									items.peopleData[other.bind].selector.toggleClass('fgPerson');
									//must find bound and set flipped so it doesn't flop HA
									for(var h = 0; h < _hitList.length; h++) {
										if(other.bind === _hitList[h].bindName) {
											_hitList[h].flipped = true;
										}
									}
								}
							} else if(other.kind === 'person') {
								other.selector.toggleClass('fgPerson');
								//HACK
								if(other.bind) {
									items.itemData[other.bind].selector.toggleClass('fgItem');
									//must find bound and set flipped so it doesn't flop HA
									for(var h = 0; h < _hitList.length; h++) {
										if(other.bind === _hitList[h].bindName) {
											_hitList[h].flipped = true;
										}
									}
								}
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

		clickedPerson: function(key, el) {
			var person = items.peopleData[key],
				game = person.game;
			//see if in game mode
			var msg, target;
			if($game.localStore.playing) {
				//current target && not visited
				//current target && visited
				//future target
				//past target
				if($game.localStore.targetPerson === key) {
					//determine if player has talked to them yet
					if($game.localStore.people[key]) {
						msg = game.clue;
					} else {
						//check if they did mini challenge (task)
						if($game.localStore.tasks[key]) {
							msg = game.present;
							target = true;
						} else {
							msg = game.task;
						}
					}
				} else if($game.localStore.previousPerson === key) {
					msg = game.chatClue;
				} else {
					//see if we unlockeed them already
					if($game.localStore.people[key]) {
						msg = game.past;
					} else {
						msg = game.future;
					}
				}
			} else {
				msg = person.status;
			}
			
			$game.showMessage({el: el, message: msg, bioKey: key, target: target});
		},

		showBioCard: function(key) {
			$game.hideMessage();
			var person = items.peopleData[key];
			$('#popupBox .bioImage').attr('src', '../../img/people/bio/real_' + key + '.jpg');
			$('#popupBox .bioName span').text(person.fullName);
			$('#popupBox .bioTitle span').text(person.jobTitle);
			$('#popupBox .bioAbout span').html(person.about);

			$game.hidePopup();
			$('#popupBox .bio').show();
			$('#popupBox').show();
			setTimeout(function() {
				items.showingBio = true;
			}, 17);
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
			//compare people
			for (var personName in items.peopleData) {
				var person = items.peopleData[personName];
				if(	top > (person.y + person.h) 
					|| (top + $game.input.height) < person.y 
					|| left > (person.x + person.w) 
					|| (left + $game.input.width) < person.x) {
					person.onScreen = false;
				} else {
					person.onScreen = true;
				}
			}
			//if it is AND it has changed state (off/on) then toggle class
		},

		updateItemAnimations: function() {
			for(var a = 0; a < _animatedItemKeys.length; a++) {
				var item = items.itemData[_animatedItemKeys[a]];
				_animateItem(item);
			}
			for(var b = 0; b < _animatedPeopleKeys.length; b++) {
				var item = items.peopleData[_animatedPeopleKeys[b]];
				_animateItem(item);
			}
		},

		showChallenge: function() {
			$('#challengeBox').hide().empty();
			_challengeSlide = 0;
			$game.hideMessage();
			_addChallengeContent();
			$('#challengeBox').show();
			setTimeout(function() {
				$game.input.preventMoveForever();
			}, 100);
		},

		nextSlide: function() {
			_challengeSlide += 1;
			if(_challengeSlide === 1) {
				_addChallengeContent();
			}
			else if(_challengeSlide === 2) {
				//submit answer
				var answer = $('#challengeAnswer').val();
				$game.localStore.answers.push(answer);
				$game.localStore.people[$game.localStore.targetPerson] = true;
				//set color in inventory
				var selector = '.' + $game.localStore.targetPerson + 'Inventory';
				$(selector).removeClass('grayscale');

				$game.localStore.targetIndex += 1;
				//TODO: a game over check
				if($game.localStore.targetIndex >= $game.targetOrder.length) {
					$game.localStore.over = true;
				}
				//congrats with clue screen
				_addChallengeContent();

				
				if(!$game.localStore.over) {
					$game.localStore.previousPerson = $game.localStore.targetPerson;
					$game.localStore.targetPerson = $game.targetOrder[$game.localStore.targetIndex];
				}
				var sound = 'win' + ($game.localStore.targetIndex - 1);
				$game.audio.playFx(sound);
				$game.updateStorage();

			} else if(_challengeSlide === 3) {
				$('#challengeBox').hide();
				$game.input.enableMove();
				if($game.localStore.over) {
					_promptName();
				}
			}
		}

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
				_setupPeople(0);
			}
		}
		img.src = '../../img/items/' + info.class + '.png';
	}

	function _setupPeople(index) {
		var key = items.peopleKeys[index],
			info = items.peopleData[key],
			item = document.createElement('div'),
			img = new Image();

		img.onload = function() {
			//set the background image and append
			item.setAttribute('id', key);
			item.setAttribute('class', 'person');
			item.setAttribute('data-key', key);
			var divWidth;
			//set size, based on if it is animated or not
			if(info.frames) {
				//if animted, add it to animation list
				_animatedPeopleKeys.push(key);
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
			if(index < items.peopleKeys.length) {
				_setupPeople(index);
			} else {
				//TODO: uncomment this
				// _preloadBioCards(0);
				_loadPeopleInfo();
			}
		}
		img.src = '../../img/people/' + key + '.png';
	}

	function _preloadBioCards(index) {		
		var img = new Image();
		img.onload = function() {
			index++;
			if(index < items.peopleKeys.length) {
				_setupPeople(index);
			} else {
				console.log('s');
				_loadPeopleInfo(); //set to null for google doc
			}
		}
		var person = items.peopleKeys[index];

		img.src = '../../img/people/bio/real_' + person + '.jpg';
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
				paused: false
			},
			'discoball': {
				class: 'discoball',
				x: 1205,
				y: -150,
				frames: 8,
				animation: [0,1,2,3,4,5,6,7],
				paused: false,
				action: function() {
					$game.toggleDiscoMode();
					setTimeout(function() {
						$game.toggleDiscoMode();
					}, 5000);
					if($game.localStore.playing && $game.localStore.targetPerson === 'jesse') {
						$game.localStore.tasks.jesse = true;
						$game.updateStorage();
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
			'water': {
				class: 'water',
				x: 2200,
				y: 650,
				// invisible: true,
				frames: 7,
				animation: [0,1,2,3,4,5,6],
				paused: false,
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
				x: 2400,
				y: 800,
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
					var msg = 'Hey there! Havin\' fun exploring the Lab? Want to kick things into high gear? We\'ll help you create your own engagement game! Just enter "game-mode" and start playing.';
					if($game.localStore.playing) {
						msg = 'Want to exit Game Mode? Your progress will be saved.';
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
					if($game.localStore.playing && $game.localStore.targetPerson === 'eric') {
						$game.localStore.tasks.eric = true;
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

		items.peopleData = {
			'stephen': {
				x: 300,
				y: 500,
				frames: 8,
				animation: [4,5,6,7,0,1,2,3,6,7,5,6,5,0,1,4,5,6,7,6,5,4,0,1,2,1,0,6,5,7,4,6,5,4],
				fullName: 'Stephen Walter',
				jobTitle: 'Managing Director',
				about: 'Stephen makes and studies media that aim to foster and amplify experiences of complexity, difference, and play.',
				game: {
					past: 'What are you doing back here? Did you want to change your answer? Well, too bad!',
					task: 'no task from me.',
					present: 'Oh, hey there! Thanks for visiting the Lab. Ready to get to work? I mean... fun?',
					future: 'No future from me.',
					reward: {
						text: 'Nice! Here, take some dongles. They\'ll help you in your quest.',
						name: 'dongle',
						count: 3
					},
					clue: 'To get to the next stage in the game, you\'ll need to talk to our fearless leader. Good luck!',
					chatClue: 'Have you found our fearless leader yet? He\'s right over there!',
					information: '<p>All engagement games begin with a real-world problem, because the purpose of an engagement game is to enable real-world change. For example, we saw barriers to entry and discussion in local planning, so we decided to make <a href="/projects/community-planit" target="_blank">Community PlanIt</a> to help break those barriers down. Games can be used to solve huge problems that affect millions of people, or bite-sized problems that affect small, local communities.</p>',
					question: 'What real world problem will your engagement game help solve?',
					lead: 'The issue is ',
					questionType: 'open',
					maxLength: 40
				}
			},
			'eric': {
				x: 250,
				y: 80,
				frames: 5,
				animation: [0,1,2,3,4],
				paused: false,
				sleep: function() {
					this.paused = true;
					var timeout = Math.floor(Math.random() * 10000 + 4000);
					setTimeout(function(self) {
						self.paused = false;
					}, timeout, this);
				},
				fullName: 'Eric Gordon',
				jobTitle: 'Executive Director',
				about: 'Eric studies civic media, mediated cities and playful engagement.  He is a fellow at the Berkman Center for Internet and Society at Harvard University and he is an associate professor in the department of Visual and Media Arts at Emerson College.',
				game: {
					past: 'Bored? You could always talk to Rob and learn some more facts.',
					task: 'You\'ve found me, the fearless leader of the Lab. I really want to help you make your engagement game, but first you must prove your wisdom by learning a fact from one of our Fount of Knowledge.',
					present: 'You learned a most-excellent fact. You are now ready.',
					future: 'Later...',
					reward: {
						text: 'I like it! You\'ve earned an award!',
						name: 'award',
						count: 1
					},
					clue: 'To find your next guide, you\'ll have to take a seat.',
					chatClue: 'Still looking for her? I thought my clue was easy enough. Have a seat, get it?',
					information: '<p>The difference between engagement games and other "learning" or "serious" games is action. An engagement game doesn\'t just teach about a topic or encourage later action - the very act of playing the game <b>is</b> real-world action. </p><p>For instance, in <a href="/projects/upriver/" target="_blank">UpRiver</a>, the game requires players to make real predictions about river levels near them and accurately measure those levels. This arms them with real-life information that could save them from floods!</p>',
					question: 'What real-world action will your game facilitate?',
					lead: 'The issue is ',
					questionType: 'open',
					maxLength: 40
				}
			},
			'christina': {
				x: 1620,
				y: 70,
				frames: 4,
				animation: [0,1,2,3,1,1,2,3,1,2,3,1,2,3,1,2,2,3,2,1,2],
				paused: false,
				sleep: function() {
					this.paused = true;
					var timeout = Math.floor(Math.random() * 3000 + 2000);
					setTimeout(function(self) {
						self.paused = false;
					}, timeout, this);
				},
				fullName: 'Christina Wilson',
				jobTitle: 'Project Manager',
				about: 'Christina\'s abiding interests in open access to a participatory democracy, ethics, and the role of technology in shaping human experiences drew her to the Engagement Game Lab.',
				bindName: 'christina',
				bind: 'couch',
				game: {
					past: 'Check out Community PlanIt on our projects page.',
					task: 'Oh! Nice to meet you. I think you\'re ready for the next step in developing your game... but first do me a solid and put on the Panda Cam. Then we\'ll talk.',
					present: 'Pandas, yay!',
					future: 'Dear Sir or madam... no, that\'s not right at all. Hmmm...',
					reward: {
						text: 'Very good! I award you six arbitrary badges.',
						name: 'badge',
						count: 6
					},
					clue: 'Wow, you\'ve earned the Badge-Collector Badge! Great job. For the next stage in the game, you\'ll need to get technical.',
					chatClue: 'Found that tech-savvy EGLer yet? His face was just on the TV.',
					information: '<p>Our engagement games are developed in cooperation with community partners. By working with organizations who have a need and are experts on their communities, we can create games that come from a place of trust and knowledge. </p><p>For example, when we create a game on our <a href="/community-planit" target="_blank">Community PlanIt</a> platform, we partner with local planning departments, non-profit organizations, and local governments.</p>',
					question: 'Who will you partner with to make your game a success?',
					lead: 'The issue is ',
					questionType: 'open',
					maxLength: 40
				}
			},
			'russell': {
				x: 1900,
				y: 450,
				frames: 3,
				animation: [0,0,1,2,1,1,2,0,0,2,1,2,1,2],
				fullName: 'Russell Goldenberg',
				jobTitle: 'Hacker-in-Chief',
				about: 'Russell is an interactive developer who creates games and data visualizations at the lab.',
				game: {
					past: 'What are you doing back here? Did you want to change your answer? Well, too bad!',
					task: 'no task from me.',
					present: 'Oh, hey there! Thanks for visiting the Lab. Ready to get to work? I mean... fun?',
					future: 'No future from me.',
					reward: {
						text: 'Nice! Here, take some dongles. They\'ll help you in your quest.',
						name: 'dongle',
						count: 3
					},
					clue: 'To get to the next stage in the game, you\'ll need to talk to our fearless leader. Good luck!',
					chatClue: 'Have you found our fearless leader yet? He\'s right over there!',
					information: '<p>All engagement games begin with a real-world problem, because the purpose of an engagement game is to enable real-world change. For example, we saw barriers to entry and discussion in local planning, so we decided to make <a href="/projects/community-planit" target="_blank">Community PlanIt</a> to help break those barriers down. Games can be used to solve huge problems that affect millions of people, or bite-sized problems that affect small, local communities.</p>',
					question: 'What real world problem will your engagement game help solve?',
					lead: 'The issue is ',
					questionType: 'open',
					maxLength: 40
				}
			},
			'sam': {
				x: 2300,
				y: 200,
				frames: 8,
				animation: [0,1,2,3,4,5,6,7],
				paused: false,
				sleep: function() {
					this.paused = true;
					var timeout = Math.floor(Math.random() * 3000 + 2000);
					setTimeout(function(self) {
						self.paused = false;
					}, timeout, this);
				},
				fullName: 'Sam Liberty',
				jobTitle: 'Game Writer',
				about: 'Sam is lead writer for EGL\'s projects, including Community PlanIt and Civic Seed, and one half of the Spoiled Flush Games design studio. ',
				game: {
					past: 'What are you doing back here? Did you want to change your answer? Well, too bad!',
					task: 'no task from me.',
					present: 'Oh, hey there! Thanks for visiting the Lab. Ready to get to work? I mean... fun?',
					future: 'No future from me.',
					reward: {
						text: 'Nice! Here, take some dongles. They\'ll help you in your quest.',
						name: 'dongle',
						count: 3
					},
					clue: 'To get to the next stage in the game, you\'ll need to talk to our fearless leader. Good luck!',
					chatClue: 'Have you found our fearless leader yet? He\'s right over there!',
					information: '<p>All engagement games begin with a real-world problem, because the purpose of an engagement game is to enable real-world change. For example, we saw barriers to entry and discussion in local planning, so we decided to make <a href="/projects/community-planit" target="_blank">Community PlanIt</a> to help break those barriers down. Games can be used to solve huge problems that affect millions of people, or bite-sized problems that affect small, local communities.</p>',
					question: 'What real world problem will your engagement game help solve?',
					lead: 'The issue is ',
					questionType: 'open',
					maxLength: 40
				}
			},
			'aidan': {
				x: 850,
				y: 200,
				frames: 7,
				animation: [0,1,2,3,4,5,6],
				paused: false,
				sleep: function() {
					this.paused = true;
					var timeout = Math.floor(Math.random() * 3000 + 2000);
					setTimeout(function(self) {
						self.paused = false;
					}, timeout, this);
				},
				fullName: 'Aidan O\'Donohue',
				jobTitle: 'Designer',
				about: 'Aidan graduated from the Rhode Island School of Design with a degree in painting, and has also studied design and architecture.',
				game: {
					past: 'What are you doing back here? Did you want to change your answer? Well, too bad!',
					task: 'no task from me.',
					present: 'Oh, hey there! Thanks for visiting the Lab. Ready to get to work? I mean... fun?',
					future: 'No future from me.',
					reward: {
						text: 'Nice! Here, take some dongles. They\'ll help you in your quest.',
						name: 'dongle',
						count: 3
					},
					clue: 'To get to the next stage in the game, you\'ll need to talk to our fearless leader. Good luck!',
					chatClue: 'Have you found our fearless leader yet? He\'s right over there!',
					information: '<p>All engagement games begin with a real-world problem, because the purpose of an engagement game is to enable real-world change. For example, we saw barriers to entry and discussion in local planning, so we decided to make <a href="/projects/community-planit" target="_blank">Community PlanIt</a> to help break those barriers down. Games can be used to solve huge problems that affect millions of people, or bite-sized problems that affect small, local communities.</p>',
					question: 'What real world problem will your engagement game help solve?',
					lead: 'The issue is ',
					questionType: 'open',
					maxLength: 40
				}
			},
			'jedd': {
				x: 1600,
				y: 450,
				frames: 4,
				animation: [2,0,1,2,2,2,0,0,1,1,1,0,0,1,2,1,3,3,3,0,0,1,0,0,1,2,1,1,0,0,0,1,2],
				paused: false,
				sleep: function() {
					this.paused = true;
					var timeout = Math.floor(Math.random() * 4000 + 2000);
					setTimeout(function(self) {
						self.paused = false;
					}, timeout, this);
				},
				fullName: 'Jedd Cohen',
				jobTitle: 'Curriculum Developer',
				about: 'Jedd is working to adapt Community PlanIt for use in schools and other community and advocacy organizations.',
				game: {
					past: 'What are you doing back here? Did you want to change your answer? Well, too bad!',
					task: 'no task from me.',
					present: 'Oh, hey there! Thanks for visiting the Lab. Ready to get to work? I mean... fun?',
					future: 'No future from me.',
					reward: {
						text: 'Nice! Here, take some dongles. They\'ll help you in your quest.',
						name: 'dongle',
						count: 3
					},
					clue: 'To get to the next stage in the game, you\'ll need to talk to our fearless leader. Good luck!',
					chatClue: 'Have you found our fearless leader yet? He\'s right over there!',
					information: '<p>All engagement games begin with a real-world problem, because the purpose of an engagement game is to enable real-world change. For example, we saw barriers to entry and discussion in local planning, so we decided to make <a href="/projects/community-planit" target="_blank">Community PlanIt</a> to help break those barriers down. Games can be used to solve huge problems that affect millions of people, or bite-sized problems that affect small, local communities.</p>',
					question: 'What real world problem will your engagement game help solve?',
					lead: 'The issue is ',
					questionType: 'open',
					maxLength: 40
				}
			},
			'jesse': {
				x: 1000,
				y: 620,
				frames: 5,
				animation: [0,1,2,1,2,0,4,0,2,0,1,2,4,3,4,2,2,1,0],
				paused: false,
				sleep: function() {
					this.paused = true;
					var timeout = Math.floor(Math.random() * 1000 + 1900);
					setTimeout(function(self) {
						self.paused = false;
					}, timeout, this);
				},
				fullName: 'Jesse Baldwin-Philippi',
				jobTitle: 'Rsearcher & Visiting Professor',
				about: 'Jesse is a visiting faculty member in Emerson\'s Department of Visual and Media Arts, and studies civic engagement, citizenship, and digital media.',
				// bind: 'plant1',
				// bindName: 'jesse',
				game: {
					past: 'What are you doing back here? Did you want to change your answer? Well, too bad!',
					task: 'no task from me.',
					present: 'Oh, hey there! Thanks for visiting the Lab. Ready to get to work? I mean... fun?',
					future: 'No future from me.',
					reward: {
						text: 'Nice! Here, take some dongles. They\'ll help you in your quest.',
						name: 'dongle',
						count: 3
					},
					clue: 'To get to the next stage in the game, you\'ll need to talk to our fearless leader. Good luck!',
					chatClue: 'Have you found our fearless leader yet? He\'s right over there!',
					information: '<p>All engagement games begin with a real-world problem, because the purpose of an engagement game is to enable real-world change. For example, we saw barriers to entry and discussion in local planning, so we decided to make <a href="/projects/community-planit" target="_blank">Community PlanIt</a> to help break those barriers down. Games can be used to solve huge problems that affect millions of people, or bite-sized problems that affect small, local communities.</p>',
					question: 'What real world problem will your engagement game help solve?',
					lead: 'The issue is ',
					questionType: 'open',
					maxLength: 40
				}
			}
		};
	}

	function _loadPeopleInfo(backupData) {
		var rawData;
		if(backupData) {
			rawData = new Miso.Dataset({
				url: '/data/backup.csv',
				delimiter: ','
			});
		} else {
			rawData = new Miso.Dataset({
				importer : Miso.Dataset.Importers.GoogleSpreadsheet,
				parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
				key : '0AtnV9m5qu78_dEY2dWNIRXNhTk1USk9rRG9McTFuMkE',
				worksheet: '1'
			});
		}
		rawData.fetch({
			success: function() {
				this.each(function(row){
					if(items.peopleData[row.name]) {
						items.peopleData[row.name].status = row.status;
					}
				});
				items.ready = true;
				console.log('items ready');
			},
			error: function() {
				console.log('having a bad day? Try backup data!');
				loadData(true);
			}
		});
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

	function _addChallengeContent() {
		$('#challengeBox').empty();
		var person = items.peopleData[$game.localStore.targetPerson],
			game = person.game,
			html;
		//if game over
		if($game.localStore.over) {
			//create Lib
			_createLib();
			html = '<p>Congrats! Here is your game lib:</p>';
			html += '<p>'+ $game.localStore.lib +'</p>';
			html += '<p><a href="#" class="nextSlide">Close</a></p>';
		} else if(_challengeSlide === 0) {
			//show info
			html = game.information;
			html += '<p><a href="#" class="nextSlide">Next</a></p>';
		} else if(_challengeSlide === 1) {
			//show question
			html = '<p><span class="h3like">Q: </span>' + game.question + '</p>';
			html += '<p>' + game.lead + ' <input id="challengeAnswer" maxLength="' + game.maxLength +'"></input></p>';
			html += '<p><a href="#" class="nextSlide">Submit</a></p>';
		} else {
			//show victory and clue
			html = '<p>' + game.reward.text + '</p>';
			html += '<p>' + game.clue + '</p>';
			html += '<p><a href="#" class="nextSlide">Close</a></p>';
			$game.spawnReward(game.reward);
		}
		$('#challengeBox').html(html);
		$game.input.bindNextSlide();
	}

	function _promptName() {
		$('#challengeBox').empty();
		var html = '<p>Enter your name to submit your lib:</p><p><input id="libName" maxLength="20"></input></p>';
		html += '<p><a href="#" class="saveLib">Submit</a></p>';
		$('#challengeBox').html(html).show();
		$BODY.on('click','.saveLib', function(e) {
			e.preventDefault();
				var name = $('#libName').val();
				_saveLib(name);
			$('#challengeBox').hide();
			return false;
		});
	}

	function _saveLib(name) {
		var lib = $game.localStore.lib,
			score = Math.floor(Math.random() * 100);
		$.post('../../db/saveLib.php', {lib: lib, score: score, name: name},
			function(res) {
				console.log(res);
			}, 'text');
	}

	function _createLib() {
		$game.localStore.lib = 'First thing is ' + $game.localStore.answers[0];
		$game.localStore.lib += 'First thing is ' + $game.localStore.answers[1];
		$game.localStore.lib += 'First thing is ' + $game.localStore.answers[2];
		$game.localStore.lib += 'First thing is ' + $game.localStore.answers[3];
		$game.localStore.lib += 'First thing is ' + $game.localStore.answers[4];
		$game.localStore.lib += 'First thing is ' + $game.localStore.answers[5];
		$game.localStore.lib += 'First thing is ' + $game.localStore.answers[6];
		$game.localStore.lib += 'First thing is ' + $game.localStore.answers[7];
	}
})();