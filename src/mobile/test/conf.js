exports.config = {
  framework: 'jasmine',
  jasmineNodeOpts: {defaultTimeoutInterval: 50000},
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec.js'],
  uberUsername: process.env.uberUsername,
  uberPassword: process.env.uberPassword
}