import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContent';

function Navbar(){
    const navigate = useNavigate();

    function Profile(){
        navigate('/profile');
    }
    function ExpenseForm(){
        navigate('/form');
    }
    function ExpenseTable(){
        navigate('/table');
    }
    function Budget(){
        navigate('/budget');
    }
    function Chart(){
        navigate('/chart');
    }
    function Logout(){
        localStorage.clear();
        navigate('/');
    }
const { toggleTheme } = useTheme();

    return(
        <div>
            <div className="nav">
                <button onClick={Profile}>PROFILE</button>
                <button onClick={ExpenseForm}>ADD EXPENSES</button>
                <button onClick={ExpenseTable}>YOUR EXPENSES</button>
                <button onClick={Budget}>SPENDINGS</button>
                <button onClick={Chart}>MONITOR EXPENSES</button>
                <button onClick={Logout}>LOGOUT</button>
            </div>
        </div>
    );
}

export default Navbar;