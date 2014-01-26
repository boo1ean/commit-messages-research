var repos = require('./repos'),
    crawler = require('./lib/crawler'),
    predicates = require('./lib/predicates'),
    scan = require('./lib/scan');

var options = {
	handler: function(commits, repo) {
		var result = scan(commits, predicates);
		console.log(repo, commits.length);
		console.log(result);
	},
	
	map: function(entry) {
		return entry.commit ? entry.commit.message : '';
	},

	secrets: {
		client_id: 'xxxxxx',
		client_secret: 'yyyyy'
	}
};

crawler(repos, options);
