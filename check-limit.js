var secrets = require('./secrets'),
    request = require('request');

var url = 'https://api.github.com/rate_limit?client_id=' + secrets.client_id + '&client_secret=' + secrets.client_secret;

var req = {
	url: url,
	headers: { 'User-Agent': 'Commit messages research agent' }
};

request(req, function(error, response, body) {
	console.log(body);
});
