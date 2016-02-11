'use strict';

let app = require('../../server'),
	should = require('should'),
	mongoose = require('mongoose'),
	Workshop = mongoose.model('Workshop'),
	Instructor = mongoose.model('Instructor');

let workshop;
let instructor;

describe('Workshop Model Unit Tests:', () => {
	beforeEach((done) => {
		instructor = new Instructor({
			firstName: 'Robin',
			lastName: 'Malby',
			email: 'robinmtaichi@gmail.com',
			phone: '(925) 381-3097',
			description: 'She is a Tai Chi and Qi Gong instructor of 12 years'
		});
		instructor.save((err) => {
			if (err)
				console.log(err);
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
			});
			workshop.instructors.push(instructor);
			done();
		});
	});

	describe('Testing the save method', () => {
		it('Should be able to save without problems', () => {
			workshop.save((err) => {
				should.not.exist(err);
			});
		});

		it('Should not save without a title', () => {
			workshop.title = '';
			workshop.save((err) => {
				should.exist(err);
			});
		});
	});

	describe('Testing retrieval', () => {
		it('Should be able to retrieve a workshop entry', () => {
			workshop.save();
			Workshop.findOne({}, (err) => {
				should.not.exist(err);
			});
		});

		it('Should successfully populate the intructors list', () => {
			workshop.save((err) => {
				should.not.exist(err);
				Workshop.findOne({title: 'TAI CHI for Energy Part One'})
						.populate('instructors')
						.exec(function(err, wkshp) {
							should.not.exist(err);
							(wkshp.instructors[0].fullName).should.equal('Robin Malby');
						});
			});
		});
	});

	afterEach((done) => {
		Workshop.remove({}, () => {
			Instructor.remove({}, () => {
				done();
			});
		});
	});
});