'use strict';

let mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	regexes = require('../../regex/regexes');

let StudentSchema = new Schema({
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
	dob: {
		type: Date
	},
	street: String,
	city: String,
	state: String,
	zip: Number,
	certifications: [String],
	paid: {},
	registeredFor: {},
	educationUnits: {},
	workshopsEnrolled: [{ type: Schema.Types.ObjectId, ref: 'Workshop' }],
	classesEnrolled: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
	createdAt: Date,
	updatedAt: Date
});

StudentSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
	var splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

StudentSchema.pre('save', function(next){
  let now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

StudentSchema.set('toJSON', { virtuals: true });

mongoose.model('Student', StudentSchema);