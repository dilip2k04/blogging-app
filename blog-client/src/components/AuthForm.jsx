// components/AuthForm.jsx
import { useState } from 'react';
import "./AuthForm.css";

export const AuthForm = ({ onSubmit, isRegister = false, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-title">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
      <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
        <div className="input-group">
          <label htmlFor="email" className="input-label">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
            autoComplete="username"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password" className="input-label">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
            autoComplete={isRegister ? 'new-password' : 'current-password'}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`auth-button ${isRegister ? 'register-button' : 'login-button'}`}
        >
          {isLoading ? (
            <span className="button-loader"></span>
          ) : isRegister ? (
            'Sign Up'
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      
      <div className="auth-footer">
        {isRegister ? (
          <p>Already have an account? <span className="auth-link">Sign In</span></p>
        ) : (
          <p>Don't have an account? <span className="auth-link">Register</span></p>
        )}
      </div>
    </div>
  );
};
