var conf = require('./conf.js')
var protractor = require('protractor')
describe('Authroization', function() {

  it('accessing app should take you to login screen when not authorized', function() {
  	var url;
  	if(process.env.DEPLOYED) {
    	url = 'enter dev url here'
  	} else {
  		url = 'http://localhost:3000';
  	}

  	browser.get(url).then(function(){
  		 expect(browser.getTitle()).toEqual('Login');
  	});
  });

  it('successful login will take you to dashboard', function() {
  	var url;
  	if(process.env.DEPLOYED) {
    	url = 'enter dev url here'
  	} else {
  		url = 'http://localhost:3000';
  	}
  	browser.get(url).then(function(){
  		element(by.css('.col input')).click().then(function(){
	  		browser.driver.getTitle().then(function(title){
	  			expect(title).toEqual('Uber');
	  		});
	  		browser.driver.findElement(by.id('email')).sendKeys(process.env.uberUsername);
	  		browser.driver.findElement(by.id('password')).sendKeys(process.env.uberPassword);
	  		browser.driver.findElement(by.css('.btn.btn--large.btn--full')).click().then(function(){
			 		// browser.wait(function(){

			 		// },)
			 		// browser.getTitle().then(function(title){
			 		// 	console.log(title)
			  	// 	expect(title).toEqual('Dashboard');
			  	// }), 10000)
	  		})
  		})
  	});
  	
  	
    

  });
});

// describe('User Story', function(){
// 	if(process.env.DEPLOYED) {
//     browser.get('ENTER DEPLOYED URL');
//   } else {
//   	browser.get('http://localhost:3000');
//   }
	
// 	it('url address should be correct', function(){
//   	expect(browser.getLocationAbsUrl()).toBe('/tab/start');
// 	});

// 	it('dashboard should contain at least a map, two input fields, a button, and tab view', function() {
//   	var elements = [
//   		element(by.id('map')),
//   		element(by.css('form')),
//   		element(by.model('vm.startAt')),
//   		element(by.model('vm.arriveAt')),
//   		element(by.css('.button.button-balanced.button-block')),
//   		element(by.css('.geolocate')),
//   		element(by.css('.tab-nav.tabs'))
//  		]
//   	elements.forEach(function(element){
//   		expect(element.isPresent()).toBeTruthy();
//   	})
// 	});


// 	it('should navigate to results page when form is submitted', function(){
// 		var address = '11400 Commerce Park Dr, Reston, VA 20191, USA';
// 		element(by.model('vm.startAt')).sendKeys(address);
// 		element(by.id('findHubs')).submit();
// 		expect(browser.getLocationAbsUrl()).toBe('/tab/start/results/address/' + address.split(' ').join('_'));
// 	})

// 	it('should navigate to detail page', function(){
// 		element(by.css('.item-remove-animate.item-avatar.item-icon-right')).click();
// 		var url;
// 		browser.getLocationAbsUrl().then(function(result){
// 			console.log(result.split('/'))
// 			expect(result.split('/')[4]).toMatch(/\d{1,}/);
// 			expect(result).toBe('/tab/start/results/');
// 		})	
// 	})
// })