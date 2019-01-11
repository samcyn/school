var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Init locals
  locals.section = 'courseLists';
  locals.courseType= req.params.courseType;
  locals.courses = [];

  // Load the courses
  view.on('init', function (next) {
    
    var q = keystone.list('Course').paginate({
      page: req.query.page || 1,
      perPage: 10,
      maxPages: 10,
    })
      .where('state', 'published');
    
    if (locals.courseType !== 'all') {
      q.where('courseType', locals.courseType).sort('startDate');
    }
    else {
      q.sort('startDate');
    }

    q.exec(function (err, response) {
      locals.courses = response;
      next(err);
    });
  });

  // Render the view
  view.render('courseLists');
};
