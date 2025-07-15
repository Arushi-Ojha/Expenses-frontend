import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import {API_BASE_URL} from '../config.js'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Navbar from './Navbar';
import { useTheme } from '../ThemeContent';
function Budget() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [recurring, setRecurring] = useState([]);
  const username = localStorage.getItem('username');
  const chartRef = useRef();
const { toggleTheme } = useTheme();

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  };

  useEffect(() => {
    if (!username) {
      alert('Please log in first');
      window.location.href = '/login';
      return;
    }

    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/expenses/${username}`);
        const expenses = res.data.expenses;

        const categoryTotals = {};
        const categoryCounts = {};

        expenses.forEach(exp => {
          const category = exp.category;
          const amount = parseFloat(exp.amount);
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
          name,
          value: parseFloat(value.toFixed(2)),
          color: getRandomColor()
        }));

        const recurringCategories = Object.entries(categoryCounts)
          .filter(([_, count]) => count > 4)
          .map(([name]) => name);

        setData(chartData);
        setRecurring(recurringCategories);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch expenses');
      }
    };

    fetchExpenses();
  }, [username]);

  const handleDownload = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.download = `${username}-expenses-pie-chart.jpg`;
    link.click();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <Navbar />
      <h2>Expense Distribution by Category</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data.length > 0 ? (
        <div ref={chartRef}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={150}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No expenses to display</p>
      )}

      {data.length > 0 && (
        <button
          onClick={handleDownload}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          📥 Download Pie Chart
        </button>
      )}

      {recurring.length > 0 && (
        <div style={{ marginTop: '1rem', background: '#f0f8ff', padding: '1rem', borderRadius: '10px' }}>
          <h3 style={{ color: '#333' }}>📌 Recurring Expense Categories</h3>
          <ul>
            {recurring.map((cat, idx) => (
              <li key={idx}>🔁 {cat}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Budget;
