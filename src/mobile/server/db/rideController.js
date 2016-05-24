var User = require('./userModel.js');
var Hub = require('./hubModel.js');
var Ride = require('./rideModel.js');

module.exports = {
	createRide: function(req, res, callback) {
		var ride = {
			request_id: req.body.request_id,
			status: req.body.status,
			driver: req.body.driver,
			vehicle: req.body.vehicle,
			eta: req.body.eta,
			hub_id: req.body.hub_id,
			product_id: req.body.product_id,
			surge_multiplier: req.body.surge_multiplier
		}
		Ride.forge(ride).save().then(function(ride) {
			User.forge({uuid: req.body.uuid}).fetch().then(function(user) {
				if (user) {
					user.set({ride_id: ride.attributes.id}).save().then(function(user) {
						callback(null, user);
					})
				} else {
					callback('user not found', null);
				}
			})
		}).catch(function(err) {
			callback(err, null);
		});
	

	}



}