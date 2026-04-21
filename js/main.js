/* =============================================================
   NETWORK CANVAS ANIMATION (Hero background)
   ============================================================= */
(function () {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const ACCENT = '#00d4ff';
  const NODE_COUNT = 60;
  let nodes = [];
  let w, h;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function createNode() {
    return {
      x:  Math.random() * w,
      y:  Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 2.5 + 1.2,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(createNode());
  }

  function drawFrame() {
    ctx.clearRect(0, 0, w, h);

    /* Move nodes */
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += 0.025;

      /* Bounce on edges */
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    const MAX_DIST = 160;

    /* Draw connections */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > MAX_DIST) continue;

        const alpha = (1 - dist / MAX_DIST) * 0.35;
        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        /* Animated data packet */
        if (Math.random() < 0.002) {
          const t = (Date.now() % 2000) / 2000;
          const px = a.x + (b.x - a.x) * t;
          const py = a.y + (b.y - a.y) * t;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 180, ${alpha * 2})`;
          ctx.fill();
        }
      }
    }

    /* Draw nodes */
    nodes.forEach(n => {
      const pulse = 0.7 + 0.3 * Math.sin(n.pulse);

      /* Outer glow */
      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
      grd.addColorStop(0, `rgba(0, 212, 255, ${0.18 * pulse})`);
      grd.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      /* Core dot */
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = ACCENT;
      ctx.fill();
    });

    requestAnimationFrame(drawFrame);
  }

  window.addEventListener('resize', () => { resize(); initNodes(); });
  resize();
  initNodes();
  drawFrame();
})();

/* =============================================================
   NAVBAR: scroll effect + mobile toggle
   ============================================================= */
(function () {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const links   = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  /* Close menu when a link is clicked */
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });
})();

/* =============================================================
   REVEAL ON SCROLL (IntersectionObserver)
   ============================================================= */
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          /* Animate skill bars once visible */
          entry.target.querySelectorAll('.skill-fill[data-width]').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  /* Also trigger skill bars for elements already visible on init */
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* Trigger skill fills when skill category becomes visible */
  const skillObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-fill[data-width]').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
          skillObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.skill-category').forEach(el => skillObs.observe(el));
})();

/* =============================================================
   SMOOTH ACTIVE NAV LINK on scroll
   ============================================================= */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    links.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--accent)'
        : '';
    });
  });
})();
