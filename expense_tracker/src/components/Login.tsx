import React, {useState} from 'react';
import './style.css'; // Import your CSS file
import {account_options} from "../../../src/app/functions"
import {useNavigate} from "react-router-dom"
import {connectDB} from ".../../../src/mongodb/database"
import {getAccount} from "../../../src/mongodb/account"
import * as crypto from "crypto"  

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async () => {
    try {
      const account = await getAccount(username);
      
      if (!account) {
        setError('User does not exist!');
        return;
      }

      // Step 3: Check if the password is correct
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      if (account.password !== hashedPassword) {
        setError('Incorrect password!');
        return;
      }

      // Step 4: Login successful
      console.log('Login successful!');
      setError('');
      navigate('/main'); // Redirect to the Main page
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="wrapper">
      <header>
        <div className="logo">
          <a href="/login" className="logo_link">Login</a>
        </div>
      </header>
      <main className="main login">
        <div style={{ margin: '1px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        <div className="opt">
          <a href="/" className="opt_link">Cancel</a>
        </div>
      </main>
    </div>
  );
};

export default Login;