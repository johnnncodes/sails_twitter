/**
 * SessionsController
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
   *    `/session/create`
   */
   create: function (req, res) {
    return res.view();
  },


  /**
   * Action blueprints:
   *    `/session/store`
   */
   store: function (req, res) {

    User.findOneByUsername(req.param('username')).done(function(err, user) {
      if (err) return res.json(err);

      var invalidCredentialsError = 'Invalid username and password combination!';

      if ( ! user) {
        req.session.flash = {
          err: [invalidCredentialsError]
        };

        return res.redirect('/session/create');
      }

      bcrypt.compare(req.param('password'), user.password, function(err, valid) {
        if (err) return res.json(err);

          if( ! valid) {
            req.session.flash = {
              err: [invalidCredentialsError]
            };

            return res.redirect('/session/create');
          }

          // The user has authenticated successfully, set their session
          req.session.authenticated = true;
          req.session.User = user;

          // Redirect to protected area
          return res.redirect('/tweet');
      });

    });
  },

   destroy: function (req, res) {
    req.session.destroy();
    return res.redirect('session/create');
  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SessionsController)
   */
  _config: {}


};
