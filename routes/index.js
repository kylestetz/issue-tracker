var async = require('async');
var model = require('./../model/repo.js');
var Repo = model.Repo;
var Hook = model.Hook;
var config = require('./../config');

var GitHubApi = require("github");
var github = new GitHubApi({
  version: "3.0.0",
  debug: true
});

github.authenticate({
    type: "oauth",
    token: config.githubOAuthToken
});

module.exports = function(app) {

  app.get('/', function(req, res) {
    // get stuff from the db
    return res.render('index.html', {});
  });

  app.post('/webhook', function(req, res) {
    // got something: figure out what repo it came from
    var user = req.body.repository.owner.login;
    var repoName = req.body.repository.name;
    Repos.find({ title: repoName, user: user }, function(err, result) {
      if(err || !result.length) {
        console.log('couldnt find a repo at ' + user + '/' + repoName);
        return res.send('');
      }

      var repo = results[0];
      // is it an issue we just got?
      if(req.body.issue) {
        github.issues.repoIssues({
          user: user,
          repo: repo,
          state: 'open'
        }, function(err, results) {
          if(err) { console.log('error getting updated issues.'); return res.send(''); };
          repo.issues = results;
          repo.markModified('issues');
          repo.save(function(err) {
            console.log('error saving changes to repo.');
            // DONEZO
            return res.send('');
          });
        });
      }
      // or a pull request?
      else if(req.body.pull_request) {
        github.pullRequests.getAll({
          user: user,
          repo: repo,
          state: 'open'
        }, function(err, results) {
          if(err) { console.log('error getting updated pull requests.'); return res.send(''); };
          repo.pullRequests = results;
          repo.markModified('pullRequests');
          repo.save(function(err) {
            console.log('error saving changes to repo.');
            // DONEZO
            return res.send('');
          });
        });
      }
    })
  });

  // NEW REPO
  // ====================================================

  app.post('/new-repo', function(req, res) {
    var user = req.body.repo.split('/')[0];
    var repo = req.body.repo.split('/')[1];

    var newRepo = new Repo({
      title: repo,
      user: user,
      url: 'https://github.com/' + user + '/' + repo
  });

    if(!req.body.repo) {
      return res.send('that repo didnt work');
    }

    github.issues.repoIssues({
      user: user,
      repo: repo,
      state: 'open'
    }, function(err, results) {

      if(err) { return res.json(err); }

      newRepo.issues = results;

      github.pullRequests.getAll({
        user: user,
        repo: repo,
        state: 'open'
      }, function(err, results) {

        if(err) { return res.json(err); }

        newRepo.pullRequests = results;

        newRepo.markModified('issues');
        newRepo.markModified('pullRequests');

        newRepo.save(function(err) {
          if(err) { console.log('couldnt save!!'); res.json(err); }

          // now we make a hook in that repo.
          github.repos.createHook({
            name: 'web',
            user: user,
            repo: repo,
            active: true,
            events: [
              "issues",
              "issue_comment",
              "pull_request",
              "pull_request_review_comment"
            ],
            config: {
              url: config.webhookCallbackUrl,
              content_type: 'json'
            }
          }, function(err, results) {
            if(err) {
              return res.json({
                special_alert: 'saved data, but the webhook didn\'t work',
                err: err
              });
            }
            console.log('set up the hook!');
            res.redirect('/');
          });

        });

      });

    });
  });

}