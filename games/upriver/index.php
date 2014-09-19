<!DOCTYPE html>
<html lang='en'>
	<head>
		<?php include '../../head.php' ?>
	</head>
	<body>
		<div id='wrap'>
			<?php include '../../nav.php' ?>
			<div class='whatIsIt'>
				<div class='container'>
					<div class='row'>
						<div class='span4'>
							<div class='projectLogo'>
								<img src='../../img/projects/logos/upriver.png'>
							</div>
						</div>
						<div class='span8 projectDescription'>
							<p>
								<span>UpRiver</span> is a multi-phase game (physical and digital) that enables communication and flood prediction for people living in high-risk areas along major rivers. The physical game teaches the principles of flood prediction. The digital game lets players use SMS-enabled cell phones to report, predict, and gather information about the current and future water level of the river, local to them.
							</p>
						</div>
					</div>
					<div class='row'>
						<div class='span6 projectContext'>
							<h2 class='funTitle'>
								Context
							</h2>
							<p>	
								Every year, people die in completely predictable floods. A rainstorm in the mountains overflows the banks of the Zambezi river, and water flows downstream, hitting each population in order from the source of the flood to the sea, where the river empties.
							</p>
							<p>
								Lives and property are lost, and millions of dollars in humanitarian aid is spent to alleviate these crisis because:
							</p>
							<ul>
								<li>No universal early warning system is currently in place</li>
								<li>Those in and around affected areas do not or cannot effectively share information</li>
								<li>Many who live in high-risk areas do not even realize that floods can be predicted</li>
							</ul>
							<p>
								UpRiver was designed in cooperation with the Red Cross /  Red Crescent Climate Centre and the Zambian Red  Cross, which works directly with people affected by floods to communicate these important ideas and save lives.
							</p>
						</div>
						<div class='span6 videoContainer'>
							<img src='../../img/projects/other/upriver1.jpg'>
						</div>
					</div>
				</div>
			</div>
			<div class='container projectPage'>
				<div class='theGame'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>The Game</h2>
							<p>
								<img class='inlineImage' src='../../img/projects/other/upriver3.png'>
								<span>The Goal:</span>
								UpRiver challenges players to predict what the water level in their area will be at a future date. At the end of a play period, the player who has earned the most in-game currency wins real world rewards such as free text messages or cell phone minutes.
							</p>
							<p>
								<span>The Equipment:</span>
								In the physical phase, players simulate water levels along the river with cups filled with different amounts of water. Water is added or subtracted from the cups with sponges, and players are asked to predict the final level.
								<br>
								<br>
								In the digital phase, UpRiver is played via text message, so any SMS-enabled cell phone can be used.
							</p>
							<p>
								<span>How To Play:</span>
								First, players earn game currency by reporting the water level, weather, and other real-time information about their local area. They can earn more by placing bets about future conditions. The farther out their predictions, and more accurate their guesses, the larger the reward.
								
								<br><br>
								<img class='inlineImageRightBig' src='../../img/projects/other/upriver2.jpg'>
								To help make more accurate guesses, players may also purchase information about what players upstream from them are reporting, or buy access to a computer model. In the end, the player who is best able to leverage this information into accurate predictions will win the day.

							</p>
						</div>
					</div>
				</div>
				<div class='realActions extraPadding'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>The Real-World Action/Results</h2>
							<p>
								In both phases of the game, players learn principles of flood prediction and computer modelling. In the digital phase, each game action also results in a specific real-world outcome.
							</p>
							<ul>
								<li>Reporting the river level and other local conditions helps make the computer model more accurate</li>
								<li>Making bets on future, non-abstract conditions teaches the principle of prediction to people unfamiliar with the concept</li>
								<li>Gifting cell phone minutes to players makes it easier for people to communicate</li>
								<li>Real world rewards give people at different points along the river reason to communicate, and makes a habit of sharing important information</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div id='push'></div>
   		</div>
		<?php include '../../footer.php' ?>

    	<!- Los javascripts ->
    	<script src='/js/libs/lab.js'></script>
    	<script>
    		$LAB
    		.script('/js/libs/jquery.min.js').wait()
			.script('/js/libs/bootstrap.min.js').wait()
			.script('/js/libs/fitvids.js').wait()
			.script('/js/other/vimeo.js');
    	</script>
  </body>
</html>
