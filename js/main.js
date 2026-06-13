document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCopyCA();
  initCounters();
  initScrollReveal();
});

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initCopyCA() {
  const btn = document.getElementById('copy-ca');
  const address = document.getElementById('ca-address');

  if (!btn || !address) return;

  btn.addEventListener('click', async () => {
    const text = address.textContent.trim();

    try {
      await navigator.clipboard.writeText(text);
      showCopied(btn);
    } catch {
      const range = document.createRange();
      range.selectNode(address);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      showCopied(btn);
    }
  });
}

function showCopied(btn) {
  const copyIcon = btn.querySelector('.icon-copy');
  const checkIcon = btn.querySelector('.icon-check');
  const copyText = btn.querySelector('.copy-text');

  btn.classList.add('copied');
  copyIcon.classList.add('hidden');
  checkIcon.classList.remove('hidden');
  copyText.textContent = 'COPIED';

  setTimeout(() => {
    btn.classList.remove('copied');
    copyIcon.classList.remove('hidden');
    checkIcon.classList.add('hidden');
    copyText.textContent = 'COPY';
  }, 2000);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      animateCount(el, target);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCount(el, target) {
  const duration = 1500;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.feature-card, .about-visual, .about-text, .token-panel'
  );

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}
