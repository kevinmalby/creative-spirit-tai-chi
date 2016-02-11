'use strict';

let app = require('../../server'),
	should = require('should'),
	Promise = require('bluebird'),
	mongoose = Promise.promisifyAll(require('mongoose')),
	Workshop = mongoose.model('Workshop'),
	Instructor = mongoose.model('Instructor');

let workshop,
	instructor,
	instructorTwo;


describe('Workshop Model Unit Tests:', () => {
	beforeEach((done) => {
		instructor = new Instructor({
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
		instructor.saveAsync()
			.then(() => instructorTwo.saveAsync())
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
					instructors: [instructor, instructorTwo]
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
			workshop.saveAsync()
				.then(() => Workshop.findOneAsync())
				.then(done())
				.catch((err) => should.not.exist(err));
		});

		it('Should successfully populate the intructors list', (done) => {
			workshop.saveAsync()
				.then(() => {
					Workshop.findOne({title: 'TAI CHI for Energy Part One'})
						.populate('instructors')
						.exec(function(err, wkshp) {
							should.not.exist(err);
							(wkshp.instructors[0].fullName).should.equal('Robin Malby');
							done();
						});
				});
		});
	});

	afterEach((done) => {
		Workshop.removeAsync()
			.then(() => { return Instructor.removeAsync() })
			.then(() => { return done() })
			.catch((err) => { console.log(err) });
	});
});