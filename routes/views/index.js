var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {
		course: null,
		courses: [],
		testimonials: [],
	};


	// Load all courses
	view.on('init', function (next) {
		var q = keystone.list('Course').paginate({
			page: 1,
			perPage: 10,
			maxPages: 10,
		}).where('state', 'published').sort('startDate');

		q.exec(function (err, response) {
			locals.data.courses = response;
			locals.data.course = response.results[0];
			// console.log(response.results);
			next(err);
		});
	});

	view.on('init', function(next){
		var t = keystone.list('Testimonial').paginate({
			page: 1,
			perPage: 4,
			maxPages: 10,
		}).where('state', 'published');

		t.exec(function(err, response){
			locals.data.testimonials = response;
			console.log(response.results);
		});
	});

	// Render the view
	view.render('index');
};
