
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function HeaderNav() {
  const { cartCount } = useCart();

  return (
    <header className="site-header">
      <div className="navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">✦</span>
          <span>
            Craft<span className="brand-highlight">Lanka</span>
          </span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Shop</Link>
          <Link to="/products#categories">Categories</Link>
          <Link to="/artisans">Artisans</Link>
          <Link to="/about">Our Story</Link>
          <Link to="/my-orders">My Orders</Link>
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-link">
            <span>♧</span>
            <span>Cart ({cartCount})</span>
          </Link>

          <Link to="/login" className="sign-in">
            Sign In
          </Link>

          <Link to="/signup" className="join-btn">
            Join Us
          </Link>
        </div>
      </div>
    </header>
  );
}

export default HeaderNav;
