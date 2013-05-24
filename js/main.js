window.requestAnimationFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback, element) {
			// window.setTimeout(callback, _tickSpeed); // <-- OLD VERSION
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - _lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
			_lastTime = currTime + timeToCall;
			return id;
		};
}());

var width,
	height,
	maxScroll;

var GAMEBOARD_WIDTH = 2000,
	GAMEBOARD_HEIGHT = 1000,
	NAVBAR_HEIGHT = 80,
	HEIGHT_BUFFER = 20; //how much buffer we check for collision detection (height of box)

var	player,
	sound;

var prevMoveX,
	prevMoveY,
	hitList,
	animatedItemList,
	peopleKeys,
	itemKeys,
	currentFrame = 0,
	numFrames = 64;

var	messageTimeout,
	preventMovementTimeout;

var ready = false,
	playing = false,
	inTransit = false,
	preventMovement = false,
	keyUp = true;

var $body,
	$gameboard,
	$overlay,
	$messageBox,
	$messageBoxP,
	$chooseCharacter,
	$chooseCharacterContent,
	$scrollElement,
	$prompt,
	$promptCopy,
	$promptButton0,
	$promptButton1;

var devMode = false;

$(function() {
	init();
});

function init() {
	player = loadPlayer();
	sound = loadSound();
	setupSelectors();
	setupKeys();
	resize();
	getFeed();
}

function setupSelectors() {
	$body = $('body');
	$overlay = $('.overlay');
	$gameboard = $('#gameboard');
	$scrollElement = $('html, body');
    $chooseCharacter = $('#chooseCharacter');
    $chooseCharacterContent = $('#chooseCharacter .content');
    $messageBox = $('#message');
    $messageBoxP = $('#message p');
    $prompt = $('#prompt');
    $promptCopy = $('#prompt .copy');
    $promptButton0 = $('#prompt .button0');
    $promptButton1 = $('#prompt .button1');

   //reset scrollbar
   $scrollElement.each(function(i) {
        $(this).scrollTop(0).scrollLeft(0);
    });
}

function setupKeys() {
	animatedItemList = [];
	peopleKeys = Object.keys(people);
	itemKeys = Object.keys(items);
	setupEnvironment(0);
}

//show a brief message that auto fades away on item
function showMessage(options) {
	var num = options.messages.length,
		msg;

	if(num === 1) {
		msg = options.messages[0];
		$messageBoxP.text(msg);	
	} else {
		//pick random
		var ran = Math.floor(Math.random() * num);
		msg = options.messages[ran];
		$messageBoxP.text(msg);
	}
	
	//figure out how to align it center
	var	top = parseInt(options.el.style.top,10) + 20,
		left = parseInt(options.el.style.left,10),
		mid = left + parseInt(options.el.style.width,10) / 2;

	var msgWidth = parseInt($messageBox.css('width'), 10),
		msgLeft = Math.floor(mid - msgWidth / 2);
	
	//clear old messages and change position and show and add fade out timer
	clearTimeout(messageTimeout);
	$messageBox.hide().css({
		top: top,
		left: msgLeft
	});

	var duration = msg.length * 80;
		fade = 200;
	if(options.noFade) {
		fade = 0;
	}

	$messageBox.show();
	messageTimeout = setTimeout(function() {
		$messageBox.fadeOut();
	}, duration);
}

//display prompt from a character
function showPrompt(options) {
	updatePromptButtons(options.kind);
	$promptCopy.text(options.copy);
	//update the position then show
	//align center
	var	top = parseInt(options.el.style.top,10) - 20,
		left = parseInt(options.el.style.left,10),
		mid = left + parseInt(options.el.style.width,10) / 2;

	var msgWidth = parseInt($prompt.css('width'), 10),
		msgLeft = Math.floor(mid - msgWidth / 2);
	
	$prompt.hide().css({
		top: top,
		left: msgLeft
	}).show();
}

function updatePromptButtons(kind) {
	if(kind === 'status') {
		//show bio or close
		$promptButton0.text('my bio');
		$promptButton1.text('close');
	}
}

//load in data for environmental image assets and attach to DOM
function setupEnvironment(index) {
	var key = itemKeys[index];
	var info = items[key];
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
			animatedItemList.push(key);
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
		$gameboard.append(item);
		info.selector = $('#' + key);
		info.w = divWidth;
		info.h = img.height;
		info.bottom = info.y + info.h;
		index++;
		if(index < itemKeys.length) {
			setupEnvironment(index);
		} else {
			console.log('environment loaded');
			setupPeople(0);
		}
	}
	img.src = '../img/items/' + info.class + '.png';
}

