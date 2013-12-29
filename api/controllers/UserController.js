/**
 * UsersController
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

var bcrypt = require('bcrypt');

var async = require("async");

module.exports = {

  /**
   * Action blueprints:
   *    `/users/index` or `/users`
   */
  index: function (req, res) {
    User.find({}, function(err, users) {
      if (err) return res.json(err);
      return res.view({'users': users});
    });
  },

  /**
   * Action blueprints:
   *    `/users/create`
   */
  create: function (req, res) {
    res.view();
  },

  /**
   * Action blueprints:
   *    `/users/store`
   */
  store: function (req, res) {
    var username = req.param('username');
    var password = req.param('password');

    // validate inputs
    var validator = ValidatorService.make();
    validator.check(username, 'Username is required').notEmpty();
    validator.check(password, 'Password is required').notEmpty();

    var err = validator.getErrors();

    async.waterfall([

      // check username if available
      function(callback){
        User.findOne()
        .where({ username: username })
        .then(function(user){

          if (user) {
            err.push('Username already exists');
          }

          callback(null);
        }).fail(function(err){
          return res.send('An error occured', 500);
        });
      },

      // redirect if there are any errors
      function(callback){

        if (err.length > 0) {
          req.session.flash = {
            err: err
          };

          return res.redirect('/user/create');
        }

        callback(null);
      },

      // build inputs
      function(callback){

        // hash password
        bcrypt.hash(password, 10, function(err, hash) {
          if (err) return res.send('An error occured', 500);

          // if there is no password supplied, empty the hash to make the model
          // validation fail
          if ( ! password) hash = '';

          var inputs = {
            username: username,
            password: hash
          }

          callback(null, inputs);
        });
      },

      // create user
      function(inputs, callback){
        User.create(inputs, function (err, user) {
          if (err) return res.send('An error occured', 500);

          // user is passed in case we will need it later
          callback(null, user);
        });
      }

    ], function (err, user) {
      res.redirect('/session/create');
      req.session.flash = {};
    });

  },



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UsersController)
   */
  _config: {}


};
