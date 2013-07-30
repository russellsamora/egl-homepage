(function(){
    var _currentBlurb = null,
        _nextBlurb = 'Hi I am Rob! I love facts.  If you click me, I might give you one.',
        _baseUrl = 'http://en.wikipedia.org/w/api.php?';

    var wiki = $game.wiki = {
        
        getWiki: function() {
            _currentBlurb = _nextBlurb;
            _getArticle();
            return _currentBlurb;
        }
    };

    function _getArticle() {
        _randomArticle(function(id) {
            if(id) {
                _getContent(id);
            } else {
                setTimeout(function() {
                    console.log('wiki bad');
                    _getArticle();
                }, 17);
            }
        });
    }

    function _randomArticle(callback) {
        var url = _baseUrl + 'action=query&list=random&rnlimit=10&format=json&callback=?'; 
        $.getJSON(url, function(data) {
            var ran =  data.query.random; 
            var num = ran.length;
            for(var i = 0; i < num; i++) {
                if(ran[i].ns === 0) {
                    callback(ran[i].id);
                    return;
                }
            }
            callback(false);
        });   
    }

    function _getContent(id) {
        var url = _baseUrl + 'action=parse&pageid=' + id +  '&prop=text&format=json&callback=?';
        $.getJSON(url, function(data) {
            var content = JSON.stringify(data.parse.text['*']);
                startIndex = content.indexOf('<p>'),
                endIndex = content.indexOf('</p>') + 3;

            if(startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
                var sub = content.substring(startIndex,endIndex),
                    newP = $(sub),
                    text = newP.text(),
                    clean = text.replace('\\/g','').replace(/\[.*?\]/g, ' ');

                // console.log(clean);
                //deny it for length or keywords
                if(clean.length < 50 || clean.length > 300 || clean.indexOf('This is a list') > -1 || clean.indexOf('Coordinates:') > -1 || clean.indexOf('.svg') > -1) {
                    // console.log('too picky');
                    _getArticle();
                    return false;
                }
                console.log('wiki good');
                _nextBlurb = clean;
            } else {
                // console.log('bad apple');
                _getArticle();
            }
        });
    }

    _getArticle();
})();