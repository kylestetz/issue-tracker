module.exports = function(options) {
  options = options || {};
  var mongoose = options.mongoose || require('mongoose')
  , config = {
    development: {
      'hostname': 'localhost',
      'port': 27017,
      'username': '',
      'password': '',
      'name': '',
      'db': 'issue-tracker'
    }
  };

  module.exports.mongoose = mongoose;
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  mongoose.connection.once('open', function() {
    console.log('MongoDB connection opened');
  });

  var generate_mongo_url = function(obj) {
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db);
    if (obj.username && obj.password) {
      return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    } else {
      return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
  }

  // bootstrap mongoose connection
  var mongo = config.development;
  var mongourl = generate_mongo_url(mongo);

  if (mongoose.connection.readyState == 0) {
    module.exports.db = mongoose.connect(mongourl);
  }
}