var conf = require('./conf.js')
var protractor = require('protractor')
describe('Protractor Demo App', function() {

  it('accessing app should take you to login screen when not authorized', function() {
  	if(process.env.DEPLOYED) {
    	browser.get('ENTER DEPLOYED URL');
  	} else {
  		browser.get('http://localhost:3000');
  	}

    expect(browser.getTitle()).toEqual('Login');

    if(process.env.DEPLOYED) {
    	browser.get('ENTER DEPLOYED URL');
  	} else {
  		browser.get('http://localhost:3000/#/tab/start');
  	}

  	expect(browser.getTitle()).toEqual('Login');
  });

  it('successful login will take you to dashboard', function() {
  	if(process.env.DEPLOYED) {
    	browser.get('ENTER DEPLOYED URL');
  	} else {
  		browser.get('http://localhost:3000');
  	}
  	element(by.css('.col input')).click();
  	expect(browser.driver.getTitle()).toEqual('Uber');// This is wrong!
  	console.log('logging in user into uber', process.env.uberUsername)
    browser.driver.findElement(by.id('email')).sendKeys(process.env.uberUsername);
    browser.driver.findElement(by.id('password')).sendKeys(process.env.uberPassword);
    browser.driver.findElement(by.css('.btn.btn--large.btn--full')).click();
 		expect(browser.getTitle()).toEqual('Dashboard');
	    
   
   

    

  });
});