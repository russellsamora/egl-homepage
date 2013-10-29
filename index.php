<!--
          .         .              
          |         |              
,-. ,-. ,-| ,-. ;-. |-. ,-. ;-. ,-:
|   | | | | |-' | | | | |-' |   | |
`-' `-' `-' `-' ' ' `-' `-' '   `-|
                                `-'
-->
<!DOCTYPE html>
<html lang='en'>
	<head>
		<?php include 'head.php' ?>
		<link href='css/custom-game.css' rel='stylesheet'>
	</head>
	<body>
		<div id='wrap'>
  			<?php include 'nav.php' ?>
			<div id='game'>
				<div id='message'>
					<p class='messageText'></p>
				</div>
				<div id='help'>
					<p>CLICK TO EXPLORE</p>
				</div>
				<div id='popupBox'>
					<div class='bio'>
						<img class='bioImage'>
						<p class='bioName'>NAME: <span></span></p>
						<p class='bioTitle'>TITLE: <span></span></p>
						<p class='bioAbout'>ABOUT: <span></span></p>
					</div>
					<div class='wiki'><p></p></div>
					<div class='soundcloud'>
						<p class='songTitle'></p>
						<p class='user'></p>
						<p><img src='img/soundcloud/black_text.png'></p>
					</div>
					<div class='gameInstructions'>
						<h3>Welcome to the Engagement Game Lib!</h3>
						<p>Game Mode Activated! Like the dramatic lighting? You can <b>EXIT</b> Game Mode at any time by coming back to me. To begin your journey, search the lab for the staff member with <b>THE MOST COFFEE</b>. Good luck!</p>
						<p style='text-align:center; padding:10px;'><a href='#' class='beginGame'>Begin Game</a></p>
					</div>
				</div>
				<div id='challengeBox'>
				</div>
				<div id='codegame'>
				</div>
				<div id='inventoryButton'>
					<p><i class='icon-briefcase'></i></p>
				</div>
				<div id='inventory'>
					<h3>INVENTORY</h3>
					<p>
						<span>Trophies:</span>
						<span class='award'></span>
					</p>
					<p>
						<span>Dongles:</span>
						<span class='dongle'></span>
					</p>
					<p>
						<span>Arbitrary Badges:</span>
						<span class='shield'></span>
					</p>
					<p>
						<span>Bitcoins:</span>
						<span class='bitcoin'></span>
					</p>
					<p>
						<img class='grayscale ericInventory' src='img/people/inventory/eric.jpg'>
						<img class='grayscale samInventory' src='img/people/inventory/sam.jpg'>
						<img class='grayscale jeddInventory' src='img/people/inventory/jedd.jpg'>
						<img class='grayscale jesseInventory' src='img/people/inventory/jesse.jpg'>
						<img class='grayscale stephenInventory' src='img/people/inventory/stephen.jpg'>
						<img class='grayscale russellInventory' src='img/people/inventory/russell.jpg'>
						<img class='grayscale aidanInventory' src='img/people/inventory/aidan.jpg'>
						<img class='grayscale christinaInventory' src='img/people/inventory/christina.jpg'>
					</p>
				</div>
				<div class='promptCode'>
					<p>What is the code?</p>
					<p><input></p>
					<p class='unlockButton'>
						UNLOCK
					</p>
					<p class='closeButton'>
						CLOSE
					</p>
				</div>
				<div class='denied'>
					<p>ACCESS DENIED</p>
				</div>
				<div class='otherLibs'>
				</div>
				<div id='pregame'>
					<div class='leftHalf'>
						<p class='introText'>
							We are an applied research lab at <a class='emerson' href='http://emerson.edu' target='_blank'>Emerson College</a> that designs and studies playful approaches to serious problems. Our <a href='/projects'>PROJECTS</a> span from community engagement in Detroit to disaster preparedness in Zambia. Our <a href='/research'>RESEARCH</a> frames all our projects and ranges from issues of global/networked citizenship to youth and civic media. Check out our <a href='/resources'>RESOURCES</a> page for design guides, curricula, and courses, or learn some more <a href='/about'>ABOUT US</a>.
							<br><br>
							<!-- MAKE UPDATES HERE -->
							<span>
								<b>FROM THE BLOG: </b>Why We Engage: How Theories of Human Behavior Contribute to Our Understanding of Civic Engagement in a Digital Era<a href='/blog'> [read it]</a>
							</span>
						</p>
					</div>
					<div class='rightHalf'>
						<p class='introText'>
							Curious about engagement games? Interested in learning more about who we are and how we do what we do? Unsure of what clicking the word below does? For the most extraordinary answers to these questions, there is only one path forward:
						</p>
						<p class='playBig'><a href='' class='playGameButton'>PLAY<em>!</em></a></p>
						<p class='loading'>loading...</p>
					</div>
				</div>
				<div id='cover'></div>
			</div>
			<div id='helpArrows'>
				<p class='rightArrow'><i class='icon-chevron-right'></i></p>
				<p class='downArrow'><i class='icon-chevron-down'></i></p>
			</div>
			<div id='nongame'>
				<div class='row-fluid'>
					<div class='span4 projectsLink'>
						<p><a href='projects/'>PROJECTS</a></p>
					</div>
				</div>
				<div class='row-fluid'>
					<div class='span4 researchLink'>
						<p><a href='research/'>RESEARCH</a></p>
					</div>
				</div>
				<div class='row-fluid'>
					<div class='span4 aboutLink'>
						<p><a href='about/'>ABOUT</a></p>
					</div>
				</div>
				<div class='row-fluid'>
					<div class='span4 blogLink'>
						<p><a href='resources/'>RESOURCES</a></p>
					</div>
				</div>
				<div class='row-fluid'>
					<div class='span12'>
						<p>
							Visit this site on a desktop or tablet to enter and explore the lab, play our game, and learn more about what we do.
						</p>
					</div>
				</div>
			</div>
			<div id='nongameH'>
				<div class='container'>
					<div class='row'>
						<div class='span12'>
							<p>
								<span>Welcome to the Engagement Game Lab</span>, an applied research lab for play and civic engagement.  Make your browser taller to enter and explore the lab, play our game, and learn more about what we do.
							</p>
							<p style='text-align:center;'><img src='img/nongame.jpg'></p>
						</div>
					</div>
				</div>
			</div>
   		</div>
    	<!-- Los javascripts -->
    	<script src='js/libs/lab.js'></script>
    	<script>
    		$LAB
			.script('js/libs/jquery.min.js')
			.script('js/libs/bootstrap.min.js')
			.script('js/libs/modernizr.js')
			.script('js/libs/plugins.js').wait()
			.script('js/game/main.js').wait(function() {
				var gotGame = $game.init();
				if(gotGame) {
					$LAB
					.script('js/game/input.js')
					.script('js/game/audio.js')
					.script('js/game/items.js')
					.script('js/game/people.js')
					.script('js/game/whiteboard.js')
					.script('js/game/tv.js')
					.script('js/game/wiki.js')
					.script('js/game/codegame.js')
					.script('js/game/player.js').wait(function() {
						$game.beginGame();
					});
				}
			});
    	</script>
  </body>
</html>
