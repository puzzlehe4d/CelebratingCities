exports.config = {
  framework: 'jasmine',
  jasmineNodeOpts: {defaultTimeoutInterval: 50000},
  baseUrl: 'http://localhost:3000',
  rootElement: '.ridehub',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec.js'],
  // onPrepare: function() {
  //     browser.get('http://localhost:3000').then(function(){
  // 			element(by.css('.col input')).click()
  // 		});

  //     browser.driver.findElement(by.id('email')).sendKeys(process.env.uberUsern);
  //     browser.driver.findElement(by.id('password')).sendKeys('1234');
  //     browser.driver.findElement(by.css('.btn.btn--large.btn--full')).click();

  //     // Login takes some time, so wait until it's done.
  //     // For the test app's login, we know it's done when it redirects to
  //     // index.html.
  //     return browser.driver.wait(function() {
  //       return browser.driver.getCurrentUrl().then(function(url) {
  //         return /index/.test(url);
  //       });
  //     }, 10000);
  //   }
}