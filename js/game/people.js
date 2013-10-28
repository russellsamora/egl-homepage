(function(){

	var _hitList,
		_prevMove = {},
		_animatedItemKeys = [],
		_animatedPeopleKeys = [],
		_pfx = ["webkit", "moz", "MS", "o", ""],
		_challengeSlide = 0;

	var people = $game.people = {
		peopleKeys: null,
		peopleData: null,
		showingBio : false,
		ready: false,

		init: function() {
			_loadData();
			people.peopleKeys = Object.keys(people.peopleData);
			_setupPeople(0);
		},

		setZIndex: function(input) {
			var minX = Math.min(input.x,$game.player.x),
				minY = Math.min(input.y,$game.player.y),
				playerBottom = $game.player.y + $game.player.h;

			//reset hit list to empty and build it up, these are the items we will check for collision during walk
			_hitList = [];
			//items

			//people
			for(var j = 0; j < people.peopleKeys.length; j++) {
				var person = people.peopleData[people.peopleKeys[j]];
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
							other.selector.toggleClass('fgPerson');
							//HACK
							//TODO fix this
							// if(other.bind) {
							// 	items.itemData[other.bind].selector.toggleClass('fgItem');
							// 	//must find bound and set flipped so it doesn't flop HA
							// 	for(var h = 0; h < _hitList.length; h++) {
							// 		if(other.bind === _hitList[h].bindName) {
							// 			_hitList[h].flipped = true;
							// 		}
							// 	}
							// }
							//}
						}
					}
				}
				//store the last step so we can place player there for no conflicts on next move
				_prevMove.x = tempX;
				_prevMove.y = tempY;

				requestAnimationFrame(people.hitTest);
			}
		},

		clickedPerson: function(key, el) {
			var person = people.peopleData[key],
				game = person.game;
			//see if in game mode
			var msg, target;
			if($game.localStore.playing) {
				//current target && not visited
				//current target && visited
				//future target
				//past target
				if($game.localStore.over) {
					msg = person.game.over;
				} else if($game.localStore.targetPerson === key) {
					//determine if player has talked to them yet
					if($game.localStore.people[key]) {
						msg = game.clue;
					} else {
						//check if they did mini challenge (task)
						if($game.localStore.tasks[key]) {
							msg = game.present;
							target = true;
						} else {
							//special case....
							if($game.audio.isPlaying && $game.localStore.targetPerson === 'eric') {
								msg = 'Not a fan of this song, how about you change it up first then come see me?';
							} else {
								msg = game.task;	
							}
							
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
			var person = people.peopleData[key];
			$('#popupBox .bioImage').attr('src', '../../img/people/bio/real_' + key + '.jpg');
			$('#popupBox .bioName span').text(person.fullName);
			$('#popupBox .bioTitle span').text(person.jobTitle);
			$('#popupBox .bioAbout span').html(person.about);

			$game.hidePopup();
			$('#popupBox .bio').show();
			$('#popupBox').show();
			setTimeout(function() {
				people.showingBio = true;
			}, 17);
		},

		checkScreen: function() {
			//get current window position
			var left = pageXOffset,
				top = pageYOffset;

			//compare people
			for (var personName in people.peopleData) {
				var person = people.peopleData[personName];
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

		updateAnimations: function() {
			for(var b = 0; b < _animatedPeopleKeys.length; b++) {
				var person = people.peopleData[_animatedPeopleKeys[b]];
				_animatePerson(person);
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
				var person = people.peopleData[$game.localStore.targetPerson];
				var answer = [];
				if(person.game.questionType === 'choice') {
					answer.push($('input[name=challenge]:checked').val());
				} else if (person.game.questionType === 'multiple') {
					var inputs = $('.challengeAnswer');
					inputs.each(function(i) {
						var val = $(this).val().trim();
						if(val.charAt(val.length - 1) === '.') {
							val = val.substr(0, val.length - 1);
						} 
						answer.push(val);
					});
				} else {
					var val = $('.challengeAnswer').val().trim();
					if(val.charAt(val.length - 1) === '.') {
						val = val.substr(0, val.length - 1);
					}
					answer.push(val);
				}
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
					setTimeout(function() {
						$game.input.preventMoveForever();
					}, 100);
					_promptName();
				}
			}
		}

	};
	people.init();

	//private functions
	function _setupPeople(index) {
		var key = people.peopleKeys[index],
			info = people.peopleData[key],
			person = document.createElement('div'),
			img = new Image();

		img.onload = function() {
			//set the background image and append
			person.setAttribute('id', key);
			person.setAttribute('class', 'person');
			person.setAttribute('data-key', key);
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
			$(person).css({
				position: 'absolute',
				top: info.y,
				left: info.x,
				width: divWidth,
				height: img.height,
				backgroundImage: 'url(' + img.src + ')'
			});
			$GAMEBOARD.append(person);
			info.selector = $('#' + key);
			info.w = divWidth;
			info.h = img.height;
			info.bottom = info.y + info.h;
			index++;
			if(index < people.peopleKeys.length) {
				_setupPeople(index);
			} else {
				//async load bio cards (not critical) 
				_preloadBioCards(0);
				_loadPeopleInfo();
			}
		}
		img.src = '../../img/people/' + key + '.png';
	}

	function _preloadBioCards(index) {		
		var img = new Image();
		img.onload = function() {
			index++;
			if(index < people.peopleKeys.length) {
				_preloadBioCards(index);
			}
		}
		var person = people.peopleKeys[index];

		img.src = '../../img/people/bio/real_' + person + '.jpg';
	}

	function _loadData() {
		people.peopleData = {
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
						count: {dongle: 3},
					},
					clue: 'To get to the next stage in the game, you\'ll need to talk to our fearless leader. Good luck!',
					chatClue: 'Have you found our fearless leader yet? He\'s right over there!',
					information: '<p>All engagement games begin with a real-world problem, because the purpose of an engagement game is to enable real-world change. For example, we saw barriers to entry and discussion in local planning, so we decided to make <a href="/projects/community-planit" target="_blank">Community PlanIt</a> to help break those barriers down. Games can be used to solve huge problems that affect millions of people, or bite-sized problems that affect small, local communities.</p>',
					question: 'What real world problem will your engagement game help solve? Use this space to describe a real world issue in 25 words or less.',
					lead: [''],
					questionType: 'open',
					maxLength: 125,
					over: 'That was fun. Now I need a refill.'
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
					task: 'You\'ve found me, the fearless leader of the Lab.  Ready to rock and roll? So am I, but first, put on some tunes, and then I\'ll help you.',
					present: 'Awesome song! You are now ready.',
					future: 'Later...',
					reward: {
						text: 'I like it! You\'ve earned an award!',
						count: {award: 1}
					},
					clue: 'To find your next guide, you\'ll have to take a seat.',
					chatClue: 'Still looking for her? I thought my clue was easy enough. Have a seat, get it?',
					information: '<p>The difference between engagement games and other "learning" or "serious" games is action. An engagement game doesn\'t just teach about a topic or encourage later action - the very act of playing the game <b>is</b> real-world action. </p><p>For instance, in <a href="/projects/upriver/" target="_blank">UpRiver</a>, the game requires players to make real predictions about river levels near them and accurately measure those levels. This arms them with real-life information that could save them from floods!</p>',
					question: 'What real-world action will your game facilitate?',
					lead: ['My game will get people to'],
					questionType: 'open',
					maxLength: 65,
					over: 'Bored? You could always talk to Rob and learn some more facts.'
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
						count: {shield: 6}
					},
					clue: 'Wow, you\'ve earned the Badge-Collector Badge! Great job. For the next stage in the game, you\'ll need to get technical.',
					chatClue: 'Found that tech-savvy EGLer yet? His face was just on the TV.',
					information: '<p>You know what real-world actions you\'d like to enable with your game, so you probably have some idea of who you want to play the game. Let\'s think a little more about that. When we designed <a href="/projects/community-planit" target="_blank">Community PlanIt</a>, we wanted it to be playable by stakeholders in the community. This includes people who live, work, and hang out in the community, decision makers, school officials, students, senior citizens... everyone in a given community. Other games are narrower, like <a href="/projects/civic-seed" target="_blank">Civic Seed</a>, which was designed only for students learning about Civic Engagement.</p>',
					question: 'Who is the target audience of your game?',
					lead: ['My game will be played by'],
					questionType: 'open',
					maxLength: 40,
					over: 'Check out communityplanit.org'
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
					past: 'Your game\'s coming along great. You\'re almost done!',
					task: 'Hey, robo-dude. I think you\'re ready to start building your game, but I\'m too busy to help you. Take care of this bit of coding for me, and I\'ll help you.',
					present: 'Sweet. Let\'s get crackin.',
					future: 'Can\'t talk. Coding.',
					reward: {
						text: 'That sounds good to me! Here\'s some stuff!',
						count: {award: 3, bitcoin: 7}
					},
					clue: 'Next, you need to take your idea and play around with it a little. Who could help you do that?',
					chatClue: 'What are you waiting for? It\'s your move.',
					information: '<p>When we design games, we think about how people will actually play them, and what the best medium might be to reach the audience we\'ve invisioned for the game. Many of our games are web-based, like <a href="/projects/civic-seed/" target="_blank">Civic Seed</a>, so players can colaborate online in a shared virtual environment. Others, like the first phase of <a href="/projects/upriver/" target="_blank">UpRiver</a>, are low-tech, played with physical pieces, so people can play them even without electricity.</p>',
					question: 'What medium will your game be created in? Pick one:',
					answers: ['a web game built in HTML5', 'a mobile app for smart phones', 'a physical game played live in a real space', 'an SMS (text messaging) game', 'a social media game played through existing platforms', 'an alternate reality game'],
					lead: ['The issue is '],
					questionType: 'choice',
					maxLength: 40,
					over: 'How many dongles did you earn?'
				}
			},
			'sam': {
				x: 2260,
				y: 120,
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
					past: 'I\'ve redesigned this game. Now it\'s gin rummy, but with flame-throwers.',
					task: 'Before we get started, I want you to gain some knowledge by learning a random fact from someone who seems to be holding a lot of it.',
					present: 'You learned a most-excellent fact. It looks like you\'ve got a solid framwork around your game. You know who will play it, and what real-world action you\'re trying to enable, and you also know what format the game will be created in. Now it\'s time to figure out the narrative of your game.',
					future: 'This game combines Sorry, Monopoly, Candy Land, and Trivial Persuit. It is the worst game ever. Come back later.',
					reward: {
						text: 'Awesome! You earned the Write Stuff award! Also, take a dongle.',
						count: {dongle: 1, award: 1}
					},
					clue: 'For your next task, you must find... your creator.',
					chatClue: 'Haven\'t found your creator yet? Maybe this game\'s not drawing you in.',
					information: '<p>Narrative can be a powerful driver for player engagement. In <a href="/projects/civic-seed" target="_blank">Civic Seed</a>, we created a fantasy world where players control avatars and interact with strange people and palces. Compare that to <a href="/projects/community-planit" target="_blank">Community PlanIt</a>, where players play as themeselves, and move through challenges by answering questions about real-world issues. What approach you use is a big part of your design, but largely a matter tone.</p>',
					question: 'What will the narrative of your game be?',
					lead: ['In my engagement game, players play as','trying to','by'],
					questionType: 'multiple',
					maxLength: 40,
					over: 'What\'s your favorite game? Mine\'s Carcassonne.'
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
					past: 'I\'m drawing... can you come back a little later?',
					task: 'Hey! Let\'s get to work on the look of your game... first thing\'s first, go draw me something nice on the whiteboard, then come back.',
					present: 'I like it. It\'s very... distinctive. Now let\'s play with your look.',
					future: 'I\'m drawing... can you come back a little later?',
					reward: {
						text: 'A sound choice. You\'ve got the Amateur Artist Award.',
						count: {award: 1}
					},
					clue: 'For the next stage, seek out the Great Tall One.',
					chatClue: 'I love dinosaurs, don\'t you? Maybe I\'ll draw one.',
					information: '<p>The look of a game has a huge impact on how people experience it. It\'s important that your aesthetic choices support the tone you\'re going for, while enabling fun. Take a look at the lab space on your screen now. Everything you see was a stylistic choice made to express the mood of the lab, create a playful atmosphere, make people excited to explore. Of course, this is a 2-D envirnoment, but it feels 3-D thanks to my visuals.</p>',
					question: 'How will your game look? Choose one.',
					lead: ['none'],
					questionType: 'choice',
					answers: ['3D interactive environment', '2D environment', 'Stylized text with a few drawings', 'A clean utilitarian interface', 'No visuals some games don\'t require them!)'],
					hiddenValues: ['3D','2D','textually-driven','sleek and spare','omit'],
					maxLength: 40,
					over: 'Make more drawings! Can you guess which ones are mine?'
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
					past: 'Hang on, I\'m on a call. Can you come back later?',
					task: 'Hey, I need your help. There\'s a book on the book shelf that I need. It\'s called "We\'re Watching You: A History of the NSA." They\'re listening to my call right now! If you go grab it for me, I\'ll help you with your game.',
					present: 'Aw, thanks! That\'s really, really just the best. Thanks so much. ',
					future: 'Hang on, I\'m on a call. Can you come back later?',
					reward: {
						text: 'Super. Here, take a bunch of stuff!',
						count: {shield: 4, bitcoin: 3, award: 2, dongle: 1}
					},
					clue: 'There\'s just one more person left to talk to. Can you find her?',
					chatClue: 'There\'s just one more person left to talk to. Can you find her?',
					information: '<p>Our engagement games are developed in cooperation with community partners. By working with organizations who have a need and are experts on their communities, we can create games that come from a place of trust and knowledge. For example, when we create a game on our Community PlanIt [NEW WINDOW] platform, we partner with local planning departments, non-profit organizations, schools, and local governments.</p>',
					question: 'Who will you partner with to make your game a success?',
					lead: ['I\'ll partner with'],
					questionType: 'open',
					maxLength: 40,
					over: 'Ever thought about using games in school? Check out our resources section!'
				}
			},
			'jesse': {
				x: 1000,
				y: 650,
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
				game: {
					past: 'na',
					task: 'Listen. I don\'t want to help you, but I will. But on one condition. This place has gotten super-lame boring lately. If you can activate the Lab\'s Disco Mode, I\'ll help ya out.',
					present: 'Dude! That\'s sweeter than my Mystify Your Mind screensaver. Let\'s jam.',
					future: 'NNyyyaaa... that is INCORRECT!',
					reward: {
						text: 'What the what? Your game is complete! You\'ve earned 16 dongles, and the right to view your final product? Ready to see it?',
						count: {dongle: 16}
					},
					clue: 'na',
					chatClue: 'na',
					information: '<p>At the end of the day, engagement games are about affecting real change. The only way to know if we\'ve met these goals is through evaluation. We evaluate our games through sound research methods. These include focus groups, interviews, metrics, studies, and research projects. You can learn more about these initiatives on the <a href="/research" target="_blank">research</a> section of our website.</p>',
					question: 'How wil you evaluate your game to see if it worked? Select one.',
					lead: [''],
					answers: ['I\'ll use in-game analytics', 'I\'ll conduct a survey', 'I\'ll conduct an experiment with different variables', 'I\'ll talk to actual human beings'],
					hiddenValues: ['robust in-game analytics.' , 'a set of surveys.' , 'an experiment with different variables.' , 'interviews with real humans who played the game.'],
					questionType: 'choice',
					maxLength: 40,
					over: 'Oh dinosaur, you\'re the only one for me. Get lost, robot.'
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
					if(people.peopleData[row.name]) {
						people.peopleData[row.name].status = row.status;
					}
				});
				people.ready = true;
				console.log('people ready');
			},
			error: function() {
				console.log('having a bad day? Try backup data!');
				loadData(true);
			}
		});
	}

	function _animatePerson(person) {
		//console.log(person.paused, person.curFrame, person.animation.length);
		if(!person.paused && person.onScreen) {
			person.curFrame++;
			if(person.curFrame >= person.animation.length) {
				person.curFrame = 0;
				if(person.sleep) {
					person.sleep();
				}
			}
			var position = - person.animation[person.curFrame] * person.w + 'px 0';
			// console.log(position);
			person.selector.css('background-position', position);
		}
	}

	function _prefixedEvent(element, type, callback) {
		for (var p = 0; p < _pfx.length; p++) {
		if (!_pfx[p]) type = type.toLowerCase();
		element.addEventListener(_pfx[p]+type, callback, false);
		}
	}

	function _addChallengeContent() {
		$('#challengeBox').empty();
		var person = people.peopleData[$game.localStore.targetPerson],
			game = person.game,
			html;
		//if game over
		if($game.localStore.over) {
			//create Lib
			_createLib();
			html = '<p>Congrats! Here is your game lib:</p>';
			html += '<p>'+ $game.localStore.lib +'</p>';
			html += '<p><a href="#" class="nextSlide">Close</a></p>';
			$game.spawnReward(game.reward);
		} else if(_challengeSlide === 0) {
			//show info
			html = game.information;
			html += '<p><a href="#" class="nextSlide">Next</a></p>';
		} else if(_challengeSlide === 1) {
			//show question
			html = '<p><span class="h3like">Q: </span>' + game.question + '</p>';
			var i;
			if(person.game.questionType === 'choice') {
				html += '<p>';
				for (i = 0; i < person.game.answers.length; i++) {
					var val = person.game.answers[i];
					if(person.game.hiddenValues) {
						val = person.game.hiddenValues[i];
					}
					html += '<input type="radio" class="choice" name="challenge" value="' + val + '"><span class="labelText">' + person.game.answers[i] + '</span><br>' 
				}
				html += '</p>';
			} else if(person.game.questionType === 'multiple') {
				html += '<p>';
				for(i = 0; i < person.game.lead.length; i++) {
					html += game.lead[i] + ' <input class="multiple challengeAnswer" maxLength="' + game.maxLength +'"></input>';	
				}
				html += '</p>';
			} else {
				html += '<p>' + game.lead[0] + ' <input class="open challengeAnswer" maxLength="' + game.maxLength +'"></input></p>';	
			}
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
		var html = '<p>Enter your name and the name of your game to save it.</p><p><input placeholder="game name" id="libName" maxLength="20"></p><p><input placeholder="your name" id="authorName" maxLength="20"></p>';
		html += '<p>Enter your email to get updates on lab news and events:</p><p><input placeholder="email" id="emailName" maxLength="30"></p>';
		html += '<p><a href="#" class="saveLib">Submit</a></p>';
		$('#challengeBox').html(html).show();
		$BODY.on('click','.saveLib', function(e) {
			e.preventDefault();
			var authorName = $('#authorName').val();
			var libName = $('#libName').val();
			var emailName = $('#emailName').val();
			$game.localStore.libName = libName;
			$game.localStore.authorName = authorName;
			$game.localStore.emailName = emailName;
			$game.updateStorage();
			_saveLib();
			$('#challengeBox').hide();
			$game.input.enableMove();
			return false;
		});
	}

	function _saveLib() {
		var lib = $game.localStore.lib,
			libName = $game.localStore.libName,
			authorName = $game.localStore.authorName,
			emailName = $game.localStore.emailName;

		$.post('../../db/saveLib.php', {lib: lib, author: authorName, game: libName, email: emailName},
			function(res) {
				console.log(res);
				_showCode();
			}, 'text');
	}

	function _createLib() {
		$game.localStore.lib = '<p>' + $game.localStore.answers[0][0];
		$game.localStore.lib +=  '.  To help solve this problem, we\'ll use an engagement game designed to get players to ' + $game.localStore.answers[1][0] + '.</p>';
		$game.localStore.lib += '<p>This game will mostly target ' + $game.localStore.answers[2][0];
		
		$game.localStore.lib += '.  In order to reach that audience and create the best possible experience, the game is concieved of as ' + $game.localStore.answers[3][0];
		$game.localStore.lib += '.  The narrative of the game is relatively simple. Players play as ' + $game.localStore.answers[4][0] +' trying to ' + $game.localStore.answers[4][1] + ' by ' + $game.localStore.answers[4][2];
		$game.localStore.lib += '.  The game will utilize a ' + $game.localStore.answers[5][0] + ' aesthetic to set the proper tone and interface style';
		$game.localStore.lib += '.  To build trust in the community and give the game a platform, our partners will include ' + $game.localStore.answers[6][0];
		$game.localStore.lib += '.  Once the game is complete, we\'ll evaluate its impact through solid research, including ' + $game.localStore.answers[7][0] + '.</p>';
	}

	function _showCode() {
		$('#challengeBox').empty();
		var html = '<p>You can check out other players\' games at the bookshelf.  The code is: "pizza".</p>';
		$('#challengeBox').html(html).show().delay(2000).fadeOut();	
	}
})();