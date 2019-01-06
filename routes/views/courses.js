var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Init locals
  locals.section = 'courses';
  locals.filters = {
    category: req.params.category,
    courseType: req.url.slice(1),
  };
  locals.data = {
    courses: [],
    categories: [],
  };

  // Load all categories
  view.on('init', function (next) {

    keystone.list('CourseCategory').model.find().sort('name').exec(function (err, results) {

      if (err || !results.length) {
        return next(err);
      }

      locals.data.categories = results;

      // Load the counts for each category
      async.each(locals.data.categories, function (category, next) {

        keystone.list('Course').model.count().where('categories').in([category.id]).exec(function (err, count) {
          category.courseCount = count;
          next(err);
        });

      }, function (err) {
        next(err);
      });
    });
  });

  // Load the current category filter
  view.on('init', function (next) {

    if (req.params.category) {
      keystone.list('CourseCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
        locals.data.category = result;
        next(err);
      });
    } else {
      next();
    }
  });

  // Load the courses
  view.on('init', function (next) {
    var q = keystone.list('Course').paginate({
      page: req.query.page || 1,
      perPage: 10,
      maxPages: 10,
    })
      .where('state', 'published')
      .sort('-publishedDate')
      .populate('author categories');

    if (locals.data.category) {
      q.where('categories').in([locals.data.category]);
    }
    if (locals.filters.courseType) {
      q.where('courseType', locals.filters.courseType);
    }

    q.exec(function (err, results) {
      locals.data.courses = results;
      // console.log(results);
      next(err);
    });
  });

  // Render the view
  view.render('courses');
};
