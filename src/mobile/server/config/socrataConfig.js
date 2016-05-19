var Socrata = require('node-socrata');

var config = {
  // find a hostDomain from the listSource method
  hostDomain: 'http://data.baltimorecity.gov/resource/wsfq-mvij.json',
  // Create account and register app https://opendata.socrata.com
  XAppToken: process.env.SOCRATA_APP_TOKEN || '0Uro7CYrUZh7INFHiHmn2EzfV'
};

var soda = new Socrata(config);

module.exports = soda;