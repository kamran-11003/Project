import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const FareManagement = () => {
  const [rideType, setRideType] = useState("");
  const [fareMultiplier, setFareMultiplier] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [activeSection, setActiveSection] = useState(0); // Track active section

  // Function to get the JWT token from localStorage
  const getJwtToken = () => {
    return localStorage.getItem("jwtToken");
  };

  // Handle fare update
  const handleFareUpdate = () => {
    const token = getJwtToken();
    axios
      .put(
        "http://localhost:5000/api/admin/fare/update",
        { rideType, fareMultiplier },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token as Authorization header
          },
        }
      )
      .then((response) => alert(response.data.message))
      .catch((error) => alert("Error updating fare"));
  };

  // Handle promotion add
  const handleAddPromotion = () => {
    const token = getJwtToken();
    axios
      .post(
        "http://localhost:5000/api/admin/promotion/add",
        { rideType, promotionCode, discountPercentage, validUntil },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token as Authorization header
          },
        }
      )
      .then((response) => alert(response.data.message))
      .catch((error) => alert("Error adding promotion"));
  };

  // Handle promotion removal
  const handleRemovePromotion = () => {
    const token = getJwtToken();
    axios
      .delete(
        "http://localhost:5000/api/admin/promotion/remove",
        { data: { rideType, promotionCode } },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token as Authorization header
          },
        }
      )
      .then((response) => alert(response.data.message))
      .catch((error) => alert("Error removing promotion"));
  };

  // Handle promotion update
  const handleUpdatePromotion = () => {
    const token = getJwtToken();
    axios
      .put(
        "http://localhost:5000/api/admin/promotion/update",
        { rideType, promotionCode, discountPercentage, validUntil },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token as Authorization header
          },
        }
      )
      .then((response) => alert(response.data.message))
      .catch((error) => alert("Error updating promotion"));
  };

  // Handle section change (using buttons)
  const handleSectionChange = (sectionIndex) => {
    setActiveSection(sectionIndex);
  };

  return (
    <Container>
      <Title>Fare Management</Title>
      <NavBar>
        <NavButton
          onClick={() => handleSectionChange(0)}
          isActive={activeSection === 0}
        >
          Update Fare
        </NavButton>
        <NavButton
          onClick={() => handleSectionChange(1)}
          isActive={activeSection === 1}
        >
          Add Promotion
        </NavButton>
        <NavButton
          onClick={() => handleSectionChange(2)}
          isActive={activeSection === 2}
        >
          Remove Promotion
        </NavButton>
        <NavButton
          onClick={() => handleSectionChange(3)}
          isActive={activeSection === 3}
        >
          Update Promotion
        </NavButton>
      </NavBar>

      <FormContainer>
        {/* Section 1: Update Fare */}
        {activeSection === 0 && (
          <Section>
            <SubTitle>Update Fare</SubTitle>
            <FormGroup>
              <Input
                type="text"
                placeholder="Ride Type"
                value={rideType}
                onChange={(e) => setRideType(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Fare Multiplier"
                value={fareMultiplier}
                onChange={(e) => setFareMultiplier(e.target.value)}
              />
              <Button onClick={handleFareUpdate}>Update Fare</Button>
            </FormGroup>
          </Section>
        )}

        {/* Section 2: Add Promotion */}
        {activeSection === 1 && (
          <Section>
            <SubTitle>Add Promotion</SubTitle>
            <FormGroup>
              <Input
                type="text"
                placeholder="Ride Type"
                value={rideType}
                onChange={(e) => setRideType(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Promotion Code"
                value={promotionCode}
                onChange={(e) => setPromotionCode(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Discount Percentage"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
              />
              <Input
                type="date"
                placeholder="Valid Until"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
              <Button onClick={handleAddPromotion}>Add Promotion</Button>
            </FormGroup>
          </Section>
        )}

        {/* Section 3: Remove Promotion */}
        {activeSection === 2 && (
          <Section>
            <SubTitle>Remove Promotion</SubTitle>
            <FormGroup>
              <Input
                type="text"
                placeholder="Ride Type"
                value={rideType}
                onChange={(e) => setRideType(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Promotion Code"
                value={promotionCode}
                onChange={(e) => setPromotionCode(e.target.value)}
              />
              <Button onClick={handleRemovePromotion}>Remove Promotion</Button>
            </FormGroup>
          </Section>
        )}

        {/* Section 4: Update Promotion */}
        {activeSection === 3 && (
          <Section>
            <SubTitle>Update Promotion</SubTitle>
            <FormGroup>
              <Input
                type="text"
                placeholder="Ride Type"
                value={rideType}
                onChange={(e) => setRideType(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Promotion Code"
                value={promotionCode}
                onChange={(e) => setPromotionCode(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Discount Percentage"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
              />
              <Input
                type="date"
                placeholder="Valid Until"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
              <Button onClick={handleUpdatePromotion}>Update Promotion</Button>
            </FormGroup>
          </Section>
        )}
      </FormContainer>
    </Container>
  );
};

// Styled-components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  animation: fadeIn 1s ease-in-out;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const NavButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: ${(props) => (props.isActive ? "#C1F11D" : "#ddd")};
  color: ${(props) => (props.isActive ? "black" : "gray")};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  :hover {
    background-color: #b3e2b2;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  padding: 20px;
`;

const Section = styled.section`
  margin: 20px 0;
  animation: slideIn 1s ease-in-out;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
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
  background-color: #c1f11d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
`;

const fadeIn = `
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const slideIn = `
  @keyframes slideIn {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }
`;

// Responsive media query
const mediaQueries = `
  @media (max-width: 768px) {
    .title {
      font-size: 1.5rem;
    }
    .button {
      width: 100%;
    }
  }
`;

export default FareManagement;
