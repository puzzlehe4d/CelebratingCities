var db = require('./dbConfig');
db.plugin('registry')
var Hub = require('./hubModel');
var User = db.Model.extend({
  tableName: 'users',
  hubs: function() {
    return this.belongsToMany('Hub', 'id');
  }
});
 

module.exports = db.model('User', User);;
