/* ================================================================
   MediThai Hospital Network — Main JavaScript
   ================================================================ */

/* ----------------------------------------------------------------
   Page Loader
   ---------------------------------------------------------------- */
// Show loader only on first visit per session; skip on page-to-page navigation
const _loader = document.querySelector('.page-loader');
let _loaderHidden = false;

function _hideLoader() {
  if (_loaderHidden || !_loader) return;
  _loaderHidden = true;
  _loader.classList.add('hidden');
  setTimeout(() => { if (_loader) _loader.style.display = 'none'; }, 450);
}

if (sessionStorage.getItem('loaderShown')) {
  // Not first visit — remove immediately, bypass CSS transition entirely
  if (_loader) _loader.style.display = 'none';
} else {
  // First visit — show loader, mark as shown
  sessionStorage.setItem('loaderShown', '1');

  let _pageLoaded = false;
  let _minTimeDone = false;

  function _tryHideLoader() {
    if (_pageLoaded && _minTimeDone) _hideLoader();
  }

  setTimeout(() => { _minTimeDone = true; _tryHideLoader(); }, 800);
  setTimeout(_hideLoader, 3500);
  window.addEventListener('load', () => { _pageLoaded = true; _tryHideLoader(); });
}

/* ----------------------------------------------------------------
   DOM refs shared by scroll handler (declared before Lenis init)
   ---------------------------------------------------------------- */
const header        = document.querySelector('.header');
const announcementBar = document.querySelector('.announcement-bar');
const scrollTopBtn  = document.querySelector('.scroll-top');
const heroImg       = document.querySelector('.hero-image');

const progressBar = document.createElement('div');
progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;z-index:9999;background:linear-gradient(90deg,#0891B2,#F59E0B);width:0%;pointer-events:none;';
document.body.appendChild(progressBar);

/* ----------------------------------------------------------------
   Smooth Scroll (Lenis)
   ---------------------------------------------------------------- */
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({ lerp: 0.1 });

  lenis.on('scroll', ({ scroll, progress }) => {
    header?.classList.toggle('scrolled', scroll > 20);
    scrollTopBtn?.classList.toggle('visible', scroll > 500);
    if (heroImg) heroImg.style.transform = `scale(1.05) translateY(${scroll * 0.15}px)`;
    progressBar.style.width = `${progress * 100}%`;
  });

  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
} else {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header?.classList.toggle('scrolled', y > 20);
    scrollTopBtn?.classList.toggle('visible', y > 500);
    if (heroImg) heroImg.style.transform = `scale(1.05) translateY(${y * 0.15}px)`;
    progressBar.style.width = max > 0 ? `${(y / max) * 100}%` : '0%';
  }, { passive: true });
}

/* ----------------------------------------------------------------
   Sticky Header / Announcement
   ---------------------------------------------------------------- */
let announcementClosed = localStorage.getItem('announcementClosed') === '1';

if (announcementClosed && announcementBar) {
  announcementBar.classList.add('hidden');
}

function updateHeaderOffset() {
  const barHeight = (!announcementClosed && announcementBar) ? announcementBar.offsetHeight : 0;
  if (header) document.documentElement.style.setProperty('--header-height', (76 + barHeight) + 'px');
}

document.querySelector('.announcement-close')?.addEventListener('click', function () {
  announcementClosed = true;
  localStorage.setItem('announcementClosed', '1');
  announcementBar?.classList.add('hidden');
  updateHeaderOffset();
});
updateHeaderOffset();

/* ----------------------------------------------------------------
   Scroll-to-top Button
   ---------------------------------------------------------------- */
scrollTopBtn?.addEventListener('click', () => {
  lenis ? lenis.scrollTo(0) : window.scrollTo(0, 0);
});

/* ----------------------------------------------------------------
   Mobile Navigation
   ---------------------------------------------------------------- */
const mobileToggle = document.querySelector('.mobile-toggle');
const mobileNav    = document.querySelector('.mobile-nav');

mobileToggle?.addEventListener('click', () => {
  mobileToggle.classList.toggle('open');
  mobileNav?.classList.toggle('open');
  document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
});

mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileToggle.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ----------------------------------------------------------------
   Language Toggle
   ---------------------------------------------------------------- */
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (typeof switchLang !== 'undefined') switchLang(btn.dataset.lang);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  if (typeof applyTranslations !== 'undefined') applyTranslations();
  // Load CMS content overrides and re-apply translations
  _loadContentOverrides();
});

/* ----------------------------------------------------------------
   CMS Content Overrides
   Fetches DB overrides from /api/content and patches T before
   re-applying translations. Runs after initial render so the
   page never shows a blank state.
   ---------------------------------------------------------------- */
(function _loadContentOverrides() {
  // Determine page slug from path
  const path = window.location.pathname;
  let pageSlug = 'home';
  if (path.startsWith('/doctors')) pageSlug = 'doctors';
  else if (path.startsWith('/packages')) pageSlug = 'packages';
  else if (path.startsWith('/appointments')) pageSlug = 'appointments';
  else if (path.startsWith('/about')) pageSlug = 'about';
  else if (path.startsWith('/contact')) pageSlug = 'contact';
  else if (path === '/') pageSlug = 'home';

  fetch(`/api/content?page=${pageSlug}`)
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!data || typeof T === 'undefined') return;
      if (data.th) Object.assign(T.th, data.th);
      if (data.en) Object.assign(T.en, data.en);
      const bgUrl = data.meta?.hero_bg_url || data.th?.hero_bg_url;
      if (bgUrl) {
        const heroImg = document.querySelector('.hero-image');
        if (heroImg) heroImg.style.backgroundImage = `url('${bgUrl}')`;
      }
      if (typeof applyTranslations !== 'undefined') applyTranslations();
    })
    .catch(() => {});

  // Phase 2: SSR already applied layout via inline styles in index.astro.
  // This client-side block is a fallback only for non-SSR scenarios (cache hits etc).
  // Skip if body already has flex from SSR <style> injection.
  if (pageSlug === 'home' && getComputedStyle(document.body).display !== 'flex') {
    fetch('/api/content?page=home')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        try {
          const layout = data?.th?.section_order || data?.en?.section_order;
          const hidden = data?.th?.hidden_sections || data?.en?.hidden_sections;
          if (!layout && !hidden) return;
          const order = layout ? JSON.parse(layout) : null;
          const hiddenSet = hidden ? new Set(JSON.parse(hidden)) : new Set();
          document.querySelectorAll('[data-section-key]').forEach(el => {
            const key = el.dataset.sectionKey;
            if (hiddenSet.has(key)) { el.style.display = 'none'; return; }
            if (order) { const idx = order.indexOf(key); el.style.order = idx >= 0 ? idx : 99; }
          });
          if (order) { const b = document.body; b.style.display = 'flex'; b.style.flexDirection = 'column'; }
        } catch (e) {}
      })
      .catch(() => {});
  }
})();

/* ----------------------------------------------------------------
   Phase 3: Nav Config Apply
   Fetch saved nav config from DB and hide/relabel nav items.
   ---------------------------------------------------------------- */
(function _applyNavConfig() {
  fetch('/api/content?page=global')
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!data?.th?.nav_items) return;
      try {
        const navItems = JSON.parse(data.th.nav_items);
        navItems.forEach(tab => {
          // Top-level tab
          const tabEl = document.querySelector(`[data-nav-id="${tab.id}"]`);
          if (tabEl) {
            if (!tab.visible) { tabEl.style.display = 'none'; }
            // Relabel if label changed
            const link = tabEl.querySelector('.nav-link') || tabEl;
            if (link && tab.label_th) {
              const textNode = [...link.childNodes].find(n => n.nodeType === 3);
              if (textNode) textNode.textContent = (typeof currentLang !== 'undefined' && currentLang === 'en')
                ? (tab.label_en || tab.label_th) + ' '
                : tab.label_th + ' ';
            }
          }
          // Children
          if (tab.children) {
            tab.children.forEach(child => {
              const childEl = document.querySelector(`[data-nav-id="${child.id}"]`);
              if (childEl && !child.visible) childEl.style.display = 'none';
            });
          }
        });
      } catch(e) {}
    })
    .catch(() => {});
})();

