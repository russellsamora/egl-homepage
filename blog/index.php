<!DOCTYPE html>
<html lang='en'>
	<head>
		<?php include '../head.php' ?>
		</script>
	</head>
	<body>
		<div id='wrap'>
  			<?php include '../nav.php' ?>
			<div class='container'>
				<div class='row'>
					<div class='span8 offset2'>
						<div id='blog'></div>
					</div>
				</div>
			</div>
			<div id='push'></div>
   		</div>
   		<?php include '../footer.php' ?>

    	<!-- Los javascripts -->
    	<script src='/js/libs/lab.js'></script>
    	<script>
    		$LAB
    		.script('/js/libs/jquery.min.js').wait()
			.script('/js/libs/bootstrap.min.js')
			.script('/js/libs/plugins.js').wait()
			.script('/js/other/blog.js');
    	</script>
  </body>
</html>
