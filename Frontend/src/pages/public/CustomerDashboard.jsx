
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  Heart,
  ArrowRight,
  Store,
  LogOut
} from 'lucide-react';

function CustomerDashboard() {
  const navigate = useNavigate();

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem('craftlanka_user') || '{}');
  } catch {
    user = {};
  }

  const orders = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem('craftlanka_orders') || '[]');
      if (!Array.isArray(saved)) return [];
      return saved.filter(
        (order) => order.customer?.email === user.email
      );
    } catch {
      return [];
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem('craftlanka_user');
    navigate('/login');
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <p className="eyebrow">CUSTOMER SPACE</p>
          <h1>Welcome back, <span>{user.fullName || 'Craft Lover'}.</span></h1>
          <p>Discover handmade treasures and support local Sri Lankan artisans.</p>
        </div>
        <button className="dashboard-logout" onClick={handleLogout}>
          <LogOut size={17} /> Sign Out
        </button>
      </section>

      <section className="dashboard-stats">
        <article className="dashboard-stat">
          <span className="dashboard-stat-icon"><Package size={22} /></span>
          <div><strong>{orders.length}</strong><span>My Orders</span></div>
        </article>
        <article className="dashboard-stat">
          <span className="dashboard-stat-icon"><ShoppingBag size={22} /></span>
          <div><strong>Explore</strong><span>Handmade Products</span></div>
        </article>
        <article className="dashboard-stat">
          <span className="dashboard-stat-icon"><Store size={22} /></span>
          <div><strong>Local</strong><span>Artisan Community</span></div>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">YOUR ACCOUNT</p>
            <h2>What would you like to do?</h2>
          </div>
        </div>

        <div className="dashboard-action-grid">
          <Link to="/products" className="dashboard-action-card">
            <span className="dashboard-action-icon"><ShoppingBag size={25} /></span>
            <h3>Explore Products</h3>
            <p>Discover pottery, batik, handloom and wood carving.</p>
            <span className="dashboard-action-link">Start Shopping <ArrowRight size={16} /></span>
          </Link>

          <Link to="/my-orders" className="dashboard-action-card">
            <span className="dashboard-action-icon"><Package size={25} /></span>
            <h3>My Orders</h3>
            <p>View your previous orders and their current status.</p>
            <span className="dashboard-action-link">View Orders <ArrowRight size={16} /></span>
          </Link>

          <Link to="/cart" className="dashboard-action-card">
            <span className="dashboard-action-icon"><Heart size={25} /></span>
            <h3>My Cart</h3>
            <p>Review your selected handmade products before checkout.</p>
            <span className="dashboard-action-link">View Cart <ArrowRight size={16} /></span>
          </Link>
        </div>
      </section>

      <section className="dashboard-profile">
        <div>
          <p className="eyebrow">ACCOUNT INFORMATION</p>
          <h2>Your Details</h2>
        </div>
        <div className="dashboard-profile-details">
          <div><span>Full Name</span><strong>{user.fullName || 'Not available'}</strong></div>
          <div><span>Email Address</span><strong>{user.email || 'Not available'}</strong></div>
          <div><span>Account Type</span><strong>Customer</strong></div>
        </div>
      </section>
    </main>
  );
}

export default CustomerDashboard;
