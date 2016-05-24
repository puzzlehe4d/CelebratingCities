var User = require('./userModel.js');
var Hub = require('./hubModel.js');
var Ride = require('./rideModel.js');
var HubsUsers = require('./hubsUsersModel.js');
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
					var response = {
						status: false,
						ride_id: null
					}
					user.set({ride_id: ride.attributes.id}).save().then(function(user) {
						callback(null, response);
					})
				} else {
					callback('user not found', null);
				}
			})
		}).catch(function(err) {
			callback(err, null);
		});
	},

	getRidesByHubId: function(req, res) {
		console.log('in controller', req.params)
		Ride.query().where('hub_id', '=', req.params.hub_id).then(function(collection){
			console.log(collection)
			res.status(200).send(collection);
		}).catch(function(error){
			res.status(500).send(error);
		})
	}

}