gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    /* ── CURSOR ───────────────────────────── */
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; gsap.set(dot, { x: mx, y: my }) });
    gsap.ticker.add(() => { rx += (mx - rx) * .1; ry += (my - ry) * .1; gsap.set(ring, { x: rx, y: ry }) });
    document.querySelectorAll('a,button,input,textarea').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('big'));
      el.addEventListener('mouseleave', () => ring.classList.remove('big'));
    });

    /* ── NAVBAR ───────────────────────────── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('stuck', window.scrollY > 80);
    });

    /* ── THEME TOGGLE ─────────────────────── */
    const html = document.documentElement;
    const moonIcon = document.getElementById('icon-moon');
    const sunIcon = document.getElementById('icon-sun');
    let isDark = true;
    document.getElementById('theme-btn').addEventListener('click', () => {
      isDark = !isDark;
      html.setAttribute('data-theme', isDark ? 'dark' : 'light');
      moonIcon.style.display = isDark ? 'block' : 'none';
      sunIcon.style.display = isDark ? 'none' : 'block';
    });

    /* ── HERO ENTRANCE ─────────────────────── */
    const heroTl = gsap.timeline({ delay: .2 });
    heroTl
      .to('#hw1', { y: '0%', duration: 1, ease: 'expo.out' })
      .to('#hw2', { y: '0%', duration: 1, ease: 'expo.out' }, '-=.7')
      .to('#hw3', { y: '0%', duration: 1, ease: 'expo.out' }, '-=.7')
      .to('#hero-eyebrow', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, '-=.4')
      .to('#hero-bottom', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, '-=.5');

    /* Hero title parallax on scroll */
    gsap.to('.hero-title', {
      yPercent: -25,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
    gsap.to('#hero-eyebrow', {
      yPercent: -40, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: '60% top', scrub: 1 }
    });
    gsap.to('#hero-bottom', {
      yPercent: -60, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: '50% top', scrub: 1 }
    });

    /* ── ZOOM PORTAL ──────────────────────── */
    const zoomFrame = document.getElementById('zoom-frame');
    const zoomLabel = document.getElementById('zoom-label');

    gsap.set(zoomFrame, { scale: 1, borderRadius: '12px' });

    const zoomTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#zoom-portal',
        start: 'top top',
        end: '+=150%', // Pins for 1.5x screen height of scrolling
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    // Scale up the frame smoothly
    zoomTimeline.to(zoomFrame, {
      scale: 30,
      borderRadius: '0px',
      ease: 'none'
    }, 0);

    // Fade out and scale down the label "MY WORK" as zoom starts
    zoomTimeline.to(zoomLabel, {
      opacity: 0,
      scale: 0.5,
      ease: 'power1.in'
    }, 0);

    /* ── ABOUT HORIZONTAL SCROLL ──────────── */
    const aboutTrack = document.getElementById('about-track');
    const aboutPanels = document.querySelectorAll('.about-panel');
    const aboutDots = document.querySelectorAll('.prog-dot');

    const aboutTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#about',
        start: 'top top',
        end: '+=200%', // Pins for 2x screen height of scrolling
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate(self) {
          // Keep active indicators perfectly in sync
          const idx = Math.round(self.progress * (aboutPanels.length - 1));
          aboutPanels.forEach((p, i) => {
            p.classList.toggle('active', i === idx);
          });
          aboutDots.forEach((d, i) => {
            d.classList.toggle('active', i === idx);
          });
        }
      }
    });

    // Animate track horizontally
    aboutTimeline.to(aboutTrack, {
      x: () => -(aboutTrack.scrollWidth - window.innerWidth),
      ease: 'none'
    });

    /* ── PROJECTS HORIZONTAL SCROLL ────────── */
    /* ── PROJECTS HORIZONTAL SCROLL ────────── */
    const projTrack = document.getElementById('proj-track');
    const projFill = document.getElementById('proj-fill');
    const totalCards = 4;

    /*
      Build the pinned horizontal scroll AFTER the page has fully painted
      so projTrack.scrollWidth is accurate (4 × 100vw = 4 × innerWidth).
      requestAnimationFrame defers one frame, which is enough for layout.
    */
    requestAnimationFrame(() => {
      // Each card is 100vw, so total travel = (totalCards - 1) × innerWidth
      const getTravelX = () => -(projTrack.scrollWidth - window.innerWidth);

      const projST = ScrollTrigger.create({
        trigger: '#proj-scroll',
        start: 'top top',
        // Pin long enough to scroll through every card at a comfortable pace
        end: () => `+=${window.innerWidth * (totalCards - 1)}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        // Must recalculate AFTER the AA pin spacer above has settled
        refreshPriority: -1,
        onUpdate(self) {
          // Progress bar fill
          projFill.style.width = (self.progress * 100) + '%';

          // Per-card content entrance — animate content in/out as each card
          // enters its own "segment" of the scroll progress range
          document.querySelectorAll('.proj-card').forEach((card, i) => {
            const content = card.querySelector('.proj-content');
            const img = card.querySelector('.proj-img img');
            const segSize = 1 / totalCards;
            const segStart = i * segSize;
            const segProg = Math.max(0, Math.min(1, (self.progress - segStart) / segSize));

            if (segProg > 0.05 && segProg < 0.95) {
              gsap.to(content, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
              gsap.to(img, { scale: 1, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
            } else {
              gsap.to(content, { opacity: 0, x: -40, duration: 0.4, overwrite: 'auto' });
              gsap.to(img, { scale: 1.08, duration: 0.8, overwrite: 'auto' });
            }
          });
        }
      });

      // Set initial states for content and images
      document.querySelectorAll('.proj-card').forEach(card => {
        gsap.set(card.querySelector('.proj-content'), { opacity: 0, x: -60 });
        gsap.set(card.querySelector('.proj-img img'), { scale: 1.1 });
      });

      // Horizontal track movement — inline with the same ScrollTrigger
      // so position is always in sync with the pin
      gsap.to(projTrack, {
        x: getTravelX,
        ease: 'none',
        scrollTrigger: {
          trigger: '#proj-scroll',
          start: 'top top',
          end: () => `+=${window.innerWidth * (totalCards - 1)}`,
          scrub: 1,
          refreshPriority: -1
        }
      });
    });


    /* ── CONTACT ENTRANCE ─────────────────── */
    gsap.from('#contact-heading .line', {
      y: 80, opacity: 0, stagger: .12, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '#contact', start: 'top 75%', toggleActions: 'play none none none' }
    });

    gsap.from('.contact-form', {
      y: 50, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-form', start: 'top 80%', toggleActions: 'play none none none' }
    });

    /* ── FORM SUBMIT ──────────────────────── */
    function handleSubmit(e) {
      e.preventDefault();
      const btn = document.querySelector('.submit-btn');
      btn.innerHTML = 'Sent! ✓';
      btn.style.background = '#00ff87';
      setTimeout(() => {
        btn.innerHTML = 'Send Message <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
        btn.style.background = '';
        e.target.reset();
      }, 3000);
    }

    /* ── ANIMATE ANYTHING — horizontal scroll + word reveal ── */
    (function () {
      const track = document.getElementById('aa-track');
      const slides = document.querySelectorAll('.aa-slide');
      const progressBar = document.getElementById('aa-progress-bar');
      const counter = document.getElementById('aa-counter');
      const totalSlides = slides.length;

      // Collect all word inners per slide
      const slideWords = Array.from(slides).map(s =>
        Array.from(s.querySelectorAll('.aa-word-inner'))
      );
      const slideLabels = Array.from(slides).map(s =>
        s.querySelector('.aa-slide-label')
      );
      const slideSubs = Array.from(slides).map(s =>
        s.querySelector('.aa-sub')
      );

      // Set initial word positions and labels
      slideWords.forEach(words => {
        gsap.set(words, { y: '110%' });
      });
      gsap.set(slideLabels, { opacity: 0, y: 12 });
      gsap.set(slideSubs, { opacity: 0, y: 20 });

      // Calculate scroll distance: 4 slides = 3 slide widths to scroll through
      const scrollDistance = window.innerWidth * (totalSlides - 1);
      
      // Master timeline: pin + horizontal scroll
      const aaTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#animate-anything',
          start: 'top top',
          end: () => `+=${scrollDistance + 300}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate(self) {
            // Update progress bar
            progressBar.style.width = (self.progress * 100) + '%';

            // Update counter
            const idx = Math.min(
              Math.floor(self.progress * totalSlides),
              totalSlides - 1
            );
            counter.textContent =
              String(idx + 1).padStart(2, '0') + ' / ' +
              String(totalSlides).padStart(2, '0');
          }
        }
      });

      // Horizontal movement — move left by 3 slide widths (300vw)
      aaTl.to(track, {
        x: -scrollDistance,
        ease: 'none',
        duration: totalSlides - 1
      }, 0);

      // Per-slide word reveals and sub text — tied to scroll position
      slides.forEach((slide, i) => {
        const words = slideWords[i];
        const label = slideLabels[i];
        const sub = slideSubs[i];
        const segDuration = 1; // each slide occupies "1 unit" in timeline
        const segStart = i * segDuration;

        // Reveal label
        aaTl.to(label, {
          opacity: 1,
          y: 0,
          duration: 0.15,
          ease: 'power2.out'
        }, segStart + 0.05);

        // Stagger words in
        words.forEach((word, wi) => {
          const wordStart = segStart + 0.08 + wi * 0.06;
          aaTl.to(word, {
            y: '0%',
            duration: 0.18,
            ease: 'power3.out'
          }, wordStart);
          // Light up
          aaTl.to(word, {
            duration: 0.12,
            onStart() { word.classList.add('lit'); },
            onReverseComplete() { word.classList.remove('lit'); }
          }, wordStart);
        });

        // Sub text fades in
        if (sub) {
          aaTl.to(sub, {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: 'power2.out'
          }, segStart + 0.35);
        }

        // Fade out when leaving (except last slide)
        if (i < totalSlides - 1) {
          const exitStart = segStart + 0.75;
          aaTl.to(label, { opacity: 0, y: -10, duration: 0.12 }, exitStart);
          aaTl.to(words, { opacity: 0, y: '-20%', stagger: 0.03, duration: 0.12 }, exitStart);
          if (sub) aaTl.to(sub, { opacity: 0, y: -15, duration: 0.12 }, exitStart);
        }
      });

      // Floating shape parallax per slide
      document.querySelectorAll('.aa-shape').forEach((shape, i) => {
        gsap.to(shape, {
          y: (i % 2 === 0 ? -40 : 40),
          x: (i % 3 === 0 ? 20 : -20),
          ease: 'none',
          scrollTrigger: {
            trigger: '#animate-anything',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
          }
        });
      });
    })();

    /* ── MARQUEE DIRECTION ON SCROLL ─────── */
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const dir = window.scrollY > lastScroll ? 1 : -1;
      document.querySelector('.marquee-track').style.animationDirection = dir > 0 ? 'normal' : 'reverse';
      lastScroll = window.scrollY;
    });

    /* ════════════════════════════════════════════════════════
       ALL WORK PAGE
    ════════════════════════════════════════════════════════ */
    const ALL_PROJECTS = [
      {
        id: 'shopflow',
        title: 'ShopFlow',
        type: 'web-app',
        typeLabel: 'Web App',
        year: '2024',
        desc: 'Full e-commerce platform with real-time inventory, Stripe payments, and admin dashboard. Handles 10k+ products with sub-100ms search.',
        tags: ['Next.js','PostgreSQL','Stripe','Prisma','Redis'],
        img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=75',
        liveUrl: '#', githubUrl: '#',
        overview: 'ShopFlow is a production-grade e-commerce engine built for scale. The platform supports multi-vendor stores, dynamic pricing, and real-time inventory tracking across 10,000+ SKUs. The architecture uses edge caching, optimistic UI updates, and a headless CMS for content.',
        challenge: 'Building a search system that returns results under 100ms at scale required custom indexing with PostgreSQL full-text search combined with Redis caching layers.',
        gallery: [
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80',
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
          'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
        ],
        features: [
          { num: '10K+', title: 'Products Indexed', desc: 'Handles over ten thousand SKUs with real-time inventory sync across all storefronts.' },
          { num: '<100ms', title: 'Search Latency', desc: 'Full-text search powered by PostgreSQL tsvector and Redis caching for instant results.' },
          { num: '99.9%', title: 'Uptime SLA', desc: 'Deployed on Vercel Edge with automatic failover and zero-downtime deploys.' },
        ]
      },
      {
        id: 'devcollab',
        title: 'DevCollab',
        type: 'web-app',
        typeLabel: 'Web App',
        year: '2024',
        desc: 'Real-time collaborative coding environment with live video, shared execution sandbox, and GitHub integration.',
        tags: ['React','WebSockets','Node.js','Docker','WebRTC'],
        img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=75',
        liveUrl: '#', githubUrl: '#',
        overview: 'DevCollab brings pair-programming into the browser. It features OT-based conflict resolution for simultaneous edits, WebRTC peer-to-peer video, and an isolated Docker sandbox for running untrusted code safely.',
        challenge: 'Operational Transformation for concurrent edits without conflicts was the hardest engineering problem — ensuring two people typing at the exact same character position never corrupts the document.',
        gallery: [
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1400&q=80',
          'https://images.unsplash.com/photo-1555066931-4365d14431b9?w=800&q=80',
          'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&q=80',
        ],
        features: [
          { num: '500+', title: 'Developers', desc: 'Active users collaborating daily on coding sessions across timezones.' },
          { num: '0ms', title: 'Conflict Delta', desc: 'OT algorithm ensures zero merge conflicts even with simultaneous keystroke edits.' },
          { num: '6', title: 'Languages', desc: 'Sandboxed execution supports JS, Python, Go, Rust, Java, and C++ out of the box.' },
        ]
      },
      {
        id: 'taskmind',
        title: 'TaskMind AI',
        type: 'saas',
        typeLabel: 'SaaS',
        year: '2024',
        desc: 'AI-powered task manager that generates subtasks from plain-language goals, prioritizes your backlog, and syncs with Google Calendar.',
        tags: ['Next.js','OpenAI','MongoDB','Auth.js','Tailwind'],
        img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=75',
        liveUrl: '#', githubUrl: '#',
        overview: 'TaskMind uses GPT-4 to decompose vague goals into structured, prioritized tasks. It learns from your completion patterns to reorder your backlog and integrates with Google Calendar for time-blocking.',
        challenge: 'Getting the AI to produce consistent, actionable subtasks without over-generating noise required careful prompt engineering and a post-processing validation layer.',
        gallery: [
          'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1400&q=80',
          'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
          'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=800&q=80',
        ],
        features: [
          { num: 'GPT-4', title: 'AI Core', desc: 'Fine-tuned prompts extract structured tasks from natural language goals reliably.' },
          { num: '∞', title: 'Context Memory', desc: 'MongoDB stores full task history to enable long-term priority learning.' },
          { num: '2-Way', title: 'Calendar Sync', desc: 'Bi-directional Google Calendar integration for automatic time-block scheduling.' },
        ]
      },
      {
        id: 'authkit',
        title: 'AuthKit',
        type: 'open-source',
        typeLabel: 'Open Source',
        year: '2023',
        desc: 'Open-source plug-and-play auth library for Node.js. JWT + refresh tokens + 6 OAuth providers. Zero config, full TypeScript.',
        tags: ['Node.js','TypeScript','JWT','OAuth','Open Source'],
        img: 'https://images.unsplash.com/photo-1555066931-4365d14431b9?w=800&q=75',
        liveUrl: '#', githubUrl: '#',
        overview: 'AuthKit abstracts all authentication complexity into a single npm install. It handles session management, token rotation, PKCE flows, and comes with optional Express/Fastify middleware — all fully typed.',
        challenge: 'Supporting 6 OAuth providers with different token shapes and refresh strategies required an abstraction layer that remains extensible without adding complexity for simple use cases.',
        gallery: [
          'https://images.unsplash.com/photo-1555066931-4365d14431b9?w=1400&q=80',
          'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
          'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80',
        ],
        features: [
          { num: '800+', title: 'GitHub Stars', desc: 'Adopted by developers worldwide for production authentication needs.' },
          { num: '6', title: 'OAuth Providers', desc: 'Google, GitHub, Discord, Twitter/X, Apple, and Microsoft out of the box.' },
          { num: '0', title: 'Config Required', desc: 'Sensible defaults mean you can add auth to any Node app in under 5 minutes.' },
        ]
      },
      {
        id: 'pulseanalytics',
        title: 'Pulse Analytics',
        type: 'dashboard',
        typeLabel: 'Dashboard',
        year: '2024',
        desc: 'Real-time business analytics dashboard with custom chart builder, multi-source data ingestion, and role-based access.',
        tags: ['React','D3.js','Node.js','ClickHouse','WebSockets'],
        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=75',
        liveUrl: '#', githubUrl: '#',
        overview: 'Pulse ingests events from multiple sources (Segment, Mixpanel, custom webhooks) into ClickHouse for OLAP queries at billions-of-row scale. A drag-and-drop chart builder lets non-technical teams build dashboards without SQL.',
        challenge: 'Streaming live metric updates to hundreds of concurrent dashboard viewers without hammering the database required a smart pub-sub diffing layer on top of WebSockets.',
        gallery: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
          'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
        ],
        features: [
          { num: '1B+', title: 'Events Handled', desc: 'ClickHouse columnar storage processes billions of analytics events with sub-second queries.' },
          { num: 'Live', title: 'Real-time Updates', desc: 'WebSocket pub-sub pushes metric changes to all connected dashboards instantly.' },
          { num: 'RBAC', title: 'Access Control', desc: 'Granular role-based permissions from org admin down to dashboard viewer level.' },
        ]
      },
      {
        id: 'finotrack',
        title: 'FinoTrack',
        type: 'mobile-app',
        typeLabel: 'Mobile App',
        year: '2023',
        desc: 'Personal finance tracker for iOS & Android. Connects to bank accounts via Plaid, auto-categorizes transactions, and forecasts spending.',
        tags: ['React Native','Plaid','Node.js','PostgreSQL','Expo'],
        img: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=75',
        liveUrl: '#', githubUrl: '#',
        overview: 'FinoTrack uses Plaid to connect to 12,000+ financial institutions. An ML model auto-categorizes transactions with 94% accuracy and a budget forecaster predicts month-end balances from historical patterns.',
        challenge: 'Building a reliable sync engine that handles bank API downtime gracefully and reconciles duplicate transactions across statement periods without showing phantom entries.',
        gallery: [
          'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1400&q=80',
          'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
          'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
        ],
        features: [
          { num: '12K+', title: 'Banks Supported', desc: 'Plaid integration covers over twelve thousand financial institutions globally.' },
          { num: '94%', title: 'Auto-Categorization', desc: 'ML model trained on 2M+ transactions for accurate spending category detection.' },
          { num: 'iOS+', title: 'Cross Platform', desc: 'Single React Native codebase deployed to both App Store and Google Play.' },
        ]
      },
      {
        id: 'mailcraft',
        title: 'MailCraft',
        type: 'email',
        typeLabel: 'Email Template',
        year: '2023',
        desc: 'Premium email template system with 40+ responsive designs, dark mode variants, and a visual editor for marketing teams.',
        tags: ['MJML','React Email','Tailwind','Storybook','Figma'],
        img: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=75',
        liveUrl: '#', githubUrl: '#',
        overview: 'MailCraft is a full design system for transactional and marketing emails. Every template is coded in MJML for maximum client compatibility, ships with light/dark variants, and includes a Storybook-based preview server.',
        challenge: 'Achieving consistent dark mode rendering across Gmail, Apple Mail, and Outlook required careful use of prefers-color-scheme media queries combined with class-based fallbacks for clients that ignore media queries.',
        gallery: [
          'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1400&q=80',
          'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
          'https://images.unsplash.com/photo-1607703703520-bb638e84caf2?w=800&q=80',
        ],
        features: [
          { num: '40+', title: 'Templates', desc: 'Covers transactional, promotional, digest, onboarding, and notification patterns.' },
          { num: '99%', title: 'Client Coverage', desc: 'Tested across Gmail, Outlook 2013-2021, Apple Mail, and Yahoo Mail.' },
          { num: 'Dark', title: 'Mode Ready', desc: 'Every template includes a pixel-perfect dark mode variant using modern CSS.' },
        ]
      },
      {
        id: 'ridewave',
        title: 'RideWave',
        type: 'mobile-app',
        typeLabel: 'Mobile App',
        year: '2024',
        desc: 'On-demand ride-sharing app for local markets with real-time driver tracking, surge pricing, and in-app wallet.',
        tags: ['React Native','Firebase','Google Maps','Node.js','Redis'],
        img: 'https://images.unsplash.com/photo-1556742212-5b321f3c261b?w=800&q=75',
        liveUrl: '#', githubUrl: '#',
        overview: 'RideWave is a full-stack ride-hailing platform. Drivers receive trip requests via WebSocket with a 10-second acceptance window. The surge pricing engine calculates real-time demand/supply ratios per geohash cell.',
        challenge: 'The driver-matching algorithm needed to factor in real-time traffic, driver acceptance rates, and surge zones simultaneously while staying under 2 seconds total dispatch time.',
        gallery: [
          'https://images.unsplash.com/photo-1556742212-5b321f3c261b?w=1400&q=80',
          'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
        ],
        features: [
          { num: '<2s', title: 'Dispatch Time', desc: 'Smart matching algorithm finds the best nearby driver in under two seconds.' },
          { num: 'Live', title: 'Driver Tracking', desc: 'Real-time GPS position updates via Firebase Realtime DB at 2-second intervals.' },
          { num: 'Surge', title: 'Dynamic Pricing', desc: 'Geohash-based demand heatmaps drive automatic surge multipliers in real time.' },
        ]
      },
      {
        id: 'adminpro',
        title: 'AdminPro',
        type: 'dashboard',
        typeLabel: 'Dashboard',
        year: '2023',
        desc: 'Highly customizable SaaS admin panel boilerplate with 80+ UI components, dark/light themes, and complete CRUD scaffolding.',
        tags: ['React','TypeScript','Tailwind','Zustand','Vite'],
        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=75',
        liveUrl: '#', githubUrl: '#',
        overview: 'AdminPro is a production-ready admin panel template. It ships with pre-built CRUD views, data tables with sorting/filtering, chart widgets, notification system, and a full theming API — so teams skip weeks of boilerplate.',
        challenge: 'Making the theming system truly extensible without CSS-in-JS overhead required a CSS custom property architecture that supports runtime theme switching with no flash of unstyled content.',
        gallery: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
          'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
        ],
        features: [
          { num: '80+', title: 'UI Components', desc: 'From data tables to calendar widgets, every admin pattern is pre-built and themed.' },
          { num: 'Zero', title: 'Flash on Switch', desc: 'CSS custom property theming enables instant dark/light switching with no repaint.' },
          { num: 'TS', title: 'Fully Typed', desc: 'Complete TypeScript coverage including component props, API types, and state slices.' },
        ]
      },
      {
        id: 'notifyflow',
        title: 'NotifyFlow',
        type: 'saas',
        typeLabel: 'SaaS',
        year: '2024',
        desc: 'Multi-channel notification infrastructure. One API to send push, email, SMS, and in-app alerts with delivery tracking and templating.',
        tags: ['Node.js','TypeScript','RabbitMQ','React','Postgres'],
        img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=75',
        liveUrl: '#', githubUrl: '#',
        overview: 'NotifyFlow abstracts away the complexity of multi-channel notifications. A single API call triggers the right channel based on user preferences, time zones, and delivery receipts — with automatic retry for failed sends.',
        challenge: 'Building reliable at-least-once delivery across 4 channels with deduplication required a RabbitMQ dead-letter queue architecture with idempotency keys.',
        gallery: [
          'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1400&q=80',
          'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80',
          'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80',
        ],
        features: [
          { num: '4', title: 'Channels', desc: 'Push, Email, SMS, and In-App — all from a single unified notification API.' },
          { num: 'Retry', title: 'Auto Recovery', desc: 'Dead-letter queues automatically retry failed notifications with exponential backoff.' },
          { num: '99.9%', title: 'Delivery Rate', desc: 'Redundant provider fallbacks ensure near-perfect notification delivery rates.' },
        ]
      },
      {
        id: 'receiptify',
        title: 'Receiptify',
        type: 'email',
        typeLabel: 'Email Template',
        year: '2022',
        desc: 'Transactional email template library for e-commerce: order confirmations, shipping updates, invoices, and refunds.',
        tags: ['MJML','Handlebars','Node.js','Figma','Litmus'],
        img: 'https://images.unsplash.com/photo-1607703703520-bb638e84caf2?w=800&q=75',
        liveUrl: '#', githubUrl: '#',
        overview: 'Receiptify is a battle-tested set of transactional email templates used by 20+ e-commerce brands. Templates are dynamic via Handlebars, Litmus-tested across 90+ clients, and integrate with SendGrid/Postmark out of the box.',
        challenge: 'Keeping complex order receipt tables readable in plain-text fallback mode (for accessibility) while still rendering rich HTML in supporting clients was surprisingly tricky to get right.',
        gallery: [
          'https://images.unsplash.com/photo-1607703703520-bb638e84caf2?w=1400&q=80',
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
        ],
        features: [
          { num: '90+', title: 'Clients Tested', desc: 'Every template Litmus-tested across 90 email clients including legacy Outlook.' },
          { num: '20+', title: 'Brands', desc: 'Deployed in production by over twenty e-commerce companies globally.' },
          { num: 'A11y', title: 'Accessible', desc: 'ARIA labels, semantic table markup, and plain-text fallbacks for all templates.' },
        ]
      },
      {
        id: 'codeclip',
        title: 'CodeClip',
        type: 'open-source',
        typeLabel: 'Open Source',
        year: '2022',
        desc: 'CLI tool that generates boilerplate snippets for common dev patterns. 200+ snippets, custom template support, and team sharing.',
        tags: ['Node.js','TypeScript','Commander.js','Handlebars','npm'],
        img: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&q=75',
        liveUrl: '#', githubUrl: '#',
        overview: 'CodeClip lets developers define reusable code snippets with variable placeholders and share them across teams via a snippets registry. It integrates with VS Code via a companion extension.',
        challenge: 'Designing a snippet DSL flexible enough to handle complex multi-file scaffolding (e.g. new React component + test + styles + story) while staying dead simple for single-file snippets.',
        gallery: [
          'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=1400&q=80',
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
          'https://images.unsplash.com/photo-1555066931-4365d14431b9?w=800&q=80',
        ],
        features: [
          { num: '200+', title: 'Snippets', desc: 'Covers React, Node, Go, Python, Docker, CI/CD, and more out of the box.' },
          { num: 'Team', title: 'Snippet Sharing', desc: 'Publish and pull snippets from a shared registry via CLI — like npm for code templates.' },
          { num: 'VS Code', title: 'IDE Plugin', desc: 'Companion VS Code extension triggers snippets inline from the command palette.' },
        ]
      },
    ];

    /* ── open / close ── */
    const allWorkPage = document.getElementById('all-work-page');
    const awCurtain = document.getElementById('aw-curtain');
    const awClose = document.getElementById('aw-close');
    const awGrid = document.getElementById('aw-grid');
    const awEmpty = document.getElementById('aw-empty');
    const awSectionLabel = document.getElementById('aw-section-label');
    const awVisibleCount = document.getElementById('aw-visible-count');
    const awScroll = document.getElementById('aw-scroll');

    function openAllWork() {
      allWorkPage.classList.add('open');
      document.body.style.overflow = 'hidden';
      // curtain reveal — scale from top
      gsap.set(awCurtain, { scaleY: 1, transformOrigin: 'top' });
      gsap.to(awCurtain, { scaleY: 0, duration: .7, ease: 'expo.inOut', delay: .05 });
      // stagger cards in
      setTimeout(() => {
        awScroll.scrollTop = 0;
        renderCards('all');
        positionFilterLine(document.querySelector('.aw-filter.active'));
      }, 150);
    }

    function closeAllWork() {
      gsap.set(awCurtain, { scaleY: 0, transformOrigin: 'bottom' });
      gsap.to(awCurtain, {
        scaleY: 1, duration: .6, ease: 'expo.in',
        onComplete() {
          allWorkPage.classList.remove('open');
          document.body.style.overflow = '';
          gsap.set(awCurtain, { scaleY: 1, transformOrigin: 'top' });
        }
      });
    }

    document.getElementById('nav-work-btn').addEventListener('click', openAllWork);
    document.getElementById('cta-view-all').addEventListener('click', openAllWork);
    awClose.addEventListener('click', closeAllWork);
    document.getElementById('all-work-page').querySelector('.aw-header').addEventListener('click', e => {
      // close on logo click
    });

    /* ── render cards ── */
    function renderCards(filter) {
      const filtered = filter === 'all'
        ? ALL_PROJECTS
        : ALL_PROJECTS.filter(p => p.type === filter);

      awVisibleCount.textContent = filtered.length;

      if (filtered.length === 0) {
        awGrid.innerHTML = '';
        awEmpty.classList.add('show');
        return;
      }
      awEmpty.classList.remove('show');

      awGrid.innerHTML = filtered.map(p => `
        <div class="aw-card" data-id="${p.id}" data-type="${p.type}">
          <div class="aw-card-thumb">
            <img src="${p.img}" alt="${p.title}" loading="lazy" />
            <div class="aw-card-type-badge">${p.typeLabel}</div>
          </div>
          <div class="aw-card-body">
            <div class="aw-card-meta">
              <span class="aw-card-year">${p.year}</span>
            </div>
            <div class="aw-card-title">${p.title}</div>
            <div class="aw-card-desc">${p.desc}</div>
            <div class="aw-card-tags">
              ${p.tags.slice(0,4).map(t => `<span class="aw-card-tag">${t}</span>`).join('')}
            </div>
          </div>
          <div class="aw-card-footer">
            <a href="${p.liveUrl}" class="aw-card-cta solid">Live ↗</a>
            <a href="${p.githubUrl}" class="aw-card-cta outline">GitHub</a>
            <button class="aw-card-detail-btn" data-id="${p.id}" aria-label="View Details" title="View Details">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </button>
          </div>
        </div>
      `).join('');

      // stagger in
      requestAnimationFrame(() => {
        document.querySelectorAll('.aw-card').forEach((card, i) => {
          setTimeout(() => card.classList.add('in'), i * 50);
        });
      });

      // attach detail btn listeners
      document.querySelectorAll('.aw-card-detail-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const proj = ALL_PROJECTS.find(p => p.id === btn.dataset.id);
          if (proj) openProjectDetail(proj);
        });
      });

      // whole card click also opens detail
      document.querySelectorAll('.aw-card').forEach(card => {
        card.addEventListener('click', e => {
          if (e.target.tagName === 'A') return;
          const proj = ALL_PROJECTS.find(p => p.id === card.dataset.id);
          if (proj) openProjectDetail(proj);
        });
      });

      // add cursor big on cards
      document.querySelectorAll('.aw-card').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('big'));
        el.addEventListener('mouseleave', () => ring.classList.remove('big'));
      });
    }

    /* ── filters ── */
    function positionFilterLine(activeBtn) {
      const line = document.getElementById('aw-filter-line');
      if (!activeBtn) return;
      const rect = activeBtn.getBoundingClientRect();
      const parentRect = activeBtn.closest('.aw-filters').getBoundingClientRect();
      line.style.left = (rect.left - parentRect.left) + 'px';
      line.style.width = rect.width + 'px';
    }

    document.querySelectorAll('.aw-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.aw-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        positionFilterLine(btn);
        const filter = btn.dataset.filter;
        const filtered = filter === 'all' ? ALL_PROJECTS : ALL_PROJECTS.filter(p => p.type === filter);
        const label = filter === 'all' ? 'All Projects' : btn.textContent.trim() + ' Projects';
        awSectionLabel.textContent = label;
        // collapse existing cards, then re-render
        document.querySelectorAll('.aw-card').forEach(c => c.classList.remove('in'));
        setTimeout(() => renderCards(filter), 200);
        awScroll.scrollTop = 0;
      });
    });

    /* ════════════════════════════════════════════════════════
       PROJECT DETAIL PAGE
    ════════════════════════════════════════════════════════ */
    const detailPage = document.getElementById('project-detail-page');
    const pdCurtain = document.getElementById('pd-curtain');
    const pdProgressBar = document.getElementById('pd-progress-bar');
    const pdNavTitle = document.getElementById('pd-nav-title');

    function openProjectDetail(proj) {
      // populate content
      document.getElementById('pd-hero-img').src = proj.img;
      document.getElementById('pd-hero-eyebrow').textContent = proj.typeLabel + ' · ' + proj.year;
      document.getElementById('pd-hero-title').textContent = proj.title.toUpperCase();
      pdNavTitle.textContent = proj.title.toUpperCase();

      document.getElementById('pd-hero-meta').innerHTML = `
        <div class="pd-meta-item"><div class="pd-meta-label">Category</div><div class="pd-meta-value">${proj.typeLabel}</div></div>
        <div class="pd-meta-item"><div class="pd-meta-label">Year</div><div class="pd-meta-value">${proj.year}</div></div>
        <div class="pd-meta-item"><div class="pd-meta-label">Stack</div><div class="pd-meta-value">${proj.tags.slice(0,2).join(', ')}</div></div>
      `;

      document.getElementById('pd-overview-text').textContent = proj.overview;
      document.getElementById('pd-challenge-text').textContent = proj.challenge;

      document.getElementById('pd-tech-pills').innerHTML =
        proj.tags.map(t => `<span class="pd-tech-pill">${t}</span>`).join('');

      // gallery
      if (proj.gallery && proj.gallery.length >= 3) {
        document.getElementById('pd-gallery-1').src = proj.gallery[0];
        document.getElementById('pd-gallery-2').src = proj.gallery[1];
        document.getElementById('pd-gallery-3').src = proj.gallery[2];
      }

      // features
      document.getElementById('pd-features-grid').innerHTML = proj.features.map(f => `
        <div class="pd-feature-item">
          <div class="pd-feature-num">${f.num}</div>
          <div class="pd-feature-title">${f.title}</div>
          <div class="pd-feature-desc">${f.desc}</div>
        </div>
      `).join('');

      // cta
      document.getElementById('pd-cta-title').textContent = 'Ready to See ' + proj.title + ' Live?';
      document.getElementById('pd-cta-desc').textContent = 'Explore the live product or dig into the source code on GitHub.';
      document.getElementById('pd-cta-links').innerHTML = `
        <a href="${proj.liveUrl}" class="pd-cta-link solid">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          View Live
        </a>
        <a href="${proj.githubUrl}" class="pd-cta-link outline">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.79 1.3 3.47.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.28-1.23 3.28-1.23.65 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
          Source Code
        </a>
      `;

      // scroll to top
      detailPage.scrollTop = 0;
      pdNavTitle.classList.remove('show');

      // open with curtain animation
      detailPage.classList.add('open');
      document.body.style.overflow = 'hidden';

      gsap.set(pdCurtain, { scaleY: 1, transformOrigin: 'bottom', opacity: 1 });
      gsap.to(pdCurtain, {
        scaleY: 0,
        duration: .75,
        ease: 'expo.inOut',
        onComplete() { pdCurtain.style.pointerEvents = 'none'; }
      });

      // hero entrance animations
      gsap.fromTo('#pd-hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: .4 });
      gsap.fromTo('#pd-hero-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power3.out', delay: .55 });
      gsap.fromTo('#pd-hero-meta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power3.out', delay: .65 });
      gsap.fromTo('.pd-overview', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out', delay: .7 });

      // gallery stagger
      gsap.fromTo('.pd-gallery-item',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: .12, duration: .8, ease: 'power3.out', delay: .8 }
      );

      // feature items stagger
      gsap.fromTo('.pd-feature-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: .1, duration: .7, ease: 'power3.out', delay: 1 }
      );
    }

    function closeProjectDetail() {
      pdCurtain.style.pointerEvents = 'all';
      gsap.set(pdCurtain, { scaleY: 0, transformOrigin: 'top', opacity: 1 });
      gsap.to(pdCurtain, {
        scaleY: 1,
        duration: .6,
        ease: 'expo.in',
        onComplete() {
          detailPage.classList.remove('open');
          document.body.style.overflow = 'hidden'; // still in all-work
        }
      });
    }

    document.getElementById('pd-back').addEventListener('click', closeProjectDetail);

    // scroll progress bar + nav title reveal
    detailPage.addEventListener('scroll', () => {
      const scrolled = detailPage.scrollTop;
      const total = detailPage.scrollHeight - detailPage.clientHeight;
      pdProgressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
      // show sticky title after hero
      pdNavTitle.classList.toggle('show', scrolled > 120);
    });

    // also handle the "View All Projects" links on selected project cards
    document.querySelectorAll('.proj-link').forEach(link => {
      // If there's a "View Details" type link
    });

    // Allow selected proj cards in home to open detail
    document.querySelectorAll('.proj-card').forEach((card, i) => {
      const proj = ALL_PROJECTS[i];
      if (!proj) return;
      card.style.cursor = 'none';
      const solidLink = card.querySelector('.proj-link.solid');
      if (solidLink) {
        solidLink.addEventListener('click', e => {
          e.preventDefault();
          openAllWork();
          setTimeout(() => openProjectDetail(proj), 400);
        });
      }
    });

    // Add cursor hover on detail elements
    document.querySelectorAll('.pd-tech-pill, .pd-cta-link, .pd-back, .pd-feature-item, .pd-gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('big'));
      el.addEventListener('mouseleave', () => ring.classList.remove('big'));
    });