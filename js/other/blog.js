(function() {
	$('#blog').rssfeed('http://engagementgamelab.wordpress.com/feed/', {
		limit: 10,
		header: false,
		dateformat: 'date',
		snippet: false,
		// media: false,
		errormsg: 'russell made an error.'
	}, function() {
		// //replace a tags h4 text
		$('#blog h4 a').each(function() {
			var text = $(this).text(),
				parent = $(this).parent();
			$(this).remove();
			$(parent).text(text);
		});

		$('#blog .rssRow div').addClass('date');

		//some tidying
		$('#blog ul li').each(function(i) {
			var p = $(this).find('p');
			$(p).eq(0).remove();
			$(p).last().remove();
			
			var body = $(p).slice(1);

			$(this).find('br').remove();
			$(this).find('a').remove();
			
			var img = $(this).find('img');
			$(img).last().remove();
			
			var html = $(this).html();
			
			var date = $(this).find('.date').text(),
				title = $(this).find('h4').text();

			var o1 = '<div class="row"><div class="span9 offset3"><p class="postImage postImage' + i + '"></p></div></div>',
				o2 = '<div class="row"><div class="span3"><p class="postTitle postTitle' + i + '"></p><p class="postDate date' + i + '"></p></div>',
				o3 = '<div class="span9 post post' + i + '"></div></div>';
				outline = o1 + o2 + o3;
			
			$('.blogContainer').append(outline);
			
			var firstImage = $(img).first();
			$('.postImage' + i).append(firstImage);
			$('.date' + i).text(date);
			$('.postTitle' + i).text(title);

			$(body).each(function() {
				if($(this).text().length > 0) {
					$('.post' + i).append(this);
				}
			});
			
		});
		// //center iframes for videos
		// $('#blog iframe').each(function() {
		// 	var parent = $(this).parent();
		// 	$(parent).css('text-align', 'center');
		// });
	});
})();