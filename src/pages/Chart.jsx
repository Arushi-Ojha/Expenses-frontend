import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useTheme } from '../ThemeContent';
import { BASE_URL } from '../config';
function Chart() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState([]);
  const [budget, setBudget] = useState(0);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
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
    fetchPastWeekData(storedUsername);
  }, []);

  const fetchPastWeekData = async (username) => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 6); // Last 7 days including today

    const from = lastWeek.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];

    await fetchAndPrepareData(username, from, to);
  };

  const fetchAndPrepareData = async (username, from, to) => {
    try {
      const resUser = await axios.get(`${BASE_URL}/api/expenses/${username}`);
      setBudget(resUser.data.remaining_balance + resUser.data.total_spent);

      const res = await axios.get(`${BASE_URL}/api/expenses/${username}/filter`, { params: { from, to } });
      const expenses = res.data.filtered_expenses;

      const grouped = {};
      for (let exp of expenses) {
        grouped[exp.date] = (grouped[exp.date] || 0) + parseFloat(exp.amount);
      }

      const chartData = Object.keys(grouped).map((date) => ({
        date,
        amount: grouped[date],
      }));

      setData(chartData);
    } catch (err) {
      console.error(err);
      setError('Error fetching data');
    }
  };

  const handleCustomFilter = async () => {
    if (!dateRange.from || !dateRange.to) return setError('Both dates are required');
    await fetchAndPrepareData(username, dateRange.from, dateRange.to);
  };

  return (
    <div>
      <Navbar />
      <h2>Expense Monitor</h2>

      <div style={{ marginBottom: '10px' }}>
        <strong>Max Bar Height (based on budget): ₹{budget}</strong>
      </div>

      <div>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
        />
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
        />
        <button onClick={handleCustomFilter}>Show Trend</button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, parseFloat(budget)]} />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Chart;
