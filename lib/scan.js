var scan = function(data, predicates) {
	var result = {};
	for (var i in predicates) {
		result[i] = 0;
		for (var j in data) {
			result[i] += predicates[i](data[j]);
		}
	}

	return result;
}

module.exports = scan;
