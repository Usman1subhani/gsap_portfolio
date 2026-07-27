document.addEventListener('DOMContentLoaded', () => {
  const detailPage = document.getElementById('project-detail-page');
  const pdCurtain = document.getElementById('pd-curtain');
  const pdProgressBar = document.getElementById('pd-progress-bar');
  const pdNavTitle = document.getElementById('pd-nav-title');

  // Extract project id from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (typeof ALL_PROJECTS === 'undefined') {
    console.error('ALL_PROJECTS data is missing!');
    return;
  }

  const proj = ALL_PROJECTS.find(p => p.id === projectId);

  if (!proj) {
    console.error('Project not found or no ID provided. Redirecting to projects list.');
    window.location.href = 'projects.html';
    return;
  }

  // Populate project details dynamically
  function populateAndRevealDetail(project) {
    // Populate Hero section
    const heroImg = document.getElementById('pd-hero-img');
    const heroEyebrow = document.getElementById('pd-hero-eyebrow');
    const heroTitle = document.getElementById('pd-hero-title');
    
    if (heroImg) heroImg.src = project.img;
    if (heroEyebrow) heroEyebrow.textContent = project.typeLabel + ' · ' + project.year;
    if (heroTitle) heroTitle.textContent = project.title.toUpperCase();
    if (pdNavTitle) pdNavTitle.textContent = project.title.toUpperCase();

    // Populate Hero Meta Grid
    const heroMeta = document.getElementById('pd-hero-meta');
    if (heroMeta) {
      heroMeta.innerHTML = `
        <div class="pd-meta-item"><div class="pd-meta-label">Category</div><div class="pd-meta-value">${project.typeLabel}</div></div>
        <div class="pd-meta-item"><div class="pd-meta-label">Year</div><div class="pd-meta-value">${project.year}</div></div>
        <div class="pd-meta-item"><div class="pd-meta-label">Stack</div><div class="pd-meta-value">${project.tags.slice(0, 2).join(', ')}</div></div>
      `;
    }

    // Populate Overview and Challenges
    const overviewText = document.getElementById('pd-overview-text');
    const challengeText = document.getElementById('pd-challenge-text');
    const techPills = document.getElementById('pd-tech-pills');
    
    if (overviewText) overviewText.textContent = project.overview;
    if (challengeText) challengeText.textContent = project.challenge;
    if (techPills) {
      techPills.innerHTML = project.tags.map(t => `<span class="pd-tech-pill">${t}</span>`).join('');
    }

    // Populate Gallery Images
    if (project.gallery && project.gallery.length >= 3) {
      const g1 = document.getElementById('pd-gallery-1');
      const g2 = document.getElementById('pd-gallery-2');
      const g3 = document.getElementById('pd-gallery-3');
      if (g1) g1.src = project.gallery[0];
      if (g2) g2.src = project.gallery[1];
      if (g3) g3.src = project.gallery[2];
    }

    // Populate Features
    const featuresGrid = document.getElementById('pd-features-grid');
    if (featuresGrid && project.features) {
      featuresGrid.innerHTML = project.features.map(f => `
        <div class="pd-feature-item">
          <div class="pd-feature-num">${f.num}</div>
          <div class="pd-feature-title">${f.title}</div>
          <div class="pd-feature-desc">${f.desc}</div>
        </div>
      `).join('');
    }

    // Populate Call to Action (CTA) Links
    const ctaTitle = document.getElementById('pd-cta-title');
    const ctaDesc = document.getElementById('pd-cta-desc');
    const ctaLinks = document.getElementById('pd-cta-links');
    
    if (ctaTitle) ctaTitle.textContent = 'Ready to See ' + project.title + ' Live?';
    if (ctaDesc) ctaDesc.textContent = 'Explore the live product or dig into the source code on GitHub.';
    if (ctaLinks) {
      ctaLinks.innerHTML = `
        <a href="${project.liveUrl}" class="pd-cta-link solid" target="_blank">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          View Live
        </a>
        <a href="${project.githubUrl}" class="pd-cta-link outline" target="_blank">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.79 1.3 3.47.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.28-1.23 3.28-1.23.65 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
          Source Code
        </a>
      `;
    }

    // Scroll details container to top on transition start
    if (detailPage) detailPage.scrollTop = 0;
    if (pdNavTitle) pdNavTitle.classList.remove('show');

    // Make detail container open/visible
    detailPage.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Play curtain slide up transition
    if (pdCurtain) {
      gsap.set(pdCurtain, { scaleY: 1, transformOrigin: 'bottom', opacity: 1 });
      gsap.to(pdCurtain, {
        scaleY: 0,
        duration: 0.75,
        ease: 'expo.inOut',
        onComplete() {
          pdCurtain.style.pointerEvents = 'none';
          document.body.style.overflow = ''; // Allow scrolling of details page
        }
      });
    }

    // Staggered entrance animations for details page sections
    gsap.fromTo('#pd-hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.4 });
    gsap.fromTo('#pd-hero-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.55 });
    gsap.fromTo('#pd-hero-meta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.65 });
    gsap.fromTo('.pd-overview', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.7 });

    gsap.fromTo('.pd-gallery-item',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out', delay: 0.8 }
    );

    gsap.fromTo('.pd-feature-item',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 1 }
    );
  }

  function closeProjectDetail() {
    if (pdCurtain) {
      pdCurtain.style.pointerEvents = 'all';
      gsap.set(pdCurtain, { scaleY: 0, transformOrigin: 'top', opacity: 1 });
      gsap.to(pdCurtain, {
        scaleY: 1,
        duration: 0.6,
        ease: 'expo.in',
        onComplete() {
          // Navigate back to projects list
          window.location.href = 'projects.html';
        }
      });
    } else {
      window.location.href = 'projects.html';
    }
  }

  // Bind exit navigation triggers
  const backBtn = document.getElementById('pd-back');
  if (backBtn) {
    backBtn.addEventListener('click', closeProjectDetail);
  }

  // Scroll progress bar + nav sticky title indicator
  if (detailPage && pdProgressBar) {
    detailPage.addEventListener('scroll', () => {
      const scrolled = detailPage.scrollTop;
      const total = detailPage.scrollHeight - detailPage.clientHeight;
      pdProgressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
      if (pdNavTitle) {
        pdNavTitle.classList.toggle('show', scrolled > 120);
      }
    });
  }

  // Run dynamic generation
  populateAndRevealDetail(proj);
});
