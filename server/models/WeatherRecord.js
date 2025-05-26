const mongoose = require('mongoose');

const WeatherRecordSchema = new mongoose.Schema({
  location: String,
  dateRange: {
    start: Date,
    end: Date
  },
  data: Object
}, {
  timestamps: true
});

module.exports = mongoose.model('WeatherRecord', WeatherRecordSchema);