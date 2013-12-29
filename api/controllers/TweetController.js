/**
 * TweetsController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {


  /**
   * Action blueprints:
   *    `/tweet/index`
   *    `/tweet`
   */
   index: function (req, res) {
    Tweet.find({sort: 'createdAt ASC'}, function(err, tweets) {
      if (err) return res.json(err);

      var resolved = 0,
          resolvedTweets = [],
          tweetsLength = tweets.length;

      // if there are no tweets available, return the view immediately
      if (tweetsLength < 1) {
        return res.view({'tweets': tweets});
      }

      for(var i = 0; i < tweetsLength; i++) {
        tweets[i].attachAuthor(i, function (err, tweet, index) {
          resolvedTweets[index] = tweet;

          // return the view after flattening all the tweets
          if (++resolved == tweetsLength) {
            return res.view({'tweets': resolvedTweets});
          }
        });
      }

    });
  },

  /**
   * Action blueprints:
   *    `/tweet/store`
   */
   store: function (req, res) {

    var data = {
      body: req.param('body'),
      authorId: req.session.User.id
    }

    Tweet.create(data, function (err, tweet) {
      if (err) return res.send('An error occured', 500);

      tweet.user(function (err, author) {
        tweet.author = author;
        res.json(tweet);

        // Let other subscribed sockets know that a tweet was created.
        Tweet.publishCreate(tweet.toJSON());

        req.session.flash = {};
      });

    });
  },

  subscribe: function(req, res) {
    Tweet.subscribe(req.socket);
  },



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to TweetsController)
   */
  _config: {}


};
