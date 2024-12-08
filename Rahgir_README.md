
# Rahgir - Ride-Hailing Platform

## Project Overview
**Rahgir** is a comprehensive ride-hailing platform designed to offer seamless transportation solutions rides. The platform provides distinct panels tailored for riders, drivers, and administrators, each equipped with unique functionalities for efficient and smooth operations.

---

## Project Scope and Structure

Rahgir leverages modern web technologies and APIs to offer:
- Real-time tracking
- User-friendly management features

### Key Functionalities and Modules
1. **Ride Management System**  
   - Booking, tracking, pricing, and route optimization for rides.
2. **User and Driver Management**  
   - Profile handling, availability, and ratings.
3. **Geolocation and Maps Integration**  
   - Live tracking, navigation, and estimated time of arrival (ETA) via Mapbox.
4. **Notifications and Communication**  
   - Real-time alerts and SMS notifications.
5. **Admin and Analytics Dashboard**  
   - User management, reporting, and dispute resolution.
6. **Promotions and Rewards**  
   - Discounts, referrals, and promotional campaigns.

---

## Panels and User Roles

Rahgir is divided into three core panels:

1. **User Panel (Riders)**  
   - Book rides, track trips, and manage trip history.
2. **Driver Panel**  
   - Manage ride requests, earnings, and navigation.
3. **Admin Panel**  
   - Oversee platform operations and analytics.

Each panel will be developed as a modular component to facilitate independent workflows and streamlined integration.

---

## Panels, Modules, and Requirements

### 1. User Panel (Riders)
#### Modules and Features:
- **Account Management**:  
  - User registration, login/logout, and profile updates.
- **Ride Booking**:  
  - Book rides with estimated fares.
- **Live Ride Tracking**:  
  - Real-time driver location updates and notifications.
- **Trip History**:  
  - View past trips and provide ride feedback.

#### APIs Used:
- **Mapbox API**: Location tracking and ETA.
- **Twilio SMS API**: Notifications and reminders.

---

### 2. Driver Panel
#### Modules and Features:
- **Driver Profile Management**:  
  - Registration, document verification, and availability status.
- **Ride Requests**:  
  - View and manage ride bookings.
- **Earnings Management**:  
  - Track earnings and summaries.
- **Navigation and Tracking**:  
  - Optimized routes and trip updates.
- **Ratings and Feedback**:  
  - View to user feedback.

#### APIs Used:
- **Mapbox API**: Route optimization.
- **Twilio SMS API**: Ride notifications.

---

### 3. Admin Panel
#### Modules and Features:
- **User and Driver Management**:  
  - Manage accounts, approvals, and suspensions.
- **Ride Analytics and Reporting**:  
  - Generate reports on ride statistics and revenue.
- **Price and Promotion Management**:  
  - Set fare rates and launch promotional campaigns.
- **Support and Dispute Resolution**:  
  - Handle disputes and feedback.

#### APIs Used:
- **Mapbox API**: Service area management.
- **Twilio SMS API**: Admin notifications.

---

## Development Stack

Rahgir is built using the **MERN stack**:
- **MongoDB**: Database management.
- **Express.js**: Backend API development.
- **React.js**: User interface.
- **Node.js**: Server-side logic.

---

## Project Structure

The project is organized into two main folders:
1. **Backend**: Contains server-side logic and APIs.  
   - Start the backend using:  
     ```bash
     npm run dev
     ```
2. **Frontend/Display**: Contains the user interface built with React.  
   - Start the frontend using:  
     ```bash
     npm start
     ```

---

## Current Status

The following features are pending implementation:
1. **Intra-city ride functionality**.
2. **Payment Integration**.
3. **use google map api**.
4. **make design and map better**.
5. **improve socket connection**.
6. **chat with drivers**.
7. **add more features**.

---

## Conclusion

Rahgir is a scalable and efficient platform poised to redefine the ride-hailing experience. The modular approach ensures flexibility and maintainability, with a clear roadmap for feature enhancements and service expansions.
