var _womp = '21fe53d165fc4ca8b9e2ead49226b098',
    _baseInstagramUrl = 'https://api.instagram.com/v1/',
    _photos = {},
    _displayedIds = {},
    _maxPhotosToShow = 24,
    _hideCaption;

(function() {
	_init();
})();

function _init() {
    var searchTag = 'redsox';
    _queryInstagramTag(searchTag);
    
    setInterval(function() {
        _queryInstagramTag(searchTag);
    }, 10000);
}

function _queryInstagramTag(tag) {
    var tagParam = 'tags/' + tag + '/media/recent?client_id=' + _womp,
        query = _baseInstagramUrl + tagParam;
    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        cache: false,
        url: query,
        success: function(response) {
            if(response.meta.code !== 200) {
                console.log(response.meta.error_message);
            }
            
            for(var cur = response.data.length - 1; cur > -1; cur--) {
                var data = response.data[cur];
                if(!_displayedIds[data.id]) {
                    _addPhoto(data);
                }
            }

            var numPhotos = _getNumPhotos();
            if(numPhotos > _maxPhotosToShow) {
                var numRemove = numPhotos - _maxPhotosToShow;
                for(var i = 0; i < numRemove; i++) {
                    var last = $('.pics img').last();
                    var id = last.attr('data-id');
                    last.off('click');
                    last.remove();
                    delete _photos[id];
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function _getNumPhotos() {
    return Object.keys(_photos).length;
}

function _addPhoto(data) {
    var images = data.images,
        user = data.user,
        caption = data.caption,
        location = data.location,
        captionText = null,
        id = data.id;

    //clean up caption
    if(caption) {
        captionText = caption.text.replace(/\"/g, '\'');
    } else {
        captionText = '';
    }

    //clean up date
    var real_date = new Date(data.created_time * 1000),
        clean_date = real_date.toUTCString().substr(0,25);

    _displayedIds[id] = true;
    _photos[id] = {
        images: {
            thumbnail: images.thumbnail.url,
            standard: images.standard_resolution.url
        },
        created: {
            milliseconds: (data.created_time * 1000),
            date_string: clean_date
        },
        user: {
            realname: data.user.full_name,
            username: data.user.username
        },
        location: data.location,
        caption: captionText
    };
    var img = new Image();
    img.onload = function() {
        // img.className = 'newbie';
        img.setAttribute('data-id', id);
        $('.pics').prepend(img);
        $(img).on('click touch', function() {
            var id = $(this).attr('data-id');
            _showCaption(id);
        });
    };
    img.src = images.low_resolution.url;
}

function _showCaption(id) {
    var caption = _photos[id].caption,
        user = _photos[id].user.username,
        date = _photos[id].created.date_string;

    var html = '<span>' + user + ':</span> ' + caption;
    $('.caption').html(html).fadeIn();
    clearTimeout(_hideCaption);
    _hideCaption = setTimeout(function() {
        $('.caption').fadeOut();
    },10000);

}