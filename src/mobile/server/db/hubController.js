var User = require('./userModel.js');
var Hub = require('./hubModel.js');

module.exports = {

	seedWithData: function () {
		var hubs = [{
	    name: 'Giant Food on 33rd',
	    address: '601 E 33rd Street',
	    distance: 0.3,
	    duration: 6,
	    leaveTime: '7:06am',
	    arriveTime: '7:12am',
	    endPoint: 'West Balitmore (MARC)',
	    lat: 39.32,
	    lon: -76.60
		},
		{
	    name: '7-11 in Lucille Park',
	    address: '5129 Reisterstown Rd',
	    distance: 0.6,
	    duration: 9,
	    leaveTime: '7:20am',
	    arriveTime: '7:29am',
	    endPoint: 'West Balitmore (MARC)',
	    lat: 39.34,
	    lon: -76.68
		},
		{
			name: 'ALDI East Arlington',
			address: '3601 W Cold Spring Ln',
			distance: 1.1,
			duration: 12,
			leaveTime: '7:01am',
			arriveTime: '7:13am',
			endPoint: 'West Balitmore (MARC)',
			lat: 39.33,
			lon: -76.67
		},
		{
			name: 'ALDI East Arlington',
			address: '3601 W Cold Spring Ln',
			distance: 1.1,
			duration: 12,
			leaveTime: '7:01am',
			arriveTime: '7:13am',
			endPoint: 'West Balitmore (MARC)',
			lat: '38.9461282',
			lon: '-77.3398399'
		}
		]

		hubs.forEach(function(element){
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

	createHub: function(req, res) {
		console.log(req.body)
		Hub.forge(req.body).save().then(function(hub){
			console.log('succesfully added hub');
			res.status(201).send(hub);
		}).catch(function(error){
			console.log('error adding hub', error);
			res.status(500).send(error);
		})
	},

	getHubById: function(req, res) {
		Hub.forge({id: req.params.hubId}).fetch().then(function (hub) {
			console.log('sucessfully found hub');
			res.status(200).send(hub);
		}).catch(function(error) {
			res.status(500).send(error);
		});
	},

	getHubsByGeoCode: function (req, res) {
		return Hub.query().where('lat', '<=', Number(req.params.lat) + .5).andWhere('lat', '>=', Number(req.params.lat) - .5).andWhere('lon', '<=', Number(req.params.lon) + .5).andWhere('lon', '>=', Number(req.params.lon) - .5)
		.then(function(collection) {
			res.status(200).send(collection);
		}).catch(function(error) {
			res.status(500).send(error);
		})
	}

}