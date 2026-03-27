import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';

export default function LoginForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      navigate('/Home');
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Get cookie value by name
  const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) return value;
    }
    return null;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post(
        '/food-ordering-app/api/user/login',
        {
          email: data.email,
          password: data.password, 
        }
      );

      const { token } = response.data;

      // Store token in cookie for 1 hour
      document.cookie = `token=${token}; max-age=3600; path=/; SameSite=Lax`;

      toast.success('Login successful!');
      reset();
      setTimeout(() => navigate('/Home'), 1500);
    } catch (error) {
      console.error('Login error:', error);
      const serverError = error.response?.data?.error || error.response?.data?.details;
      toast.error(serverError || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>User Login</h1>

        <div className="input-group">
          <div className="input-field">
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Invalid email format',
                },
              })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner"></div>
              <span style={{ marginLeft: '8px' }}>Logging in...</span>
            </>
          ) : (
            'Login'
          )}
        </button>

        <p>
          Don't have an account? <Link to="/RegisterForm">Register here</Link>
        </p>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
