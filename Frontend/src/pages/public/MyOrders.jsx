
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  CalendarDays
} from 'lucide-react';

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem('craftlanka_orders') || '[]'
      );

      setOrders(Array.isArray(savedOrders) ? savedOrders : []);
    } catch {
      setOrders([]);
    }
  }, []);

  const formatDate = (date) => {
    if (!date) return 'Date unavailable';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date unavailable';
    }

    return parsedDate.toLocaleString('en-LK', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = (status || 'Pending').toLowerCase();

    if (normalizedStatus === 'delivered') {
      return <CheckCircle2 size={17} />;
    }

    if (normalizedStatus === 'shipped') {
      return <Truck size={17} />;
    }

    if (normalizedStatus === 'cancelled') {
      return <XCircle size={17} />;
    }

    return <Clock size={17} />;
  };

  const getStatusClass = (status) => {
    const normalizedStatus = (status || 'Pending')
      .toLowerCase()
      .replace(/\s+/g, '-');

    return `order-status status-${normalizedStatus}`;
  };

  if (orders.length === 0) {
    return (
      <main className="my-orders-page">
        <div className="my-orders-empty">
          <div className="my-orders-empty-icon">
            <ShoppingBag size={42} />
          </div>

          <p className="eyebrow">YOUR CRAFTLANKA ACCOUNT</p>
          <h1>No orders <span>yet.</span></h1>
          <p>
            You haven't placed any orders yet. Explore our handmade
            collections and find something special.
          </p>

          <Link to="/products" className="btn-primary">
            Explore Products <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="my-orders-page">
      <section className="my-orders-hero">
        <div>
          <p className="eyebrow">YOUR CRAFTLANKA ACCOUNT</p>
          <h1>My <span>Orders.</span></h1>
          <p>
            Keep track of your handmade treasures and previous purchases.
          </p>
        </div>

        <div className="my-orders-count">
          <Package size={25} />
          <div>
            <strong>{orders.length}</strong>
            <span>{orders.length === 1 ? 'Order' : 'Orders'}</span>
          </div>
        </div>
      </section>

      <section className="my-orders-list">
        <div className="my-orders-list-heading">
          <h2>Order History</h2>
          <span>{orders.length} total</span>
        </div>

        {orders.map((order) => (
          <article className="my-order-card" key={order.id}>
            <div className="my-order-header">
              <div className="my-order-reference">
                <span className="my-order-icon">
                  <Package size={21} />
                </span>

                <div>
                  <strong>{order.id}</strong>
                  <span>
                    <CalendarDays size={14} />
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>

              <span className={getStatusClass(order.status)}>
                {getStatusIcon(order.status)}
                {order.status || 'Pending'}
              </span>
            </div>

            <div className="my-order-items">
              {(order.items || []).map((item, index) => (
                <div
                  className="my-order-item"
                  key={`${order.id}-${item.id}-${index}`}
                >
                  <img src={item.image} alt={item.name} />

                  <div className="my-order-item-info">
                    <strong>{item.name}</strong>
                    <span>Quantity: {item.quantity}</span>
                    <span>
                      LKR {(item.price * item.quantity).toLocaleString('en-LK')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-order-footer">
              <div className="my-order-payment">
                <span>Payment method</span>
                <strong>
                  {order.paymentMethod === 'cod'
                    ? 'Cash on Delivery'
                    : order.paymentMethod === 'bank'
                    ? 'Bank Transfer'
                    : order.paymentMethod || 'Not specified'}
                </strong>
              </div>

              <div className="my-order-total">
                <span>Order Total</span>
                <strong>
                  LKR {(order.total || 0).toLocaleString('en-LK')}
                </strong>
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="my-orders-bottom">
        <p>Thank you for supporting Sri Lankan artisans.</p>
        <Link to="/products" className="my-orders-shop-link">
          Continue Shopping <ArrowRight size={17} />
        </Link>
      </div>
    </main>
  );
}

export default MyOrders;
