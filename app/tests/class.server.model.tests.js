'use strict';

let app = require('../../server'),
	should = require('should'),
	mongoose = require('mongoose'),
	Course = mongoose.model('Course'),
	Instructor = mongoose.model('Instructor'),
	Student = mongoose.model('Student');

let course,
	instructorOne,
	instructorTwo,
	studentOne,
	studentTwo;


describe('Course Model Unit Tests:', () => {
	beforeEach((done) => {
		instructorOne = new Instructor({
			firstName: 'Robin',
			lastName: 'Malby',
			email: 'robinmtaichi@gmail.com',
			phone: '(555) 555-5555',
			description: 'She is a Tai Chi and Qi Gong instructor of 12 years'
		});
		instructorTwo = new Instructor({
			firstName: 'Steve',
			lastName: 'Madden',
			email: 'smeemee@gmail.com',
			phone: '5555555555',
			description: 'He makes shoes, he\'s really not qualified for this'
		});
		studentOne = new Student({
			firstName: 'Err',
			lastName: 'Buddy',
			email: '3rrbuddy@yahoo.com',
			phone: '(555)555-5555',
			dob: new Date('January 1, 1970'),
			street: '598 Erry Street',
			city: 'Erry City',
			state: 'Ca',
			zip: 66621,
			certifications: ['Clubbin', 'Mobbin']
		});
		studentTwo = new Student({
			firstName: 'Velma',
			lastName: 'Doobiescoo',
			email: 'jinkies563@gmail.com',
			phone: '111-555-5555',
			dob: new Date('December 11, 1982'),
			street: '123 Getouttaherescoob Lane',
			city: 'Weirdsville',
			state: 'Indiana',
			zip: 696969,
			certifications: ['Jinky Master', 'Meddling Around']
		});
		instructorOne.save()
		.then(() => { return instructorTwo.save()})
		.then(() => { return studentOne.save() })
		.then(() => { return studentTwo.save() })
		.then(() => {
			course = new Course({
				title: 'Sun 73',
				subTitle: 'A Tai Chi for Arthritis course',
				shortDescription: 'A 10 week introduction to the Sun 73 style of Tai Chi',
				fullDescription: 'This is the full description',
				startDate: new Date('May 30, 2015'),
				endDate: new Date('July 15, 2015'),
				meetingDays: ['Monday', 'Wednesday'],
				blackoutDates: [new Date('June 7, 2015'), new Date('July 1, 2015')],
				fee: 350,
				paymentDueBy: new Date('May 21, 2015'),
				location: 'Chatauqua Hall',
				street: '16th and Central Avenue',
				city: 'Pacific Grove',
				state: 'Ca',
				zip: 93950,
				instructors: [instructorOne, instructorTwo],
				registeredStudents: [studentOne, studentTwo]
			});
			done();
		})
		.catch((err) => {
			console.log(err);
		});
	});

	describe('Testing the save method', (done) => {
		it('Should be able to save without problems', () => {
			course.save((err) => {
				should.not.exist(err);
				done();
			});
		});

		it('Should not save without a title', (done) => {
			course.title = '';
			course.save((err) => {
				should.exist(err);
				done();
			});
		});

		it('Should not save when start date is after end date', (done) => {
			course.startDate = new Date('July 16, 2015');
			course.save((err) => {
				should.exist(err);
				done();
			});
		});

		it('Should not save when end date is before start date', (done) => {
			course.endDate = new Date('March 3, 2015');
			course.save((err) => {
				should.exist(err);
				done();
			});
		});
	});

	describe('Testing retrieval', () => {
		it('Should be able to retrieve a class entry', (done) => {
			course.save()
			.then(() => { return Course.findOne() })
			.then((crse) => {
				should.exist(crse);
				done();
			})
			.catch((err) => should.not.exist(err));
		});

		it('Should successfully populate the intructors list', (done) => {
			course.save()
			.then(() => { return Course.findOne({title: 'Sun 73'})
							.populate('instructors').exec() })
			.then((crse) => {
				(crse.instructors[0].fullName).should.equal('Robin Malby');
				done();
			})
			.catch((err) => should.not.exist(err));
		});

		it('Should successfully populate the students list', (done) => {
			course.save()
			.then(() => { return Course.findOne({title: 'Sun 73'})
							.populate('registeredStudents').exec() })
			.then((crse) => {
				(crse.registeredStudents[1].fullName).should.equal('Velma Doobiescoo');
				done();
			})
			.catch((err) => should.not.exist(err));
		});
	});

	afterEach((done) => {
		Course.remove()
		.then(() => { return Instructor.remove() })
		.then(() => { return Student.remove() })
		.then(() => done())
		.catch((err) => { console.log(err) });
	});
});