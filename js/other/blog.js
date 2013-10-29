(function() {
	$('#blog').rssfeed('http://engagementgamelab.wordpress.com/feed/', {
		limit: 7,
		header: false,
		dateformat: 'date',
		snippet: false,
		// media: false,
		errormsg: 'russell made an error.'
	}, function() {
		//replace a tags h4 text
		$('#blog h4 a').each(function() {
			var text = $(this).text(),
				parent = $(this).parent();
			$(this).remove();
			$(parent).text(text);
		});

		//some tidying
		$('#blog ul li.rssRow').each(function(i) {
			//remove the first and last ptags
			$(this).find('p').first().remove();
			$(this).find('p').last().remove();

			//remove the last link
			$(this).find('a').last().remove();
			
			//remove all the br tags
			$(this).find('br').remove();
			
			//remove the last image
			$(this).find('img').last().remove();

			//now the cruft is gone, reformat

			// first div is the date
			$(this).find('div').first().addClass('date');

			//subsequent divs are images with captions
			$(this).find('div').not('.date').addClass('imageDiv');

			
			// var bodyText = $(p).slice(1);
			//open links in new tab
			$(this).find('a').attr('target', '_blank');
			
			var date = $(this).find('.date').text(),
				title = $(this).find('h4').text(),
				author = $(this).find('p').first().text();


			var o1 = '<div class="row"><div class="span9 offset3"><p class="postImage postImage' + i + '"></p></div></div>',
				o2 = '<div class="row"><div class="span3"><p class="postTitle postTitle' + i + '"></p><p class="postAuthro author' + i + '"></p><p class="postDate date' + i + '"></p></div>',
				o3 = '<div class="span9 post post' + i + '"></div></div>';
				outline = o1 + o2 + o3;
			
			$('.blogContainer').append(outline);

			$('.date' + i).text(date);
			$('.postTitle' + i).text(title);
			$('.author' + i).text('By ' + author);

			$(this).find('p').first().remove();
			$(this).find('.date').remove();
			$(this).find('h4').remove();


			
			// // var firstImage = $(img).first();
			// // $('.postImage' + i).append(firstImage);
			
			var html = $(this).html();
			$('.post' + i).append(html);
			
		});
		
		// //center iframes for videos
		// $('#blog iframe').each(function() {
		// 	var parent = $(this).parent();
		// 	$(parent).css('text-align', 'center');
		// });
	});
})();