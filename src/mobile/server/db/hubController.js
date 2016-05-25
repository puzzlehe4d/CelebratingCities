var User = require('./userModel.js');
var Hub = require('./hubModel.js');
var Ride = require('./rideModel.js');
var HubsUsers = require('./hubsUsersModel.js')

module.exports = {

	seedWithData: function (redisClient) {
		var hubs = [{
	    name: 'Giant Food on 33rd',
	    address: '601 E 33rd Street Baltimore, MD',
	    distance: 0.3,
	    recurring: null,
	    area: 'Baltimore',
	    leaveTime: '7:06am',
	    duration: 5,
	    endPoint: 'West Balitmore (MARC)',
	    lat: 39.3278140,
	    lon: -76.6079990,
	    geoRoute: '39.3278140, -76.6079990, 38.946, -77.34005'
		},
		{
	    name: 'Thai Restaraunt',
	    address: '601 E 33rd St, Baltimore, MD 21218, USA',
	    distance: 0.6,
	    recurring: null,
	    area: 'Reston',
	    leaveTime: '7:20am',
	    duration: 3,
	    endPoint: '601 E 33rd Street Baltimore, MD',
	    lat: 39.3290174,
	    lon: -76.6096083,
	    geoRoute: '39.3290174, -76.6096083, 39.3278140, -76.6079990',
		},
		{
			name: 'Architecture Inc',
			address: '1902 Campus Commons Dr # 101, Reston, VA 20191',
			distance: 1.1,
			recurring: null,
			area: 'Reston',
			leaveTime: '7:01am',
			duration: 8,
			endPoint: '11400 Commerce Park Dr # 600, Reston, VA 20191',
			lat: 38.94523,
			lon: -77.33751,
			geoRoute: '38.94523, -77.33751, 38.946, -77.34005'
		},
		{
			name: 'Applied Information Sciences',
			address: '11400 Commerce Park Dr # 600, Reston, VA 20191',
			distance: 1.1,
			recurring: 'true, undefined, true, undefined, undefined, undefined, undefined',
			area: 'Reston',
			leaveTime: '7:01am',
			duration: 8,
			endPoint: '1108 Columbia Road NW Washington D.C. 20009',
			lat: '38.94617',
			lon: '-77.34005',
			geoRoute: '38.94523, -77.33751, 38.92771, -77.02763',
		}
		]

		hubs.forEach(function(element){
			var hubString = element.address;
			redisClient.geoadd('HUB', element.lat, element.lon, hubString, function(err, reply) {
				if(err) {
					console.log(err);
				}
			});

			Hub.forge(element).save().then(function(hub){
				console.log('succesfully added hub');
			}).catch(function(error){
				console.log('error adding hub', error);
			})
		})
	},

	getAllHubs: function(req, res) {
		Hub.fetchAll().then(function(hubs){
			res.status(200).send(hubs);
		}).catch(function(err){
			res.status(500).send(err);
		})
	},

	createHub: function(req, res, redisClient, uber) {
		if(!req.body.name && req.body.address){
			req.body.name = req.body.address;
		}

		var coords = req.body.geoRoute.split(', ')
    var start_latitude = coords[0];
    var start_longitude = coords[1];
    var end_latitude = coords[2];
    var end_longitude = coords[3];

    uber.estimates.getPriceForRoute(start_latitude, start_longitude, end_latitude, end_longitude, function(err, estimate) {
      if(err) {
        console.log(err)
        res.status(500).send(err);
      } else {
      	if(estimate.prices[0]) {
        	req.body.duration = Math.floor(estimate.prices[0].duration/60);
        	req.body.distance = estimate.prices[0].distance;	
					var hubString = req.body.address;
					redisClient.geoadd('HUB', req.body.lat, req.body.lon, hubString, function(err, reply) {
						if(err) {
							console.log(err);
						}
					});
					Hub.forge(req.body).save().then(function(hub){
						console.log('succesfully added hub');
						res.status(201).send(hub);
					}).catch(function(error){
						console.log('error adding hub', error);
						res.status(500).send(error);
					})
      	}
      }
    });


		

	},

	getHubById: function(hubId, callback) {
		Hub.forge({id: hubId}).fetch().then(function (hub) {
			console.log('sucessfully found hub');
			Ride.query().where('hub_id', '=', hub.attributes.id).andWhere('status', '=', 'accepted').then(function(collection) {
				console.log(collection.length)
				hub.attributes.rider_count = collection.length;
				HubsUsers.query().where('hub_id', '=', hub.attributes.id).then(function(collection){
					hub.attributes.user_count = collection.length;
					callback(null, hub);
				}).catch(function(error){
					callback(error,null);
				})	
			}).catch(function(error) {
				callback(error, null);
			})
		}).catch(function(error) {
			callback(error, null);
		});
	},

	getHubsByGeoCode: function (req, res) {
		return Hub.query().where('lat', '<=', Number(req.params.lat) + .05).andWhere('lat', '>=', Number(req.params.lat) - .05).andWhere('lon', '<=', Number(req.params.lon) + .05).andWhere('lon', '>=', Number(req.params.lon) - .05)
		.then(function(collection) {
			res.status(200).send(collection);
		}).catch(function(error) {
			res.status(500).send(error);
		})
	}

}