import React, { useState } from 'react';
import axios from 'axios';

const JobSearchByLocation = () => {
  const [keyword, setKeyword] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocationId = async (keyword) => {
    try {
      const options = {
        method: 'GET',
        url: 'https://linkedin-data-api.p.rapidapi.com/search-locations',
        params: { keyword },
        headers: {
          'x-rapidapi-key': '32f7ca50a2msh55d8fe00b549f00p1aa53cjsn131c08cc91e8',
          'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com',
        },
      };

      const response = await axios.request(options);
      if (response.data.length > 0) {
        return response.data[0].locationId;
      } else {
        throw new Error('Location not found.');
      }
    } catch (err) {
      throw err;
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    setJobs([]);

    try {
      const locationId = await getLocationId(keyword);

      const options = {
        method: 'GET',
        url: 'https://linkedin-data-api.p.rapidapi.com/search-jobs',
        params: {
          keywords: 'golang',
          locationId,
          datePosted: 'anyTime',
          sort: 'mostRelevant',
        },
        headers: {
          'x-rapidapi-key': '32f7ca50a2msh55d8fe00b549f00p1aa53cjsn131c08cc91e8',
          'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com',
        },
      };

      const response = await axios.request(options);
      setJobs(response.data.jobs || []);
    } catch (err) {
      setError('Failed to fetch jobs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Search Golang Jobs by Location</h2>
      <input
        type="text"
        placeholder="Enter location (e.g. Pakistan, Berlin)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <button onClick={fetchJobs} style={{ padding: '8px 16px' }}>
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ marginTop: '20px' }}>
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <strong>{job.title}</strong> — {job.company}
              <br />
              <a href={job.link} target="_blank" rel="noopener noreferrer">
                View Job
              </a>
            </li>
          ))
        ) : (
          !loading && <p>No jobs found.</p>
        )}
      </ul>
    </div>
  );
};

export default JobSearchByLocation;
