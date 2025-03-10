import React from 'react';
import './style.css'; // Import your CSS file

const Login = () => {
  return (
    <div className="wrapper">
      <header>
        <div className="logo">
          <a href="" className="logo_link">Login</a>
        </div>
      </header>
      <main className="main login">
        <div style={{ margin: '1px' }}>
          <input
            type="text"
            placeholder="Username"
            id="username" // Changed ID to avoid duplicates
          />
          <input
            type="password" // Changed to password type for security
            placeholder="Password"
            id="password" // Changed ID to avoid duplicates
          />
          <button id="submit">Login</button>
        </div>
        <div className="opt">
          <a href="/" className="opt_link">Cancel</a>
        </div>
      </main>
    </div>
  );
};

export default Login;