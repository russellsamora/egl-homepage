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
								<img src='../../img/projects/logos/rh.png'>
							</div>
						</div>
						<div class='span8 projectDescription'>
							<p>
								<span><a target='_blank' href='http://riskhorizon.org'>Risk Horizon</a></span> is a real-time strategy game designed in partnership with the World Bank as part of a Massive Open Online Course (MOOC). Players use the risk management tools of knowledge, protection, and insurance to guide the development of an alien world to meet goals and survive increasingly powerful comet strikes.
							</p>
						</div>
					</div>
					<div class='row'>
						<div class='span6 projectContext'>
							<h2 class='funTitle'>
								Context
							</h2>
							<p>	
								One of the resources offered by the World Bank is a series of free MOOCs designed to foster the skills needed for healthy development all over the world. The game was designed as a component of a MOOC that took place over the summer of 2014. The content of the MOOC was based on the World Bank&#39;s Risk Management Development Report.  	
							</p>
							<p>
								The global preconception of Risk Management is that it is a cost that is not always affordable, especially in developing countries. The World Bank&#39;s Report on Risk Management and the learning module built around it reframes risk management as a tool for healthy development.
							</p>
							<p>
								Risk Horizon was played  during the MOOC&#39;s second week, which covered the most important tenets of risk management. The game&#39;s design goals were to reinforce these concepts and let users understand them in an experiential way while remaining accessible to a wide audience with a variety of learning styles. Players responded to questions about the game with qualitative essay-style answers, and were required to play at least three of the game&#39;s six levels to receive full credit for the MOOC.
							</p>
						</div>
							<div class='span6 videoContainer'>
								<img class='inlineImageRightBig' src='../../img/projects/other/riskhorizonlarge.png'>
							</div>
					</div>
				</div>
			</div>
			<div class='container projectPage'>
				<div class='theGame'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'><a href=http://www.riskhorizon.org>The Game</a></h2>
							<p>
									
								<!-- <img class='inlineImageRightSmall' src='../../img/projects/other/civic_seed_statue.png'> -->
								<img class='inlineImageRightBig' src='../../img/projects/other/research.png'>
								In Risk Horizon, players take on the role of the Luminator, the individual responsible for developing new communities on the alien world of Alora. The player must build and upgrade &ldquo;pods&rdquo; in order to speed up development and meet pre-set goals. However, the planet is frequently pelted by comets, which flood the community and damage the pods. Damaged pods do not produce development, so they must be prepared. This slows development and drains away resources that could be used elsewhere.
							</p>
							<p>
								In order to manage these risks, players must use a variety of tools. Knowledge allows them to examine comets to learn more about the risks they pose, and gain extra time to prepare. Protection raises their city up out of harm&#39;s way. Insurance decreases the time and cost of replacing lost development after a strike. Only by balancing these tactics with development are players are able to meet all their goals and complete all six levels.
							</P>
						</div>
					</div>
				</div>
				<div class='realActions extraPadding'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>The Real-World Action/Results</h2>
							<p>
								More than 8,600 people played Risk Horizon as part of the course. Players were in nearly every country in the world, across six continents. The World Bank and Engagement Lab are currently conducting research on the effectiveness of using games like Risk Horizon in learning contexts, as well as on the impact of play in future behavior.								
							</p>
							<p>
								<strong>The game will remain online and playable for free at <a href= http://www.riskhorizon.org>riskhorizon.org</a> as part of the project&#39;s scope.</strong>
							</P>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id='push'></div>
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
