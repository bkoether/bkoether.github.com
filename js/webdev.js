$(function() {
  $('.slider-row .slide-col').hover(
    function () {
      var $this = $(this);
      $this.attr('x-w', $this.width());
      $this.stop().animate({'width':($this.width() * 2.5)},500);
      $('.heading',$this).stop(true,true).fadeOut();
      // $('.bgDescription',$this).stop(true,true).slideDown(500);
      $('.description',$this).stop(true,true).fadeIn();

    },
    function () {
      var $this = $(this);
      $this.stop().animate({'width': $this.attr('x-w')},1000, function(){$this.removeAttr('style');});
      $('.heading',$this).stop(true,true).fadeIn();
      $('.description',$this).stop(true,true).fadeOut(500);
      // $('.bgDescription',$this).stop(true,true).slideUp(700);
    }
  );

  // Check if we have have the latest tweet in local storage
  var lastTweet = localStorage['bkw_tweet'];

// alert(localStorage['bkw_tweet']);
  // if empty (or not suppoprted get the latest tweet)
  if(typeof lastTweet === "undefined"){
    console.log('last tweet undefined');
    // This code need s to go into node.js
    bkwTweet.fetch();

  }
  else{
    console.log('we have a tweet, check the date');
    // Check if one hour is up
    var lastTweetTime = localStorage['bkw_tweet_time'] + 3600;
    var now = Math.round(+new Date()/1000)
    if (typeof lastTweetTime === 'undefined' || lastTweetTime < now){
      console.log('time up, ask again');
      bkwTweet.fetch();
    }
    else {
      $("#twitter").html(lastTweet);
    }
  }
});

bkwTweet = {
  fetch: function() {
    var user = 'ben_ned';
    $.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + user + '&count=1&include_rts=true&callback=?',
      function(data) {
        var tweet = ify.clean(data[0].text);
        localStorage['bkw_tweet'] = tweet;
        localStorage['bkw_tweet_time'] = Math.round(+new Date()/1000);
        $("#twitter").html(tweet);
      }
    );
  }
}

/**
 * The Twitalinkahashifyer!
 * http://www.dustindiaz.com/basement/ify.html
 * Eg:
 * ify.clean('your tweet text');
 */
ify = {
  link: function(tweet) {
    return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
      var http = m2.match(/w/) ? 'http://' : '';
      return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
    });
  },

  at: function(tweet) {
    return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
      return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
    });
  },

  list: function(tweet) {
    return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
    return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
    });
  },

  hash: function(tweet) {
    return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
      return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
    });
  },

  clean: function(tweet) {
    return this.hash(this.at(this.list(this.link(tweet))));
  }
};
