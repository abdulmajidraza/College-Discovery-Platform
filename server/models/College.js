const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: String, required: true }
});

const ReviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true }
}, { timestamps: true });

const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  fees: { type: Number, required: true },
  rating: { type: Number, required: true },
  overview: { type: String, required: true },
  placements: { type: String, required: true },
  averagePackage: { type: Number, required: true },
  highestPackage: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  courses: [CourseSchema],
  reviews: [ReviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('College', CollegeSchema);
