import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  Package,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';

import { useCart } from '../../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    payment: 'cod',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = cartItems.length > 0 ? 350 : 0;
  const grandTotal = cartTotal + deliveryFee;

  const formatPrice = (price) =>
    `LKR ${Number(price || 0).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (isSubmitting) return;

    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add products before checkout.');
      return;
    }

    setIsSubmitting(true);

    let originalProducts = null;
    let stockWasSaved = false;

    try {
      // Read products and existing orders.
      originalProducts = localStorage.getItem(
        'craftlanka_seller_products'
      );

      const originalOrders = localStorage.getItem('craftlanka_orders');

      const savedProducts = JSON.parse(originalProducts || '[]');
      const savedOrders = JSON.parse(originalOrders || '[]');

      if (
        !Array.isArray(savedProducts) ||
        !Array.isArray(savedOrders)
      ) {
        throw new Error('Unable to read saved products or orders.');
      }

      // Validate product quantities and available stock.
      for (const item of cartItems) {
        const quantity = Number(item.quantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new Error(`Invalid quantity for ${item.name}.`);
        }

        const sellerProduct = savedProducts.find(
          (product) => String(product.id) === String(item.id)
        );

        // Demo products without seller stock tracking are allowed.
        if (!sellerProduct) continue;

        const availableStock = Number(sellerProduct.stock ?? 0);

        if (
          !Number.isInteger(availableStock) ||
          availableStock < quantity
        ) {
          throw new Error(
            `Not enough stock for "${item.name}". Available stock: ${availableStock}.`
          );
        }
      }

      // Decrease seller product stock.
      const updatedProducts = savedProducts.map((product) => {
        const cartItem = cartItems.find(
          (item) => String(item.id) === String(product.id)
        );

        if (!cartItem) return product;

        return {
          ...product,
          stock:
            Number(product.stock ?? 0) -
            Number(cartItem.quantity),
        };
      });

      const orderId = `CL-${Date.now()}`;

      const orderItems = cartItems.map((item) => {
        const sellerProduct = savedProducts.find(
          (product) => String(product.id) === String(item.id)
        );

        return {
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image || '',
          sellerEmail:
            sellerProduct?.sellerEmail || item.sellerEmail || '',
        };
      });

      const order = {
        id: orderId,

        customer: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          postalCode: form.postalCode.trim(),
        },

        items: orderItems,
        subtotal: Number(cartTotal),
        deliveryFee,
        total: Number(grandTotal),
        paymentMethod: form.payment,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      // Save the updated product stock.
      localStorage.setItem(
        'craftlanka_seller_products',
        JSON.stringify(updatedProducts)
      );

      stockWasSaved = true;

      try {
        // Save the new order without deleting previous orders.
        localStorage.setItem(
          'craftlanka_orders',
          JSON.stringify([order, ...savedOrders])
        );
      } catch (saveError) {
        // Restore stock if saving the order fails.
        if (originalProducts === null) {
          localStorage.removeItem('craftlanka_seller_products');
        } else {
          localStorage.setItem(
            'craftlanka_seller_products',
            originalProducts
          );
        }

        stockWasSaved = false;
        throw saveError;
      }

      // Clear the cart only after the order is saved.
      clearCart();

      // Go directly to the My Orders page.
      navigate('/my-orders');

    } catch (err) {
      console.error('Checkout error:', err);

      setError(
        err.message || 'Unable to place your order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <Link to="/cart" className="checkout-back-link">
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <div className="checkout-heading">
          <h1>Checkout</h1>
          <p>Complete your order from CraftLanka.</p>
        </div>

        {error && (
          <div className="checkout-error" role="alert">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="checkout-empty">
            <Package size={42} />
            <h2>Your cart is empty</h2>
            <p>Add some handmade products before checking out.</p>

            <Link
              to="/products"
              className="checkout-primary-button"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="checkout-layout">

            <form
              className="checkout-card"
              onSubmit={handleSubmit}
            >
              <section className="checkout-section">
                <h2>Delivery Information</h2>
                <p>Enter the details required to deliver your order.</p>

                <div className="checkout-fields">

                  <div className="checkout-field">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                      required
                    />
                  </div>

                  <div className="checkout-field checkout-field-full">
                    <label htmlFor="address">Street Address *</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House number and street"
                      autoComplete="street-address"
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      autoComplete="address-level2"
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="postalCode">Postal Code *</label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={form.postalCode}
                      onChange={handleChange}
                      placeholder="Postal code"
                      autoComplete="postal-code"
                      required
                    />
                  </div>

                </div>
              </section>

              <section className="checkout-section">
                <h2>Payment Method</h2>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={form.payment === 'cod'}
                    onChange={handleChange}
                  />

                  <Banknote size={23} />

                  <span>
                    <strong>Cash on Delivery</strong>
                    <small>Pay when your order arrives.</small>
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={form.payment === 'bank'}
                    onChange={handleChange}
                  />

                  <CreditCard size={23} />

                  <span>
                    <strong>Bank Transfer</strong>
                    <small>
                      Transfer instructions must be provided separately.
                    </small>
                  </span>
                </label>
              </section>

              <button
                type="submit"
                className="checkout-place-order"
                disabled={isSubmitting || cartItems.length === 0}
              >
                <ShieldCheck size={19} />
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="checkout-secure-note">
                <ShieldCheck size={15} />
                Your order will be saved for tracking.
              </p>
            </form>

            <aside className="checkout-summary">
              <h2>Order Summary</h2>

              <div className="checkout-items">
                {cartItems.map((item) => (
                  <div className="checkout-item" key={item.id}>

                    <div className="checkout-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <Package size={26} />
                      )}
                    </div>

                    <div className="checkout-item-info">
                      <h3>{item.name}</h3>
                      <p>Qty: {item.quantity}</p>
                      <strong>
                        {formatPrice(
                          Number(item.price) * Number(item.quantity)
                        )}
                      </strong>
                    </div>

                    <div className="checkout-item-actions">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        disabled={Number(item.quantity) <= 1}
                        onClick={() => {
                          if (Number(item.quantity) > 1) {
                            updateQuantity(
                              item.id,
                              Number(item.quantity) - 1
                            );
                          }
                        }}
                      >
                        <Minus size={14} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => {
                          try {
                            const sellerProducts = JSON.parse(
                              localStorage.getItem(
                                'craftlanka_seller_products'
                              ) || '[]'
                            );

                            const product = sellerProducts.find(
                              (saved) =>
                                String(saved.id) === String(item.id)
                            );

                            if (
                              product &&
                              Number(item.quantity) >=
                                Number(product.stock ?? 0)
                            ) {
                              setError(
                                `Only ${Number(product.stock ?? 0)} unit(s) of "${item.name}" are available.`
                              );
                              return;
                            }

                            setError('');

                            updateQuantity(
                              item.id,
                              Number(item.quantity) + 1
                            );
                          } catch (err) {
                            console.error(err);
                            setError('Unable to check product stock.');
                          }
                        }}
                      >
                        <Plus size={14} />
                      </button>

                      <button
                        type="button"
                        className="checkout-remove-item"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => {
                          removeFromCart(item.id);
                          setError('');
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              <div className="checkout-totals">
                <div>
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>

                <div>
                  <span className="checkout-delivery-label">
                    <Truck size={16} />
                    Delivery Fee
                  </span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>

                <div className="checkout-grand-total">
                  <strong>Total</strong>
                  <strong>{formatPrice(grandTotal)}</strong>
                </div>
              </div>

              <p className="checkout-summary-note">
                Handmade with care by Sri Lankan artisans.
              </p>
            </aside>

          </div>
        )}
      </div>
    </div>
  );
}