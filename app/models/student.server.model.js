'use strict';

let mongoose = require('mongoose'),
	schema = mongoose.Schema,
	phoneUtil = require('google-libphonenumber').phoneUtil;

let StudentSchema = new schema({
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
				let re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
				return re.test(email);
			}, 'Not a valid email address'
		]
	},
	phone: {
		type: String,
		validate: [
			function(phoneNumber) {
				return phoneUtil.isValidPhoneNumber(phoneNumber, 'US');
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
	paid: [Schema.Types.Mixed],
	registeredFor: [Schema.Types.Mixed],
	educationUnits: [Schema.Types.Mixed],
	workshopsEnrolled: [{ type: Schema.Types.ObjectId, ref: 'Workshop' }],
	classesEnrolled: [{ type: Schema.Types.ObjectId, ref: 'Class' }]
});

StudentSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
	var splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

StudentSchema.set('toJSON', { virtuals: true });

mongoose.model('Student', StudentSchema);