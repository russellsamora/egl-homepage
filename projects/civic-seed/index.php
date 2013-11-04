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
								<img src='../../img/projects/logos/cs.jpg'>
							</div>
						</div>
						<div class='span8 projectDescription'>
							<p>
								<span><a target='_blank' href='http://civicseed.org'>Civic Seed</a></span> is a multi-player RPG that harnesses the power of online social play to teach and certify students to civically engage with partner communities.
							</p>
						</div>
					</div>
					<div class='row'>
						<div class='span6 projectContext'>
							<h2 class='funTitle'>
								Context
							</h2>
							<p>	
								Many incoming university students are eager to get involved with their school's partner communities and create positive change. However, to most, the people and challenges of these communities are unknown, and under-trained volunteers can even do more harm than good.
							</p>
							<p>
								For local organizations, it's difficult to know which students have the necessary knowledge and skills to collaborate effectively and whose personal goals align with the goals of the organization and the community.
							</p>
						</div>
						<div class='span6 videoContainer'>
							<iframe src="//player.vimeo.com/video/64315985?title=0&amp;byline=0&amp;portrait=0&amp;color=ff9933" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
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
								The color has vanished! Can you help bring it back?
									
								<!-- <img class='inlineImageRightSmall' src='../../img/projects/other/civic_seed_statue.png'> -->
								<img class='inlineImageRightBig' src='../../img/projects/other/civic_seed1.jpg'>
								In Civic Seed, students get to explore a fantastical world, engage with the people who live there, and work together to solve a mystery and help bring the world back to life. 

								Reflective learning is mixed with puzzle-solving, social gaming, and collaborative art.

								Learning through play makes it easy to engage with, reflect upon, and apply new knowledge. Civic Seed lets students learn how to tackle issues systematically and internalize information through experience instead of just memorizing for a quiz.
							</p>
						</div>
					</div>
				</div>
				<div class='realActions extraPadding'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>The Real-World Action/Results</h2>
							<p>
								<span>Real Learning-</span> Players take part in a reflective, collaborative learning process that prepares them to engage effectively in partner communities and make a positive, informed impact.
								<img class='inlineImageRightSmall' src='../../img/projects/other/civic_seed2.png'>
							</p>
							<p>
								<span>The Civic Resume-</span> By playing the game, student-players not only learn about civic engagement, they become certified to civically engage with their partner communities. Game actions and responses are recorded and transformed into a civic resume -- a sharable profile, owned by the player, that lets partners understand a student's background, skills, goals, and motivations.
							</p>
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
