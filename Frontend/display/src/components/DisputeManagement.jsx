import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DisputeManagement = () => {
  const [disputes, setDisputes] = useState([]);
  const [resolutionMessage, setResolutionMessage] = useState({});
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    // Fetch disputes when the component mounts
    const fetchDisputes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/disputes/admin/disputes', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setDisputes(response.data.disputes);
      } catch (error) {
        console.error('Error fetching disputes:', error);
      }
    };

    fetchDisputes();
  }, [jwtToken]);

  const handleResolutionChange = (disputeId, message) => {
    setResolutionMessage(prev => ({
      ...prev,
      [disputeId]: message,
    }));
  };

  const handleResolve = async (disputeId) => {
    const message = resolutionMessage[disputeId];
    if (!message) {
      alert('Please provide a resolution message.');
      return;
    }

    try {
      // API call to resolve the dispute
      await axios.put(
        'http://localhost:5000/api/disputes/admin/dispute/resolve',
        { disputeId, resolutionMessage: message },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Dispute resolved successfully!');
      // Reload disputes after resolving
      const response = await axios.get('http://localhost:5000/api/disputes/admin/disputes', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setDisputes(response.data.disputes);
    } catch (error) {
      console.error('Error resolving dispute:', error);
    }
  };

  return (
    <div>
      <h1>Dispute Management</h1>
      {disputes.length === 0 ? (
        <p>No disputes available.</p>
      ) : (
        disputes.map(dispute => (
          <div key={dispute._id} style={{ marginBottom: '20px' }}>
            <h3>Issue: {dispute.issueDescription}</h3>
            <p>Status: {dispute.status}</p>
            {dispute.status === 'Pending' && (
              <div>
                <textarea
                  value={resolutionMessage[dispute._id] || ''}
                  onChange={(e) => handleResolutionChange(dispute._id, e.target.value)}
                  placeholder="Provide a resolution message..."
                  rows="4"
                  style={{ width: '100%' }}
                />
                <button
                  onClick={() => handleResolve(dispute._id)}
                  style={{ marginTop: '10px' }}
                >
                  Resolve
                </button>
              </div>
            )}
            {dispute.status === 'Resolved' && (
              <p><strong>Resolution Message:</strong> {dispute.resolutionMessage}</p>
            )}
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default DisputeManagement;
