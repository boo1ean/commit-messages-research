var repos = require('./repos'),
    crawler = require('./lib/crawler');

crawler(repos, function(data, repo) {
	console.log(repo, data.length);
});
