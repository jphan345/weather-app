const express = require('express');
const router = express.Router();
const WeatherRecord = require('../models/WeatherRecord');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();


// CREATE
router.post('/', async (req, res) => {
    const { location, dateRange, data } = req.body;
  
    // Validate location
    if (!location || typeof location !== 'string' || location.trim() === '') {
      return res.status(400).json({ error: 'Location is required' });
    }
  
    // Validate date range
    if (
      !dateRange ||
      !dateRange.start ||
      !dateRange.end ||
      new Date(dateRange.start) > new Date(dateRange.end)
    ) {
      return res.status(400).json({ error: 'Invalid date range' });
    }
  
    try {
      // Check if location is real (via OpenWeather Geocoding API)
      const geoRes = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
        params: {
          q: location,
          limit: 1,
          appid: process.env.WEATHER_API_KEY
        }
      });
  
      if (!geoRes.data || geoRes.data.length === 0) {
        return res.status(404).json({ error: 'Location not found' });
      }
  
      // Save
      const record = new WeatherRecord({
        location: geoRes.data[0].name, // Normalized name
        dateRange,
        data
      });
  
      await record.save();
      res.status(201).json(record);
  
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to validate or save record' });
    }
  });

// READ
router.get('/', async (req, res) => {
  try {
    const records = await WeatherRecord.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updated = await WeatherRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await WeatherRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Delete failed' });
  }
});

// Retrieve a specific location and date
router.get('/lookup', async (req, res) => {
    const { location, date } = req.query;
  
    if (!location || !date) {
      return res.status(400).json({ error: 'Both location and date are required' });
    }
  
    try {
      const targetDate = new Date(date);
  
      const record = await WeatherRecord.findOne({
        location: new RegExp(location, 'i'),
        'dateRange.start': { $lte: targetDate },
        'dateRange.end': { $gte: targetDate }
      });
  
      if (!record) {
        return res.status(404).json({ message: 'No weather record found for that location and date' });
      }
  
      res.json(record);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query failed' });
    }
  });

module.exports = router;