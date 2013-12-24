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

    bcrypt.hash(password, 10, function(err, hash) {
      if (err) return res.send('An error occured', 500);

      // if there is no password supplied, empty the hash to make the model
      // validation fail
      if ( ! password) hash = '';

      var inputs = {
        username: username,
        password: hash
      }

      User.create(inputs, function (err, user) {

        if (err) {

          console.log(err);

          req.session.flash = {
            err: err
          };

          return res.redirect('/user/create');
        }

        res.redirect('/session/create');
        req.session.flash = {};
      });
    });
  },



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UsersController)
   */
  _config: {}


};
