
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const demoProducts = [
  {
    id: 1,
    name: 'Handcrafted Ceramic Vase',
    category: 'Pottery',
    artisan: 'Local Artisan',
    price: 2800,
    image:
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 2,
    name: 'Natural Woven Basket',
    category: 'Handloom',
    artisan: 'Local Artisan',
    price: 1950,
    image:
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 3,
    name: 'Artisan Decorative Bowl',
    category: 'Pottery',
    artisan: 'Local Artisan',
    price: 2400,
    image:
      'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 4,
    name: 'Traditional Craft Collection',
    category: 'Wood Carving',
    artisan: 'Local Artisan',
    price: 3200,
    image:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 5,
    name: 'Batik Inspired Textile',
    category: 'Batik',
    artisan: 'Local Artisan',
    price: 3500,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 6,
    name: 'Handwoven Everyday Bag',
    category: 'Handloom',
    artisan: 'Local Artisan',
    price: 2200,
    image:
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=700&q=85',
  },
];

function loadSellerProducts() {
  try {
    const savedProducts = JSON.parse(
      localStorage.getItem('craftlanka_seller_products') || '[]'
    );

    if (!Array.isArray(savedProducts)) {
      return [];
    }

    return savedProducts
      .filter((product) => product && typeof product === 'object')
      .map((product, index) => ({
        ...product,
        // Use a unique string ID to avoid conflicts with demo products.
        id: String(
          product.id ||
          product._id ||
          `seller-${index}`
        ),
        name: product.name || product.title || 'Handmade Craft',
        category: product.category || 'Other',
        artisan:
          product.artisan ||
          product.sellerName ||
          'CraftLanka Artisan',
        price: Number(product.price) || 0,
        image: product.image || product.imageLabel || '',
      }));
  } catch (error) {
    console.error('Error loading seller products:', error);
    return [];
  }
}

function ProductCatalog() {
  const [searchParams] = useSearchParams();

  const [category, setCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [search, setSearch] = useState('');
  const [sellerProducts, setSellerProducts] = useState(loadSellerProducts);

  // Reload when another browser tab changes seller products.
  useEffect(() => {
    const refreshProducts = () => {
      setSellerProducts(loadSellerProducts());
    };

    window.addEventListener('storage', refreshProducts);

    return () => {
      window.removeEventListener('storage', refreshProducts);
    };
  }, []);

  // Keep the original demo products and add seller products.
  const allProducts = useMemo(
    () => [...demoProducts, ...sellerProducts],
    [sellerProducts]
  );

  const categories = [
    'All',
    'Wood Carving',
    'Batik',
    'Pottery',
    'Handloom',
  ];

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return allProducts.filter((product) => {
      const matchesCategory =
        category === 'All' || product.category === category;

      const matchesSearch =
        (product.name || '').toLowerCase().includes(searchText) ||
        (product.category || '').toLowerCase().includes(searchText) ||
        (product.artisan || '').toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [allProducts, category, search]);

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <p className="eyebrow">THE CRAFTLANKA COLLECTION</p>
        <h1>
          Find something <span>meaningful.</span>
        </h1>
        <p>
          Discover handmade treasures created by talented local artisans.
        </p>
      </section>

      <section className="catalog-content">
        <div className="catalog-toolbar">
          <div>
            <h2>Shop handmade</h2>
            <p>{filteredProducts.length} products to explore</p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search crafts..."
            aria-label="Search crafts"
            className="catalog-search"
          />
        </div>

        <div className="filter-list">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-chip ${
                category === item ? 'selected' : ''
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="catalog-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <Link
                  to={`/products/${encodeURIComponent(product.id)}`}
                  className="product-photo"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      <span>✦</span>
                      <p>Handmade Craft</p>
                    </div>
                  )}

                  <span className="product-badge">Handmade</span>
                </Link>

                <div className="product-details">
                  <p className="product-category">
                    {product.category}
                  </p>

                  <Link
                    to={`/products/${encodeURIComponent(product.id)}`}
                    className="product-name"
                  >
                    {product.name}
                  </Link>

                  <p className="product-artisan">
                    By {product.artisan}
                  </p>

                  <div className="product-footer">
                    <strong>
                      LKR {product.price.toLocaleString('en-LK')}
                    </strong>

                    <Link
                      to={`/products/${encodeURIComponent(product.id)}`}
                      className="product-view"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <span>⌕</span>
            <h3>No crafts found</h3>
            <p>
              Try another search or select a different category.
            </p>

            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setSearch('');
                setCategory('All');
              }}
            >
              Show all products
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductCatalog;
