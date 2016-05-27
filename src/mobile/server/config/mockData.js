var randomstring = require("randomstring");
var carList = ['Toyota Prius', 'Toyota Camry', 'Nissan Versa', 'Toyota Highlander', 'Honda CR-V', 'Ford Escape', 'Ford Focus'];
var drivers = ['John Smith', 'Jane Doe', 'John Doe', 'Maddy Johnson', 'Paul Williams', 'Trevor Anderson'];
var firstNames = ['Brittany', 'Harun', 'Greg', 'Will', 'Vishal', 'Sophia', 'Matthew', 'Jeff']
var lastNames = ['Patterson', 'Zager', 'Mckee', 'Raithel', 'Hund', 'Arya', 'Anzelone', 'Davood']
module.exports = {
  nameData: function () {
    return {
      first_name: firstNames[Math.floor(Math.random() * firstNames.length)],
      last_name: lastNames[Math.floor(Math.random() * lastNames.length)]
    }
  },
  uberData: function () {
    return {
      products:
         [ { capacity: 4,
             product_id: '73070b26-7fb0-44b6-a8b5-789bba6cc96c',
             price_details: [Object],
             image: 'http://d1a3f4spazzrp4.cloudfront.net/car-types/mono/mono-uberx.png',
             shared: false,
             short_description: 'uberX',
             display_name: 'uberX',
             description: 'The low-cost Uber' },
           { capacity: 6,
             product_id: '767d8b17-93f7-4a1c-908c-a14efd8eb963',
             price_details: [Object],
             image: 'http://d1a3f4spazzrp4.cloudfront.net/car-types/mono/mono-uberxl2.png',
             shared: false,
             short_description: 'uberXL',
             display_name: 'uberXL',
             description: 'Low-cost rides for large groups' },
           { capacity: 4,
             product_id: '8587cfd7-908d-4d16-9896-23e765a1697b',
             price_details: [Object],
             image: 'http://d1a3f4spazzrp4.cloudfront.net/car-types/mono/mono-black.png',
             shared: false,
             short_description: 'UberBLACK',
             display_name: 'UberBLACK',
             description: 'The original Uber' },
           { capacity: 6,
             product_id: '2b84b9df-8a6d-4b01-9a7e-b8726ac11ed4',
             price_details: [Object],
             image: 'http://d1a3f4spazzrp4.cloudfront.net/car-types/mono/mono-suv.png',
             shared: false,
             short_description: 'SUV',
             display_name: 'UberSUV',
             description: 'Room for Everyone' } ],

      prices:
         [ { localized_display_name: 'uberX',
             high_estimate: 6,
             minimum: 6,
             duration: 180,
             estimate: '$6-6',
             distance: 0.18,
             display_name: 'uberX',
             product_id: '73070b26-7fb0-44b6-a8b5-789bba6cc96c',
             low_estimate: 6,
             surge_multiplier: 1,
             currency_code: 'USD' },
           { localized_display_name: 'uberXL',
             high_estimate: 8,
             minimum: 8,
             duration: 180,
             estimate: '$8',
             distance: 0.18,
             display_name: 'uberXL',
             product_id: '767d8b17-93f7-4a1c-908c-a14efd8eb963',
             low_estimate: 8,
             surge_multiplier: 1,
             currency_code: 'USD' },
           { localized_display_name: 'UberBLACK',
             high_estimate: 15,
             minimum: 15,
             duration: 180,
             estimate: '$15',
             distance: 0.18,
             display_name: 'UberBLACK',
             product_id: '8587cfd7-908d-4d16-9896-23e765a1697b',
             low_estimate: 15,
             surge_multiplier: 1,
             currency_code: 'USD' },
           { localized_display_name: 'UberSUV',
             high_estimate: 25,
             minimum: 25,
             duration: 180,
             estimate: '$25',
             distance: 0.18,
             display_name: 'UberSUV',
             product_id: '2b84b9df-8a6d-4b01-9a7e-b8726ac11ed4',
             low_estimate: 25,
             surge_multiplier: 1,
             currency_code: 'USD' } ],
      requests: {
        product_id: randomstring.generate(),
        request_id: randomstring.generate(),
        driver: drivers[Math.floor(Math.random() * drivers.length)],
        vehicle: carList[Math.floor(Math.random() * carList.length)],
        eta: Math.floor(Math.random() * 6) + 1,
        location: [39.3040047,-76.6391667],
        surge_multiplier: Math.floor(Math.random() * 3) + 1,
        status: 'accepted',
        shared: false  
      },

      request_status: {
           "request_id":"17cb78a7-b672-4d34-a288-a6c6e44d5315",
           "product_id": "a1111c8c-c720-46c3-8534-2fcdd730040d",
           "status":"accepted",
           "location":{
              "latitude":37.7886532015,
              "longitude":-122.3961987534,
              "bearing":135
           },
           "pickup":{
              "latitude":37.7872486012,
              "longitude":-122.4026315287,
              "eta":5
           },
           "destination":{
              "latitude":37.7766874,
              "longitude":-122.394857,
              "eta":19
           },
           "driver": {
              "phone_number": "(555)555-5555",
              "rating": 5,
              "picture_url": "https://s-media-cache-ak0.pinimg.com/75x75/4b/84/13/4b8413a7cb88e873d254603ea8f0abc5.jpg",
              "name": drivers[Math.floor(Math.random() * drivers.length)]
           },
           "vehicle":{
              "make": "Bugatti",
              "model": "Veyron",
              "license_plate": "I<3Uber",
              "picture_url": "https:\/\/d1w2poirtb3as9.cloudfront.net\/car.jpeg"
           },
           "surge_multiplier":1.0,
           "eta": 5,
           "shared": true,
           "riders":[  
              {
                 "rider_id":"8KwsIO_YG6Y2jijSMf",
                 "first_name":"Alec",
                 "me":"true"
              },
              {  
                 "rider_id":null,
                 "first_name":"Kevin",
                 "me":"false"
              }
           ],
          "waypoints":[  
              {  
                 "rider_id":null,
                 "latitude":37.77508531,
                 "type":"pickup",
                 "longitude":-122.3976683872
              },
              {  
                 "rider_id":null,
                 "latitude":37.773133,
                 "type":"dropoff",
                 "longitude":-122.415069
              },
              {  
                 "rider_id":"8KwsIO_YG6Y2jijSMf",
                 "latitude":37.7752423,
                 "type":"dropoff",
                 "longitude":-122.4175658
              }
           ],
        }
    }
  }
}
      


