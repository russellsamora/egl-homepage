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
					<p><img src='../../img/projects/logos/habitat.jpg'>
					</p>
				</div>
				<p class='projectTagline'>
					Habit@
				</p>
			</div>
			<div class='container projectPage'>
				<div class='row briefOverview'>
					<div class='span6'>
							<p>
								A <span>Habit@</span> is an ecosystem of civic technologies, deployed on a local scale.  It is designed to both give local citizens many ways to make their voice heard, access important information, and take action with others in their community. 
							</p>
					</div>
					<div class='span6 videoContainer'>
						<img src='../../img/projects/other/habitat3.jpg'>
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
							</p>
							<p>
								The DSNI Technology Habit@ consists of six tools, which will be implemented from November 2013 - April 2014.
							</p>
								<ol>
									<li>a set of touchscreens with internet access and helpful applications</li>
									<li>a projection screen that will display results from a public outreach effort led by a local community group</li>
									<li>a visioning cart (plexiglass cart on which citizens can draw what they'd prefer to take the place of empty space/existing structures)</li>
									<li>Planning on the Street using Textizen (a Code for America app) campaign</li>
									<li>a <a href='http://communityplanit.org' target='_blank'>Community PlanIt</a> mission</li> 
									<li>a <a href='http://streetcredu.us' target='_blank'>StreetCred</a> campaign</li>
								</ol>							
						</div>
					</div>
				</div>
				<div class='realActions extraPadding'>
					<div class='row'>
						<div class='span12'>
							<h2>The Real-World Action/Results</h2>
							<p>
								The DSNI Technology Habit@ project is designed to both give local citizens many ways to make their voice heard, access important information, and take action with others in their community. The research associated with the project is designed to investigate the effects of the Habit@ on civic life, how innovation occurs in local community organizations, and best practices for replicating Habit@ in other neighborhoods.
								<br>
								<br>
								Within this context, we ask the following research questions:
							</p>
							<ol>
								<li>Can a cohort of innovations affect people's relationships to civic life (relationship to community organizations, feelings of efficacy, social/communal connection) differently than single interventions?</li>
								<li>Can a cohort of interventions affect more people than simply those who interact with them?</li>
								<li>What meanings do people ascribe to civic media in their community (i.e. are tools seen as efficient for everyday life, connections to government institutions, methods of person empowerment, etc)?</li>
								<li>What are best practices for implementing each tool, and what is needed from DSNI?</li>
							</ol>
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
