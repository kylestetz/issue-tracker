var async = require('async');

var GitHubApi = require("github");
var github = new GitHubApi({
  version: "3.0.0"
  // debug: true
});

github.authenticate({
    type: "oauth",
    token: "1f43c2776e74d5844cb54c1ae5f78d1e33b44559"
});

exports.index = function(req, res){
  async.series({
    aposPullRequests: getAposPullRequests,
    aposIssues: getAposIssues,
    snippetPullRequests: getSnippetPullRequests,
    snippetIssues: getSnippetIssues
  }, function(err, results) {
    if(err) {
      return res.json(err);
    }
    var data = {
      repos: [
        {
          title: 'Apostrophe',
          url: 'https://github.com/punkave/apostrophe',
          pullRequests: results.aposPullRequests,
          issues: results.aposIssues
        },
        {
          title: 'Apostrophe-Snippets',
          url: 'https://github.com/punkave/apostrophe-snippets',
          pullRequests: results.snippetPullRequests,
          issues: results.snippetIssues
        }
      ]
    }
    return res.render('index.html', data);
  });
};

function getAposPullRequests(callback) {
  github.pullRequests.getAll({
    user: 'punkave',
    repo: 'apostrophe',
    state: 'open'
  }, function(err, results) {
    callback(err, results);
  });
}

function getAposIssues(callback) {
  github.issues.repoIssues({
    user: 'punkave',
    repo: 'apostrophe',
    state: 'open'
  }, function(err, results) {
    callback(err, results);
  });
}

function getSnippetPullRequests(callback) {
  github.pullRequests.getAll({
    user: 'punkave',
    repo: 'apostrophe-snippets',
    state: 'open'
  }, function(err, results) {
    callback(err, results);
  });
}

function getSnippetIssues(callback) {
  github.issues.repoIssues({
    user: 'punkave',
    repo: 'apostrophe-snippets',
    state: 'open'
  }, function(err, results) {
    callback(err, results);
  });
}