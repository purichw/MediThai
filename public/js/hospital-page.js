/* Shared script for hospital brand pages */
function initHospitalPage(config) {
  // Active tab filter
  document.querySelectorAll('.hosp-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.hosp-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.pkg-card[data-cat]').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}
