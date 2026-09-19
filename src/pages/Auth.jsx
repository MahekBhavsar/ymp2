import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/account');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join the Four Sisters family</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input className="input-field" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await resetPassword(email); setSent(true); }
    catch { setError('Could not send reset email. Check the address.'); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Reset Password</h1>
        {sent ? (
          <div className="auth-success">
            <p>Password reset email sent! Check your inbox.</p>
            <Link to="/login" className="btn btn-primary auth-btn">Back to Login</Link>
          </div>
        ) : (
          <>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary auth-btn">Send Reset Link</button>
            </form>
          </>
        )}
        <p className="auth-switch"><Link to="/login">Back to Sign In</Link></p>
      </div>
    </div>
  );
}
