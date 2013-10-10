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
					<p>You are in the lab. Click to explore.</p>
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
						<p><img src='img/soundcloud/white_text.png'></p>
					</div>
					<div class='gameInstructions'>
						<p>Welcome to the Engagement Game Lib!</p>
						<p>To create your own lib, you must talk everybody in the lab.  However, order matters.  Each person will have a challenge to complete before you fill out the lib.  They will also have a clue for who to go see next.</p>
						<p style='text-align:center; padding:10px;'><a href='#' class='beginGame'>Begin Game</a></p>
					</div>
				</div>
				<div id='challengeBox'>
				</div>
				<div id='pregame'>
					<div class='leftHalf'>
						<p class='introText'>
							We are an applied research lab that designs and studies playful approaches to serious problems. Our <a href='#'>PROJECTS</a> span from urban planning in Detroit to disaster preparedness in Zambia. Our <a href='#'>RESEARCH</a> is heavily integrated with all our projects and ranges from issues of global/networked citizenship to youth and civic media. Check out our <a href='#'>RESOURCES</a> page for design guides, curriculums, and courses, and learn more <a href='#'>ABOUT US</a> (in a standard fashion). 
							<br><br>
							<!-- MAKE UPDATES HERE -->
							<span>
								In the news: New York Times writes scathing review of the Engagement Game Lab. <a href='/blog'>[read it]</a>
							</span>
						</p>
					</div>
					<div class='rightHalf'>
						<p class='introText'>
							Curious about engagement games? Interested in learning more about who we are and how we do what we do? Unsure of what clicking the word below does? Ride the lightning:
						</p>
						<p class='playBig'><a href='' class='playGameButton'>PLAY<em>!</em></a></p>
						<p class='loading'>loading...</p>
					</div>
				</div>
				<div id='cover'></div>
			</div>
			<div id='blogTease'></div>
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
					.script('js/game/whiteboard.js')
					.script('js/game/tv.js')
					.script('js/game/wiki.js')
					.script('js/game/player.js').wait(function() {
						$game.beginGame();
					});
				}
			});
    	</script>
  </body>
</html>
