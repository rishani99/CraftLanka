
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  ClipboardList,
  Clock,
  CheckCircle2,
  Truck,
  RefreshCw,
  Store,
  AlertCircle,
  ImagePlus,
} from 'lucide-react';
import api from '../../api';

const ORDERS_KEY = 'craftlanka_orders';
const USER_KEY = 'craftlanka_user';

const ORDER_STATUSES = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

const CATEGORIES = [
  'Wood Carving',
  'Batik',
  'Pottery',
  'Handloom',
];

function readStorage(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function formatPrice(value) {
  return `LKR ${Number(value || 0).toLocaleString('en-LK')}`;
}

function formatDate(value) {
  if (!value) return 'Date unavailable';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleString('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState(() =>
    readStorage(ORDERS_KEY)
  );
  const [user, setUser] = useState(() =>
    readStorage(USER_KEY, null)
  );

  const [activeTab, setActiveTab] = useState('products');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Pottery',
    price: '',
    stock: '',
    image: '',
    description: '',
  });

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setError('');

    try {
      const response = await api.get('/products/mine');

      const loadedProducts = (
        Array.isArray(response.data.products)
          ? response.data.products
          : []
      ).map((product) => ({
        ...product,
        id: product._id,
        name: product.title,
      }));

      setProducts(loadedProducts);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load products. Please check your login and backend.'
      );
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    setUser(readStorage(USER_KEY, null));
    loadProducts();
  }, [loadProducts]);

  const sellerEmail = String(user?.email || '')
    .trim()
    .toLowerCase();

  // Products returned by /products/mine belong to the authenticated seller.
  const sellerProducts = products;

  // Orders still use localStorage until the order API is implemented.
  const sellerOrders = orders.filter((order) => {
    const items = Array.isArray(order.items) ? order.items : [];

    return items.some((item) => {
      if (!item.sellerEmail) return true;

      return (
        String(item.sellerEmail).trim().toLowerCase() ===
        sellerEmail
      );
    });
  });

  const pendingOrders = sellerOrders.filter(
    (order) => (order.status || 'Pending') === 'Pending'
  ).length;

  const deliveredOrders = sellerOrders.filter(
    (order) => order.status === 'Delivered'
  ).length;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!form.name.trim()) {
      setError('Please enter the product name.');
      return;
    }

    if (
      form.price === '' ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) <= 0
    ) {
      setError('Enter a valid product price.');
      return;
    }

    if (
      form.stock === '' ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      setError('Enter a valid stock quantity.');
      return;
    }

    if (
      form.image.trim() &&
      !/^https?:\/\/\S+$/i.test(form.image.trim())
    ) {
      setError('Please enter a valid image URL beginning with http:// or https://.');
      return;
    }

    setSavingProduct(true);

    try {
      const response = await api.post('/products', {
        title: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image.trim(),
        description:
          form.description.trim() || 'Handmade craft item',
      });

      const product = response.data.product;

      const savedProduct = {
        ...product,
        id: product._id,
        name: product.title,
      };

      setProducts((previous) => [
        savedProduct,
        ...previous,
      ]);

      setForm({
        name: '',
        category: 'Pottery',
        price: '',
        stock: '',
        image: '',
        description: '',
      });

      setMessage('Product saved to MongoDB successfully!');
      setActiveTab('products');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to save product. Please check your connection and login.'
      );
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) return;

    setError('');
    setMessage('');
    setDeletingProductId(productId);

    try {
      await api.delete(`/products/${productId}`);

      setProducts((previous) =>
        previous.filter(
          (product) => String(product.id) !== String(productId)
        )
      );

      setMessage('Product deleted successfully.');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to delete product. Please try again.'
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  // Order statuses are still demo/localStorage data.
  // Replace this handler after implementing protected order endpoints.
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setError('');
    setMessage('');

    const updatedOrders = orders.map((order) =>
      String(order.id) === String(orderId)
        ? {
            ...order,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        : order
    );

    try {
      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(updatedOrders)
      );

      setOrders(updatedOrders);
      setMessage(`Order ${orderId} updated to ${newStatus}.`);
    } catch {
      setError('Unable to update the order status.');
    }
  };

  const getStatusIcon = (status) => {
    switch ((status || 'Pending').toLowerCase()) {
      case 'delivered':
        return <CheckCircle2 size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'cancelled':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const refreshDashboard = () => {
    setMessage('');
    setError('');
    setOrders(readStorage(ORDERS_KEY));
    setUser(readStorage(USER_KEY, null));
    loadProducts();
  };

  return (
    <main className="seller-dashboard-page">
      <header className="seller-dashboard-header">
        <div className="seller-dashboard-title">
          <span className="seller-dashboard-logo">
            <Store size={28} />
          </span>

          <div>
            <p className="eyebrow">CRAFTLANKA ARTISAN PORTAL</p>
            <h1>Seller Dashboard</h1>
            <p>
              Welcome, {user?.name || user?.fullName || 'Artisan'}!
              {' '}Manage your handmade products and orders.
            </p>
          </div>
        </div>

        <Link to="/products" className="seller-view-shop">
          <ShoppingBag size={17} />
          View Shop
        </Link>
      </header>

      <section className="seller-dashboard-stats">
        <article className="seller-stat-card">
          <span><Package size={22} /></span>
          <div>
            <p>Total Products</p>
            <strong>{sellerProducts.length}</strong>
          </div>
        </article>

        <article className="seller-stat-card">
          <span><ShoppingBag size={22} /></span>
          <div>
            <p>Total Orders</p>
            <strong>{sellerOrders.length}</strong>
          </div>
        </article>

        <article className="seller-stat-card">
          <span><Clock size={22} /></span>
          <div>
            <p>Pending Orders</p>
            <strong>{pendingOrders}</strong>
          </div>
        </article>

        <article className="seller-stat-card">
          <span><CheckCircle2 size={22} /></span>
          <div>
            <p>Delivered Orders</p>
            <strong>{deliveredOrders}</strong>
          </div>
        </article>
      </section>

      {message && (
        <div className="seller-dashboard-message" role="status">
          <CheckCircle2 size={18} />
          {message}
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setMessage('')}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="seller-dashboard-error" role="alert">
          <AlertCircle size={18} />
          {error}
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}

      <nav className="seller-dashboard-tabs">
        <button
          type="button"
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => {
            setActiveTab('products');
            setMessage('');
            setError('');
          }}
        >
          <Package size={18} />
          My Products
        </button>

        <button
          type="button"
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => {
            setActiveTab('add');
            setMessage('');
            setError('');
          }}
        >
          <Plus size={18} />
          Add Product
        </button>

        <button
          type="button"
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => {
            setActiveTab('orders');
            setMessage('');
            setError('');
          }}
        >
          <ClipboardList size={18} />
          Customer Orders ({sellerOrders.length})
        </button>
      </nav>

      {activeTab === 'products' && (
        <section className="seller-dashboard-section">
          <div className="seller-section-heading">
            <div>
              <h2>My Products</h2>
              <p>Manage your handmade craft collection.</p>
            </div>

            <button
              type="button"
              className="seller-primary-button"
              onClick={() => setActiveTab('add')}
            >
              <Plus size={17} />
              Add Product
            </button>
          </div>

          {loadingProducts ? (
            <div className="seller-dashboard-empty">
              <RefreshCw size={32} />
              <p>Loading your products...</p>
            </div>
          ) : sellerProducts.length === 0 ? (
            <div className="seller-dashboard-empty">
              <Package size={40} />
              <h3>No products yet</h3>
              <p>Add your first handmade product to your shop.</p>

              <button
                type="button"
                className="seller-primary-button"
                onClick={() => setActiveTab('add')}
              >
                <Plus size={17} />
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="seller-product-grid">
              {sellerProducts.map((product) => (
                <article
                  className="seller-product-card"
                  key={product.id}
                >
                  {product.image ? (
                    <img
                      className="seller-product-image"
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    <div className="seller-product-image seller-product-placeholder">
                      <ImagePlus size={34} />
                      <span>No image</span>
                    </div>
                  )}

                  <div className="seller-product-content">
                    <span className="seller-product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p className="seller-product-price">
                      {formatPrice(product.price)}
                    </p>

                    <p className="seller-product-stock">
                      Stock: {Number(product.stock ?? 0)}
                    </p>

                    {product.description && (
                      <p>{product.description}</p>
                    )}

                    <button
                      type="button"
                      className="seller-delete-button"
                      disabled={deletingProductId === product.id}
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 size={16} />
                      {deletingProductId === product.id
                        ? 'Deleting...'
                        : 'Delete Product'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'add' && (
        <section className="seller-dashboard-section">
          <div className="seller-section-heading">
            <div>
              <h2>Add New Product</h2>
              <p>Enter the details of your handmade item.</p>
            </div>
          </div>

          <form
            className="seller-product-form"
            onSubmit={handleAddProduct}
          >
            <label>
              Product Name *
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Handcrafted Ceramic Vase"
                maxLength={150}
                required
              />
            </label>

            <label>
              Category *
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <div className="seller-form-row">
              <label>
                Price (LKR) *
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="2500"
                  min="0.01"
                  step="0.01"
                  required
                />
              </label>

              <label>
                Available Stock *
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  step="1"
                  required
                />
              </label>
            </div>

            <label>
              Product Image URL
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
              />
              <small>
                Enter a publicly accessible image URL.
                Image upload is not implemented yet.
              </small>
            </label>

            <label>
              Product Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the materials, design and handmade details..."
                rows={4}
                maxLength={3000}
              />
            </label>

            <button
              type="submit"
              className="seller-primary-button seller-submit-button"
              disabled={savingProduct}
            >
              <Plus size={18} />
              {savingProduct ? 'Saving Product...' : 'Save Product'}
            </button>
          </form>
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="seller-dashboard-section">
          <div className="seller-section-heading">
            <div>
              <h2>Customer Orders</h2>
              <p>
                Review demo orders and update their delivery status.
              </p>
            </div>

            <button
              type="button"
              className="seller-refresh-button"
              onClick={refreshDashboard}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {sellerOrders.length === 0 ? (
            <div className="seller-dashboard-empty">
              <ShoppingBag size={40} />
              <h3>No customer orders yet</h3>
              <p>
                Order management is still using local demo data.
              </p>
            </div>
          ) : (
            <div className="seller-orders-list">
              {sellerOrders.map((order) => (
                <article
                  className="seller-order-card"
                  key={order.id}
                >
                  <div className="seller-order-heading">
                    <div>
                      <span className="seller-order-reference">
                        {order.id}
                      </span>
                      <span className="seller-order-date">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <span
                      className={`seller-order-status status-${(
                        order.status || 'Pending'
                      ).toLowerCase()}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status || 'Pending'}
                    </span>
                  </div>

                  <div className="seller-order-customer">
                    <h3>Customer Details</h3>
                    <p>
                      <strong>Name:</strong>{' '}
                      {order.customer?.fullName || 'Not provided'}
                    </p>
                    <p>
                      <strong>Email:</strong>{' '}
                      {order.customer?.email || 'Not provided'}
                    </p>
                    <p>
                      <strong>Phone:</strong>{' '}
                      {order.customer?.phone || 'Not provided'}
                    </p>
                    <p>
                      <strong>Address:</strong>{' '}
                      {[
                        order.customer?.address,
                        order.customer?.city,
                        order.customer?.postalCode,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'Not provided'}
                    </p>
                  </div>

                  <div className="seller-order-products">
                    <h3>Ordered Products</h3>

                    {(order.items || [])
                      .filter((item) => {
                        if (!item.sellerEmail) return true;

                        return (
                          String(item.sellerEmail)
                            .trim()
                            .toLowerCase() === sellerEmail
                        );
                      })
                      .map((item, index) => (
                        <div
                          className="seller-order-product"
                          key={`${order.id}-${item.id || index}-${index}`}
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.name} />
                          ) : (
                            <div className="seller-order-image-placeholder">
                              <Package size={20} />
                            </div>
                          )}

                          <div className="seller-order-product-info">
                            <strong>
                              {item.name || 'Handmade Product'}
                            </strong>
                            <span>
                              Quantity: {Number(item.quantity || 0)}
                            </span>
                          </div>

                          <strong>
                            {formatPrice(
                              Number(item.price || 0) *
                                Number(item.quantity || 0)
                            )}
                          </strong>
                        </div>
                      ))}
                  </div>

                  <div className="seller-order-footer">
                    <div>
                      <span>Payment Method</span>
                      <strong>
                        {order.paymentMethod === 'cod'
                          ? 'Cash on Delivery'
                          : order.paymentMethod === 'bank'
                          ? 'Bank Transfer'
                          : order.paymentMethod || 'Not specified'}
                      </strong>
                    </div>

                    <div>
                      <span>Order Total</span>
                      <strong>{formatPrice(order.total)}</strong>
                    </div>
                  </div>

                  <div className="seller-order-update">
                    <label htmlFor={`status-${order.id}`}>
                      Update Demo Order Status
                    </label>

                    <select
                      id={`status-${order.id}`}
                      value={order.status || 'Pending'}
                      onChange={(event) =>
                        handleUpdateOrderStatus(
                          order.id,
                          event.target.value
                        )
                      }
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default SellerDashboard;
