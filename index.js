var repos = require('./repos'),
    crawler = require('./lib/crawler');

var options = {
	handler: function(commits, repo) {
		console.log(commits);
	},
	
	map: function(entry) {
		return entry.commit.message;
	},

	secrets: {
		client_id: 'xxxxxxxxx',
		client_secret: 'yyyyyyyyyy'
	}
};

crawler(repos, options);
