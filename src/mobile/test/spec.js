var conf = require('./conf.js')
var protractor = require('protractor')
describe('Authroization', function() {

  it('successful login will take you to dashboard', function() {
    // due to uber rate limit restrictions, login for tests is mocked (see server/routes.js)
  	if(process.env.DEPLOYED) {
    	browser.get('ENTER DEPLOYED URL');
  	} else {
  		browser.get('http://localhost:3000');
  	}
  	element(by.css('.col input')).click();
  	
 		browser.getTitle().then(function(title){
 			console.log(title)
  		expect(title).toEqual('Dashboard');
  	})

  });
});

describe('User Story', function(){
	if(process.env.DEPLOYED) {
    browser.get('ENTER DEPLOYED URL');
  } else {
  	browser.get('http://localhost:3000');
  }
	
	it('url address should be correct', function(){
  	expect(browser.getLocationAbsUrl()).toBe('/tab/start');
	});

	it('dashboard should contain at least a map, two input fields, a button, and tab view', function() {
  	var elements = [
  		element(by.id('map')),
  		element(by.css('form')),
  		element(by.model('vm.startAt')),
  		element(by.model('vm.arriveAt')),
  		element(by.css('.button.button-balanced.button-block')),
  		element(by.css('.geolocate')),
  		element(by.css('.tab-nav.tabs'))
 		]
  	elements.forEach(function(element){
  		expect(element.isPresent()).toBeTruthy();
  	})
	});


	it('should navigate to results page when form is submitted', function(){
		var address = '11400 Commerce Park Dr, Reston, VA 20191, USA';
		element(by.model('vm.startAt')).sendKeys(address);
		element(by.id('findHubs')).submit();
		expect(browser.getLocationAbsUrl()).toBe('/tab/start/results/address/' + address.split(' ').join('_'));
	})

	it('should navigate to detail page', function(){
		element(by.css('.item-remove-animate.item-avatar.item-icon-right')).click();
		var url;
		browser.getLocationAbsUrl().then(function(result){
			expect(result.split('/')[4]).toMatch(/\d{1,}/);
		})	
	})
})