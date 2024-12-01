import React from "react";
import { FaHome, FaHistory, FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <div style={styles.profile}>
        <img
          src="https://via.placeholder.com/50"
          alt="Profile"
          style={styles.profileImage}
        />
        <div>
          <h4 style={styles.name}>John Doe</h4>
          <p style={styles.email}>john.doe@example.com</p>
        </div>
      </div>
      <div style={styles.content}>
        <nav style={styles.nav}>
          <a href="#dashboard" style={styles.navItem}>
            <FaHome style={styles.icon} /> Dashboard
          </a>
          <a href="#history" style={styles.navItem}>
            <FaHistory style={styles.icon} /> Request History
          </a>
          <a href="#settings" style={styles.navItem}>
            <FaCog style={styles.icon} /> Settings
          </a>
          <a href="#help" style={styles.navItem}>
            <FaQuestionCircle style={styles.icon} /> Help
          </a>
          <a href="#logout" style={styles.logout}>
            <FaSignOutAlt style={styles.icon} /> Logout
          </a>
        </nav>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    background: "#f5f5f5",
    padding: "20px",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  profileImage: {
    borderRadius: "50%",
    marginRight: "10px",
  },
  name: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "bold",
  },
  email: {
    margin: 0,
    fontSize: "12px",
    color: "#666",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "#333",
    padding: "10px",
    borderRadius: "5px",
    transition: "background 0.3s",
  },
  icon: {
    marginRight: "10px",
  },
  logout: {
    textDecoration: "none",
    color: "#333",
    padding: "10px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    marginTop: "10px", // Slightly separate logout from last nav item
  },
};

export default Sidebar;
