
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const demoProducts = [
  {
    id: 1,
    name: 'Handcrafted Ceramic Vase',
    category: 'Pottery',
    artisan: 'Local Artisan',
    price: 2800,
    image:
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85',
    description:
      'A beautiful handmade ceramic vase crafted with care by a local artisan. Perfect for decorating your living room, bedroom, or workspace.',
  },
  {
    id: 2,
    name: 'Natural Woven Basket',
    category: 'Handloom',
    artisan: 'Local Artisan',
    price: 1950,
    image:
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1000&q=85',
    description:
      'A natural woven basket inspired by traditional craftsmanship. A practical and stylish addition to your home.',
  },
  {
    id: 3,
    name: 'Artisan Decorative Bowl',
    category: 'Pottery',
    artisan: 'Local Artisan',
    price: 2400,
    image:
      'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1000&q=85',
    description:
      'A decorative handmade piece that brings warmth and character to your home. Each piece celebrates the beauty of artisan work.',
  },
  {
    id: 4,
    name: 'Traditional Craft Collection',
    category: 'Wood Carving',
    artisan: 'Local Artisan',
    price: 3200,
    image:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
    description:
      'A traditional craft item inspired by Sri Lankan handmade artistry. Ideal for your home or as a thoughtful gift.',
  },
  {
    id: 5,
    name: 'Batik Inspired Textile',
    category: 'Batik',
    artisan: 'Local Artisan',
    price: 3500,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=85',
    description:
      'A textile inspired by the colours and patterns of traditional batik. Bring a touch of local creativity into your space.',
  },
  {
    id: 6,
    name: 'Handwoven Everyday Bag',
    category: 'Handloom',
    artisan: 'Local Artisan',
    price: 2200,
    image:
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=85',
    description:
      'A versatile handwoven bag for everyday use, celebrating traditional techniques and handmade style.',
  },
];

function loadSellerProducts() {
  try {
    const saved = JSON.parse(
      localStorage.getItem('craftlanka_seller_products') || '[]'
    );

    if (!Array.isArray(saved)) return [];

    return saved
      .filter((item) => item && typeof item === 'object')
      .map((item, index) => ({
        ...item,
        id: String(item.id || item._id || `seller-${index}`),
        name: item.name || item.title || 'Handmade Craft',
        category: item.category || 'Other',
        artisan:
          item.artisan || item.sellerName || 'CraftLanka Artisan',
        price: Number(item.price) || 0,
        stock:
          item.stock === undefined ? null : Number(item.stock),
        image: item.image || item.imageLabel || '',
        description:
          item.description ||
          'A handmade product offered by a CraftLanka artisan.',
      }));
  } catch (error) {
    console.error('Unable to load seller products:', error);
    return [];
  }
}

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sellerProducts, setSellerProducts] = useState(loadSellerProducts);

  useEffect(() => {
    const refreshProducts = () => {
      setSellerProducts(loadSellerProducts());
    };

    window.addEventListener('storage', refreshProducts);

    return () => {
      window.removeEventListener('storage', refreshProducts);
    };
  }, []);

  const allProducts = [...demoProducts, ...sellerProducts];

  const product = allProducts.find(
    (item) => String(item.id) === String(id)
  );

  if (!product) {
    return (
      <main className="placeholder-page">
        <h1>Product not found</h1>
        <p>Sorry, we could not find that product.</p>
        <Link to="/products" className="btn-primary">
          Back to Shop
        </Link>
      </main>
    );
  }

  const stock = product.stock;
  const hasStockLimit =
    stock !== null &&
    Number.isFinite(stock) &&
    stock >= 0;

  const outOfStock = hasStockLimit && stock < 1;

  const handleAddToCart = () => {
    if (outOfStock) return;

    if (hasStockLimit && quantity > stock) {
      alert(`Only ${stock} item(s) are currently available.`);
      setQuantity(Math.max(1, stock));
      return;
    }

    addToCart(
      {
        ...product,
        id: product.id,
      },
      quantity
    );

    setAdded(true);
  };

  return (
    <main className="product-detail-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <section className="detail-layout">
        <div className="detail-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="product-image-placeholder">
              <span>✦</span>
              <p>Handmade Craft</p>
            </div>
          )}
          <span className="product-badge">Handmade</span>
        </div>

        <div className="detail-content">
          <p className="detail-category">{product.category}</p>

          <h1>{product.name}</h1>

          <p className="detail-artisan">
            Crafted by <strong>{product.artisan}</strong>
          </p>

          <p className="detail-price">
            LKR {product.price.toLocaleString('en-LK')}
          </p>

          <p className="detail-description">
            {product.description}
          </p>

          <div className="detail-info">
            <p>
              <strong>Product type:</strong> Handmade craft
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Artisan:</strong> {product.artisan}
            </p>

            {hasStockLimit && (
              <p>
                <strong>Available stock:</strong>{' '}
                {stock > 0 ? stock : 'Out of stock'}
              </p>
            )}
          </div>

          {!outOfStock && (
            <div className="quantity-control">
              <span>Quantity</span>

              <div className="quantity-buttons">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      hasStockLimit
                        ? Math.min(stock, current + 1)
                        : current + 1
                    )
                  }
                  disabled={hasStockLimit && quantity >= stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            className="add-cart-btn"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            {outOfStock
              ? 'Out of Stock'
              : `Add to Cart — LKR ${(product.price * quantity).toLocaleString('en-LK')}`}
          </button>

          {added && (
            <div className="success-message">
              <span>✓</span> Added to your cart successfully.
              <Link to="/cart"> View Cart</Link>
            </div>
          )}

          <p className="detail-note">
            Every purchase helps support local Sri Lankan artisans.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
