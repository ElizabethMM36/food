import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <h1 className="crumps-title">Crumps</h1>
      <p className="quote">"Here everything is half a price."</p>
      <div className="button-container">
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </div>
  );
};

export default Home;