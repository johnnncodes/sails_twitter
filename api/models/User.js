/**
 * Users
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {

    username: {
      type: 'STRING',
      required: true,
      unique: true
    },

    password: {
      type: 'STRING',
      required: true
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }

  }

};
