'use strict';

let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let CourseSchema = new Schema({
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
		type: Date,
		validate: [
			function(startDate) {
				if (this.endDate) {
					return this.startDate < this.endDate;
				}
				return true;
			}, 'Start date must be before end date'
		]
	},
	endDate: {
		type: Date,
		validate: [
			function(endDate) {
				if (this.startDate) {
					return this.endDate > this.startDate;
				}
				return true;
			}, 'End date must be after start date'
		]
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
	registeredStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
	createdAt: Date,
	updatedAt: Date
});

CourseSchema.pre('save', function(next){
  let now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

mongoose.model('Course', CourseSchema);