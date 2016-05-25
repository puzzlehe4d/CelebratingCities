var User = require('./userModel.js');
var Hub = require('./hubModel.js');
var HubsUsers = require('./hubsUsersModel.js');

module.exports = {

	// not requested through service but requested from routes.js; req does not have any methods
	addUser: function(req, callback) {
		var userObject = {
			picture: req.picture,
			first_name: req.first_name,
			last_name: req.last_name,
			uuid: req.uuid,
			rider_id: req.rider_id,
			access_token: req.access_token,
			refresh_token: req.refresh_token
		}
		User.forge({uuid: userObject.uuid}).fetch().then(function(user){
			if(!user) {
			  User.forge(userObject).save().then(function(user) {
			    console.log('added user', user.attributes.first_name, user.attributes.last_name, 'to db');
			    callback(null, user);
			  }).catch(function(err){
			    console.log('error adding user', err);
			    callback(err, null);  // next(err);
			  });
			} else {
				console.log('user already exists')
				callback(null, null);
			}
		})
	},

	addHub: function(hub, uuid, callback) {
		User.forge({uuid: uuid}).fetch().then(function(user) {
			if(user) {
				callback(null, user);
				return user.hubs().attach(hub.id);
			}
		}).catch(function(err) {
			callback(err, null);
		});
	},

	getHubs: function(req, res) {
		return new User().query({where: {uuid: req.params.user}})
		.fetch({withRelated: ['hubs'], require: true})
		.then(function(model) {
			if(model) {
				res.status(200).send(model);
			} else {
				res.status(404).send('model not found')
			}
			
		}).catch(function(err) {
			res.status(500).send(err);
		})
	},

	checkIfUserIsRiding: function (uuid, callback) {
		User.forge({uuid: uuid}).fetch().then(function(user) {
			if(user) {
				if(user.attributes.ride_id) {
					var result = {
						status: true,
						ride_id: user.attributes.ride_id
					}
				} else {
					var result = {
						status: false,
						ride_id: null
					}
				}
				callback(null, result)
			} else {
				callback(null, 'no user found')
			}
		}).catch(function(error) {
			callback(error, null);
		})
	}


    



}