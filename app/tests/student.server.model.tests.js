'use strict';

let app = require('../../server'),
	should = require('should'),
	mongoose = require('mongoose'),
	Student = mongoose.model('Student'),
	Workshop = mongoose.model('Workshop'),
	Instructor = mongoose.model('Instructor');

let student,
	instructor,
	workshop;

describe('Student Model Unit Tests:', () => {
	beforeEach((done) => {
		instructor = new Instructor({
			firstName: 'Robin',
			lastName: 'Malby',
			email: 'robinmtaichi@gmail.com',
			phone: '(555) 555-5555',
			description: 'She is a Tai Chi and Qi Gong instructor of 12 years'
		});
		student = new Student({
			firstName: 'Kevin',
			lastName: 'Malby',
			email: 'kevin.malby@gmail.com',
			phone: '555 555-5555',
			dob: new Date('November 22, 1989'),
			street: '123 Fake Street',
			city: 'Concord',
			state: 'Ca',
			zip: 94520,
			certifications: ['Being a badass', 'Being a liar']
		});
		workshop = new Workshop({
			title: 'TAI CHI for Energy Part One',
			subTitle: 'A 2-Day Instructor Certification workshop approved for Continuing Education Units',
			shortDescription: 'Sun and Chen style Tai Chi combined in this Tai Chi for Health Program. Tai Chi is a safe and effective form of exercise for almost anyone.',
			fullDescription: 'This is the full description',
			startDate: new Date('February 7, 2015'),
			endDate: new Date('February 8, 2015'),
			fee: 255,
			recertFee: 105,
			paymentDueBy: new Date('January 26, 2015'),
			location: 'Chatauqua Hall',
			street: '16th and Central Avenue',
			city: 'Pacific Grove',
			state: 'Ca',
			zip: 93950,
			instructors: [instructor],
			registeredStudents: []
		});

		// Add the data for the dictionary-like fields
		let tmp = {};
		tmp[workshop.title] = true;
		student.paid = tmp;

		tmp = {};
		tmp[workshop.title] = 'Recertification';
		student.registeredFor = tmp;

		tmp = {};
		tmp[workshop.title] = false;
		student.educationUnits = tmp;

		// Establish the references for the foriegn-key-like fields
		student.workshopsEnrolled = [workshop];

		instructor.save()
		.then(() => {
			workshop.save();
			done();
		})
		.catch((err) => console.log(err));
	});

	describe('Testing the save method', () => {
		it('Should be able to save without problems', (done) => {
			student.save((err) => {
				should.not.exist(err);
				done();
			});
		});

		it('Should not save without a first name', (done) => {
			student.firstName = '';
			student.save((err) => {
				should.exist(err);
				done();
			});
		});

		it('Should not save without a last name', (done) => {
			student.lastName = '';
			student.save((err) => {
				should.exist(err);
				done();
			});
		});

		it('Should not save with an invalid email address', (done) => {
			student.email = 'sdhjaskdha';
			student.save((err) => {
				should.exist(err);
				done();
			});
		});

		it('Should not save with an invalid phone number', (done) => {
			student.email = '9222-2094';
			student.save((err) => {
				should.exist(err);
				done();
			});
		});
	});

	describe('Testing the virtual fields', () => {
		it('Should be able to get the full name', (done) => {
			(student.fullName).should.equal('Kevin Malby');
			done();
		});

		it('Should be able to set first and last name with full name', (done) => {
			student.fullName = 'George Foreman';
			(student.firstName).should.equal('George');
			(student.lastName).should.equal('Foreman');
			done();
		});
	});

	describe('Testing retrieval', () => {
		it('Should be able to retrieve a student entry', (done) => {
			student.save()
			.then(() => { return Student.findOne() })
			.then((stdnt) => {
				should.exist(stdnt);
				done();
			})
			.catch((err) => should.not.exist(err));
		});

		it('Should be able retrieve the workshop for which it\'s registered', (done) => {
			Workshop.findOne({title: Object.keys(student.paid)[0]}, (err, data) => {
				should.not.exist(err);
				should.exist(data);
				done();
			});
		});

		it('Should successfully populate the workshops list', (done) => {
			student.save()
			.then(() => { return Student.findOne({firstName: 'Kevin'})
							.populate('workshopsEnrolled').exec() })
			.then((stdnt) => {
				(stdnt.workshopsEnrolled[0].title).should
					.equal('TAI CHI for Energy Part One');
				done();
			})
			.catch((err) => should.not.exist(err));
		});
	});

	afterEach((done) => {
		Workshop.remove()
		.then(() => { return Instructor.remove() })
		.then(() => { return Student.remove() })
		.then(() => done())
		.catch((err) => should.not.exist(err));
	});
});