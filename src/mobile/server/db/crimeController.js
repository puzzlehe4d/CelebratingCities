module.exports = {
	getCrimes: function(req, res, redisClient) {
		console.log(req.params)
		redisClient.georadius('baltimore', Number(req.params.lat), Number(req.params.lon), .2, 'km', 'withcoord', function(err, reply) {
			
			if(reply) {
				res.send(reply.map(function(element) {
					coords = {};
					coords.lat = Number(element[1][0]);
					coords.lon = Number(element[1][1]);
					return coords
				}))	
			}
		})


	}
}
