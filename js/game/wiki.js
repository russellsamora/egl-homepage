(function(){
    var _currentBlurb = null,
        _nextBlurb = 'Hi I am Rob! I love facts.  If you click me, I might give you one.',
        _baseUrl = 'http://en.wikipedia.org/w/api.php?',
        _sentEmail = false;

    var wiki = $game.wiki = {
        
        getWiki: function() {
            _currentBlurb = _nextBlurb;
            _getArticle();
            _sendEmail();
            return _currentBlurb + ' [click to close]';
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
                var dirty = content.substring(startIndex,endIndex);
                //make sure it doesn't have an upload, is a list, or a coordinate
                if(dirty.indexOf('upload.wikimedia.org') > -1 || dirty.indexOf('This is a list') > -1 || dirty.indexOf('Coordinates') > -1 || dirty.indexOf('This article') > -1) {
                    return false;
                }
                //clean it up
                var newP = $(dirty),
                    text = newP.text(),
                    clean = text.replace(/\\/g, '').replace(/\[.*?\]/g, ' ');
                
                //remove () data
                var pIndex1 = clean.indexOf('('),
                    pIndex2 = clean.indexOf(')') + 1;

                var before,
                    after,
                    cleaner = clean;
                if(pIndex1 > -1) {
                    before = clean.substr(0,pIndex1);
                    after = clean.substr(pIndex2, clean.length);
                    cleaner = before + after;
                }
                cleaner = cleaner.trim();
                //if it isn't the write length, try again
                if(cleaner.length < 75 || cleaner.length > 300) {
                    _getArticle();
                    return false;
                } 
                console.log('wiki good');
                _nextBlurb = clean;
            } else {
                _getArticle();
            }
        });
    }

    function _sendEmail() {
        if(_currentBlurb.length <= 144 && !_sentEmail) {
            _sentEmail = true;
            var fixedBlurb = _currentBlurb.replace(/\\/g, '');
            console.log(fixedBlurb);
            // $.post('/db/email.php', {fact: fixedBlurb});    
        }
    }
    _getArticle();


})();