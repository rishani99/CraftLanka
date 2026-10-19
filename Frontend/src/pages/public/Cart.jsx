
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  return (
    <main className="cart-page">
      <section className="cart-heading">
        <p className="eyebrow">YOUR CRAFTLANKA BAG</p>
        <h1>Your Shopping Cart</h1>
        <p>Review your handmade treasures before checkout.</p>
      </section>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-cart-icon">♡</div>
          <h2>Your cart is waiting for something special.</h2>
          <p>Explore handmade products from talented local artisans.</p>
          <Link to="/products" className="btn-primary">
            Explore Products →
          </Link>
        </div>
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <article className="cart-row" key={item.id}>
                <img
                  className="cart-thumb"
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-item-info">
                  <p className="product-category">{item.category}</p>
                  <Link
                    to={`/products/${item.id}`}
                    className="cart-item-name"
                  >
                    {item.name}
                  </Link>
                  <p className="cart-item-price">
                    LKR {item.price.toLocaleString('en-LK')}
                  </p>

                  <div className="cart-quantity">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <strong>
                    LKR {(item.price * item.quantity).toLocaleString('en-LK')}
                  </strong>
                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}

            <Link to="/products" className="continue-shopping">
              ← Continue shopping
            </Link>
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="cart-total-row">
              <span>Subtotal</span>
              <span>LKR {cartTotal.toLocaleString('en-LK')}</span>
            </div>

            <div className="cart-total-row">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="cart-total-row cart-grand-total">
              <strong>Subtotal</strong>
              <strong>LKR {cartTotal.toLocaleString('en-LK')}</strong>
            </div>

            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout →
            </Link>

            <p className="cart-summary-note">
              Delivery charges are not included in this subtotal.
            </p>
          </aside>
        </section>
      )}
    </main>
  );
}

export default Cart;
