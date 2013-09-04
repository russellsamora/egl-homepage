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
					<p><a href='http://civicseed.org' target='_blank'><img src='../../img/projects/logos/students.jpg'></a>
					</p>
				</div>
				<p class='projectTagline'>
					Student Projects
				</p>
			</div>
			<div class='container projectPage'>
				<div class='row briefOverview'>
					<div class='span12'>
						<h2 style='text-align:center;'>Check Back Soon...</h2>
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
