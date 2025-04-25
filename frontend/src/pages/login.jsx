import { Link } from 'react-router-dom';
import styles from '../styles/landing.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    // State variables for form fields and error messages
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();

        // Send POST request to backend login endpoint
        const res = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Allow sending cookies
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
            console.log(data.msg); // Show success message in console
            setError('');
            navigate('/dashboard'); // Redirect to dashboard on success
        } else {
            console.error('Login failed:', data.msg);
            setError('Invalid username or password'); // Show error message in UI
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h1 className={styles.title}>Login</h1>
                <form onSubmit={handleLogin}>
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

                    {/* Display error message if login fails */}
                    {error && <p className={styles.error}>{error}</p>}

                    {/* Submit button */}
                    <button className={styles.button} type="submit">Login</button>
                </form>

                {/* Link to registration page */}
                <Link to="/register">Don't have an account? Register here</Link>
            </div>
        </div>
    );
}

export default Login;
