var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Order Model
 * =============
 */

var Order = new keystone.List('Order', {
  nocreate: true,
  noedit: true,
});

Order.add({ 
  courseId: { type: String, required: true },
  courseTitle: { type: String, required: true },
  courseActualPrice: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
  balance: { type: Number, required: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  customerNumber: { type: String, required: true },
  customerAddress: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  modeOfPayment: {type: String, required: true },
  courseCoupon: { type: String },
  createdAt: { type: Date, default: Date.now },
});

Order.schema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

Order.schema.post('save', function () {
  if (this.wasNew) {
    this.sendNotificationEmail();
  }
});

Order.schema.methods.sendNotificationEmail = function (callback) {
  if (typeof callback !== 'function') {
    callback = function (err) {
      if (err) {
        console.error('There was an error sending the notification email:', err);
      }
    };
  }

  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    console.log('Unable to send email - no mailgun credentials provided');
    return callback(new Error('could not find mailgun credentials'));
  }

  var enquiry = this;
  var brand = keystone.get('brand');

  keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
    if (err) return callback(err);
    new keystone.Email({
      templateName: 'enquiry-notification',
      transport: 'mailgun',
    }).send({
      to: 'jayi4007@gmail.com',
      from: {
        name: 'univelcity',
        email: 'order@univelcity.com',
      },
      subject: 'New Course Order for univelcity',
      enquiry: enquiry,
      brand: brand,
      layout: false,
    }, callback);
  });
};

Order.defaultSort = '-createdAt';
Order.defaultColumns = 'courseId, courseTitle, courseActualPrice, amountPaid, balance, customerEmail, customerName, customerNumber, customerAddress, paymentType, courseCoupon';
Order.register();
