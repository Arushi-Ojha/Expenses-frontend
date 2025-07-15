
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContent'; 

function Landing() {
  const navigate = useNavigate();
const { toggleTheme } = useTheme();


  function login() {
    navigate('/login');
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome to Expense Tracker</h1>
      <button onClick={login} style={{ marginRight: '10px' }}>
        GET STARTED
      </button>
      <button onClick={toggleTheme} className="toggle-btn">
        Switch Mode
      </button>
    </div>
  );
}

export default Landing;
