/**
 * Tweets
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {

    body: {
      type: 'STRING',
      required: true
    },

    authorId: {
      type: 'STRING',
      required: true
    },

    user: function(cb) {
      User.findOneById(this.authorId).done(function(err, user) {
        if (err) return cb(err);

        if ( ! user) {
          return cb();
        }

        return cb(null, user);
      });
    },

    attachAuthor: function(cb) {
      var obj = this.toObject();
      this.user(function (err, author) {
        obj.author = author;
        return cb(null, obj);
      });
    },

  }

};
