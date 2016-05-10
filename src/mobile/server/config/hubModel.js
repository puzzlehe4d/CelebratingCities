var db = require('./dbConfig');
db.plugin('registry');
var User = require('./userModel');
var Hub = db.Model.extend({
  tableName: 'hubs',
  users: function() {
    return this.belongsToMany('User', 'id');
  }
});
module.exports = db.model('Hub', Hub);;
