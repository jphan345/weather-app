const express = require('express');
const router = express.Router();
const WeatherRecord = require('../models/WeatherRecord');
const { Parser } = require('json2csv');

router.get('/', async (req, res) => {
    const format = req.query.format || 'json';
  
    try {
      const records = await WeatherRecord.find();
  
      if (format === 'csv') {
        // Transform records into flat structure for csv
        const transformed = records.map(record => ({
          location: record.location,
          start: record.dateRange?.start?.toISOString().split('T')[0],
          end: record.dateRange?.end?.toISOString().split('T')[0],
          temp: record.data?.main?.temp,
          description: record.data?.weather?.[0]?.description
        }));
  
        const parser = new Parser({ fields: ['location', 'start', 'end', 'temp', 'description'] });
        const csv = parser.parse(transformed);
  
        res.setHeader('Content-disposition', 'attachment; filename=weather.csv');
        res.set('Content-Type', 'text/csv');
        return res.status(200).send(csv);
      }
  
      // Default to JSON
      res.json(records);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Export failed' });
    }
  });

module.exports = router;