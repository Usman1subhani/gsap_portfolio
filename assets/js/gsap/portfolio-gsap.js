gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
