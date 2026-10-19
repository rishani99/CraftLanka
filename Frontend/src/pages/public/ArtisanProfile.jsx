
import React from 'react';
import { Link, useParams } from 'react-router-dom';

const artisans = [
  {
    id: 1,
    name: 'Amara Perera',
    craft: 'Pottery Artist',
    location: 'Galle, Sri Lanka',
    category: 'Pottery',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=85',
    story: 'Amara creates beautiful handmade pottery inspired by nature and Sri Lankan traditions. Each piece is carefully shaped and finished to bring warmth and character into everyday living.',
    products: [
      { id: 1, name: 'Handcrafted Ceramic Vase', price: 2800, category: 'Pottery', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=85' },
      { id: 3, name: 'Artisan Decorative Bowl', price: 2400, category: 'Pottery', image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=700&q=85' },
    ],
  },
  {
    id: 2,
    name: 'Nimali Fernando',
    craft: 'Batik Designer',
    location: 'Matara, Sri Lanka',
    category: 'Batik',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85',
    story: 'Nimali designs colourful batik creations inspired by local culture and traditional patterns. Her work brings together creativity, colour, and a love for handmade textiles.',
    products: [
      { id: 5, name: 'Batik Inspired Textile', price: 3500, category: 'Batik', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=85' },
    ],
  },
  {
    id: 3,
    name: 'Kasun Silva',
    craft: 'Wood Carving Artist',
    location: 'Kandy, Sri Lanka',
    category: 'Wood Carving',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=85',
    story: 'Kasun creates decorative wooden pieces using traditional carving techniques. Every creation reflects patience, craftsmanship, and an appreciation for natural materials.',
    products: [
      { id: 4, name: 'Traditional Craft Collection', price: 3200, category: 'Wood Carving', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85' },
    ],
  },
  {
    id: 4,
    name: 'Dilani Jayawardena',
    craft: 'Handloom Weaver',
    location: 'Kurunegala, Sri Lanka',
    category: 'Handloom',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85',
    story: 'Dilani creates handmade textile products inspired by Sri Lankan weaving traditions. She focuses on thoughtful designs and useful accessories for everyday life.',
    products: [
      { id: 2, name: 'Natural Woven Basket', price: 1950, category: 'Handloom', image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=700&q=85' },
      { id: 6, name: 'Handwoven Everyday Bag', price: 2200, category: 'Handloom', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=700&q=85' },
    ],
  },
  {
    id: 5,
    name: 'Sahan Wijesinghe',
    craft: 'Ceramic Artist',
    location: 'Colombo, Sri Lanka',
    category: 'Pottery',
    image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=85',
    story: 'Sahan combines modern design with handmade ceramic techniques to create distinctive pieces for the home.',
    products: [
      { id: 3, name: 'Artisan Decorative Bowl', price: 2400, category: 'Pottery', image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=700&q=85' },
    ],
  },
  {
    id: 6,
    name: 'Tharushi Madushani',
    craft: 'Textile Artisan',
    location: 'Badulla, Sri Lanka',
    category: 'Handloom',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85',
    story: 'Tharushi creates handmade textile products with an appreciation for craftsmanship, traditional techniques, and sustainable living.',
    products: [
      { id: 6, name: 'Handwoven Everyday Bag', price: 2200, category: 'Handloom', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=700&q=85' },
    ],
  },
];

function ArtisanProfile() {
  const { id } = useParams();
  const artisan = artisans.find((item) => item.id === Number(id));

  if (!artisan) {
    return (
      <main className="artisan-not-found">
        <h1>Artisan not found</h1>
        <p>This artisan profile is not available.</p>
        <Link to="/artisans" className="btn-primary">
          Back to Artisans
        </Link>
      </main>
    );
  }

  return (
    <main className="artisan-profile-page">
      <div className="artisan-profile-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/artisans">Artisans</Link>
        <span>/</span>
        <span>{artisan.name}</span>
      </div>

      <section className="artisan-profile-hero">
        <div className="artisan-profile-image">
          <img src={artisan.image} alt={artisan.name} />
        </div>

        <div className="artisan-profile-info">
          <p className="eyebrow">MEET THE MAKER</p>
          <span className="artisan-profile-category">{artisan.category}</span>

          <h1>{artisan.name}</h1>
          <p className="artisan-profile-craft">{artisan.craft}</p>

          <p className="artisan-profile-location">
            <span aria-hidden="true">⌖</span> {artisan.location}
          </p>

          <p className="artisan-profile-story">{artisan.story}</p>

          <div className="artisan-profile-stats">
            <div>
              <strong>{artisan.products.length}</strong>
              <span>Products shown</span>
            </div>
            <div>
              <strong>Handmade</strong>
              <span>Craftsmanship</span>
            </div>
          </div>

          <a href="#artisan-products" className="btn-primary">
            Explore Products ↓
          </a>
        </div>
      </section>

      <section className="artisan-profile-products" id="artisan-products">
        <div className="artisan-products-heading">
          <div>
            <p className="eyebrow">MADE WITH CARE</p>
            <h2>Shop {artisan.name.split(' ')[0]}'s creations</h2>
          </div>
          <Link to="/products" className="artisan-all-products">
            All Products →
          </Link>
        </div>

        {artisan.products.length > 0 ? (
          <div className="catalog-grid">
            {artisan.products.map((product) => (
              <article className="product-card" key={product.id}>
                <Link
                  to={`/products/${product.id}`}
                  className="product-photo"
                >
                  <img src={product.image} alt={product.name} />
                  <span className="product-badge">Handmade</span>
                </Link>

                <div className="product-details">
                  <p className="product-category">{product.category}</p>

                  <Link
                    to={`/products/${product.id}`}
                    className="product-name"
                  >
                    {product.name}
                  </Link>

                  <p className="product-artisan">By {artisan.name}</p>

                  <div className="product-footer">
                    <strong>
                      LKR {product.price.toLocaleString('en-LK')}
                    </strong>
                    <Link
                      to={`/products/${product.id}`}
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
          <p>No products have been added yet.</p>
        )}
      </section>

      <section className="artisan-profile-contact">
        <h2>Love handmade crafts?</h2>
        <p>Discover more unique creations from Sri Lankan artisans.</p>
        <Link to="/products" className="btn-primary">
          Continue Shopping →
        </Link>
      </section>
    </main>
  );
}

export default ArtisanProfile;
