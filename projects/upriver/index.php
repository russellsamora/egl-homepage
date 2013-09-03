<!DOCTYPE html>
<html lang='en'>
	<head>
		<?php include '../../head.php' ?>
	</head>
	<body>
		<div id='wrap' class='specialBackground'>
			<?php include '../../nav.php' ?>
			<div class='whatIsIt'>
				<div class='projectLogo'>
					<p><a href='http://civicseed.org' target='_blank'><img src='../../img/projects/logos/cs.jpg'></a>
					</p>
				</div>
				<p class='projectTagline'>
					What comes Up must flow Down
				</p>
			</div>
			<div class='container'>
				<div class='row briefOverview'>
					<div class='span6'>
							<p>
								<span>UpRiver</span> is a game that enables flood prediction and communication for people living on and near high-risk zones of flood-prone rivers. Players use SMS-enabled cell phones to report, predict, and gather information about the current and future water level of the river, local to them.
							</p>
					</div>
					<div class='span6 videoContainer'>
						<!-- <iframe src="//www.youtube.com/embed/jA5sz-ymv6k" frameborder="0" allowfullscreen></iframe> -->
						<!-- <iframe src="http://player.vimeo.com/video/55893197?title=0&amp;byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen="" allowfullscreen=""></iframe> -->
					</div>
				</div>
				<div class='realProblem'>
					<div class='row'>
						<div class='span12'>
							<h2>
								Context
							</h2>
						</div>
						<div class='span12'>
							<p>	
								<!-- <span class='contextTagline'>Better Access, Broader Input, More Discussion and Deliberation</span><br> -->

								<!-- <img src='http://placehold.it/160x160.png' style='float:left; padding: 10px;'> -->
								Every year, people die in completely predictable floods. A rainstorm in the mountains overflows the banks of the Zambezi river, and water flows downstream, hitting each population in order from the source of the flood to the sea, where the river empties. 

								Lives and property are lost, and millions of dollars in humanitarian aid is spent to alleviate these crisis because:

								No universal early warning system is currently in place
								Those in and around affected areas do not or cannot effectively share information
								Many who live in high-risk areas do not even realize that floods can be prevented



							</p>
						</div>
					</div>
				</div>
				<div class='theGame'>
					<div class='row'>
						<div class='span12'>
							<h2>The Game</h2>
							<p>
								<span>The Goal:</span>

									UpRiver challenges players to predict what the water level in their area will be at a future date. At the end of a play period, the player who has earned the most in-game currency wins real world rewards such as free text messages or cell phone minutes.

									<span>The Equipment:</span>
									UpRiver is played via text message, so any SMS-enabled cell phone can be used.

									<span>How To Play:</span>

									First, players earn game currency by reporting the water level, weather, and other real-time information about their local area. They can earn more by placing bets about future conditions. The farther out their predictions, and more accurate their guesses, the larger the reward.

									To help make more accurate guesses, players may also purchase information about what players upstream from them are reporting, or buy access to a computer model. In the end, the player who is best able to leverage this information into accurate predictions will win the day.

							</p>
						</div>
					</div>
				</div>
				<div class='realActions extraPadding'>
					<div class='row'>
						<div class='span12'>
							<h2>The Real-World Action/Results</h2>
							<p>
								Each game action results in a specific real-world outcome.

								Reporting the river level and other local conditions helps make the computer model more accurate
								Making bets on future conditions teaches the principle of prediction to people unfamiliar with the concept
								Players learn to trust computer prediction models
								Gifting cell phone minutes to players makes it easy for people to communicate
								Gives people at different points along the river reason to communicate, and turns information sharing into a habit
							</p>
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
