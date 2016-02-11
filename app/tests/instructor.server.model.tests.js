'use strict';

let app = require('../../server'),
	should = require('should'),
	mongoose = require('mongoose'),
	Instructor = mongoose.model('Instructor');

let instructor;

describe('Instructor Model Unit Tests:', () => {
	beforeEach((done) => {
		instructor = new Instructor({
			firstName: 'Robin',
			lastName: 'Malby',
			email: 'robinmtaichi@gmail.com',
			phone: '(555) 555-5555',
			description: 'She is a Tai Chi and Qi Gong instructor of 12 years'
		});
		done();
	});

	describe('Testing the save method', () => {
		it('Should be able to save without problems', () => {
			instructor.save((err) => {
				should.not.exist(err);
			});
		});

		it('Should not save without a first name', () => {
			instructor.firstName = '';
			instructor.save((err) => {
				should.exist(err);
			});
		});

		it('Should not save without a last name', () => {
			instructor.lastName = '';
			instructor.save((err) => {
				should.exist(err);
			});
		});

		it('Should not save with an invalid email address', () => {
			instructor.email = 'sdhjaskdha@ dfhjsd soo';
			instructor.save((err) => {
				should.exist(err);
			});
		});

		it('Should not save with an invalid phone number', () => {
			instructor.email = '9222-2094';
			instructor.save((err) => {
				should.exist(err);
			});
		});
	});

	describe('Testing the virtual fields', () => {
		it('Should be able to get the full name', () => {
			(instructor.fullName).should.equal('Robin Malby');
		});

		it('Should be able to set first and last name with full name', () => {
			instructor.fullName = 'George Foreman';
			(instructor.firstName).should.equal('George');
			(instructor.lastName).should.equal('Foreman');
		});
	});

	describe('Testing retrieval', () => {
		it('Should be able to retrieve an instructor entry', () => {
			instructor.save();
			Instructor.findOne({}, (err) => {
				should.not.exist(err);
			});
		});
	});

	afterEach((done) => {
		Instructor.remove({}, () => {
			done();
		});
	});
});