import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignInUp = ({setAuth}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${baseURL}/api/auth/register`, { email, password });
        localStorage.setItem("jwt", response.data.token);
        setAuth(true);
        navigate('/'); // remove?
    } catch (err){
        console.log(err.response.data.error);
        setError(err.response.data.error);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${baseURL}/api/auth/login`, { email, password });
        localStorage.setItem("jwt", response.data.token);
        setAuth(true);
        navigate('/'); // remove?
    } catch (err){
        console.log(err);
        setError(err.response.data.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Sign In/Up</h1>
        {error && <p style={{ color: "red"}}>{error}</p>}
      <form >
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit" onClick={handleRegistration}>Register</button>
        <button type="submit" onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default SignInUp;