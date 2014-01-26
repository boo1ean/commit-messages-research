var verbs = require('./verbs');
module.exports = function(message) {
	return verbs.indexOf(message.substring(0, message.indexOf(' ')).toLowerCase()) != -1;
};
