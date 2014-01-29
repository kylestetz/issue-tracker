var mongoose = require('mongoose');

var RepoSchema = new mongoose.Schema({
  title: String,
  url: String,
  issues: [ mongoose.Schema.Types.Mixed ],
  pullRequests: [ mongoose.Schema.Types.Mixed ]
});

var HookSchema = new mongoose.Schema({
  createdAt: Date,
  data: mongoose.Schema.Types.Mixed
});

module.exports.Repo = Repo = mongoose.model('Repo', RepoSchema);
module.exports.Hook = Hook = mongoose.model('Hook', HookSchema);