import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Ensure you import auth from your firebase config
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // If needed, you can fetch user data from Firestore and check if they are an admin
      // For now, we just redirect to the admin dashboard on successful login
      setSuccess('Login successful');
      localStorage.setItem('isLoggedIn', 'true'); // Set login status in local storage
      navigate('/'); // Redirect to the admin dashboard
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError('Invalid email or password');
    }
  };

  return (
    <div className='login'>
      <div className="login-container">
        <h1>Admin Login</h1>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleLogin}>
          <div className="login-fields">
            <input
              type="email"
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
            <div className="password-container">
              <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>
          <button type='submit'>Login</button>
        </form>
        <p className='loginsignup-signup'>
          Don't have an account? <Link to="/signup"><span>Sign Up here</span></Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
