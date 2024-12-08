import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';
import { DollarSign, Calendar, Loader } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f7fafc;
`;

const SummaryWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background-color: ${props => props.active ? '#a8d619' : '#c1f11d'};
  color: #1a1c18;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: ${props => props.active ? '#95bd16' : '#b1df1b'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: #e0e7c7;
    color: #8c9183;
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }
`;

const TotalEarnings = styled.h3`
  text-align: center;
  color: #2d3748;
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const EarningsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const EarningsItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EarningsSummary = () => {
  const [timeframe, setTimeframe] = useState('daily');
  const [summary, setSummary] = useState({ totalEarnings: 0, details: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        
        if (!token) {
          setError('No JWT token found');
          return;
        }

        const decodedToken = jwtDecode(token);
        const driverId = decodedToken.id;
        
        if (!driverId) {
          setError('Driver ID not found in the token');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/earnings/summary', {
          params: {
            driverId: driverId,
            period: timeframe,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSummary({
          totalEarnings: response.data.totalEarnings,
          details: response.data.data,
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
    <Container>
      <SummaryWrapper>
        <Title>
          <DollarSign size={24} style={{ marginRight: '0.5rem' }} />
          Earnings Summary
        </Title>
        <ButtonGroup>
          <Button onClick={() => setTimeframe('daily')} active={timeframe === 'daily'} disabled={timeframe === 'daily'}>
            Daily
          </Button>
          <Button onClick={() => setTimeframe('weekly')} active={timeframe === 'weekly'} disabled={timeframe === 'weekly'}>
            Weekly
          </Button>
          <Button onClick={() => setTimeframe('monthly')} active={timeframe === 'monthly'} disabled={timeframe === 'monthly'}>
            Monthly
          </Button>
        </ButtonGroup>

        {loading ? (
          <LoadingWrapper>
            <Loader size={24} />
          </LoadingWrapper>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <>
            <TotalEarnings>Total Earnings: ${summary.totalEarnings.toFixed(2)}</TotalEarnings>
            <EarningsList>
              {summary.details.length > 0 ? (
                summary.details.map((record) => (
                  <EarningsItem key={record._id}>
                    <span>${record.amount.toFixed(2)}</span>
                    <span>
                      <Calendar size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </EarningsItem>
                ))
              ) : (
                <EarningsItem>No earnings data available for this timeframe.</EarningsItem>
              )}
            </EarningsList>
          </>
        )}
      </SummaryWrapper>
    </Container>
  );
};

export default EarningsSummary;

