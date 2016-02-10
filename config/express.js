'use strict';

let config = require('./config'),
	express = require('express'),
	morgan = require('morgan');

module.exports = function(db) {
	// Initialize the app
	let app = express();

	// Use morgan logger if in the dev environment
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	}

	// Set the port for the application
	app.set('port', (process.env.PORT || 5000));

	// views is directory for all template files
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');

	// Pass the express app to the routes file
	//require('../app/routes')(app);

	return app;
};