//load in the people image files and bind data
function setupPeople(index) {
	var key = peopleKeys[index];
	var info = people[key];
	//create item, add to dom
	var item = document.createElement('div');
	var img = new Image();
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
		$gameboard.append(item);
		info.selector = $('#' + key);
		info.w = img.width;
		info.h = img.height;
		info.bottom = info.y + info.h;
		index++;
		if(index < peopleKeys.length) {
			setupPeople(index);
		} else {
			console.log('people loaded');
			loadData('backup');
		}
	}
	img.src = '../img/people/' + key + '.png';
}

//load in the custom data from either google spreadsheet or backup to csv
function loadData(backupData) {
	var rawData;
	if(backupData) {
		rawData = new Miso.Dataset({
			url: '../data/backup.csv',
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
				if(people[row.name]) {
					people[row.name].status = row.status;
				}
			});
			ready = true;
			console.log('data loaded');
			$('.loading').delay(1000).fadeOut(function() {
				selectCharacter();
			});
		},
		error: function() {
			console.log('having a bad day? Try backup data!');
			loadData('backup');
		}
	});
}

//resize and update some vars
function resize() {
	width = $(window).width();
	height = $(window).height();
	maxScroll = { 
		left: Math.max(0,GAMEBOARD_WIDTH - width),
		top: Math.max(0,GAMEBOARD_HEIGHT - height + NAVBAR_HEIGHT)
	};
}

//slide the screen if the player is transition outside the current frame
function slideScreen(input) {
	//check for page edge clicking to animate scroll!
	var destX, destY;
	//make sure transition isn't too fast.
	var speed = Math.max(500,input.speed);

	//left edge
	if(input.edgeX < player.w && pageXOffset > 0) {
		destX = Math.max(pageXOffset - width / 2, 0);
	//right edge
	} else if( input.edgeX > width - player.w) {
		destX = Math.min(pageXOffset + width / 2, maxScroll.left);
	}
	//top edge
	if(input.edgeY < player.h + NAVBAR_HEIGHT && pageYOffset > NAVBAR_HEIGHT) {
		destY = Math.max(pageYOffset - height / 2, 0);
	//bottom edge
	} else if( input.edgeY > height - player.h) {
		destY = Math.min(pageYOffset + height / 2, maxScroll.top);
	}
	//console.log('y:', input.y,'edge:', input.edgeY,'page:', pageYOffset,'max:', maxScroll.top);

	//choose which to animate (must lump together so it doesn't halt other)
	if(destX !== undefined && destY !== undefined) {
		$scrollElement.stop().animate({
			scrollLeft: destX,
			scrollTop: destY
		}, speed,'linear');	
	} else if(destY !== undefined) {
		$scrollElement.stop().animate({
			scrollTop: destY
		}, speed,'linear');	
	} else if(destX !== undefined) {
		$scrollElement.stop().animate({
			scrollLeft: destX
		}, speed,'linear');	
	}
}

//hit test / flip z-index test on walk cycle
function hitTest() {
	//only test if moving...
	if(inTransit) {
		//must pull the current position (yuck)
		var tempX = parseFloat(player.otherSelector.style.left),
			tempY = parseFloat(player.otherSelector.style.top),
			bottomY = tempY + player.h;
		
		for(var h = 0; h < hitList.length; h++) {
			var other = hitList[h];
			//hit test for bottom of both rectangles
			if((bottomY >= other.bottom) && (bottomY <= other.bottom + HEIGHT_BUFFER)) {
				var readyToFlip;
				//if we just crossed hit the vertical intersection, switch the z-index, but only once
				if(!other.flipped) {
					readyToFlip = true;
				}
				//check for actual collision
				if ((tempX + player.w >= other.x) && (tempX <= other.x + other.w)) {
					stopMove();
					break;
				}
				if(readyToFlip) {
					other.flipped = true;
					if(other.kind === 'item') {
						other.selector.toggleClass('fgItem');	
					} else if(other.kind === 'person') {
						other.selector.toggleClass('fgPerson');
					}
					hitList.splice(h,1);				
				}
			}
		}
		//store the last step so we can place player there for no conflicts on next move
		prevMoveX = tempX;
		prevMoveY = tempY;

		//this might be too frequent? ( can just do ever 150 and be safe?)
		requestAnimationFrame(hitTest);
		//setTimeout(hitTest,speedAmplifier * (HEIGHT_BUFFER - 10));
	}
}

