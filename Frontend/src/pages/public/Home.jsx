import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const categories = [
  {
    title: 'Wood Carving',
    subtitle: 'Timeless wooden art',
    image:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85',
  },
  {
    title: 'Batik',
    subtitle: 'Patterns with a story',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=85',
  },
  {
    title: 'Pottery',
    subtitle: 'Earth turned into art',
    image:
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=85',
  },
  {
    title: 'Handloom',
    subtitle: 'Woven with tradition',
    image:
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=700&q=85',
  },
];

const fallbackImage =
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=85';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products from MongoDB through the backend API.
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/products');
      const data = response.data;

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
          ? data.products
          : [];

      setProducts(productList);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(
        'We could not load the products right now. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Return a category image when a product has no image.
  const getProductImage = (product) => {
    if (product.image && product.image.trim() !== '') {
      return product.image;
    }

    const category = categories.find(
      (item) => item.title === product.category
    );

    return category?.image || fallbackImage;
  };

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">
            <span>✦</span> MADE BY HAND, LOVED FOREVER
          </div>

          <h1>
            Handmade treasures.
            <br />
            <span>Stories worth sharing.</span>
          </h1>

          <p className="hero-description">
            Discover the beauty of Sri Lankan craftsmanship.
            Shop unique handmade creations or share your own
            craft with the world.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="btn-primary">
              Explore the Collection <span>→</span>
            </Link>

            <Link to="/signup" className="btn-outline">
              Sell Your Creations
            </Link>
          </div>

          <div className="hero-note">
            <div className="avatar-stack">
              <span>🌿</span>
              <span>🧵</span>
              <span>🏺</span>
            </div>

            <p>
              <strong>Made by local hands</strong>
              <br />
              Supporting Sri Lankan artisans
            </p>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-main">
            <img
              src={fallbackImage}
              alt="Handmade ceramic craft"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="floating-card floating-card-top">
            <span className="floating-icon">✿</span>
            <div>
              <strong>Made with care</strong>
              <p>Every piece tells a story</p>
            </div>
          </div>

          <div className="floating-card floating-card-bottom">
            <span className="floating-emoji">🧺</span>
            <div>
              <strong>Authentic crafts</strong>
              <p>From Sri Lanka, with love</p>
            </div>
          </div>

          <div className="hero-decoration">✳</div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefit-strip">
        <div>
          <span>✦</span> Authentic Handmade Crafts
        </div>
        <div>
          <span>♡</span> Support Local Artisans
        </div>
        <div>
          <span>❋</span> Unique Pieces, Meaningful Stories
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section category-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE OUR WORLD</p>
            <h2>Crafted by tradition.</h2>
            <p className="section-subtitle">
              Find something special in every corner of Sri Lanka.
            </p>
          </div>

          <Link to="/products" className="view-all">
            Explore all categories <span>→</span>
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              to={`/products?category=${encodeURIComponent(
                category.title
              )}`}
              className="category-card"
              key={category.title}
            >
              <div className="category-image">
                <img
                  src={category.image}
                  alt={category.title}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = fallbackImage;
                  }}
                />
                <span className="category-arrow">↗</span>
              </div>

              <div className="category-info">
                <h3>{category.title}</h3>
                <p>{category.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS FROM MONGODB */}
      <section className="section products-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A LITTLE SOMETHING SPECIAL</p>
            <h2>Our favourite finds.</h2>
            <p className="section-subtitle">
              Beautiful pieces, made slowly and thoughtfully.
            </p>
          </div>

          <Link to="/products" className="view-all">
            Shop all products <span>→</span>
          </Link>
        </div>

        {loading && (
          <div className="products-message">
            Loading handmade products...
          </div>
        )}

        {!loading && error && (
          <div className="products-message">
            <p>{error}</p>
            <button
              type="button"
              className="btn-primary"
              onClick={fetchProducts}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="products-message">
            <h3>No products yet</h3>
            <p>
              Our artisans are preparing their handmade creations.
              Please check back soon.
            </p>
            <Link to="/products" className="btn-primary">
              Explore Products <span>→</span>
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="featured-grid">
            {products.slice(0, 8).map((product, index) => {
              const productId = product._id || product.id;
              const productName =
                product.title || product.name || 'Handmade Product';

              const sellerName =
                typeof product.seller === 'object'
                  ? product.seller?.name
                  : product.sellerName;

              return (
                <article
                  className="product-card"
                  key={productId || index}
                >
                  <Link
                    to={
                      productId
                        ? `/products/${productId}`
                        : '/products'
                    }
                    className="product-photo"
                  >
                    <img
                      src={getProductImage(product)}
                      alt={productName}
                      loading="lazy"
                      onError={(event) => {
                        if (
                          event.currentTarget.src !== fallbackImage
                        ) {
                          event.currentTarget.src = fallbackImage;
                        } else {
                          event.currentTarget.onerror = null;
                        }
                      }}
                    />

                    <span className="product-badge">
                      Artisan made
                    </span>
                  </Link>

                  <div className="product-details">
                    <p className="product-category">
                      {product.category || 'Handmade'}
                    </p>

                    <Link
                      to={
                        productId
                          ? `/products/${productId}`
                          : '/products'
                      }
                      className="product-name"
                    >
                      {productName}
                    </Link>

                    <p className="product-artisan">
                      By {sellerName || 'Local Artisan'}
                    </p>

                    <div className="product-footer">
                      <strong>
                        LKR{' '}
                        {Number(product.price || 0).toLocaleString(
                          'en-LK'
                        )}
                      </strong>

                      <Link
                        to={
                          productId
                            ? `/products/${productId}`
                            : '/products'
                        }
                        className="product-view"
                        aria-label={`View ${productName}`}
                      >
                        →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ARTISAN SECTION */}
      <section className="artisan-section">
        <div className="artisan-photo">
          <img
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=85"
            alt="Creative handmade work"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackImage;
            }}
          />
        </div>

        <div className="artisan-copy">
          <p className="eyebrow">YOUR HANDS. YOUR HERITAGE.</p>
          <h2>Your craft deserves to be discovered.</h2>

          <p>
            Are you a maker, artist or craft enthusiast?
            Create your own shop, showcase your products and
            connect with customers who value handmade work.
          </p>

          <ul>
            <li>✓ Create your own artisan shop</li>
            <li>✓ Showcase your handmade products</li>
            <li>✓ Manage your products and orders</li>
          </ul>

          <Link to="/signup" className="btn-primary">
            Open Your Shop <span>→</span>
          </Link>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="newsletter-section">
        <p className="eyebrow">A NOTE FROM CRAFTLANKA</p>
        <h2>Bring a little handmade joy into your life.</h2>
        <p>
          Explore thoughtful creations and support the people behind them.
        </p>

        <Link to="/products" className="btn-light">
          Find Your Favourite <span>→</span>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="brand footer-logo">
              <span className="brand-icon">✦</span>
              <span>
                Craft<span className="brand-highlight">Lanka</span>
              </span>
            </Link>

            <p>
              A home for Sri Lankan handmade crafts,
              local creativity and stories worth sharing.
            </p>
          </div>

          <div className="footer-column">
            <h4>Discover</h4>
            <Link to="/products">Shop All</Link>
            <Link to="/products">Categories</Link>
            <Link to="/artisans">Meet Artisans</Link>
          </div>

          <div className="footer-column">
            <h4>Sell With Us</h4>
            <Link to="/signup">Open a Shop</Link>
            <Link to="/login">Artisan Login</Link>
          </div>

          <div className="footer-column">
            <h4>CraftLanka</h4>
            <Link to="/about">Our Story</Link>
            <Link to="/login">My Account</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} CraftLanka.
            Made with care in Sri Lanka.
          </p>
          <p>Celebrating handmade, supporting local.</p>
        </div>
      </footer>
    </main>
  );
}

export default Home;