import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const FareManagement = () => {
  const [rideType, setRideType] = useState('');
  const [fareMultiplier, setFareMultiplier] = useState('');
  const [promotionCode, setPromotionCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // State to track the current form page

  // Function to get the JWT token from localStorage
  const getJwtToken = () => {
    return localStorage.getItem('jwtToken');
  };

  // Handle fare update
  const handleFareUpdate = () => {
    const token = getJwtToken();
    axios
      .put(
        'http://localhost:5000/api/admin/fare/update',
        { rideType, fareMultiplier },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Send JWT token as Authorization header
          },
        }
      )
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error updating fare'));
  };

  // Handle promotion add
  const handleAddPromotion = () => {
    const token = getJwtToken();
    axios
      .post(
        'http://localhost:5000/api/admin/promotion/add',
        { rideType, promotionCode, discountPercentage, validUntil },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Send JWT token as Authorization header
          },
        }
      )
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error adding promotion'));
  };

  // Handle promotion removal
  const handleRemovePromotion = () => {
    const token = getJwtToken();
    axios
      .delete(
        'http://localhost:5000/api/admin/promotion/remove',
        { data: { rideType, promotionCode } },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Send JWT token as Authorization header
          },
        }
      )
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error removing promotion'));
  };

  // Handle promotion update
  const handleUpdatePromotion = () => {
    const token = getJwtToken();
    axios
      .put(
        'http://localhost:5000/api/admin/promotion/update',
        { rideType, promotionCode, discountPercentage, validUntil },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Send JWT token as Authorization header
          },
        }
      )
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error updating promotion'));
  };

  // Handle page change (pagination)
  const goToNextPage = () => {
    if (currentPage < 3) { // Only 4 pages in total (0-3)
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container>
      <Title>Fare Management</Title>
      <FormContainer>
        {/* Section 1: Update Fare */}
        {currentPage === 0 && (
          <Section>
            <SubTitle>Update Fare</SubTitle>
            <FormGroup>
              <Input type="text" placeholder="Ride Type" value={rideType} onChange={(e) => setRideType(e.target.value)} />
              <Input type="number" placeholder="Fare Multiplier" value={fareMultiplier} onChange={(e) => setFareMultiplier(e.target.value)} />
              <Button onClick={handleFareUpdate}>Update Fare</Button>
            </FormGroup>
          </Section>
        )}

        {/* Section 2: Add Promotion */}
        {currentPage === 1 && (
          <Section>
            <SubTitle>Add Promotion</SubTitle>
            <FormGroup>
              <Input type="text" placeholder="Ride Type" value={rideType} onChange={(e) => setRideType(e.target.value)} />
              <Input type="text" placeholder="Promotion Code" value={promotionCode} onChange={(e) => setPromotionCode(e.target.value)} />
              <Input type="number" placeholder="Discount Percentage" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} />
              <Input type="date" placeholder="Valid Until" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
              <Button onClick={handleAddPromotion}>Add Promotion</Button>
            </FormGroup>
          </Section>
        )}

        {/* Section 3: Remove Promotion */}
        {currentPage === 2 && (
          <Section>
            <SubTitle>Remove Promotion</SubTitle>
            <FormGroup>
              <Input type="text" placeholder="Ride Type" value={rideType} onChange={(e) => setRideType(e.target.value)} />
              <Input type="text" placeholder="Promotion Code" value={promotionCode} onChange={(e) => setPromotionCode(e.target.value)} />
              <Button onClick={handleRemovePromotion}>Remove Promotion</Button>
            </FormGroup>
          </Section>
        )}

        {/* Section 4: Update Promotion */}
        {currentPage === 3 && (
          <Section>
            <SubTitle>Update Promotion</SubTitle>
            <FormGroup>
              <Input type="text" placeholder="Ride Type" value={rideType} onChange={(e) => setRideType(e.target.value)} />
              <Input type="text" placeholder="Promotion Code" value={promotionCode} onChange={(e) => setPromotionCode(e.target.value)} />
              <Input type="number" placeholder="Discount Percentage" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} />
              <Input type="date" placeholder="Valid Until" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
              <Button onClick={handleUpdatePromotion}>Update Promotion</Button>
            </FormGroup>
          </Section>
        )}

        {/* Pagination Arrows */}
        <PaginationArrows>
          <ArrowIcon onClick={goToPreviousPage} disabled={currentPage === 0}>&#8592;</ArrowIcon> {/* Left Arrow */}
          <ArrowIcon onClick={goToNextPage} disabled={currentPage === 3}>&#8594;</ArrowIcon> {/* Right Arrow */}
        </PaginationArrows>
      </FormContainer>
    </Container>
  );
};

// Styled-components
const Container = styled.div`
  max-width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 20px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const FormContainer = styled.div`
  width: 100%;
  padding: 20px;
`;

const Section = styled.section`
  background-color: #fff;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SubTitle = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  width: 100%;
  transition: all 0.3s ease;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 1rem;
  background-color: #C1F11D;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
`;

const PaginationArrows = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
`;

const ArrowIcon = styled.span`
  font-size: 2rem;
  cursor: pointer;
  color: #333;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }

  &:disabled {
    color: #aaa;
    cursor: not-allowed;
  }
`;

export default FareManagement;