function setZIndex(input) {
	var minX = Math.min(input.x,player.x),
		minY = Math.min(input.y,player.y),
		playerBottom = player.y + player.h;

	if(devMode) {
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
		$gameboard.append(d);
	}
	hitList = [];
	//items
	for(var i = 0; i < itemKeys.length; i++) {
		var other = items[itemKeys[i]];
		if ((minX + input.w >= other.x) && (minX <= other.x + other.w) && (minY + input.h >= other.y) && (minY <= other.y + other.h)) {
			other.flipped = false;
			other.kind = 'item';
			hitList.push(other);
			//check to see which side the player is on (above or below)
			if(playerBottom < other.bottom) {
				other.selector.addClass('fgItem');
			} else {
				other.selector.removeClass('fgItem');
			}
		}
	}
	//people
	for(var i = 0; i < peopleKeys.length; i++) {
		var other = people[peopleKeys[i]];
		if ((minX + input.w >= other.x) && (minX <= other.x + other.w) && (minY + input.h >= other.y) && (minY <= other.y + other.h)) {
			other.flipped = false;
			other.kind = 'person';
			hitList.push(other);
			//check to see which side the player is on (above or below)
			if(playerBottom < other.bottom) {
				other.selector.addClass('fgPerson');
			} else {
				other.selector.removeClass('fgPerson');
			}
		}
	}
}

//stop the current player movement animation
function stopMove() {
	inTransit = false;
	player.selector.stop(true).css({
		'background-position': -640
	});
	$scrollElement.stop(true);
	player.x = prevMoveX;
	player.y = prevMoveY;
	player.selector.css({
		top: prevMoveY,
		left: prevMoveX
	});
	showMessage({el: player.otherSelector, messages: ['Ouch!']});
}

//gets the blog feed and shows on screen
function getFeed() {
	$('#blog').rssfeed('http://communityplanit.engagementgamelab.org/?feed=rss2', {
		limit: 1,
		header: false,
		dateformat: 'date',
		snippet: false,
		// media: false,
		errormsg: 'check out our blog at this website!'
	}, function() {
		$('iframe').remove();
		//remove the last paragraph tag (super hack!)
		$('#blog p').first().remove();
		$('#blog p').last().remove();
		$('#blog p').last().remove();
		$('#blog p').last().remove();

		$('#blog h4 a').attr('target', '_blank');
		var s = $('#blog p').text(),
			link = $('#blog h4 a').attr('href');
		var sub = s.substring(0,144) + '... <a target="_blank" href="' + link + '">[view post]</a>';
		$('#blog p').html(sub);
		$('#blog').append('<p style="text-align:center;"><button style="width: 90%;" id="hideBlog" class="btn btn-mini btn-warning" type="button">hide</button><p>')
		$('#blog').fadeIn();
		$('#hideBlog').on('click', function() {
			$('#blog').fadeOut();
		});
	});
}

//simple timer to make sure we don't move when click item
function preventMove() {
	clearTimeout(preventMovementTimeout);
	preventMovement = true;
	preventMovementTimeout = setTimeout(function() {
		preventMovement = false;
	}, 17);
}

function tick() {
	if(ready) {
		currentFrame++;
		if(currentFrame >= numFrames) {
			currentFrame = 0;
		}
		if(currentFrame % 8 === 0) {
			updateItemAnimations();	
		}
		requestAnimationFrame(tick);
	}
}

function updateItemAnimations() {
	for(var a = 0; a < animatedItemList.length; a++) {
		var item = items[animatedItemList[a]];
		item.curFrame++;
		if(item.curFrame >= item.frames) {
			item.curFrame = 0;
		}
		var position = -item.curFrame * item.w;
		// console.log(position);
		item.selector.css('background-position', position);
	}
}

function dev() {
	devMode = !devMode;
	if(devMode) {
		$('.item').addClass('hitBound');
		$('.item, #player').addClass('bottomBound');
		$('#player').css('background-color', 'rgba(0,255,0,0.5)');		
	} else {
		$('.item').removeClass('hitBound');
		$('.item, #player').removeClass('bottomBound');
		$('.dirtyBound').remove();
		$('#player').css('background-color', 'rgba(0,0,0,0)');
	}
}