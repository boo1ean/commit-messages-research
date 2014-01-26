var sprintf = require('util').format,
    path = require('path'),
    fs = require('fs'),
    parse = require('parse-link-header'),
    request = require('request');

var host = 'https://api.github.com',
    commitsPath = '/repos/%s/commits?per_page=100',
    sign = '',
    cacheDir = 'cache';

var l = function() {
	//console.log.apply(console, arguments);
};

var normalizeName = function(repo) {
	return repo.replace('/', '-');
};

var cachePath = function(repo) {
	return path.resolve(cacheDir, normalizeName(repo));
};

var hasCache = function(repo) {
	return fs.existsSync(cachePath(repo));
};

var writeCache = function(repo, commits) {
	fs.writeFile(cachePath(repo), JSON.stringify(commits));
};

var getCache = function(repo, cb) {
	fs.readFile(cachePath(repo), function(err, data) {
		cb(JSON.parse(data));
	});
};

var eachCommit = function(repo, cb) {
	if (hasCache(repo)) {
		l('Get data from cache for', repo);
		getCache(repo, function(commits) {
			cb(commits, repo);
		});
	} else {
		l('Get data for github for', repo);
		fetchCommits(repo, function(commits) {
			l('Write cache for', repo);
			writeCache(repo, commits);
			cb(commits, repo);
		});
	}
};

var url = function(repo) {
	return sprintf(host + commitsPath + sign, repo);
}

var fetchCommits = function(repo, cb) {
	var req = {
		url: url(repo),
		headers: { 'User-Agent': 'Commit messages research agent' }
	};

	var commits = [];
	var fetch = function(error, response, body) {
		commits = commits.concat(JSON.parse(body));

		var link = parse(response.headers.link);
		if (link && link.next) {
			req.url = link.next.url;
			request(req, fetch);
		} else {
			cb(commits);
		}
	};

	request(req, fetch);
};

module.exports = function(repos, o) {
	o = o || {};

	if (o.secrets && o.secrets.client_id && o.secrets.client_secret) {
		sign = '&client_id=' + o.secrets.client_secret + '&client_secret=' + o.secrets.client_secret;
	}

	if (!o.handler) {
		throw new Error('Data handler is required (options.handler)');
	}

	for (var i in repos) {
		eachCommit(repos[i], function(commits, repo) {
			if (o.map) {
				commits = commits.map(o.map);
			}

			o.handler(commits, repo);
		});
	}
};
