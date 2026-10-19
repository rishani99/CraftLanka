
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Leaf,
  Handshake,
  Palette,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

function About() {
  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="eyebrow">OUR STORY · OUR HERITAGE</p>

          <h1>
            Handmade with love.
            <br />
            <span>Rooted in Sri Lanka.</span>
          </h1>

          <p>
            We connect talented Sri Lankan artisans with people who value
            creativity, culture, and the beauty of handmade products.
          </p>

          <div className="about-hero-actions">
            <Link to="/products" className="btn-primary">
              Explore Our Collection <ArrowRight size={17} />
            </Link>

            <Link to="/artisans" className="about-text-link">
              Meet Our Artisans
            </Link>
          </div>
        </div>

        <div className="about-hero-image">
          <img
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=85"
            alt="Creative handmade craft workspace"
          />

          <div className="about-image-note">
            <Sparkles size={19} />
            <div>
              <strong>Made by hand</strong>
              <span>Inspired by tradition</span>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="about-intro">
        <p className="eyebrow">WHY CRAFTLANKA?</p>

        <h2>
          Every craft has a story.
          <br />
          <span>Every artisan deserves to be seen.</span>
        </h2>

        <p>
          CraftLanka is a handmade crafts marketplace designed to bring
          local artisans and customers together. From pottery and batik
          to wood carving and handloom, we celebrate the skills and
          creativity behind every handmade creation.
        </p>
      </section>

      {/* Mission and Vision */}
      <section className="about-purpose">
        <article className="purpose-card">
          <div className="purpose-icon">
            <Heart size={25} />
          </div>

          <p className="eyebrow">OUR MISSION</p>

          <h3>Supporting local creativity</h3>

          <p>
            Our mission is to help Sri Lankan artisans showcase their
            handmade products, reach more customers, and share their
            creative work with a wider audience.
          </p>
        </article>

        <article className="purpose-card purpose-card-highlight">
          <div className="purpose-icon">
            <Sparkles size={25} />
          </div>

          <p className="eyebrow">OUR VISION</p>

          <h3>Keeping traditions alive</h3>

          <p>
            Our vision is to create a trusted online space where traditional
            craftsmanship and modern shopping come together to celebrate
            Sri Lanka's creative heritage.
          </p>
        </article>
      </section>

      {/* Craft Categories */}
      <section className="about-crafts">
        <div className="about-section-heading">
          <p className="eyebrow">THE BEAUTY OF HANDMADE</p>
          <h2>Crafted with skill. Made with meaning.</h2>
          <p>
            Explore the different crafts and traditions represented in
            our marketplace.
          </p>
        </div>

        <div className="about-craft-grid">
          <Link
            to="/products?category=Wood%20Carving"
            className="about-craft-card"
          >
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=85"
              alt="Decorative handmade craft"
            />
            <div>
              <span>01</span>
              <h3>Wood Carving</h3>
              <p>Detailed designs shaped by skilled hands.</p>
            </div>
          </Link>

          <Link
            to="/products?category=Batik"
            className="about-craft-card"
          >
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=85"
              alt="Colourful textile craft"
            />
            <div>
              <span>02</span>
              <h3>Batik</h3>
              <p>Colourful patterns inspired by culture.</p>
            </div>
          </Link>

          <Link
            to="/products?category=Pottery"
            className="about-craft-card"
          >
            <img
              src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=85"
              alt="Handmade ceramic pottery"
            />
            <div>
              <span>03</span>
              <h3>Pottery</h3>
              <p>Beautiful creations shaped from clay.</p>
            </div>
          </Link>

          <Link
            to="/products?category=Handloom"
            className="about-craft-card"
          >
            <img
              src="https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=700&q=85"
              alt="Woven handmade craft"
            />
            <div>
              <span>04</span>
              <h3>Handloom</h3>
              <p>Textiles made with patience and care.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-values-heading">
          <p className="eyebrow">WHAT WE BELIEVE IN</p>
          <h2>More than a marketplace.</h2>
          <p>
            We believe handmade products carry value beyond their appearance.
          </p>
        </div>

        <div className="about-values-grid">
          <article>
            <div className="value-icon">
              <Handshake size={25} />
            </div>
            <h3>Community</h3>
            <p>
              Building connections between artisans and customers through
              a shared appreciation for handmade crafts.
            </p>
          </article>

          <article>
            <div className="value-icon">
              <Palette size={25} />
            </div>
            <h3>Creativity</h3>
            <p>
              Celebrating the unique ideas, artistic skills, and personal
              stories behind every creation.
            </p>
          </article>

          <article>
            <div className="value-icon">
              <Leaf size={25} />
            </div>
            <h3>Tradition</h3>
            <p>
              Recognising traditional craft techniques and the cultural
              knowledge passed between generations.
            </p>
          </article>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <p className="eyebrow">BE PART OF OUR STORY</p>

        <h2>Discover something truly meaningful.</h2>

        <p>
          Find handmade treasures or share your own craft with the world
          through CraftLanka.
        </p>

        <div className="about-cta-actions">
          <Link to="/products" className="btn-primary">
            Shop Handmade <ArrowRight size={17} />
          </Link>

          <Link to="/artisans" className="about-cta-secondary">
            Discover Artisans
          </Link>
        </div>
      </section>
    </main>
  );
}

export default About;
