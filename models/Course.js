var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Course Model
 * ==========
 */

var Course = new keystone.List('Course', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
});

Course.add({
  title: { type: String, required: true },
  price: { type: Types.Money, format: '$0,0.00', formatString: 'en-gb', default: 0, required: true },
  periods: { type: String, index: true, },
  location: { type: String },
  duration: { type: String },
  discount: { type: Types.Number, default: 0 },
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  courseType: { type: Types.Select, options: 'immersive, accelerated, short', default: 'immersive', index: true },
  author: { type: Types.Relationship, ref: 'User', index: true },
  startDate: { type: Types.Date, index: true, dependsOn: { state: 'published' }, default: Date.now },
  endDate: { type: Types.Date, index: true, dependsOn: { state: 'published' }, default: Date.now },
  image: { type: Types.CloudinaryImage },
  description: {
    brief: { type: Types.Html, wysiwyg: true, height: 150 },
    extended: { type: Types.Html, wysiwyg: true, height: 400 },
  },
  takeAways: { type: Types.Html, wysiwyg: true, height: 150 },
  prerequirements: { type: Types.Html, wysiwyg: true, height: 150 },
  categories: { type: Types.Relationship, ref: 'CourseCategory', many: true },
});

Course.schema.virtual('content.full').get(function () {
  return this.content.extended || this.content.brief;
});

Course.schema.virtual('actualPrice').get(function () {
  return this.price * this.discount * 0.01;
});

Course.defaultColumns = 'title|10%, price|10%, state|20%, author|20%, publishedDate|20%';
Course.register();
