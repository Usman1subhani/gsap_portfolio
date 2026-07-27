document.addEventListener('DOMContentLoaded', () => {
  const allWorkPage = document.getElementById('all-work-page');
  const awCurtain = document.getElementById('aw-curtain');
  const awClose = document.getElementById('aw-close');
  const awGrid = document.getElementById('aw-grid');
  const awEmpty = document.getElementById('aw-empty');
  const awSectionLabel = document.getElementById('aw-section-label');
  const awVisibleCount = document.getElementById('aw-visible-count');
  const awScroll = document.getElementById('aw-scroll');

  // Automatically start open page transition on load
  function initAllWork() {
    allWorkPage.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Curtain reveal — scale from top (covers screen, slides up to reveal)
    gsap.set(awCurtain, { scaleY: 1, transformOrigin: 'top' });
    gsap.to(awCurtain, { scaleY: 0, duration: 0.7, ease: 'expo.inOut', delay: 0.05 });
    
    // Stagger cards in
    setTimeout(() => {
      awScroll.scrollTop = 0;
      renderCards('all');
      const activeFilter = document.querySelector('.aw-filter.active');
      if (activeFilter) positionFilterLine(activeFilter);
    }, 150);
  }

  function closeAllWork() {
    gsap.set(awCurtain, { scaleY: 0, transformOrigin: 'bottom' });
    gsap.to(awCurtain, {
      scaleY: 1,
      duration: 0.6,
      ease: 'expo.in',
      onComplete() {
        document.body.style.overflow = '';
        window.location.href = '../index.html'; // Redirect to home
      }
    });
  }

  if (awClose) {
    awClose.addEventListener('click', closeAllWork);
  }

  // Handle browser back button or navigation with curtain cover
  function navigateToDetail(projectId) {
    gsap.set(awCurtain, { scaleY: 0, transformOrigin: 'bottom' });
    gsap.to(awCurtain, {
      scaleY: 1,
      duration: 0.6,
      ease: 'expo.in',
      onComplete() {
        window.location.href = 'projects_Details.html?id=' + projectId;
      }
    });
  }

  /* ── render cards ── */
  function renderCards(filter) {
    if (typeof ALL_PROJECTS === 'undefined') {
      console.error('ALL_PROJECTS data is missing!');
      return;
    }

    const filtered = filter === 'all'
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter(p => p.type === filter);

    if (awVisibleCount) awVisibleCount.textContent = filtered.length;

    if (filtered.length === 0) {
      if (awGrid) awGrid.innerHTML = '';
      if (awEmpty) awEmpty.classList.add('show');
      return;
    }
    if (awEmpty) awEmpty.classList.remove('show');

    if (awGrid) {
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
              ${p.tags.slice(0, 4).map(t => `<span class="aw-card-tag">${t}</span>`).join('')}
            </div>
          </div>
          <div class="aw-card-footer">
            <a href="${p.liveUrl}" class="aw-card-cta solid" target="_blank">Live ↗</a>
            <a href="${p.githubUrl}" class="aw-card-cta outline" target="_blank">GitHub</a>
            <button class="aw-card-detail-btn" data-id="${p.id}" aria-label="View Details" title="View Details">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </button>
          </div>
        </div>
      `).join('');
    }

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
        navigateToDetail(btn.dataset.id);
      });
    });

    // whole card click also opens detail
    document.querySelectorAll('.aw-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.tagName === 'A' || e.target.closest('a')) return;
        navigateToDetail(card.dataset.id);
      });
    });
  }

  /* ── filters ── */
  function positionFilterLine(activeBtn) {
    const line = document.getElementById('aw-filter-line');
    if (!activeBtn || !line) return;
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
      const label = filter === 'all' ? 'All Projects' : btn.textContent.trim() + ' Projects';
      if (awSectionLabel) awSectionLabel.textContent = label;
      
      // collapse existing cards, then re-render
      document.querySelectorAll('.aw-card').forEach(c => c.classList.remove('in'));
      setTimeout(() => renderCards(filter), 200);
      if (awScroll) awScroll.scrollTop = 0;
    });
  });

  // Re-align line on window resize
  window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.aw-filter.active');
    if (activeBtn) positionFilterLine(activeBtn);
  });

  // Initialize page on load
  initAllWork();
});
