/* ================================================================
   MediThai Admin CMS — Editor JS
   Handles: section expand/collapse, Quill init, save, reset,
            image preview, dirty-tracking, save status
   ================================================================ */

(function () {
  'use strict';

  const container   = document.getElementById('cms-sections');
  const saveBar     = document.getElementById('cms-save-bar');
  const saveMsg     = document.getElementById('cms-save-msg');
  const PAGE_SLUG   = container?.dataset.page || '';
  let richTextKeys  = [];
  try { richTextKeys = JSON.parse(container?.dataset.richKeys || '[]'); } catch (e) {}

  // ── Quill instances ──────────────────────────────────────────────
  const quillers = {}; // key = "lang::sectionKey::fieldKey" → Quill

  const QUILL_TOOLBAR = [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ];

  function initQuillEditors() {
    if (typeof Quill === 'undefined') return;
    document.querySelectorAll('.cms-quill-editor').forEach(el => {
      if (el.dataset.quillInit) return; // skip already initialized
      el.dataset.quillInit = '1';

      const lang    = el.dataset.lang;
      const field   = el.dataset.field;
      const secEl   = el.closest('.cms-section');
      const secKey  = secEl?.dataset.section || '';
      const qKey    = `${lang}::${secKey}::${field}`;

      const q = new Quill(el, {
        theme: 'snow',
        modules: { toolbar: QUILL_TOOLBAR },
        placeholder: 'พิมพ์เนื้อหา...',
      });

      quillers[qKey] = q;
      markSectionDirty(secKey, false); // init clean
    });
  }

  // ── Section collapse/expand ──────────────────────────────────────
  window.cmsToggleSection = function (sectionKey) {
    const body    = document.getElementById(`body-${sectionKey}`);
    const chevron = document.getElementById(`chevron-${sectionKey}`);
    if (!body) return;

    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'block';
    if (chevron) chevron.textContent = isOpen ? '▶' : '▼';

    // Init Quill editors the first time a section opens
    if (!isOpen) {
      setTimeout(initQuillEditors, 50);
    }
  };

  // ── Dirty tracking ───────────────────────────────────────────────
  const _dirty = {};

  function markSectionDirty(sectionKey, dirty = true) {
    _dirty[sectionKey] = dirty;
    const btn = document.getElementById(`save-btn-${sectionKey}`);
    if (btn) {
      btn.classList.toggle('cms-btn-dirty', dirty);
      btn.textContent = dirty ? '💾 บันทึก (มีการเปลี่ยนแปลง)' : `💾 บันทึก`;
    }
  }

  // Listen to textarea / input changes
  document.addEventListener('input', (e) => {
    const el = e.target;
    if (!el.matches('.cms-textarea, .cms-input')) return;
    const sec = el.closest('.cms-section');
    if (sec) markSectionDirty(sec.dataset.section, true);
  });

  // ── Collect section data ─────────────────────────────────────────
  function collectSectionData(sectionKey) {
    const body = document.getElementById(`body-${sectionKey}`);
    if (!body) return null;

    const th   = {};
    const en   = {};
    const meta = {};

    // Textarea / input fields
    body.querySelectorAll('.cms-textarea, .cms-input').forEach(el => {
      const lang  = el.dataset.lang;
      const field = el.dataset.field;
      if (!field) return;
      const val   = el.value;
      if (lang === 'th') th[field] = val;
      else if (lang === 'en') en[field] = val;
      else if (lang === 'meta') meta[field] = val;
    });

    // Quill editors
    Object.entries(quillers).forEach(([qKey, q]) => {
      const [lang, secKey, field] = qKey.split('::');
      if (secKey !== sectionKey) return;
      const html = q.root.innerHTML;
      const val  = html === '<p><br></p>' ? '' : html;
      if (lang === 'th') th[field] = val;
      else if (lang === 'en') en[field] = val;
      else if (lang === 'meta') meta[field] = val;
    });

    return {
      ...(Object.keys(th).length   ? { th }   : {}),
      ...(Object.keys(en).length   ? { en }   : {}),
      ...(Object.keys(meta).length ? { meta } : {}),
    };
  }

  // ── Save section ─────────────────────────────────────────────────
  window.cmsSaveSection = async function (sectionKey) {
    const btn = document.getElementById(`save-btn-${sectionKey}`);
    const originalText = btn?.textContent || '💾 บันทึก';

    const content = collectSectionData(sectionKey);
    if (!content) return;

    if (btn) { btn.disabled = true; btn.textContent = 'กำลังบันทึก...'; }
    showSaveBar('กำลังบันทึก...', 'saving');

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          page_slug: PAGE_SLUG,
          section_key: sectionKey,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showSaveBar(`❌ บันทึกไม่สำเร็จ: ${data.error}`, 'error');
        if (btn) { btn.disabled = false; btn.textContent = originalText; }
        return;
      }

      showSaveBar('✓ บันทึกสำเร็จแล้ว', 'success');
      markSectionDirty(sectionKey, false);

      // Show "customized" badge
      const secHeader = document.querySelector(`#section-${sectionKey} .cms-section-header-left`);
      if (secHeader && !secHeader.querySelector('.cms-section-badge')) {
        const badge = document.createElement('span');
        badge.className = 'cms-section-badge';
        badge.textContent = 'แก้ไขแล้ว';
        secHeader.appendChild(badge);
      }

      // Update timestamp
      const dateEl = document.querySelector(`#section-${sectionKey} .cms-section-date`);
      const now = new Date();
      const dateStr = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      if (dateEl) { dateEl.textContent = dateStr; }
      else {
        const rightHeader = document.querySelector(`#section-${sectionKey} .cms-section-header-right`);
        if (rightHeader) {
          rightHeader.innerHTML = `<span class="cms-section-date">${dateStr}</span>`;
        }
      }

    } catch (err) {
      showSaveBar(`❌ Network error: ${err.message}`, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = originalText; }
    }
  };

  // ── Reset section ─────────────────────────────────────────────────
  window.cmsResetSection = async function (sectionKey) {
    const confirmed = confirm(`Reset "${sectionKey}" กลับเป็นค่าเริ่มต้น?\nการเปลี่ยนแปลงที่บันทึกไว้จะถูกลบ`);
    if (!confirmed) return;

    showSaveBar('กำลัง reset...', 'saving');
    try {
      const res = await fetch(
        `/api/admin/content?page=${encodeURIComponent(PAGE_SLUG)}&section=${encodeURIComponent(sectionKey)}`,
        { method: 'DELETE', credentials: 'include' }
      );
      if (!res.ok) {
        const data = await res.json();
        showSaveBar(`❌ Reset ไม่สำเร็จ: ${data.error}`, 'error');
        return;
      }
      showSaveBar('✓ Reset สำเร็จ — กลับสู่ค่าเริ่มต้น', 'success');
      // Remove "customized" badge
      document.querySelector(`#section-${sectionKey} .cms-section-badge`)?.remove();
      markSectionDirty(sectionKey, false);
    } catch (err) {
      showSaveBar(`❌ Error: ${err.message}`, 'error');
    }
  };

  // ── Save bar ──────────────────────────────────────────────────────
  let saveBarTimer = null;
  function showSaveBar(msg, type = 'info') {
    if (!saveBar || !saveMsg) return;
    saveMsg.textContent = msg;
    saveBar.style.display = 'flex';
    saveBar.className = `cms-save-bar cms-save-bar--${type}`;
    clearTimeout(saveBarTimer);
    if (type === 'success' || type === 'info') {
      saveBarTimer = setTimeout(() => { saveBar.style.display = 'none'; }, 3000);
    }
  }

  // ── Image preview ──────────────────────────────────────────────
  document.addEventListener('input', (e) => {
    const el = e.target;
    if (!el.matches('.cms-input-url')) return;
    const field = el.closest('.cms-image-field');
    if (!field) return;
    let preview = field.querySelector('.cms-image-preview');
    const val = el.value.trim();
    if (val) {
      if (!preview) {
        preview = document.createElement('img');
        preview.className = el.classList.contains('cms-input-full')
          ? 'cms-image-preview cms-image-preview-lg'
          : 'cms-image-preview';
        field.appendChild(preview);
      }
      preview.src = val;
      preview.onerror = () => { preview.src = ''; };
    } else if (preview) {
      preview.remove();
    }
  });

  // ── Dirty warning on unload ────────────────────────────────────
  window.addEventListener('beforeunload', (e) => {
    const hasDirty = Object.values(_dirty).some(Boolean);
    if (hasDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // ── Keyboard shortcut: Cmd/Ctrl+S to save open section ────────
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      // Find which section is open and dirty
      const openSection = document.querySelector('.cms-section-body[style="display: block;"], .cms-section-body:not([style*="none"])');
      if (!openSection) return;
      const sectionKey = openSection.id.replace('body-', '');
      if (_dirty[sectionKey]) cmsSaveSection(sectionKey);
    }
  });

  // Auto-open first section that has overrides
  window.addEventListener('DOMContentLoaded', () => {
    const firstCustomized = document.querySelector('.cms-section-badge');
    if (firstCustomized) {
      const sectionEl = firstCustomized.closest('.cms-section');
      if (sectionEl) cmsToggleSection(sectionEl.dataset.section);
    }
  });

})();
