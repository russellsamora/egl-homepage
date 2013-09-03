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
					Habit@
				</p>
			</div>
			<div class='container'>
				<div class='row briefOverview'>
					<div class='span6'>
							<p>
								A <span>Habit@</span> is an ecosystem of civic technologies, deployed on a local scale. 
							</p>
					</div>
					<div class='span6 videoContainer'>
						<iframe src="http://player.vimeo.com/video/55893197?title=0&amp;byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen="" allowfullscreen=""></iframe>
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
								As considerable energy builds around civic innovation, there is little effort to frame new tools within a larger context of localized innovation, which disconnects tools from their local context, limits their reach, and reduces their capacity to introduce systemic change within a neighborhood. 

							</p>
						</div>
					</div>
				</div>
				<div class='theGame'>
					<div class='row'>
						<div class='span12'>
							<h2>The Game</h2>
							<p>
								All Habit@ technologies will be implemented in the Dudley Street neighborhood of Boston, with the help from a local organization, the Dudley Street Neighborhood Initiative (DSNI). 
								<br>
								The DSNI Technology Habit@ consists of six tools, which will be implemented from November 2013 - April 2014.  1) a set of touchscreens with internet access and helpful applications 2) a projection screen that will display results from a public outreach effort led by a local community group; 3) a visioning cart (plexiglass cart on which citizens can draw what they'd prefer to take the place of empty space/existing structures); 4) Planning on the Street using Textizen (a Code for America app) campaign; 5) a Community PlanIt (*LINK) mission; 6) a StreetCred (*LINK) campaign.
							</p>
						</div>
					</div>
				</div>
				<div class='realActions extraPadding'>
					<div class='row'>
						<div class='span12'>
							<h2>The Real-World Action/Results</h2>
							<p>
								The DSNI Technology Habit@ project is designed to both give local citizens many ways to make their voice heard, access important information, and take action with others in their community. The research associated with the project is designed to investigate the effects of the Habit@ on civic life, how innovation occurs in local community organizations, and best practices for replicating Habit@ in other neighborhoods.
								Within this context, we ask the following research questions:
								1) Can a cohort of innovations affect people's relationships to civic life (relationship to community organizations, feelings of efficacy, social/communal connection) differently than single interventions?
								2)  Can a cohort of interventions affect more people than simply those who interact with them?
								3) What meanings do people ascribe to civic media in their community (i.e. are tools seen as efficient for everyday life, connections to government institutions, methods of person empowerment, etc)? 
								4)          What are best practices for implementing each tool, and what is needed from DSNI?

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
