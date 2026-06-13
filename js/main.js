document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCopyCA();
  initCounters();
  initScrollReveal();
  initAiBackground();
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
  document.querySelectorAll('.ca-box').forEach(box => {
    const btn = box.querySelector('.btn-copy');
    const address = box.querySelector('.ca-address');

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
    '.feature-card, .about-visual, .about-text, .chart-panel, .token-panel'
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

function initAiBackground() {
  const canvas = document.getElementById('ai-canvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = 0;
  let height = 0;
  let animationId = null;

  const config = {
    density: 0.00007,
    minCount: 45,
    maxCount: 110,
    linkDistance: 180,
    speed: 0.45,
  };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const count = Math.min(
      config.maxCount,
      Math.max(config.minCount, Math.floor(width * height * config.density))
    );

    particles = Array.from({ length: count }, () => createParticle());
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
      radius: Math.random() * 2 + 1.5,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];

      a.x += a.vx;
      a.y += a.vy;
      a.pulse += 0.02;

      if (a.x < 0) a.x = width;
      if (a.x > width) a.x = 0;
      if (a.y < 0) a.y = height;
      if (a.y > height) a.y = 0;

      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);

        if (dist < config.linkDistance) {
          const alpha = (1 - dist / config.linkDistance) * 0.65;
          ctx.strokeStyle = `rgba(255, 107, 0, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      const glow = 0.65 + Math.sin(a.pulse) * 0.35;
      ctx.fillStyle = `rgba(255, 140, 0, ${glow})`;
      ctx.shadowColor = 'rgba(255, 69, 0, 1)';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    animationId = requestAnimationFrame(draw);
  }

  resize();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationId);
    resize();
    draw();
  });
}
