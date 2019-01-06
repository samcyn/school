var keystone = require('keystone');

/**
 * CourseCategory Model
 * ==================
 */

var CourseCategory = new keystone.List('CourseCategory', {
  autokey: { from: 'name', path: 'key', unique: true },
});

CourseCategory.add({
  name: { type: String, required: true },
});

CourseCategory.relationship({ ref: 'Course', path: 'courses', refPath: 'categories' });

CourseCategory.register();
