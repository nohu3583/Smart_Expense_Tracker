import React, { useState } from 'react';
import './style.css'; // Import your CSS file

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [currency, setCurrency] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [bankName, setBankName] = useState('');

  const handleRegister = () => {
    // Add your registration logic here
    console.log('Registering with:', {
      username,
      password,
      accountNumber,
      currency,
      initialBalance,
      bankName,
    });
  };

  return (
    <div className="wrapper">
      <header>
        <div className="logo">
          <a href="/register" className="logo_link">Register account</a>
        </div>
      </header>
      <main className="main register">
        <div style={{ margin: '1px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password" // Changed to password type for security
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="Account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Currency (e.g. EUR, SEK)"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="Initial balance"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
          />
          <input
            type="text"
            placeholder="Bank name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
          <button id="submit" onClick={handleRegister}>Register</button>
        </div>
        <div className="opt">
          <a href="/" className="opt_link">Cancel</a>
        </div>
      </main>
    </div>
  );
};

export default Register;