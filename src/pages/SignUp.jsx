import { useState } from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config.js'
function Signup() {
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    budget: ''
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('${API_BASE_URL}/api/users/request-otp', formData);
      setMessage(res.data.message);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request OTP');
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('${API_BASE_URL}/api/users/verify-otp', {
        username: formData.username,
        otp
      });
      setMessage(res.data.message);
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {step === 'form' && (
        <form onSubmit={requestOtp}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          /><br />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          /><br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          /><br />
          <input
            type="number"
            name="budget"
            placeholder="Monthly Budget"
            value={formData.budget}
            onChange={handleChange}
            required
          /><br />
          <button type="submit">Request OTP</button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={verifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          /><br />
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {step === 'success' && (
        <div>
          <p style={{ color: 'green' }}>{message}</p>
          <button onClick={() => (window.location.href = '/login')}>Go to Login</button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && step !== 'success' && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
}

export default Signup;
