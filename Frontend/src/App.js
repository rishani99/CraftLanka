
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import HeaderNav from './components/HeaderNav';
import Home from './pages/public/Home';
import ProductCatalog from './pages/public/ProductCatalog';
import ProductDetails from './pages/public/ProductDetails';
import Cart from './pages/public/Cart';
import { CartProvider } from './context/CartContext';
import Artisans from './pages/public/Artisans';
import ArtisanProfile from './pages/public/ArtisanProfile';
import About from './pages/public/About';
import Checkout from './pages/public/Checkout';
import OrderSuccess from './pages/public/OrderSuccess';
import MyOrders from './pages/public/MyOrders';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import CustomerDashboard from './pages/public/CustomerDashboard';
import SellerDashboard from './pages/public/SellerDashboard';

import './App.css';

function PlaceholderPage({ title, description }) {
  return (
    <main className="placeholder-page">
      <p className="eyebrow">CRAFTLANKA</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <a className="btn-primary" href="/products">
        Explore Products →
      </a>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <HeaderNav />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/artisans" element={<Artisans />} />
            <Route path="/artisans/:id" element={<ArtisanProfile />} />
          <Route
            path="/artisans"
            element={
              <PlaceholderPage
                title="Meet Our Artisans"
                description="Discover the talented people behind Sri Lankan handmade crafts."
              />
            }
          />
          <Route
            path="/about"
            element={
              <PlaceholderPage
                title="Our Story"
                description="CraftLanka connects local artisans with people who appreciate handmade creations."
              />
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <PlaceholderPage
                title="Checkout"
                description="The checkout page will be implemented next."
              />
            }
          />
          <Route path="/login" element={<Navigate to="/products" replace />} />
          <Route path="/signup" element={<Navigate to="/products" replace />} />
          <Route
            path="*"
            element={
              <PlaceholderPage
                title="Page Not Found"
                description="The page you are looking for does not exist."
              />
            }
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
