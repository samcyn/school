var keystone = require('keystone');
var Types = keystone.Field.Types;


/**
 * Testimonial Model
 * ==================
 */

var Testimonial = new keystone.List('Testimonial', {
  map: { name: 'name' },
  autokey: { from: 'name', path: 'key', unique: true },
});

Testimonial.add({
  name: { type: String, required: true, },
  message: {
    brief: { type: Types.Html, wysiwyg: true, height: 150 },
    extended: { type: Types.Html, wysiwyg: true, height: 400 },
  },
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  image: { type: Types.CloudinaryImage },
});


Testimonial.register();
