import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useTheme } from '../ThemeContent';
import {API_BASE_URL} from '../config.js'
function Form() {
  const [username, setUsername] = useState('');
  const [expense, setExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('${API_BASE_URL}/api/expenses', { username, ...expense });
      setMessage(res.data.message);
      setExpense({ amount: '', category: '', description: '', date: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense');
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleChange}
          required
        /><br />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={expense.category}
          onChange={handleChange}
          required
        /><br />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={expense.description}
          onChange={handleChange}
          required
        /><br />

        <input
          type="date"
          name="date"
          value={expense.date}
          onChange={handleChange}
          required
        /><br />

        <button type="submit">Add Expense</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Form;
