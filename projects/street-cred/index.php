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
					<p><a href='http://streetcred.us' target='_blank'><img src='../../img/projects/logos/streetcred.png'></a>
					</p>
				</div>
				<p class='projectTagline'>
					Take action, earn street cred, improve your city
				</p>
			</div>
			<div class='container projectPage'>
				<div class='row briefOverview'>
					<div class='span6'>
							<p>
								<span>StreetCred</span>  connects your civic actions to ongoing campaigns so the community can achieve big goals together.  It is a game-based civic badging API that is meant to expand the types of civic actions people take using existing tools like Citizens Connect or Foursquare
							</p>
					</div>
					<div class='span6 videoContainer'>
						<img src='../../img/projects/other/iphone.png'>
						<!-- <iframe src="//player.vimeo.com/video/73780837" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> -->
					</div>
				</div>
				<div class='realProblem'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle indentH2'>
								Context
							</h2>
						</div>
						<div class='span12'>
							<p>	
								<!-- <span class='contextTagline'>Better Access, Broader Input, More Discussion and Deliberation</span><br> -->

								<img class='inlineImage' src='../../img/projects/other/streetcred1.png'> 
								Reporting tools like Citizens Connect or NYC 311 do a great job of helping people report problems, but our research shows they are not very good at getting citizens to reflect on the actions they take, or to connect with their local community. So we began to ask: Can we get this tool to be more social? Can we make people take more actions, and take specific actions? Can we get people to intentionally look for problems rather than accidentally stumble on issues? 

							</p>
						</div>
					</div>
				</div>
				<div class='theGame'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>The Game</h2>
							<p>
								<img class='inlineImageRightSmall' src='../../img/projects/other/streetcred2.png'> 
								Players are prompted to take specific actions using already-existing tools such as Citizens Connect, and are rewarded with badges, which contribute to larger campaigns and real-life rewards. Actions, badges, and campaigns all contribute to a social reputation system that allows players to see their participation within the context of other engaged citizens.
							</p>
						</div>
					</div>
				</div>
				<div class='realActions extraPadding'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>The Real-World Action/Results</h2>
							<p> 
								Players get started using the Citizens Connect app and once they claim their StreetCred profile, they are prompted to use the app to complete campaigns, which are particular combinations of actions such as reporting potholes, visiting a public park or library, or watering a tree planted by the City of Boston. With each real-world action you take, you'll earn cred. And when you complete campaigns, you'll earn a digital badge to celebrate your work. The community can also work together to complete collaborative community campaigns.

							</p>
							<ul>
								<li>City officials receive more and better data about issues that require their attention </li>
								<li>Players get better public services tailored to their reports </li>
								<li>Communication and recognition of community issues is increased by the social sharing element of game </li>
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
