import { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import {API_BASE_URL} from '../config.js'
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('${API_BASE_URL}/api/users/login', {
      username,
      password,
    });

    alert('Login successful');
    localStorage.setItem('username', username);
    window.location.href = '/profile';
  } catch (err) {
    setError(err.response?.data?.error || 'Login failed');
  }
};
function signup(){
  window.location.href='/signup';
}

  const handleGoogleLogin = async (response) => {
    try {
      const res = await axios.post('/api/google-login', {
        credential: response.credential,
      });

      const { username, email } = res.data;
      alert(`Welcome ${username}`);
      localStorage.setItem('username', username);
      window.location.href = '/profile';
    } catch (err) {
      setError(err.response?.data?.error || 'Google login failed');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>
        <button type="submit">Login</button>
      </form>
      <button onClick={signup}>don't have an account? Register Now</button>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => setError('Google login failed')}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
