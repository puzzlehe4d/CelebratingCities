var User = require('./userModel.js');
var Hub = require('./hubModel.js');
var Ride = require('./rideModel.js');
var HubsUsers = require('./hubsUsersModel.js');
module.exports = {
	createRide: function(req, res, callback) {
		var uuid = req.session.uuid || process.env.uuid;
		var ride = {
			owner: uuid,
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
		Ride.query().where('hub_id', '=', req.params.hub_id).then(function(collection){
			res.status(200).send(collection);
		}).catch(function(error){
			res.status(500).send(error);
		})
	},

	getRideById: function(id, callback) {
		Ride.forge({id: id}).fetch().then(function(ride) {
			if(ride) {
				callback(null, ride);
			} else {
				callback(null, null);
			}
		}).catch(function(error) {
			callback(error, null);
		})
	},

	getRideByRequestId: function(id, callback) {
		Ride.forge({request_id: id}).fetch().then(function(ride) {
			if(ride) {
				callback(null, ride);
			} else {
				callback(null, null);
			}
		}).catch(function(error) {
			callback(error, null);
		})
	}

}