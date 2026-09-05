/* ============================================
   3D PORTFOLIO — INTERACTIVE JAVASCRIPT
   ============================================ */

(() => {
  'use strict';

  // ==========================================
  //  LOADING SCREEN
  // ==========================================
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => loader.classList.add('hidden'), 600);
      setTimeout(() => loader.remove(), 1200);
    }
  });

  // ==========================================
  //  PARTICLE SYSTEM
  // ==========================================
  class ParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: -1000, y: -1000 };
      this.resize();
      this.init();
      this.bindEvents();
      this.animate();
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    init() {
      const count = Math.min(Math.floor((this.width * this.height) / 18000), 80);
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.4 + 0.1,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.resize();
        this.init();
      });
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (const p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.01;

        // Wrap around edges
        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;
        if (p.y < 0) p.y = this.height;
        if (p.y > this.height) p.y = 0;

        // Subtle mouse repulsion
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 0.8;
          p.y += (dy / dist) * force * 0.8;
        }

        const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.1;

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(220, 20, 60, ${currentAlpha})`;
        this.ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i];
          const b = this.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.08;
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.strokeStyle = `rgba(220, 20, 60, ${alpha})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  const particleCanvas = document.getElementById('particles');
  if (particleCanvas) new ParticleSystem(particleCanvas);

  // ==========================================
  //  CUSTOM CURSOR
  // ==========================================
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
    });

    function animateFollower() {
      followerX += (cursorX - followerX) * 0.12;
      followerY += (cursorY - followerY) * 0.12;
      follower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover detection for interactive elements
    const interactiveEls = document.querySelectorAll(
      'a, button, .project-card, .skill-card, .stat-card, .education-content, input, textarea, .social-link, .sidebar-social-link, .social-btn'
    );
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ==========================================
  //  DAY / NIGHT THEME TOGGLE
  // ==========================================
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') document.documentElement.setAttribute('data-theme','light');
  if (themeToggle) {
    const updateThemeButton = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      themeToggle.setAttribute('aria-pressed', String(light));
      themeToggle.setAttribute('aria-label', light ? 'Switch to night mode' : 'Switch to day mode');
    };
    updateThemeButton();
    themeToggle.addEventListener('click', () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      if (light) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('portfolio-theme','dark'); }
      else { document.documentElement.setAttribute('data-theme','light'); localStorage.setItem('portfolio-theme','light'); }
      updateThemeButton();
    });
  }

  // ==========================================
  //  NAVIGATION
  // ==========================================
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const sections = document.querySelectorAll('.section, .hero');

  // Scroll state for nav
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;

    // Active nav link
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 200;
      if (scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });

  // Mobile menu toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================
  //  SCROLL REVEAL (Intersection Observer)
  // ==========================================
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.scroll-reveal').forEach((el) => revealObserver.observe(el));

  // ==========================================
  //  COUNTER ANIMATION
  // ==========================================
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-number[data-target]').forEach((el) => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ==========================================
  //  3D TILT EFFECT ON PROJECT CARDS
  // ==========================================
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => (card.style.transition = ''), 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  // ==========================================
  //  MAGNETIC BUTTON EFFECT
  // ==========================================
  const magneticBtns = document.querySelectorAll('.magnetic');

  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => (btn.style.transition = ''), 400);
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
    });
  });

  // ==========================================
  //  PARALLAX ON HERO SHAPES
  // ==========================================
  const heroShapes = document.querySelectorAll('.shape');

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    heroShapes.forEach((shape, i) => {
      const speed = (i + 1) * 15;
      shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });

  // ==========================================
  //  AVATAR 3D TILT ON MOUSE
  // ==========================================
  const avatarContainer = document.getElementById('avatar');

  if (avatarContainer) {
    const heroSection = document.getElementById('hero');

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      avatarContainer.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      avatarContainer.style.transform = 'rotateY(0) rotateX(0)';
      avatarContainer.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => (avatarContainer.style.transition = ''), 600);
    });
  }

  // ==========================================
  //  SMOOTH SCROLL FOR NAV LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  //  CONTACT FORM (demo handler)
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"] span');
      const original = btn.textContent;
      btn.textContent = 'Message Sent! ✓';
      btn.closest('button').style.background = '#22c55e';
      btn.closest('button').style.boxShadow = '0 4px 24px rgba(34, 197, 94, 0.3)';
      setTimeout(() => {
        btn.textContent = original;
        btn.closest('button').style.background = '';
        btn.closest('button').style.boxShadow = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ==========================================
  //  RESEARCH DETAILS MODAL
  // ==========================================
  const researchModal = document.getElementById('researchModal');
  const researchModalTitle = document.getElementById('researchModalTitle');
  const researchModalMeta = document.getElementById('researchModalMeta');
  const researchModalDescription = document.getElementById('researchModalDescription');
  const researchButtons = document.querySelectorAll('.research-link');

  const closeResearchModal = () => {
    if (!researchModal) return;
    researchModal.classList.remove('is-open');
    researchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (researchModal) {
    researchButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.research-card');
        const title = button.dataset.researchTitle;
        const meta = card.querySelector('.research-meta');
        const description = card.querySelector('.research-full-description');

        researchModalTitle.textContent = title;
        researchModalMeta.textContent = meta.textContent;
        researchModalDescription.textContent = description.textContent;
        researchModal.classList.add('is-open');
        researchModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    researchModal.querySelectorAll('[data-research-close]').forEach((closeButton) => {
      closeButton.addEventListener('click', closeResearchModal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && researchModal.classList.contains('is-open')) {
        closeResearchModal();
      }
    });
  }

  // ==========================================
  //  SKILL CARDS TILT ON HOVER
  // ==========================================
  document.querySelectorAll('.skill-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => (card.style.transition = ''), 400);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease';
    });
  });

  // ==========================================
  //  TEXT TYPING / REVEAL IN HERO
  // ==========================================
  // Already handled via CSS animations, but we add a class
  // after a short delay to ensure smooth paint
  setTimeout(() => {
    document.querySelectorAll('.reveal-text').forEach((el, i) => {
      el.style.animationDelay = `${0.3 + i * 0.15}s`;
    });
  }, 100);

})();
