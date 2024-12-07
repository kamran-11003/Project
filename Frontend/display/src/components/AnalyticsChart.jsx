import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import styled from 'styled-components';

const AnalyticsChart = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activeUsersCount, setActiveUsersCount] = useState(0); // State for active users count
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch analytics data from the backend
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analytic/analytics-data');
        const data = await response.json();
        if (data.success) {
          setAnalyticsData(data.analytics);
        } else {
          setError('Failed to load analytics data.');
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('An error occurred while fetching the analytics data.');
      }
    };

    // Fetch active users count
    const fetchActiveUsersCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/activeuser/active-users');
        const data = await response.json();
        if (data.success) {
          setActiveUsersCount(data.activeUsersCount); // Set the active users count
        } else {
          setError('Failed to load active users data.');
        }
      } catch (error) {
        console.error('Error fetching active users:', error);
        setError('An error occurred while fetching active users data.');
      }
    };

    // Call both fetch functions
    const fetchData = async () => {
      await Promise.all([fetchAnalyticsData(), fetchActiveUsersCount()]);
      setLoading(false); // Set loading to false once both requests are finished
    };

    fetchData();
  }, []); // Empty dependency array to run this only on mount

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there was an issue fetching data
  }

  // Data for Total Revenue Chart
  const totalRevenueChartData = {
    labels: ['Total Revenue'],
    datasets: [
      {
        label: 'Total Revenue',
        data: [analyticsData.totalRevenue],
        backgroundColor: ['rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Data for Completed Rides Chart
  const completedRidesChartData = {
    labels: ['Completed Rides'],
    datasets: [
      {
        label: 'Completed Rides',
        data: [analyticsData.completedRides],
        backgroundColor: ['rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Data for Active Users Count Chart
  const activeUsersChartData = {
    labels: ['Active Users'],
    datasets: [
      {
        label: 'Active Users Count',
        data: [activeUsersCount],
        backgroundColor: ['rgba(255, 159, 64, 0.6)'],
        borderColor: ['rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Chart Options (to make the chart smaller and fit in the page)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Ensures the chart can resize freely
    plugins: {
      legend: {
        position: 'top', // Legend at the top of the chart
      },
    },
  };

  return (
    <ChartsContainer>
      <h2>Analytics</h2>

      <ChartWrapper>
        <ChartContainer>
          <h3>Total Revenue</h3>
          <Bar 
            data={totalRevenueChartData} 
            options={chartOptions} 
            height={400} 
            width={300} 
          />
        </ChartContainer>

        <ChartContainer>
          <h3>Completed Rides</h3>
          <Bar 
            data={completedRidesChartData} 
            options={chartOptions} 
            height={400} 
            width={300} 
          />
        </ChartContainer>

        <ChartContainer>
          <h3>Active Users</h3>
          <Bar 
            data={activeUsersChartData} 
            options={chartOptions} 
            height={400} 
            width={300} 
          />
        </ChartContainer>
      </ChartWrapper>
    </ChartsContainer>
  );
};

export default AnalyticsChart;

// Styled Components
const ChartsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ChartWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  max-width: 1000px; /* Limit the total width of the charts */
`;

const ChartContainer = styled.div`
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9f9f9;
`;