/* ----------------------------------------------------------------
   Phase 4: Dynamic Component Rendering
   Fetches DB components and injects them into sections when defined.
   Falls back to hardcoded HTML if no DB components exist.
   ---------------------------------------------------------------- */
(function _loadComponents() {
  if (window.location.pathname !== '/') return;

  const SECTIONS = ['specialties', 'quick_actions', 'trust', 'testimonials', 'stats'];
  const lang = typeof currentLang !== 'undefined' ? currentLang : (localStorage.getItem('lang') || 'th');

  SECTIONS.forEach(section => {
    fetch(`/api/components?page=home&section=${section}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const comps = Array.isArray(data) ? data : (data?.components || []);
        if (!comps.length) return;
        const el = document.querySelector(`[data-section-key="${section}"]`);
        if (!el) return;
        // Fix 3: Use data-comp-target for reliable targeting
        const target = el.querySelector(`[data-comp-target="${section}"]`);

        if (section === 'specialties') {
          const grid = target || el.querySelector('.specialties-grid');
          if (!grid) return;
          grid.innerHTML = comps.map(c => {
            const name = lang === 'en' ? (c.content.name_en || c.content.name_th) : (c.content.name_th || c.content.name_en);
            const desc = lang === 'en' ? (c.content.desc_en || c.content.desc_th) : (c.content.desc_th || c.content.desc_en);
            return `<div class="specialty-card">
              ${c.content.icon_url ? `<img src="${c.content.icon_url}" alt="${name}" class="specialty-icon" />` : `<span class="specialty-icon" style="font-size:2rem">${c.content.icon_emoji || '🏥'}</span>`}
              <div class="specialty-name">${name || ''}</div>
              ${desc ? `<p class="specialty-desc">${desc}</p>` : ''}
            </div>`;
          }).join('');
        }

        if (section === 'quick_actions') {
          const grid = target || el.querySelector('.quick-actions-inner');
          if (!grid) return;
          grid.innerHTML = comps.map(c => {
            const label = lang === 'en' ? (c.content.label_en || c.content.label_th) : (c.content.label_th || c.content.label_en);
            return `<a href="${c.content.href || '#'}" class="qa-item">
              <div class="qa-icon">${c.content.icon_emoji || '🔗'}</div>
              <span>${label || ''}</span>
            </a>`;
          }).join('');
        }

        if (section === 'trust') {
          const list = target || el.querySelector('.trust-points');
          if (!list) return;
          list.innerHTML = comps.map(c => {
            const text = lang === 'en' ? (c.content.text_en || c.content.text_th) : (c.content.text_th || c.content.text_en);
            return `<div class="trust-point">
              <div class="trust-point-icon">${c.content.icon_emoji || '✓'}</div>
              <div class="trust-point-text">${text || ''}</div>
            </div>`;
          }).join('');
        }

        if (section === 'testimonials') {
          const list = target || el.querySelector('.swiper-wrapper');
          if (!list) return;
          list.innerHTML = comps.map(c => {
            const quote = lang === 'en' ? (c.content.quote_en || c.content.quote_th) : (c.content.quote_th || c.content.quote_en);
            return `<div class="swiper-slide"><div class="testimonial-card">
              ${c.content.avatar_url ? `<img src="${c.content.avatar_url}" alt="${c.content.author_name || ''}" class="testimonial-avatar" />` : ''}
              <blockquote class="testimonial-quote">${quote || ''}</blockquote>
              <div class="testimonial-author">${c.content.author_name || ''}</div>
              ${c.content.rating ? `<div class="testimonial-stars">${'★'.repeat(parseInt(c.content.rating))}${'☆'.repeat(5-parseInt(c.content.rating))}</div>` : ''}
            </div></div>`;
          }).join('');
        }

        if (section === 'stats') {
          const grid = el.querySelector('.stats-grid, [class*="stat"]');
          if (!grid) return;
          grid.innerHTML = comps.map(c => {
            const label = lang === 'en' ? (c.content.label_en || c.content.label_th) : (c.content.label_th || c.content.label_en);
            return `<div class="stat-item">
              <div class="stat-number">${c.content.number || ''}</div>
              <div class="stat-label">${label || ''}</div>
            </div>`;
          }).join('');
        }
      })
      .catch(() => {});
  });
})();

/* ----------------------------------------------------------------
   Phase 5: Page View Tracking
   ---------------------------------------------------------------- */
(function _trackPageView() {
  const path = window.location.pathname;
  // Don't track admin pages
  if (path.startsWith('/admin')) return;
  const lang = typeof currentLang !== 'undefined' ? currentLang : (localStorage.getItem('lang') || 'th');
  navigator.sendBeacon
    ? navigator.sendBeacon('/api/track', JSON.stringify({ page_path: path, lang, referrer: document.referrer }))
    : fetch('/api/track', { method: 'POST', body: JSON.stringify({ page_path: path, lang, referrer: document.referrer }), keepalive: true }).catch(() => {});
})();

/* ----------------------------------------------------------------
   Scroll Reveal (IntersectionObserver)
   ---------------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ----------------------------------------------------------------
   Animated Number Counters
   ---------------------------------------------------------------- */
function animateCounter(el, target, duration = 1800, suffix = '') {
  let start = 0;
  const startTime = performance.now();
  const isFloat = target % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = start + (target - start) * eased;
    el.textContent = isFloat
      ? current.toFixed(1) + suffix
      : Math.round(current).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.dataset.target;
    if (!raw) return;
    const suffix = el.dataset.suffix || '';
    animateCounter(el, parseFloat(raw.replace(/,/g, '')), 1800, suffix);
    statObserver.unobserve(el);
  });
}, { threshold: 0.4 });

document.querySelectorAll('[data-target]').forEach(el => statObserver.observe(el));

/* ----------------------------------------------------------------
   Swiper Carousels
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Swiper === 'undefined') return;

  if (document.querySelector('.packages-swiper')) {
    new Swiper('.packages-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      grabCursor: true,
      pagination: { el: '.packages-swiper .swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.packages-swiper .swiper-button-next',
        prevEl: '.packages-swiper .swiper-button-prev',
      },
      breakpoints: {
        640:  { slidesPerView: 2 },
        900:  { slidesPerView: 3 },
        1200: { slidesPerView: 3 },
      },
      autoplay: { delay: 5000, disableOnInteraction: false },
    });
  }

  if (document.querySelector('.doctors-swiper')) {
    new Swiper('.doctors-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      grabCursor: true,
      pagination: { el: '.doctors-swiper .swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.doctors-swiper .swiper-button-next',
        prevEl: '.doctors-swiper .swiper-button-prev',
      },
      breakpoints: {
        580:  { slidesPerView: 2 },
        900:  { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
      },
    });
  }

  if (document.querySelector('.testimonials-swiper')) {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      grabCursor: true,
      pagination: { el: '.testimonials-swiper .swiper-pagination', clickable: true },
      autoplay: { delay: 6000, disableOnInteraction: false },
      breakpoints: {
        768:  { slidesPerView: 2 },
        1100: { slidesPerView: 3 },
      },
    });
  }
});

/* ----------------------------------------------------------------
   Leaflet Map
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('map', {
    center: [13.756, 100.502],
    zoom: 11,
    zoomControl: false,
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CartoDB',
    maxZoom: 19,
  }).addTo(map);

  L.control.zoom({ position: 'topright' }).addTo(map);

  function makeIcon(color) {
    return L.divIcon({
      className: '',
      html: `
        <div style="
          width:40px;height:40px;
          background:${color};
          border:3px solid #fff;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 4px 16px rgba(0,0,0,.25);
          display:flex;align-items:center;justify-content:center;
        ">
          <i class="fa-solid fa-hospital" style="
            transform:rotate(45deg);
            color:#fff;font-size:14px;
          "></i>
        </div>
        <div style="
          width:10px;height:10px;
          background:${color};
          border-radius:50%;
          margin:2px auto 0;
          opacity:.4;
          animation:pulse 2s ease infinite;
        "></div>`,
      iconSize: [40, 52],
      iconAnchor: [20, 50],
      popupAnchor: [0, -52],
    });
  }

  const hospitals = [
    { lat: 13.7328, lng: 100.5308, name: 'MediThai กรุงเทพ (สำนักงานใหญ่)', nameEn: 'MediThai Bangkok (HQ)', addr: '2 ถนนเพชรบุรีตัดใหม่ บางกอกน้อย', phone: '02-310-3000', color: '#1B3A6B', id: 1 },
    { lat: 13.7563, lng: 100.5018, name: 'MediThai หัวใจ', nameEn: 'MediThai Heart Hospital', addr: '1 ซอยสาทร 15 สาทร กรุงเทพ', phone: '02-310-3100', color: '#EF4444', id: 2 },
    { lat: 13.7969, lng: 100.5600, name: 'MediThai มะเร็ง', nameEn: 'MediThai Cancer Center', addr: '99 ถนนพระราม 9 ห้วยขวาง', phone: '02-310-3200', color: '#8B5CF6', id: 3 },
    { lat: 13.7144, lng: 100.4612, name: 'MediThai สมองและกระดูก', nameEn: 'MediThai Brain & Spine', addr: '33 ถนนบางขุนนนท์ บางกอกน้อย', phone: '02-310-3300', color: '#0891B2', id: 4 },
    { lat: 13.8200, lng: 100.5200, name: 'MediThai เด็ก', nameEn: "MediThai Children's Hospital", addr: '55 ถนนลาดพร้าว จตุจักร', phone: '02-310-3400', color: '#10B981', id: 5 },
    { lat: 18.7883, lng: 98.9853, name: 'MediThai เชียงใหม่', nameEn: 'MediThai Chiang Mai', addr: '100 ถนนห้วยแก้ว เมือง เชียงใหม่', phone: '053-310-3000', color: '#F59E0B', id: 6 },
  ];

  hospitals.forEach(h => {
    const marker = L.marker([h.lat, h.lng], { icon: makeIcon(h.color) }).addTo(map);
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'th';
    marker.bindPopup(`
      <div class="map-popup">
        <h4>${h.name}</h4>
        <p><i class="fa-solid fa-location-dot" style="color:#0891B2;margin-right:4px"></i>${h.addr}</p>
        <p><i class="fa-solid fa-phone" style="color:#0891B2;margin-right:4px"></i>${h.phone}</p>
        <a href="locations.html#loc-${h.id}">
          <i class="fa-solid fa-arrow-right"></i>
          ${lang === 'th' ? 'ดูรายละเอียด' : 'View Details'}
        </a>
      </div>
    `);

    marker.on('click', () => {
      document.querySelectorAll('.location-card').forEach(c => c.classList.remove('active'));
      const card = document.querySelector(`.location-card[data-id="${h.id}"]`);
      if (card) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  document.querySelectorAll('.location-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      const h = hospitals.find(x => x.id === id);
      if (h) {
        map.flyTo([h.lat, h.lng], 14, { duration: 1.4 });
        document.querySelectorAll('.location-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      }
    });
  });
});

/* ----------------------------------------------------------------
   Appointment Form — Multi-step
   ---------------------------------------------------------------- */
let currentStep = 1;

function goToStep(step) {
  document.querySelectorAll('.appt-step').forEach((el, i) => {
    el.style.display = (i + 1 === step) ? 'block' : 'none';
  });
  document.querySelectorAll('.step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === step);
    el.classList.toggle('done',   i + 1 < step);
  });
  currentStep = step;
  const summaryCard = document.querySelector('.appt-summary-card');
  if (summaryCard) lenis ? lenis.scrollTo(summaryCard) : summaryCard.scrollIntoView();
}

document.querySelector('.btn-next-step')?.addEventListener('click', () => {
  if (currentStep < 3) goToStep(currentStep + 1);
});
document.querySelector('.btn-prev-step')?.addEventListener('click', () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

document.querySelectorAll('.radio-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.querySelector('input')?.name;
    if (name) {
      document.querySelectorAll(`.radio-card input[name="${name}"]`).forEach(inp => {
        inp.closest('.radio-card').classList.remove('selected');
      });
    }
    card.classList.add('selected');
    const inp = card.querySelector('input');
    if (inp) inp.checked = true;
  });
});

