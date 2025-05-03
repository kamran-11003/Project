import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const DisputeManagement = () => {
  const [disputes, setDisputes] = useState([]);
  const [filteredDisputes, setFilteredDisputes] = useState([]);
  const [resolutionMessage, setResolutionMessage] = useState({});
  const [filter, setFilter] = useState("All");
  const jwtToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/disputes/admin/disputes",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setDisputes(response.data.disputes);
        setFilteredDisputes(response.data.disputes);
      } catch (error) {
        console.error("Error fetching disputes:", error);
      }
    };

    fetchDisputes();
  }, [jwtToken]);

  useEffect(() => {
    if (filter === "All") {
      setFilteredDisputes(disputes);
    } else {
      const filtered = disputes.filter((dispute) => dispute.status === filter);
      setFilteredDisputes(filtered);
    }
  }, [filter, disputes]);

  const handleResolutionChange = (disputeId, message) => {
    setResolutionMessage((prev) => ({
      ...prev,
      [disputeId]: message,
    }));
  };

  const handleResolve = async (disputeId) => {
    const message = resolutionMessage[disputeId];
    if (!message) {
      alert("Please provide a resolution message.");
      return;
    }

    try {
      await axios.put(
        "http://localhost:5000/api/disputes/admin/dispute/resolve",
        { disputeId, resolutionMessage: message },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert("Dispute resolved successfully!");
      const response = await axios.get(
        "http://localhost:5000/api/disputes/admin/disputes",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setDisputes(response.data.disputes);
    } catch (error) {
      console.error("Error resolving dispute:", error);
    }
  };

  return (
    <Container>
      <Title>Dispute Management</Title>

      <FilterContainer>
        <FilterLabel>Filter by Status:</FilterLabel>
        <FilterSelect
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Unresolved</option>
          <option value="Resolved">Resolved</option>
        </FilterSelect>
      </FilterContainer>

      {filteredDisputes.length === 0 ? (
        <Message>No disputes available.</Message>
      ) : (
        filteredDisputes.map((dispute) => (
          <DisputeCard
            key={dispute._id}
            isPending={dispute.status === "Pending"}
          >
            <p1>
              {dispute.driver
                ? `${dispute.driver.firstName} ${dispute.driver.lastName} ${dispute.driver._id}`
                : dispute.user
                ? `${dispute.user.firstName} ${dispute.user.lastName} ${dispute.user._id}`
                : "No driver or user available"}
            </p1>

            <h3>Issue: {dispute.issueDescription}</h3>
            <p>Status: {dispute.status}</p>

            {dispute.status === "Pending" && (
              <ResolutionSection>
                <TextArea
                  value={resolutionMessage[dispute._id] || ""}
                  onChange={(e) =>
                    handleResolutionChange(dispute._id, e.target.value)
                  }
                  placeholder="Provide a resolution message..."
                  rows="4"
                />
                <ResolveButton onClick={() => handleResolve(dispute._id)}>
                  Resolve
                </ResolveButton>
              </ResolutionSection>
            )}

            {dispute.status === "Resolved" && (
              <ResolutionMessage>
                <strong>Resolution Message:</strong> {dispute.resolutionMessage}
              </ResolutionMessage>
            )}

            <Divider />
          </DisputeCard>
        ))
      )}
    </Container>
  );
};

export default DisputeManagement;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fafafa;
  animation: fadeIn 1s ease-in-out;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Message = styled.div`
  color: red;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FilterLabel = styled.label`
  font-size: 1.2rem;
  margin-right: 10px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FilterSelect = styled.select`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  color: #333;

  @media (max-width: 768px) {
    width: 100%;
    font-size: 1rem;
  }
`;

const DisputeCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgb(0, 0, 0);
  border-left: 5px solid #c1f11d;
  animation: slideIn 1s ease-in-out;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const ResolutionSection = styled.div`
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
  animation: fadeIn 1s ease-in-out;
  transform: scale(1.02);

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ResolveButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #c1f11d;
  color: #000000;
  border: 1px solid #c1f11d;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, color 0.3s ease;

  :hover {
    background-color: #c1f11d;
    color: white;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ResolutionMessage = styled.p`
  margin-top: 20px;
  font-size: 1rem;
  color: #000;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Divider = styled.hr`
  margin-top: 20px;
  border: 1px solid #ccc;
`;

const fadeIn = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const slideIn = `
  @keyframes slideIn {
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
