'use strict';

let app = require('../../server'),
	should = require('should'),
	mongoose = require('mongoose'),
	Workshop = mongoose.model('Workshop'),
	Instructor = mongoose.model('Instructor'),
	Student = mongoose.model('Student');

let workshop,
	instructorOne,
	instructorTwo,
	studentOne,
	studentTwo;


describe('Workshop Model Unit Tests:', () => {
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
			workshop.save((err) => {
				should.not.exist(err);
				done();
			});
		});

		it('Should not save without a title', (done) => {
			workshop.title = '';
			workshop.save((err) => {
				should.exist(err);
				done();
			});
		});
	});

	describe('Testing retrieval', () => {
		it('Should be able to retrieve a workshop entry', (done) => {
			workshop.save()
			.then(() => { return Workshop.findOne() })
			.then((wkshp) => {
				should.exist(wkshp);
				done();
			})
			.catch((err) => should.not.exist(err));
		});

		it('Should successfully populate the intructors list', (done) => {
			workshop.save()
			.then(() => { return Workshop.findOne({title: 'TAI CHI for Energy Part One'})
							.populate('instructors').exec() })
			.then((wkshp) => {
				(wkshp.instructors[0].fullName).should.equal('Robin Malby');
				done();
			})
			.catch((err) => should.not.exist(err));
		});

		it('Should successfully populate the students list', (done) => {
			workshop.save()
			.then(() => { return Workshop.findOne({title: 'TAI CHI for Energy Part One'})
							.populate('registeredStudents').exec() })
			.then((wkshp) => {
				(wkshp.registeredStudents[1].fullName).should.equal('Velma Doobiescoo');
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
		.catch((err) => { console.log(err) });
	});
});