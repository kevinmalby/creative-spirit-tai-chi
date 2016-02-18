'use strict';

let mongoose = require('mongoose'),
	schema = mongoose.Schema,
	regexes = require('../../regex/regexes');

let InstructorSchema = new schema({
	firstName: {
		type: String,
		trim: true,
		required: 'First name is required'
	},
	lastName: {
		type: String,
		trim: true,
		required: 'Last name is required'
	},
	email: {
		type: String,
		validate: [
			function(email) {
				return regexes.email.test(email);
			}, 'Not a valid email address'
		]
	},
	phone: {
		type: String,
		validate: [
			function(phoneNumber) {
				return regexes.phone.test(phoneNumber);
			}, 'Not a valid phone number'
		]
	},
	description: String,
	createdAt: Date,
	updatedAt: Date
});

InstructorSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
	var splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

InstructorSchema.pre('save', function(next){
  let now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

InstructorSchema.set('toJSON', { virtuals: true });

mongoose.model('Instructor', InstructorSchema);