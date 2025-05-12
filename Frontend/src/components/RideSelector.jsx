import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styled from "styled-components";
import "swiper/css";
import {
  FaCar,
  FaMotorcycle,
  FaHorse,
  FaCarSide,
  FaSpider,
  FaUserAstronaut,
} from "react-icons/fa";

const RideCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${(props) => (props.$isSelected ? "#4299e1" : "#e2e8f0")};
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    border-color: #4299e1;
  }
`;

const IconWrapper = styled.div`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: ${(props) => (props.$isSelected ? "#4299e1" : "#4a5568")};
`;

const RideName = styled.p`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: #2d3748;
`;

const rides = [
  { name: "Ride AC", icon: FaCar },
  { name: "Ride Mini", icon: FaCarSide },
  { name: "Motoride", icon: FaMotorcycle },
  { name: "Horse", icon: FaHorse },
  { name: "Spiderman", icon: FaSpider },
  { name: "Superman", icon: FaUserAstronaut },
];

const RideSelector = ({ selectedRide, onSelectRide }) => {
  return (
    <Swiper
      spaceBetween={12}
      slidesPerView={4}
      style={{ padding: "1rem 0" }}
      breakpoints={{
        320: { slidesPerView: 2.5 },
        480: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
      }}
    >
      {rides.map((ride) => (
        <SwiperSlide key={ride.name}>
          <RideCard
            $isSelected={selectedRide === ride.name}
            onClick={() => onSelectRide(ride.name)}
          >
            <IconWrapper $isSelected={selectedRide === ride.name}>
              <ride.icon />
            </IconWrapper>
            <RideName>{ride.name}</RideName>
          </RideCard>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default RideSelector;
