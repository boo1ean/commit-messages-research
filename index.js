var repos = require('./repos'),
    crawler = require('./lib/crawler'),
    predicates = require('./lib/predicates'),
    scan = require('./lib/scan'),
	secrets = require('./secrets');

var options = {
	handler: function(commits, repo) {
		var result = scan(commits, predicates);

		var sum = 0;
		for (var i in commits) {
			sum += commits[i].length;
		}

		result['Average commit message length'] = Math.floor(sum / commits.length);
		result['Github repository'] = repo;
		result['Total commits number'] = commits.length
		console.log(result);
	},
	
	map: function(entry) {
		return entry.commit ? entry.commit.message : '';
	},

	filter: function(message) {
		return Boolean(message)
		&& message.slice(0, 12) != 'Merge branch'
		&& message.slice(0, 18) != 'Merge pull request';
	},

	secrets: secrets
};

crawler(repos, options);
