
import React from 'react';
import { Link } from 'react-router-dom';

const artisans = [
  {
    id: 1,
    name: 'Amara Perera',
    craft: 'Pottery Artist',
    location: 'Galle, Sri Lanka',
    category: 'Pottery',
    description: 'Creating beautiful handmade pottery inspired by nature and traditional Sri Lankan artistry.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&q=85',
    products: 12,
  },
  {
    id: 2,
    name: 'Nimali Fernando',
    craft: 'Batik Designer',
    location: 'Matara, Sri Lanka',
    category: 'Batik',
    description: 'Designing colourful batik creations that celebrate local culture, patterns, and creativity.',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=700&q=85',
    products: 18,
  },
  {
    id: 3,
    name: 'Kasun Silva',
    craft: 'Wood Carving Artist',
    location: 'Kandy, Sri Lanka',
    category: 'Wood Carving',
    description: 'Crafting decorative wooden pieces with care, patience, and traditional carving techniques.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=85',
    products: 9,
  },
  {
    id: 4,
    name: 'Dilani Jayawardena',
    craft: 'Handloom Weaver',
    location: 'Kurunegala, Sri Lanka',
    category: 'Handloom',
    description: 'Making handmade textiles and woven accessories inspired by traditional weaving.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=85',
    products: 15,
  },
  {
    id: 5,
    name: 'Sahan Wijesinghe',
    craft: 'Ceramic Artist',
    location: 'Colombo, Sri Lanka',
    category: 'Pottery',
    description: 'Combining modern design with handmade ceramic techniques to create unique home accessories.',
    image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=700&q=85',
    products: 11,
  },
  {
    id: 6,
    name: 'Tharushi Madushani',
    craft: 'Textile Artisan',
    location: 'Badulla, Sri Lanka',
    category: 'Handloom',
    description: 'Creating handmade textile products with an appreciation for craftsmanship and sustainable living.',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=700&q=85',
    products: 14,
  },
];

function Artisans() {
  return (
    <main className="artisans-page">
      <section className="artisans-hero">
        <p className="eyebrow">THE PEOPLE BEHIND THE CRAFT</p>
        <h1>Meet our <span>artisans.</span></h1>
        <p>
          Every handmade creation has a story. Meet the talented people
          preserving traditions and creating beautiful crafts in Sri Lanka.
        </p>

        <a href="#artisan-list" className="btn-primary">
          Meet the Makers ↓
        </a>
      </section>

      <section className="artisans-intro">
        <div>
          <p className="eyebrow">MADE WITH PURPOSE</p>
          <h2>Real people. Real craftsmanship.</h2>
        </div>

        <p>
          CraftLanka connects customers with artisans who bring creativity,
          skill, and care to every handmade product. Explore their crafts
          and discover something meaningful.
        </p>
      </section>

      <section className="artisans-list" id="artisan-list">
        <div className="artisans-section-heading">
          <div>
            <p className="eyebrow">OUR CREATIVE COMMUNITY</p>
            <h2>Discover our makers</h2>
          </div>

          <span>{artisans.length} artisans</span>
        </div>

        <div className="artisans-grid">
          {artisans.map((artisan) => (
            <article className="artisan-card" key={artisan.id}>
              <Link
                to={`/artisans/${artisan.id}`}
                className="artisan-photo"
                aria-label={`View ${artisan.name}'s profile`}
              >
                <img src={artisan.image} alt={artisan.name} />
                <span className="artisan-category">
                  {artisan.category}
                </span>
              </Link>

              <div className="artisan-card-content">
                <p className="artisan-craft">{artisan.craft}</p>

                <h3>{artisan.name}</h3>

                <p className="artisan-location">
                  <span aria-hidden="true">⌖</span> {artisan.location}
                </p>

                <p className="artisan-description">
                  {artisan.description}
                </p>

                <div className="artisan-card-footer">
                  <span>{artisan.products} products</span>

                  <Link
                    to={`/artisans/${artisan.id}`}
                    className="artisan-view-link"
                  >
                    View Shop →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="artisan-join-section">
        <div>
          <p className="eyebrow">ARE YOU A CRAFT MAKER?</p>
          <h2>Your craft deserves to be discovered.</h2>
          <p>
            Join CraftLanka and share your handmade creations with customers
            who appreciate local craftsmanship.
          </p>
        </div>

        <Link to="/signup" className="btn-primary">
          Become an Artisan →
        </Link>
      </section>
    </main>
  );
}

export default Artisans;
