import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import styled from "styled-components";
import { jwtDecode } from "jwt-decode";
import {
  MapPin,
  Navigation,
  DollarSign,
  AlertCircle,
  Check,
  X,
  Bell,
  Flag,
} from "lucide-react";
import DriverMap from "../components/DriverMap";
import RideMaps from "../components/RideMaps";
const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h3`
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Paragraph = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.span`
  margin-left: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }

  &.accept {
    background-color: #c1f11d;
    color: #1a1c18;
    &:hover {
      background-color: #a8d619;
    }
  }

  &.reject {
    background-color: #f44336;
    &:hover {
      background-color: #d32f2f;
    }
  }

  &.notify {
    background-color: #2196f3;
    &:hover {
      background-color: #1976d2;
    }
  }

  &.end {
    background-color: #ff9800;
    &:hover {
      background-color: #f57c00;
    }
  }
`;

const NoRequest = styled.p`
  text-align: center;
  color: #718096;
  font-style: italic;
`;

const RideRequest = () => {
  const { socket, userType, userId } = useSocket();
  const [rideRequest, setRideRequest] = useState(null);
  const [rideData, setRideData] = useState(null);
  const [driverId, setDriverId] = useState("");
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const decoded = jwtDecode(token);
    const driverIdFromToken = decoded.id;
    setDriverId(driverIdFromToken);
    console.log(rideData);
    if (userType === "driver" && socket) {
      if (!socket.connected) {
        console.log("Socket not connected, waiting for connection...");
        socket.connect();
      }

      socket.on("rideRequest", (data) => {
        console.log("Ride request received:", data);
        setRideRequest(data);
        setRideData(null);
      });

      socket.on("rideStarted", (newRide) => {
        console.log("Ride started:", newRide);
        setRideData(newRide);
        setRideRequest(null);

        const locationEmitter = setInterval(() => {
          try {
            // Retrieve driver location and token from localStorage
            const currentLocation = JSON.parse(
              localStorage.getItem("driverLocation")
            );
            setDriverLocation(currentLocation);
            const token = localStorage.getItem("jwtToken");
            console.log("driver location:", currentLocation, "token:", token);
            if (!currentLocation || !token) {
              console.error("Driver location or token is missing.");
              return;
            }

            // Decode the JWT token to get the driver ID
            const decoded = jwtDecode(token);
            const driverIdFromToken = decoded.id;
            console.log("Driver ID:", driverIdFromToken);
            if (!driverIdFromToken) {
              console.error("Driver ID is missing from the token.");
              return;
            }

            console.log(
              "Emitting location update for driver:",
              driverIdFromToken
            ); // Add logging for debugging

            // Emit location update with driverId, longitude, and latitude
            socket.emit("locationUpdate", {
              driverId: driverIdFromToken,
              longitude: currentLocation.longitude,
              latitude: currentLocation.latitude,
            });
          } catch (error) {
            console.error("Error emitting location update:", error);
          }
        }, 5000); // 5000 ms = 5 seconds

        socket.on("rideEnded", () => {
          clearInterval(locationEmitter);
        });
      });

      return () => {
        socket.off("rideRequest");
        socket.off("rideStarted");
      };
    }
  }, [socket, userType]);

  const rejectRide = () => {
    socket.emit("rejectRide", { rideId: rideRequest.id, driverId: userId });
    setRideRequest(null);
  };

  return (
    <>
      {rideData ? (
        <RideMaps
          pickup={{
            longitude: rideData.pickupCoordinates.longitude,
            latitude: rideData.pickupCoordinates.latitude,
          }}
          dropOff={{
            longitude: rideData.dropOffCoordinates.longitude,
            latitude: rideData.dropOffCoordinates.latitude,
          }}
        />
      ) : (
        <DriverMap></DriverMap>
      )}
      <Container>
        {rideData ? (
          <Section>
            <Title>
              <Navigation size={24} style={{ marginRight: "0.5rem" }} />
              Ongoing Ride
            </Title>
            <Paragraph>
              <InfoItem>
                <MapPin size={18} />
                <InfoText>
                  <strong>Pickup:</strong> {rideData.pickup}
                </InfoText>
              </InfoItem>
              <InfoItem>
                <Navigation size={18} />
                <InfoText>
                  <strong>Dropoff:</strong> {rideData.dropOff}
                </InfoText>
              </InfoItem>
              <InfoItem>
                <AlertCircle size={18} />
                <InfoText>
                  <strong>Distance:</strong> {rideData.distance} meters
                </InfoText>
              </InfoItem>
              <InfoItem>
                <DollarSign size={18} />
                <InfoText>
                  <strong>Fare:</strong> ${rideData.fare}
                </InfoText>
              </InfoItem>
            </Paragraph>
            <ButtonGroup>
              <Button
                className="notify"
                onClick={() => socket.emit("notifyArrival", { ride: rideData })}
              >
                <Bell size={18} style={{ marginRight: "0.5rem" }} />
                Notify Arrival
              </Button>
              <Button
                className="end"
                onClick={() => {
                  socket.emit("endRide", {
                    ride: rideData,
                    driverId: driverId,
                  });
                  setRideData(null);
                }}
              >
                <Flag size={18} style={{ marginRight: "0.5rem" }} />
                End Ride
              </Button>
            </ButtonGroup>
          </Section>
        ) : rideRequest ? (
          <Section>
            <Title>
              <AlertCircle size={24} style={{ marginRight: "0.5rem" }} />
              New Ride Request
            </Title>
            <Paragraph>
              <InfoItem>
                <MapPin size={18} />
                <InfoText>
                  <strong>Pickup:</strong> {rideRequest.pickup}
                </InfoText>
              </InfoItem>
              <InfoItem>
                <Navigation size={18} />
                <InfoText>
                  <strong>Dropoff:</strong> {rideRequest.dropOff}
                </InfoText>
              </InfoItem>
              <InfoItem>
                <AlertCircle size={18} />
                <InfoText>
                  <strong>Distance:</strong> {rideRequest.distance} meters
                </InfoText>
              </InfoItem>
              <InfoItem>
                <DollarSign size={18} />
                <InfoText>
                  <strong>Fare:</strong> ${rideRequest.fare}
                </InfoText>
              </InfoItem>
            </Paragraph>
            <ButtonGroup>
              <Button
                className="accept"
                onClick={() =>
                  socket.emit("acceptRide", { rideRequest, driverid: driverId })
                }
              >
                <Check size={18} style={{ marginRight: "0.5rem" }} />
                Accept Ride
              </Button>
              <Button className="reject" onClick={rejectRide}>
                <X size={18} style={{ marginRight: "0.5rem" }} />
                Reject Ride
              </Button>
            </ButtonGroup>
          </Section>
        ) : (
          <NoRequest>No ride request at the moment</NoRequest>
        )}
      </Container>
    </>
  );
};

export default RideRequest;
