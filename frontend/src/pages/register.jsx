import { Link } from 'react-router-dom';
import styles from '../styles/landing.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    // State variables for input fields and error message
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle register form submission
    const handleRegister = async (e) => {
        e.preventDefault();

        // Send POST request to backend register endpoint
        const res = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Enable sending cookies
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            console.log('Successful registration:', data.msg);
            setError('');
            navigate('/'); // Redirect to login page after successful registration
        } else {
            setError('Username is already taken'); // Show error in UI
            console.error('Registration failed:', data.msg);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h1 className={styles.title}>Register</h1>
                <form onSubmit={handleRegister}>
                    {/* Username input */}
                    <label className={styles.text} htmlFor="name">Username</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {/* Password input */}
                    <label className={styles.text} htmlFor="pw">Password</label>
                    <input
                        className={styles.input}
                        type="password"
                        id="pw"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Display error if present */}
                    {error && <p className={styles.error}>{error}</p>}

                    {/* Submit button */}
                    <button className={styles.button} type="submit">Register</button>
                </form>

                {/* Link back to login */}
                <Link to="/">Already have an account? Login</Link>
            </div>
        </div>
    );
}

export default Register;
