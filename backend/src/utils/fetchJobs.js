import axios from "axios";

// ✅ Get job details from JSearch API
const fetchJobDetailsFromJSearch = async (jobId, location) => {
  try {
    const options = {
      method: 'GET',
      url: `https://jsearch.p.rapidapi.com/job-details`,
      params: {
        job_id: jobId,
        country: location
      },
      headers: {
        'x-rapidapi-key': 'd80f30eef3msh860cae1c025fd5ep158dabjsne2a0b2ee9f01',
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      },
    };

    const response = await axios.request(options);
    return response.data.data;
  } catch (error) {
    console.error('❌ JSearch job details error:', error);
    return null;
  }
};

// ✅ Main function to fetch jobs using JSearch API
export const fetchJobsFromAPI = async (keyword, location) => {
  try {
    const options = {
      method: 'GET',
      url: `https://jsearch.p.rapidapi.com/search`,
      params: {
        query: `${keyword} jobs in ${location}`,
        page: 1,
        num_pages: 1,
        country: location,
        date_posted: 'all'
      },
      headers: {
        'x-rapidapi-key': 'd80f30eef3msh860cae1c025fd5ep158dabjsne2a0b2ee9f01',
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      },
    };

    const response = await axios.request(options);
    const jobs = response.data.data || [];
    console.log(jobs, "Fetched Jobs");

    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        const details = await fetchJobDetailsFromJSearch(job.job_id, location);
        return { ...job, details };
      })
    );

    return jobsWithDetails;

  } catch (error) {
    console.warn(`❌ Failed to fetch jobs for '${keyword}' in '${location}':`, error.message);
    return null;
  }
};
