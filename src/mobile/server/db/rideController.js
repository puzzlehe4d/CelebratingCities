var User = require('./userModel.js');
var Hub = require('./hubModel.js');
var Ride = require('./rideModel.js');

module.exports = {
	createRide: function(req, res) {
		var ride = {
			request_id: req.body.request_id,
			status: req.body.status,
			driver: req.body.driver,
			vehicle: req.body.vehicle,
			eta: req.body.eta,
			product_id: req.body.product_id,
			surge_multiplier: req.body.surge_multiplier
		}
		Ride.forge(ride).save().then(function(ride) {
			if(user) {
				callback(null, user);
				return user.hubs().attach(hub.id);
			}
		}).catch(function(err) {
			callback(err, null);
		});
	}
}