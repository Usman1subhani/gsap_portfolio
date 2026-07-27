/* ── STATEFUL THEME INITIALIZATION ─────────────────── */
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-btn');
  const moonIcon = document.getElementById('icon-moon');
  const sunIcon = document.getElementById('icon-sun');
  
  if (themeBtn && moonIcon && sunIcon) {
    const isDark = savedTheme === 'dark';
    moonIcon.style.display = isDark ? 'block' : 'none';
    sunIcon.style.display = isDark ? 'none' : 'block';

    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('portfolio-theme', nextTheme);
      
      const isNowDark = nextTheme === 'dark';
      moonIcon.style.display = isNowDark ? 'block' : 'none';
      sunIcon.style.display = isNowDark ? 'none' : 'block';
    });
  }

  /* ── NAVBAR STUCK STATE ───────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('stuck', window.scrollY > 80);
    });
  }
});

/* ── CUSTOM MOUSE CURSOR ───────────────────────────── */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

if (dot && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    gsap.set(dot, { x: mx, y: my });
  });
  
  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    gsap.set(ring, { x: rx, y: ry });
  });

  // Document-level event delegation for cursor scale on hover
  document.addEventListener('mouseenter', e => {
    const target = e.target;
    if (target && target.matches && target.matches('a, button, input, textarea, .pd-tech-pill, .pd-cta-link, .pd-back, .pd-feature-item, .pd-gallery-item, .aw-card, .aw-card-detail-btn, .proj-card')) {
      ring.classList.add('big');
    }
  }, true);

  document.addEventListener('mouseleave', e => {
    const target = e.target;
    if (target && target.matches && target.matches('a, button, input, textarea, .pd-tech-pill, .pd-cta-link, .pd-back, .pd-feature-item, .pd-gallery-item, .aw-card, .aw-card-detail-btn, .proj-card')) {
      ring.classList.remove('big');
    }
  }, true);
}

/* ── GLOBAL FORM SUBMISSION HANDLER ────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.querySelector('.submit-btn');
  if (!btn) return;
  
  btn.innerHTML = 'Sent! ✓';
  btn.style.background = '#00ff87';
  
  setTimeout(() => {
    btn.innerHTML = 'Send Message <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}
