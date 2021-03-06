var keystone = require('keystone');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'course';
  locals.filters = {
    courseId: req.params.courseId,
    courseType: req.params.courseType,
  };
  locals.data = {
    course: [],
  };

  // Load the current course
  view.on('init', function (next) {

    var q = keystone.list('Course').model.findOne({
      state: 'published',
      slug: locals.filters.courseId,
      courseType: locals.filters.courseType,
    });

    q.exec(function (err, response) {
      locals.data.course = response;
      console.log("BIG...", response);
      next(err);
    });

  });

 

  // Render the view
  view.render('course');
};