function updateSummary() {
  const fields = ['appt-name', 'appt-phone', 'appt-specialty', 'appt-hospital', 'appt-date', 'appt-time'];
  const summaryKeys = ['sum-name', 'sum-phone', 'sum-specialty', 'sum-hospital', 'sum-date', 'sum-time'];
  fields.forEach((id, i) => {
    const el = document.getElementById(id);
    const sum = document.getElementById(summaryKeys[i]);
    if (el && sum) sum.textContent = el.value || '—';
  });
}
document.querySelectorAll('.appt-form-input').forEach(el => {
  el.addEventListener('change', updateSummary);
  el.addEventListener('input', updateSummary);
});

/* ----------------------------------------------------------------
   Health Library — A-Z Filter
   ---------------------------------------------------------------- */
document.querySelectorAll('.az-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const letter = btn.dataset.letter;
    document.querySelectorAll('.az-btn').forEach(b => b.classList.toggle('active', b.dataset.letter === letter));
    document.querySelectorAll('.article-card[data-letter]').forEach(card => {
      const show = letter === 'ALL' || card.dataset.letter === letter;
      card.style.display = show ? '' : 'none';
    });
  });
});

/* ----------------------------------------------------------------
   Package Tab Filter
   ---------------------------------------------------------------- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
    document.querySelectorAll('.package-card[data-cat]').forEach(card => {
      const show = cat === 'ALL' || card.dataset.cat === cat;
      card.closest('.swiper-slide')
        ? (card.closest('.swiper-slide').style.display = show ? '' : 'none')
        : (card.style.display = show ? '' : 'none');
    });
  });
});

/* ----------------------------------------------------------------
   Doctor Search Filter
   ---------------------------------------------------------------- */
