var keystone = require('keystone');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'course';
  console.log(req.params);
  locals.filters = {
    course: req.params.courseId,
    courseType: req.params.category,
  };
  // locals.data = {
  //   courses: [],
  // };

  // // Load the current post
  // view.on('init', function (next) {

  //   var q = keystone.list('Course').model.findOne({
  //     state: 'published',
  //     slug: locals.filters.course,
  //     courseType: locals.filters.courseType,
  //   }).populate('author categories');

  //   q.exec(function (err, result) {
  //     locals.data.course = result;
  //     next(err);
  //   });

  // });

  // // Load other posts
  // view.on('init', function (next) {

  //   var q = keystone.list('Course').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

  //   q.exec(function (err, results) {
  //     locals.data.courses = results;
  //     next(err);
  //   });

  // });

  // Render the view
  view.render('course');
};
