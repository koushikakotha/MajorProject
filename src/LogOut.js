import React from 'react';
import { useAuth } from './AuthContext';
import './App.css'; // Import your CSS file for styling
import { useNavigate } from 'react-router-dom';
const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="centered-container">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LogoutButton;
