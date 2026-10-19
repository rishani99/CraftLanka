import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShoppingBag,
  CalendarDays,
  MapPin,
} from 'lucide-react';

function OrderSuccess() {
  const { orderId } = useParams();

  let order = null;

  try {
    const orders = JSON.parse(
      localStorage.getItem('craftlanka_orders') || '[]'
    );

    order = Array.isArray(orders)
      ? orders.find((item) => String(item.id) === String(orderId))
      : null;
  } catch (error) {
    console.error('Unable to load order:', error);
  }

  if (!order) {
    return (
      <main className="order-success-page">
        <Package size={44} />

        <h1>Order details not found</h1>

        <p>
          This order could not be found in this browser.
          Please check your order reference.
        </p>

        <Link to="/products" className="btn-primary">
          <ShoppingBag size={17} />
          Continue Shopping
        </Link>
      </main>
    );
  }

  const formatPrice = (amount) =>
    `LKR ${Number(amount || 0).toLocaleString('en-LK')}`;

  const formatDate = (date) => {
    if (!date) return 'Date unavailable';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date unavailable';
    }

    return parsedDate.toLocaleString('en-LK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const paymentMethod =
    order.paymentMethod === 'cod'
      ? 'Cash on Delivery'
      : order.paymentMethod === 'bank'
      ? 'Bank Transfer'
      : order.paymentMethod || 'Not specified';

  return (
    <main className="order-success-page">
      <div className="order-success-icon">
        <CheckCircle2 size={46} />
      </div>

      <p className="eyebrow">
        THANK YOU FOR SUPPORTING LOCAL CRAFTS
      </p>

      <h1>Your demo order is placed!</h1>

      <p className="order-success-message">
        Thank you, {order.customer?.fullName || 'Customer'}.
        Your order details have been saved in this browser.
      </p>

      <section className="order-success-card">
        <div>
          <span>Order Reference</span>
          <strong>{order.id}</strong>
        </div>

        <div>
          <span>Order Status</span>
          <strong>{order.status || 'Pending'}</strong>
        </div>

        <div>
          <span>Payment Method</span>
          <strong>{paymentMethod}</strong>
        </div>

        <div>
          <span>Order Date</span>
          <strong>{formatDate(order.createdAt)}</strong>
        </div>
      </section>

      <section className="order-success-items">
        <h2>Items Ordered</h2>

        {(order.items || []).map((item, index) => (
          <div
            className="order-success-item"
            key={`${item.id}-${index}`}
          >
            {item.image ? (
              <img src={item.image} alt={item.name || 'Craft product'} />
            ) : (
              <div className="order-success-image-placeholder">
                <Package size={25} />
              </div>
            )}

            <div>
              <strong>{item.name || 'Handmade Product'}</strong>
              <span>Quantity: {Number(item.quantity || 0)}</span>
              <span>{formatPrice(item.price)} each</span>
            </div>

            <strong>
              {formatPrice(
                Number(item.price || 0) * Number(item.quantity || 0)
              )}
            </strong>
          </div>
        ))}
      </section>

      <section className="order-success-totals">
        <div>
          <span>Subtotal</span>
          <strong>{formatPrice(order.subtotal)}</strong>
        </div>

        <div>
          <span>Delivery Fee</span>
          <strong>{formatPrice(order.deliveryFee)}</strong>
        </div>

        <div className="order-success-grand-total">
          <span>Total Amount</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
      </section>

      <section className="order-success-delivery">
        <MapPin size={20} />

        <div>
          <strong>Delivery Address</strong>
          <p>
            {order.customer?.address || ''}
            {order.customer?.city
              ? `, ${order.customer.city}`
              : ''}
            {order.customer?.postalCode
              ? ` ${order.customer.postalCode}`
              : ''}
          </p>

          <p>
            Contact: {order.customer?.phone || 'Not provided'}
          </p>
        </div>
      </section>

      <div className="order-success-actions">
        <Link to="/products" className="btn-primary">
          Continue Shopping <ArrowRight size={17} />
        </Link>

        <Link to="/my-orders" className="order-success-secondary">
          <CalendarDays size={17} />
          View My Orders
        </Link>
      </div>

      <p className="order-success-disclaimer">
        Demo only: no real payment was processed and no delivery
        has been arranged.
      </p>
    </main>
  );
}

export default OrderSuccess;