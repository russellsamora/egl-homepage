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
								<span>StreetCred</span>  connects your civic actions to ongoing campaigns so the community can achieve big goals together. Designed in partnership with the City of Boston, StreetCred is a game-based civic badging API that is meant to expand the types of civic actions people take using existing tools like Citizens Connect or Foursquare.
							</p>
					</div>
					<div class='span6 videoContainer'>
						<img src='../../img/projects/other/streetcred4.png'>
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
							<p>
								To accomplish this, StreetCred pulls multiple reporting apps under one umbrella, combining them in a civic badging and reputation API. 
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
								Players get started using the Citizens Connect app, and once they claim their StreetCred profile, they are prompted to use the app to complete campaigns, which are particular combinations of actions such as reporting potholes, visiting a public park or library, or watering a tree planted by the City of Boston.  With each real-world action you take, players earn cred. And when you complete campaigns, you'll earn a digital badge to celebrate your work. The community can also work together to complete collaborative community campaigns.
							</p>
							<p>
								In addition, actions taken through StreetCred are logged on a map, so players can see and compare others' reports with their own and see how they've contributed in a direct, rather than abstract, way.
							</p>
						</div>
					</div>
				</div>
				<div class='realActions extraPadding'>
					<div class='row'>
						<div class='span12'>
							<h2 class='funTitle'>The Real-World Action/Results</h2>
							<p> 
								In addition to uniting many existing and future reporting apps under one, unified API, each StreetCred report is linked with certain direct real life action. 
							</p>
							<ul>
								<li>When players make reports, they're received by municipal officials who take action. Thus, StreetCred players get better public services tailored to their reports</li>
								<li>When the community of players see one another's actions through social sharing, communication and recognition of local issues is increased</li>
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
