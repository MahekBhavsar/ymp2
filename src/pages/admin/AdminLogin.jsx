import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // AuthContext will fetch the role and redirect logic is handled by AdminLayout
      // But we can eagerly redirect to /admin. AdminLayout will kick them back out if they aren't admin.
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in. Please check your credentials.');
    }

    setLoading(false);
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>Four Sisters</h2>
          <p>Admin Portal</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label>Admin Email</label>
            <input 
              type="email" 
              required 
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@foursisters.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button disabled={loading} className="btn btn-primary w-100 admin-login-btn">
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <a href="/">&larr; Back to public website</a>
        </div>
      </div>
    </div>
  );
}
