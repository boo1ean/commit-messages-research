module.exports = function(message) {
	return message[message.indexOf('\n') - 1] === '.';
}
