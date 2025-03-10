import React from 'react';
import { Link } from 'react-router-dom'; // For navigation
import './style.css'; // Import your CSS file

const Home = () => {
  return (
    <div className="wrapper">
      <header>
        <div className="logo">
          <Link to="/" className="logo_link">Expense Tracker</Link>
        </div>
      </header>
      <main className="main index">
        <div className="opt">
          <Link to="/register" className="opt_link">Register new account</Link>
        </div>
        <div className="opt">
          <Link to="/login" className="opt_link">Login</Link>
        </div>
      </main>
    </div>
  );
};

export default Home;