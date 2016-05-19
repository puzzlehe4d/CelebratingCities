var schedule = require('node-schedule');
var socrata = require('./socrataConfig');

module.exports = function(redisClient){

	
	  var params = {
	      $select: ['location_1', 'description', 'crimetime', 'location' ],
	      $limit: 1000
	    }
	    socrata.get(params, function (err, res, data) {

	      if(data) {
	      	data.forEach(function(element) {
	      		if(element.location_1) {
	      			var loc = element.location_1.latitude + element.location_1.longitude
		      		redisClient.set(element.location, loc, function(err, reply) {
		      		
		      		});	
	      		}
	      	})
	      }
	    });

}
