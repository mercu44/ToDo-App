import { Link } from 'react-router-dom';
import styles from '../styles/navigator.module.css'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';


function Navigator({ title= "Dashboard"}){

    const navigate = useNavigate();
    const handleLogout = async(e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Allows sending cookies
        });
        if(res.ok){
            navigate('/');
        }
    }

    return (
        <div className={styles.navigator}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.references}>
                
                <button
                onClick={()=> navigate('/dashboard')}
                className={styles.nButton}
                >
                    dashboard
                </button>
                <button 
                onClick={handleLogout} 
                className={styles.nButton}
                > Logout</button>
            </div>
        </div>
    );
}
Navigator.propTypes = {
    title: PropTypes.string
};
export default Navigator;