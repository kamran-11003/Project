import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // Correct import for jwt-decode

const EarningsSummary = () => {
  const [timeframe, setTimeframe] = useState('daily');
  const [summary, setSummary] = useState({ totalEarnings: 0, details: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwtToken'); // Get token from storage
        
        if (!token) {
          setError('No JWT token found');
          return;
        }

        // Decode the token to extract the driver ID
        const decodedToken = jwtDecode(token);
        const driverId = decodedToken.id; // Assuming the driver ID is stored in the token
        console.log(driverId);
        if (!driverId) {
          setError('Driver ID not found in the token');
          return;
        }

        // Make the API request using the driver ID and timeframe
        const response = await axios.get('http://localhost:5000/api/earnings/summary', {
          params: {
            driverId: driverId,  // Pass driverId as query param
            period: timeframe,   // Pass the timeframe as period (daily, weekly, monthly)
          },
          headers: {
            Authorization: `Bearer ${token}`,  // Pass the token in the Authorization header
          },
        });
        console.log(response);

        // Update the state with the data from the response
        setSummary({
          totalEarnings: response.data.totalEarnings,
          details: response.data.data,  // Assign the data array to the details state
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('Error fetching earnings: ' + error.message);
        console.error('Error fetching earnings:', error);
      }
    };

    fetchEarnings();
  }, [timeframe]);

  return (
    <div>
      <h2>Earnings Summary</h2>
      <div>
        <button onClick={() => setTimeframe('daily')} disabled={timeframe === 'daily'}>
          Daily
        </button>
        <button onClick={() => setTimeframe('weekly')} disabled={timeframe === 'weekly'}>
          Weekly
        </button>
        <button onClick={() => setTimeframe('monthly')} disabled={timeframe === 'monthly'}>
          Monthly
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <h3>Total Earnings: ${summary.totalEarnings}</h3>
          <ul>
            {summary.details.length > 0 ? (
              summary.details.map((record) => (
                <li key={record._id}>
                  ${record.amount} earned on {new Date(record.date).toLocaleDateString()}
                </li>
              ))
            ) : (
              <li>No earnings data available for this timeframe.</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default EarningsSummary;
