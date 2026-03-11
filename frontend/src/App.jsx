import { useState, useCallback, useEffect, useRef } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import * as THREE from "three";
import logo from "./assets/logo.png";
import "./App.css";

function HeroGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const material = new THREE.LineBasicMaterial({
      color: 0xdfff00,
      transparent: true,
      opacity: 0.18,
    });
    const globe = new THREE.LineSegments(wireframe, material);
    scene.add(globe);

    const innerGeo = new THREE.SphereGeometry(0.97, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xdfff00,
      transparent: true,
      opacity: 0.03,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    const dotCount = 300;
    const dotGeo = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < dotCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.05 + Math.random() * 0.6;
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
    }
    dotGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    const dotMat = new THREE.PointsMaterial({
      color: 0xdfff00,
      size: 0.018,
      transparent: true,
      opacity: 0.7,
    });
    const dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let clickPulse = 0;

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
    };

    const onMouseDown = () => {
      clickPulse = 1;
    };

    const onMouseUp = () => {};

    mount.addEventListener("mousemove", onMouseMove);
    mount.addEventListener("mousedown", onMouseDown);
    mount.addEventListener("mouseup", onMouseUp);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      globe.rotation.y += 0.003;
      globe.rotation.x += 0.001;
      dots.rotation.y -= 0.002;
      dots.rotation.x -= 0.001;

      globe.rotation.x += targetY * 0.02;
      globe.rotation.y += targetX * 0.02;

      if (clickPulse > 0) {
        clickPulse -= 0.03;
        const pulse = 1 + clickPulse * 0.15;
        globe.scale.set(pulse, pulse, pulse);
        dots.scale.set(pulse, pulse, pulse);
        material.opacity = 0.18 + clickPulse * 0.3;
      } else {
        globe.scale.set(1, 1, 1);
        dots.scale.set(1, 1, 1);
        material.opacity =
          0.18 + Math.abs(targetX) * 0.1 + Math.abs(targetY) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      mount.removeEventListener("mousemove", onMouseMove);
      mount.removeEventListener("mousedown", onMouseDown);
      mount.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        cursor: "crosshair",
      }}
    />
  );
}

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
                resize: { enable: true },
              },
              modes: {
                push: { quantity: 6 },
                grab: { distance: 180, links: { opacity: 0.7 } },
              },
            },
            particles: {
              color: { value: "#dfff00" },
              links: {
                color: "#dfff00",
                distance: 180,
                enable: true,
                opacity: 0.4,
                width: 1.5,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "out" },
                random: true,
                speed: 4,
                straight: false,
              },
              number: {
                density: { enable: true, area: 600 },
                value: 160,
              },
              opacity: {
                value: 0.7,
                random: true,
                animation: { enable: true, speed: 2, minimumValue: 0.2 },
              },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 6 }, random: true },
            },
            detectRetina: true,
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
      <a href="https://vericrux.myshopify.com/?pb=0">Shop</a>
      <a href="/blog">Blog</a>
      <a href="/contact">Contact</a>
      <a href="https://vericrux.myshopify.com/?pb=0" className="shop-btn">Shop Now</a>
    </div>
    <button
      className={`hamburger md-hidden ${mobileMenuOpen ? 'is-open' : ''}`}
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      aria-label="Toggle menu"
    >
      <span className="ham-line"></span>
      <span className="ham-line"></span>
      <span className="ham-line"></span>
    </button>
  </div>

  <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
    <div className="mobile-menu-inner">
      <a href="https://vericrux.myshopify.com/?pb=0" className="mob-link" style={{ '--i': 0 }} onClick={() => setMobileMenuOpen(false)}>Shop</a>
      <a href="/blog" className="mob-link" style={{ '--i': 1 }} onClick={() => setMobileMenuOpen(false)}>Blog</a>
      <a href="/contact" className="mob-link" style={{ '--i': 2 }} onClick={() => setMobileMenuOpen(false)}>Contact</a>
      <a href="https://vericrux.myshopify.com/?pb=0" className="mob-link shop-btn" style={{ '--i': 3 }} onClick={() => setMobileMenuOpen(false)}>Shop Now</a>
    </div>
  </div>
</nav>

      <section className="hero" style={{ position: "relative", overflow: "hidden" }}>
        <HeroGlobe />
        <div className="hero-content" style={{ position: "relative", zIndex: 2 }}>
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
            <a href="https://vericrux.myshopify.com/?pb=0" className="primary-btn">Explore Gear</a>
            <a href="/blog" className="outline-btn">Read the Blog</a>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="section-container">
          <h2
            className="featured-heading glitch-heading"
            data-text="The VERICRUX Way"
          >
            The VERICRUX <span>Way</span>
          </h2>
          <div className="brand-cards-grid">
            <div className="brand-card glitch-card">
              <div className="glitch-icon">⚔</div>
              <div className="glitch-bar"></div>
              <div className="brand-info">
                <h3 className="glitch-title" data-text="Built for the Mat">Built for the Mat</h3>
                <p>We create gear that moves with you — durable, functional, and designed by practitioners who live the grind every day.</p>
                <a href="/about" className="card-link">Our Story →</a>
              </div>
            </div>
            <div className="brand-card glitch-card">
              <div className="glitch-icon">◈</div>
              <div className="glitch-bar"></div>
              <div className="brand-info">
                <h3 className="glitch-title" data-text="Knowledge from the Mat">Knowledge from the Mat</h3>
                <p>Technique breakdowns, mindset tips, training philosophy, and real stories from the BJJ community.</p>
                <a href="/blog" className="card-link">Latest Articles →</a>
              </div>
            </div>
            <div className="brand-card glitch-card">
              <div className="glitch-icon">⬡</div>
              <div className="glitch-bar"></div>
              <div className="brand-info">
                <h3 className="glitch-title" data-text="Join the Movement">Join the Movement</h3>
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

      <footer className="footer-modern">
        <div className="footer-top">
          <div className="section-container footer-grid">
            <div className="footer-col footer-brand-col">
              <p className="footer-logo-text">VERI<span>CRUX</span></p>
              <p className="footer-tagline-text">
                Gear forged on the mat.<br />
                Built for the fight.<br />
                Engineered for you.
              </p>
              <div className="footer-socials">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-4.83-4.83h-2.83v13.18a2.19 2.19 0 1 1-2.19-2.19c.2 0 .39.03.57.07V9.97a5.02 5.02 0 0 0-.57-.03 5.02 5.02 0 1 0 5.02 5.02V9.07a7.63 7.63 0 0 0 4.83 1.67V7.91a4.84 4.84 0 0 1-0-.22z" />
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-heading">Navigate</h4>
              <ul className="footer-nav-list">
                <li><a href="/shop">Shop</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
              </ul>
            </div>

            <div className="footer-col footer-newsletter-col">
              <h4 className="footer-col-heading">Stay in the Fight</h4>
              <p className="footer-newsletter-desc">
                Drop your email. Get drops, training tips, and community news — no spam, just signal.
              </p>
              <div className="newsletter-form">
                <input type="email" placeholder="your@email.com" className="newsletter-input" />
                <button className="newsletter-btn">JOIN</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="section-container footer-bottom-inner">
            <p className="copyright">© {new Date().getFullYear()} VERICRUX. All rights reserved.</p>
            <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              ↑ Back to Top
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;