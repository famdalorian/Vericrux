import { useState, useCallback, useEffect } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import logo from './assets/logo.png';
import './App.css';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
  }, []);

  const particlesLoaded = useCallback((container) => {
    if (container) {
      console.log("Particles container ready!");
    }
  }, []);

  return (
    <>
      {engineReady && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: "#000000" } },
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: true, mode: "grab" },
                resize: { enable: true }
              },
              modes: {
                push: { quantity: 6 },
                grab: { distance: 180, links: { opacity: 0.7 } }
              }
            },
            particles: {
              color: { value: "#dfff00" },
              links: {
                color: "#dfff00",
                distance: 180,
                enable: true,
                opacity: 0.4,
                width: 1.5
              },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "out" },
                random: true,
                speed: 4,
                straight: false
              },
              number: {
                density: { enable: true, area: 600 },
                value: 160
              },
              opacity: {
                value: 0.7,
                random: true,
                animation: { enable: true, speed: 2, minimumValue: 0.2 }
              },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 6 }, random: true }
            },
            detectRetina: true
          }}
        />
      )}

      <div className="overlay"></div>

      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="logo">
            <img src={logo} alt="VERICRUX" className="logo-img" />
          </a>
          <div className="nav-links">
            <a href="/shop">Shop</a>
            <a href="/blog">Blog</a>
            <a href="/contact">Contact</a>
            <a href="/shop" className="shop-btn">Shop Now</a>
          </div>
          <button
            className="hamburger md-hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? 'X' : '='}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu open">
            <div className="mobile-menu-inner">
              <a href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</a>
              <a href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</a>
              <a href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              <a href="/shop" className="shop-btn" onClick={() => setMobileMenuOpen(false)}>Shop Now</a>
            </div>
          </div>
        )}
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-logo-wrapper">
            <img src={logo} alt="VERICRUX" className="hero-logo" />
          </div>
          <h1 className="hero-title">
            <span className="text-white-defined">VERI</span>
            <span className="text-neon">CRUX</span>
          </h1>
          <p className="hero-tagline">
            The Crux of the Grind.
            <br className="br-sm" />
            Where pressure reveals strength.
          </p>
          <div className="cta-buttons">
            <a href="/shop" className="primary-btn">Explore Gear</a>
            <a href="/blog" className="outline-btn">Read the Blog</a>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="section-container">
          <h2 className="featured-heading">
            The VERICRUX <span>Way</span>
          </h2>
          <div className="brand-cards-grid">
            <div className="brand-card">
              <div className="brand-placeholder">MISSION</div>
              <div className="brand-info">
                <h3>Built for the Mat</h3>
                <p>We create gear that moves with you — durable, functional, and designed by practitioners who live the grind every day.</p>
                <a href="/about" className="card-link">Our Story →</a>
              </div>
            </div>
            <div className="brand-card">
              <div className="brand-placeholder">INSIGHTS</div>
              <div className="brand-info">
                <h3>Knowledge from the Mat</h3>
                <p>Technique breakdowns, mindset tips, training philosophy, and real stories from the BJJ community.</p>
                <a href="/blog" className="card-link">Latest Articles →</a>
              </div>
            </div>
            <div className="brand-card">
              <div className="brand-placeholder">COMMUNITY</div>
              <div className="brand-info">
                <h3>Join the Movement</h3>
                <p>Connect with grapplers worldwide. Share your journey and be part of something bigger than the roll.</p>
                <a href="/contact" className="card-link">Get Involved →</a>
              </div>
            </div>
          </div>
          <div className="text-center mt-20">
            <a href="/shop" className="collection-link">Discover the Gear →</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="section-container">
          <p className="logo">VERICRUX</p>
          <p className="tagline">Gear forged on the mat. Built for the fight. Engineered for you.</p>
          <div className="footer-links">
            <a href="/shop">Shop</a>
            <a href="/blog">Blog</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
          <p className="copyright">© {new Date().getFullYear()} VERICRUX. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;