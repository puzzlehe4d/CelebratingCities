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
	    endPoint: 'West Balitmore (MARC)'
		},
		{
	    name: '7-11 in Lucille Park',
	    address: '5129 Reisterstown Rd',
	    distance: 0.6,
	    duration: 9,
	    leaveTime: '7:20am',
	    arriveTime: '7:29am',
	    endPoint: 'West Balitmore (MARC)'
		},
		{
			name: 'ALDI East Arlington',
			address: '3601 W Cold Spring Ln',
			distance: 1.1,
			duration: 12,
			leaveTime: '7:01am',
			arriveTime: '7:13am',
			endPoint: 'West Balitmore (MARC)'
		}]

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

	}
}