function filterDoctors() {
  const query   = document.getElementById('doctor-search')?.value.toLowerCase() || '';
  const spec    = document.getElementById('doc-spec-filter')?.value || '';
  const hosp    = document.getElementById('doc-hosp-filter')?.value || '';

  document.querySelectorAll('.doctor-card').forEach(card => {
    const name    = (card.querySelector('.doctor-name')?.textContent || '').toLowerCase();
    const cardSpec= card.dataset.specialty || '';
    const cardHosp= card.dataset.hospital  || '';
    const matchQ  = !query || name.includes(query);
    const matchS  = !spec  || cardSpec === spec;
    const matchH  = !hosp  || cardHosp === hosp;
    card.closest('.swiper-slide')
      ? (card.closest('.swiper-slide').style.display = (matchQ && matchS && matchH) ? '' : 'none')
      : (card.style.display = (matchQ && matchS && matchH) ? '' : 'none');
  });
}

['doctor-search', 'doc-spec-filter', 'doc-hosp-filter'].forEach(id => {
  document.getElementById(id)?.addEventListener('input',  filterDoctors);
  document.getElementById(id)?.addEventListener('change', filterDoctors);
});

/* ----------------------------------------------------------------
   Newsletter Form
   ---------------------------------------------------------------- */
document.querySelector('.newsletter-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const btn   = e.target.querySelector('.btn');
  if (!input?.value) return;
  btn.textContent = '✓';
  btn.style.background = '#10B981';
  input.value = '';
  setTimeout(() => {
    btn.textContent = t('news_btn');
    btn.style.background = '';
  }, 3000);
});

/* ----------------------------------------------------------------
   Active nav link highlighting
   ---------------------------------------------------------------- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href && (href === currentPage || href === './' + currentPage)) {
    link.classList.add('active');
  }
});
