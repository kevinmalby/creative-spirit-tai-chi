'use strict';

let app = require('../../server'),
	should = require('should'),
	mongoose = require('mongoose'),
	Student = mongoose.model('Student');

let student;

describe('Student Model Unit Tests:', () => {
	beforeEach((done) => {
		student = new Student({
			firstName: 'Kevin',
			lastName: 'Malby',
			email: 'kevin.malby@gmail.com',
			phone: '805 637-7260',
			dob: new Date('November 22, 1989'),
			street: '5304 Paso Del Rio Way',
			city: 'Concord',
			state: 'Ca',
			zip: 94521,
			certifications: ['Being a badass', 'Being a liar'],
			paid: [{ 'Sun 73': true }],
			registeredFor: [{ 'Sun 73': 'Recertification' }],
			educationUnits: [{ 'Sun 73': false }]
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
		Student.remove({}, () => {
			done();
		});
	});
});