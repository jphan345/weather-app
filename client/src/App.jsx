import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const API_BASE = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    location: '',
    start: '',
    end: '',
    temp: '',
    description: ''
  });
  const [editId, setEditId] = useState(null);
  const [lookup, setLookup] = useState({ location: '', date: '' });
  const [lookupResult, setLookupResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load all records
  const fetchRecords = async () => {
    const res = await axios.get(`${API_BASE}/weather`);
    setRecords(res.data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.location || !form.start || !form.end || !form.temp || !form.description) {
      setErrorMessage('All fields are required.');
      return;
    }
  
    if (new Date(form.start) > new Date(form.end)) {
      setErrorMessage('Start date must be before end date.');
      return;
    }
  
    try {
      const data = {
        location: form.location,
        dateRange: {
          start: form.start,
          end: form.end
        },
        data: {
          main: { temp: parseFloat(form.temp) },
          weather: [{ description: form.description }]
        }
      };
  
      if (editId) {
        await axios.put(`${API_BASE}/weather/${editId}`, data);
      } else {
        await axios.post(`${API_BASE}/weather`, data);
      }
  
      setForm({ location: '', start: '', end: '', temp: '', description: '' });
      setEditId(null);
      setErrorMessage('');
      fetchRecords();
  
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to save record.');
    }
  };

  const handleEdit = (record) => {
    setForm({
      location: record.location,
      start: record.dateRange.start.slice(0, 10),
      end: record.dateRange.end.slice(0, 10),
      temp: record.data.temp,
      description: record.description
    });
    setEditId(record._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE}/weather/${id}`);
    fetchRecords();
  };

  const handleExport = (format) => {
    window.open(`${API_BASE}/export?format=${format}`, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-50">
      <div className="w-full max-w-3xl p-6 bg-black-50">
        <Link to="/live" className="text-blue-600 underline">Go to Frontend Page</Link>
        <div>
          <h2>Name: Johnny Phan</h2>
          <p>
            PM Accelerator:
            The Product Manager Accelerator Program is designed to support PM professionals through every stage of their careers. 
            From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped 
            over hundreds of students fulfill their career aspirations.

            Our Product Manager Accelerator community are ambitious and committed. Through our program they have learnt, honed 
            and developed new PM and leadership skills, giving them a strong foundation for their future endeavors.
          </p>
        </div>
        <h1 className="text-2xl font-bold mb-4">Weather Records</h1>
        {errorMessage && (
          <div className="mb-4 p-2 text-red-600 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2 mb-4">
          {['location', 'start', 'end', 'temp', 'description'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              value={form[field]}
              onChange={handleChange}
              className="border p-2"
              type={field === 'start' || field === 'end' ? 'date' : 'text'}
            />
          ))}
          <button type="submit" className="col-span-2 bg-blue-600 text-white p-2">
            {editId ? 'Update' : 'Create'} Record
          </button>
        </form>
        <h2 className="text-xl font-bold mt-6 mb-2">Find Weather by Location + Date</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await axios.get(`${API_BASE}/weather/lookup`, {
                  params: {
                    location: lookup.location,
                    date: lookup.date
                  }
                });
                setLookupResult(res.data);
              } catch (err) {
                setLookupResult({ error: err.response?.data?.message || 'Lookup failed' });
              }
            }}
            className="grid grid-cols-2 gap-2 mb-4"
          >
            <input
              name="location"
              value={lookup.location}
              onChange={(e) => setLookup({ ...lookup, location: e.target.value })}
              placeholder="Location"
              className="border p-2"
            />
            <input
              name="date"
              type="date"
              value={lookup.date}
              onChange={(e) => setLookup({ ...lookup, date: e.target.value })}
              className="border p-2"
            />
            <button type="submit" className="col-span-2 bg-green-600 text-white p-2">
              Lookup Weather
            </button>
          </form>
          {lookupResult && (
            <div className="border p-3 bg-black-100">
              {lookupResult.error ? (
                <p className="text-red-600">{lookupResult.error}</p>
              ) : (
                <>
                  <h3 className="font-bold">{lookupResult.location}</h3>
                  <p>Date Range: {lookupResult.dateRange.start.slice(0, 10)} → {lookupResult.dateRange.end.slice(0, 10)}</p>
                  <p>Temp: {lookupResult.data.temp}°F — {lookupResult.data.description}</p>
                </>
              )}
            </div>
          )}
        <div className="mt-4 mb-4">
          <strong>Export:</strong>{' '}
          {['json', 'csv'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleExport(fmt)}
              className="bg-gray-300 hover:bg-gray-400 px-2 py-1 m-1"
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>

        <ul>
          {records.map((r) => (
            <li key={r._id} className="border p-3 mb-2">
              <div><strong>{r.location}</strong> ({r.dateRange.start.slice(0,10)} → {r.dateRange.end.slice(0,10)})</div>
              <div>Temp: {r.data.temp}°F — {r.data.description}</div>
              <button onClick={() => handleEdit(r)} className="mr-2 text-blue-600">Edit</button>
              <button onClick={() => handleDelete(r._id)} className="text-red-600">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;