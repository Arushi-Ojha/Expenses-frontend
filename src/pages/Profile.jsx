import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useTheme } from '../ThemeContent';

function Profile() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState({ email: '', budget: '', password: '' });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
const { toggleTheme } = useTheme();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      alert('Please log in first');
      window.location.href = '/login';
      return;
    }
    setUsername(storedUsername);

    axios.get(`/api/users/${storedUsername}`)
      .then(res => {
        const { email, budget } = res.data;
        setProfile(prev => ({ ...prev, email, budget }));
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load profile');
      });
  }, []);

  const handleEditClick = async () => {
    try {
      const res = await axios.get(`/api/users/${username}`);
      const { email, budget } = res.data;
      setProfile({ email, budget, password: '' });
      setEditMode(true);
    } catch (err) {
      setError('Failed to fetch user details');
    }
  };

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.put(`/api/users/${username}`, profile);
      setMessage(res.data.message);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Profile</h2>
      {editMode ? (
        <form onSubmit={handleUpdate}>
          <div><strong>Username:</strong> {username}</div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleChange}
            required
          /><br />
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={profile.password}
            onChange={handleChange}
            required
          /><br />
          <input
            type="number"
            name="budget"
            placeholder="Monthly Budget"
            value={profile.budget}
            onChange={handleChange}
            required
          /><br />
          <button type="submit">Save Changes</button>
        </form>
      ) : (
        <div>
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Password:</strong> ********</p>
          <p><strong>Monthly Budget:</strong> ₹{profile.budget}</p>
          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Profile;
