import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Store } from 'lucide-react';
import api from '../../api';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: form.email.trim(),
        password: form.password,
      });

      const user = response.data.user;

      // Compatibility for existing frontend components.
      // This is profile information, NOT the authentication token.
      localStorage.setItem('craftlanka_user', JSON.stringify(user));
      localStorage.setItem('user', JSON.stringify(user));

      if (user.id) {
        localStorage.setItem('userId', user.id);
      }

      navigate(
        user.role === 'seller' ? '/seller-dashboard' : '/products',
        { replace: true }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to log in. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-brand">
          <Store size={27} />
          <span>CraftLanka</span>
        </Link>

        <div className="auth-heading">
          <h1>Welcome Back</h1>
          <p>Log in to explore handmade Sri Lankan crafts.</p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>

            <div className="auth-password-wrap">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create an account</Link>
        </p>

        <Link to="/" className="auth-home-link">
          Back to Home
        </Link>
      </section>
    </main>
  );
}