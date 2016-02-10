'use strict';

let mongoose = require('mongoose'),
	schema = mongoose.Schema;

let ClassSchema = new schema({
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
	meetingDays: [String],
	blackoutDates: [Date],
	fee: {
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
	instructors: [{ type: Schema.Types.ObjectId, ref: 'Instructor' }],
	registeredStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
});


mongoose.model('Class', ClassSchema);