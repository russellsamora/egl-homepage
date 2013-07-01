(function(){

	var _hitList,
		_prevMove = {};

	var self = $game.items = {
		itemKeys: null,
		peopleKeys: null,
		itemData: null,
		peopleData: null,
		ready: false,

		init: function() {
			_loadData();
			self.itemKeys = Object.keys(self.itemData);
			self.peopleKeys = Object.keys(self.peopleData);
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
			for(var i = 0; i < self.itemKeys.length; i++) {
				var item = self.itemData[self.itemKeys[i]];
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
			//people
			for(var j = 0; j < self.peopleKeys.length; j++) {
				var person = self.peopleData[self.peopleKeys[j]];
				if ((minX + input.w >= person.x) && (minX <= person.x + person.w) && (minY + input.h >= person.y) && (minY <= person.y + person.h)) {
					person.flipped = false;
					person.kind = 'person';
					_hitList.push(person);
					//check to see which side the player is on (above or below)
					if(playerBottom < person.bottom) {
						person.selector.addClass('fgPerson');
					} else {
						person.selector.removeClass('fgPerson');
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
					if((bottomY >= other.bottom) && (bottomY <= other.bottom + HEIGHT_BUFFER)) {
						//check for collision (must do first so we don't flip if jump pos back)
						if ((tempX + $game.player.w >= other.x) && (tempX <= other.x + other.w)) {
							//return prev position doubled so it doesn't overlap for next move
							var rateX = tempX - _prevMove.x,
								rateY = tempY - _prevMove.y;
							_prevMove.x -= rateX;
							_prevMove.y -= rateY;
							$game.player.stopMove(_prevMove);
							break;
						}
						if(!other.flipped) {
							other.flipped = true;
							if(other.kind === 'item') {
								other.selector.toggleClass('fgItem');
							} else if(other.kind === 'person') {
								other.selector.toggleClass('fgPerson');
							}
						}
					}
				}
				//store the last step so we can place player there for no conflicts on next move
				_prevMove.x = tempX;
				_prevMove.y = tempY;

				requestAnimationFrame(self.hitTest);
			}
		},

		clicked: function(key, el) {
			if(self.itemData[key].action) {
				self.itemData[key].action(el);
			} else {
				$game.showMessage({el: el, message: self.itemData[key].message});
			}
		}
	};
	self.init();

	//private functions
	function _setupItems(index) {
		var key = self.itemKeys[index],
			info = self.itemData[key],
			item = document.createElement('div'),
			img = new Image();

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
				_setupPeople(0);
			}
		}
		img.src = '/img/items/' + info.class + '.png';
	}

	function _setupPeople(index) {
		var key = self.peopleKeys[index],
			info = self.peopleData[key],
			item = document.createElement('div'),
			img = new Image();

		img.onload = function() {
			//set the background image and append
			item.setAttribute('id', key);
			item.setAttribute('class', 'person');
			item.setAttribute('data-key', key);
			$(item).css({
				position: 'absolute',
				top: info.y,
				left: info.x,
				width: img.width,
				height: img.height,
				backgroundImage: 'url(' + img.src + ')'
			});
			$GAMEBOARD.append(item);
			info.selector = $('#' + key);
			info.w = img.width;
			info.h = img.height;
			info.bottom = info.y + info.h;
			index++;
			if(index < self.peopleKeys.length) {
				_setupPeople(index);
			} else {
				_loadPeopleInfo(true); //null for google doc data
			}
		}
		img.src = 'img/people/' + key + '.png';
	}

	function _loadData() {
		self.itemData = {
			'tree1': {
				class: 'tree',
				x: 200,
				y: 150,
				message: 'I am tree!'
			},
			'desk1': {
				class: 'desk',
				x: 800,
				y: 250,
				message: 'wahoo desk! wicked exciting.'
			},
			'whiteboard': {
				class: 'whiteboard',
				x: 500,
				y: 150,
				action: function() {
					whiteboard();
				}
			},
			'burger': {
				class: 'burger',
				x: 500,
				y: 350,
				frames: 6,
				message: 'le cheezbooooger'
			},
			'boombox': {
				class: 'boombox',
				x: 700,
				y: 450,
				message: 'booooombox',
				action: function(el) {
					$game.audio.startMusic(el);
				}
			}
		};

		self.peopleData = {
			'steve': {
				x: 100,
				y: 600
			},
			'eric': {
				x: 200,
				y: 600
			},
			'russell': {
				x: 300,
				y: 600
			},
			'sam': {
				x: 400,
				y: 600
			},
			'aidan': {
				x: 500,
				y: 600
			},
			'jedd': {
				x: 600,
				y: 600
			},
			'jesse': {
				x: 700,
				y: 600
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
					if(self.peopleData[row.name]) {
						self.peopleData[row.name].status = row.status;
					}
				});
				self.ready = true;
			},
			error: function() {
				console.log('having a bad day? Try backup data!');
				loadData(true);
			}
		});
	}
})();