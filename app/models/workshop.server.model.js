'use strict';

let mongoose = require('mongoose'),
	schema = mongoose.Schema;

let WorkshopSchema = new schema({
	title: {
		type: String,
		required: 'Title is required'
	},
	subTitle: {
		type: String,
	},
	shortDescription: String,
	fullDescription: String,
	startDate: {
		type: Date
	},
	endDate: {
		type: Date
	},
	fee: {
		type: Number
	},
	recertFee: {
		type: Number
	},
	paymentDueBy: {
		type: Date
	},
	location: String,
	street: String,
	city: String,
	state: String,
	zip: Number,
	instructors: { type: schema.Types.ObjectId, ref: 'Instructor' },
	registeredStudents: [{ type: schema.Types.ObjectId, ref: 'Student' }]
});


mongoose.model('Workshop', WorkshopSchema);