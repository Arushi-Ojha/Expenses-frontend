import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Navbar from './Navbar';
import { useTheme } from '../ThemeContent';
import { BASE_URL } from '../config';
function Table() {
  const [username, setUsername] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterDates, setFilterDates] = useState({ from: '', to: '' });
  const [editExpense, setEditExpense] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [budgetInfo, setBudgetInfo] = useState({ total_spent: 0, remaining_balance: 0 });

  const tableRef = useRef(); // for PDF export
const { toggleTheme } = useTheme();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      alert('Please log in first');
      window.location.href = '/login';
      return;
    }
    setUsername(storedUsername);
    fetchExpenses(storedUsername);
  }, []);

  const fetchExpenses = async (username) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/expenses/${username}`);
      setExpenses(res.data.expenses);
      setBudgetInfo({
        total_spent: res.data.total_spent,
        remaining_balance: res.data.remaining_balance,
      });
    } catch (err) {
      setError('Failed to fetch expenses');
    }
  };

  const handleSort = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/expenses/${username}/sort?order=${sortOrder}`);
      setExpenses(res.data.expenses);
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } catch (err) {
      setError('Sorting failed');
    }
  };

  const handleFilter = async () => {
    if (!filterDates.from || !filterDates.to) {
      return setError('Both dates are required');
    }

    try {
      const res = await axios.get(`${BASE_URL}/api/expenses/${username}/filter`, {
        params: filterDates
      });
      setExpenses(res.data.filtered_expenses);
    } catch (err) {
      setError('Filtering failed');
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await axios.delete(`${BASE_URL}/api/expenses/${username}/${expenseId}`);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
    } catch (err) {
      setError('Deletion failed');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { id, amount, category, description, date } = editExpense;

    try {
      await axios.put(`${BASE_URL}/api/expenses/${username}/${id}`, {
        amount,
        category,
        description,
        date,
      });
      setEditExpense(null);
      fetchExpenses(username);
      setMessage('Expense updated successfully');
    } catch (err) {
      setError('Update failed');
    }
  };

  const handleDownloadPDF = async () => {
    const input = tableRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 200;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 5, 10, imgWidth, imgHeight);
    pdf.save(`${username}-expense-table.pdf`);
  };

  return (
    <div>
      <Navbar />
      <h2>All Expenses</h2>
      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f1f1f1', borderRadius: '5px' }}>
        <strong>Total Spent:</strong> ₹{budgetInfo.total_spent} &nbsp;&nbsp;
        <strong>Remaining Budget:</strong> ₹{budgetInfo.remaining_balance}
      </div>

      <div>
        <button onClick={handleSort}>Sort by Date ({sortOrder})</button>
        <input
          type="date"
          value={filterDates.from}
          onChange={(e) => setFilterDates({ ...filterDates, from: e.target.value })}
        />
        <input
          type="date"
          value={filterDates.to}
          onChange={(e) => setFilterDates({ ...filterDates, to: e.target.value })}
        />
        <button onClick={handleFilter}>Filter</button>
        <button onClick={() => fetchExpenses(username)}>Clear Filter</button>
        <button onClick={handleDownloadPDF} style={{ backgroundColor: '#4CAF50', color: 'white', marginLeft: '10px' }}>
          📄 Download PDF
        </button>
      </div>

      <div ref={tableRef} style={{ marginTop: '10px' }}>
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.amount}</td>
                <td>{exp.category}</td>
                <td>{exp.description}</td>
                <td>{exp.date}</td>
                <td>
                  <button onClick={() => setEditExpense(exp)}>Edit</button>
                  <button onClick={() => handleDelete(exp.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editExpense && (
        <div style={{ border: '1px solid black', padding: '15px', marginTop: '20px' }}>
          <h3>Edit Expense</h3>
          <form onSubmit={handleEditSubmit}>
            <input
              type="number"
              name="amount"
              value={editExpense.amount}
              onChange={(e) => setEditExpense({ ...editExpense, amount: e.target.value })}
              required
            /><br />
            <input
              type="text"
              name="category"
              value={editExpense.category}
              onChange={(e) => setEditExpense({ ...editExpense, category: e.target.value })}
              required
            /><br />
            <input
              type="text"
              name="description"
              value={editExpense.description}
              onChange={(e) => setEditExpense({ ...editExpense, description: e.target.value })}
              required
            /><br />
            <input
              type="date"
              name="date"
              value={editExpense.date}
              onChange={(e) => setEditExpense({ ...editExpense, date: e.target.value })}
              required
            /><br />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditExpense(null)}>Cancel</button>
          </form>
        </div>
      )}

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Table;
