var keystone = require('keystone');
var Order = keystone.list('Order');
var stripe = require('stripe')('sk_test_fMfJDeU0xvgOTprqjxjMjblv');



exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'payments';

  locals.data = {
    courseId: req.params.courseId,
    course: null,
  };

  const {
    stripeToken,
    stripeTokenType, 
    name,
    email,
    number,
    address,
    option,
    coupon,
  } = req.body;

  console.log(req.body);

  // Load the current course
  view.on('init', function (next) {
    var q = keystone.list('Course').model.findOne({
      state: 'published',
      slug: locals.data.courseId,
    });

    q.exec().then(function (course) {
    
      locals.data.course = course;
      
      const amount = course.actualPrice;

      // Create a new customer and then a new charge for that customer:
      return stripe.customers.create({
        email,
      })
      .then(function (customer) {
        return stripe.customers.createSource(customer.id, {
          source: stripeToken,
        });
      })
      .then(function (source) {
        return stripe.charges.create({
          amount: amount,
          currency: 'usd',
          customer: source.customer,
        });
      })
      .then(function (charge) {
        // New charge created on a new customer
        
        var newOrder = new Order.model({
          courseId: course.slug,
          courseTitle: course.title,
          courseActualPrice: course.actualPrice,
          amountPaid: charge.amount,
          balance: course.actualPrice - charge.amount,
          customerEmail: email,
          customerName: name,
          customerNumber: number,
          customerAddress: address,
          paymentStatus: option,
          modeOfPayment: stripeTokenType,
          courseCoupon: coupon,
        });

        return newOrder.save()
      })
      .then(function(data){
        locals.data.course = data;
        next();
      });
    })
    .catch(function (err) {
      // console.log("ERROR..", err);
      next(err);
    });
  });

  // Render the view
  view.render('charges');
};

