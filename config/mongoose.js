var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {
	var db = mongoose.connect(config.db);

	require('../app/models/instructor.server.model');
	require('../app/models/student.server.model');
	require('../app/models/workshop.server.model');

	return db;
};