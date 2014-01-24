var exec = require('child_process').exec,
    sprintf = require('util').format,
    each = require('async').each,
    command, remote_name, iterator, done, has_remote, then, log, process_log, process_data;

log = console.log.bind(console);

process_data = function(commits) {
	log(commits);
};

remote_name = function(repo) {
	return repo.replace('/', '---');
};

command = {
	remote_show: function(remote, cb) {
		return exec(sprintf('git remote show %s', remote_name(remote)), cb);
	},

	remote_add: function(name, cb) {
		return exec(sprintf('git remote add %s https://github.com/%s.git', remote_name(name), name), cb);
	}, 

	fetch: function(repo, cb) {
		exec(sprintf('git fetch %s', remote_name(repo)), cb);
	},

	log: function(name, cb) {
		return exec(sprintf('git log %s/master --format=%s', remote_name(name)), cb);
	}
};

has_remote = function(repo, yes, no) {
	command.remote_show(repo, function(err, o, e) {
		if (err) {
			no();
		} else {
			yes();
		}
	});
};

process_log = function(repo) {
	command.log(repo, function(err, o, e) {
		process_data(o.split('\n').filter(Boolean), repo);
	});
};

iterator = function(repo) {
	log('Crawl for', repo, 'started');
	has_remote(repo, function() {
		log('Remote already added', repo);
		process_log(repo);
	}, function() {
		log('Adding remote', repo);
		command.remote_add(repo, function(err, o, e) {
			log('Remote added', repo);
			command.fetch(repo, function(err) {
				log('Remote fetched', repo);
				process_log(repo);
			});
		});
	});
};

module.exports = function(repos, handler) {
	if (handler) {
		process_data = handler;
	}

	each(repos, iterator, done);
};
