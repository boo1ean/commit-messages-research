var repos = require('./repos'),
    crawler = require('./lib/crawler');

var options = {
	handler: function(commits, repo) {
		console.log(repo, commits.length);
	},
	
	map: function(entry) {
		return entry.commit.message;
	}
};

crawler(repos, options);
