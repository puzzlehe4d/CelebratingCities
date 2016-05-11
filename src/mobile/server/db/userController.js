var User = require('./userModel.js');
var Hub = require('./hubModel.js');

module.exports = {

	// not requested through service but requested from routes.js; req does not have any methods
	addUser: function(req) {
		var userObject = {
			picture: req.picture,
			first_name: req.first_name,
			last_name: req.last_name,
			uuid: req.uuid,
			rider_id: req.rider_id,
			access_token: req.access_token,
			refresh_token: req.refresh_token
		}
	  User.forge(userObject).save().then(function(user) {
	    console.log('added user', user.attributes.first_name, user.attributes.last_name, 'to db');
	    return user;
	  }).catch(function(err){
	    console.log('error adding user', err);
	    return err
	    // next(err);
	  });
	}

}