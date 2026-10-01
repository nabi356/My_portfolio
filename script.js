// Register plugin and add subtle cursor follow + scroll-trigger animations
gsap.registerPlugin(ScrollTrigger);

function random(min, max){ return min + Math.random() * (max - min); }

document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.cursor');
  if(cursor){
    window.addEventListener('mousemove', e => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.12, ease: 'power1.out' });
    });
  }

  // Section reveal
  gsap.utils.toArray('.section').forEach(sec => {
    gsap.from(sec, {
      scrollTrigger: { trigger: sec, start: 'top 85%' },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Skill icons entrance (staggered)
  gsap.from('.lang-icon', {
    scrollTrigger: { trigger: '.skills', start: 'top 80%' },
    opacity: 0,
    y: 20,
    scale: 0.6,
    duration: 0.8,
    stagger: 0.12,
    ease: 'back.out(1.2)'
  });

  // 3D background blobs subtle motion loop
  gsap.utils.toArray('.bg-3d .blob').forEach(b => {
    const dur = random(8, 18);
    gsap.to(b, {
      x: random(-60,60),
      y: random(-40,40),
      rotation: random(-20,20),
      duration: dur,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  });

  // Education cards - 3D flip reveal + hover tilt
  gsap.from('.edu-card', {
    scrollTrigger: { trigger: '.edu-grid', start: 'top 85%' },
    opacity: 0,
    y: 40,
    rotateY: -12,
    duration: 0.9,
    stagger: 0.12,
    ease: 'back.out(1.2)'
  });

  // Add interactive tilt on hover for edu cards
  document.querySelectorAll('.edu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotationY: px * 12, rotationX: -py * 8, transformPerspective: 800, transformOrigin: 'center', duration: 0.25 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.45, ease: 'power2.out' });
    });
  });

  // GLOBAL HOVER OVERLAY: stable visual highlight that follows interactive elements
  const interactiveSelector = 'a, button, .btn, .card, .info-card, .edu-card, .lang-icon, .skill, input, textarea, .contact .info-card';

  // build overlay element
  const hoverOverlay = document.createElement('div');
  hoverOverlay.className = 'hover-overlay';
  document.body.appendChild(hoverOverlay);

  let rafId = null;
  let currentTarget = null;

  const findInteractive = (el) => {
    while(el && el !== document.body){
      try{ if(el.matches && el.matches(interactiveSelector)) return el; }catch(e){/* ignore */}
      el = el.parentElement;
    }
    return null;
  };

  const updateOverlay = (el) => {
    if(!el){ hoverOverlay.classList.remove('visible'); currentTarget = null; return; }
    const r = el.getBoundingClientRect();
    const pad = Math.max(8, Math.min(18, Math.round(Math.min(r.width, r.height) * 0.06)));
    const borderRadius = Math.min(24, parseFloat(getComputedStyle(el).borderRadius) || 12);
    hoverOverlay.style.width = (r.width + pad * 2) + 'px';
    hoverOverlay.style.height = (r.height + pad * 2) + 'px';
    hoverOverlay.style.left = (r.left - pad) + 'px';
    hoverOverlay.style.top = (r.top - pad) + 'px';
    hoverOverlay.style.borderRadius = borderRadius + 'px';
    hoverOverlay.classList.add('visible');
    currentTarget = el;
  };

  document.addEventListener('mousemove', (e) => {
    if(rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if(!el || el.closest && el.closest('.bg-3d')){ updateOverlay(null); return; }
      const t = findInteractive(el);
      if(t && t !== currentTarget) updateOverlay(t);
      else if(!t) updateOverlay(null);
    });
  });

  document.addEventListener('mouseleave', () => { updateOverlay(null); });

  // keyboard focus support
  document.addEventListener('focusin', (e) => {
    const t = findInteractive(e.target);
    if(t) updateOverlay(t);
  });
  document.addEventListener('focusout', (e) => { updateOverlay(null); });

  // Code preview modal logic
  const modal = document.getElementById('code-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCode = document.getElementById('modal-code');
  const modalClose = document.querySelector('.modal-close');
  const modalDownload = document.querySelector('.download-link');

  function openCodeModal(title, url){
    modalTitle.textContent = title;
    modalCode.textContent = 'Loading...';
    modal.setAttribute('aria-hidden', 'false');
    fetch(url).then(r => {
      if(!r.ok) throw new Error('Failed to fetch');
      return r.text();
    }).then(text => {
      modalCode.textContent = text;
      modalDownload.href = url;
    }).catch(err => {
      modalCode.textContent = 'Unable to load file.';
      modalDownload.removeAttribute('href');
    });
  }

  function closeCodeModal(){
    modal.setAttribute('aria-hidden', 'true');
    modalCode.textContent = '';
    modalDownload.removeAttribute('href');
  }

  document.addEventListener('click', (e) => {
    if(e.target.matches('.view-source')){
      const url = e.target.getAttribute('data-file');
      const title = e.target.parentElement.previousSibling.textContent || 'Source';
      openCodeModal(title, url);
    }
  });

  modalClose.addEventListener('click', closeCodeModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeCodeModal(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeCodeModal(); });

  // Make download links in modal act as download when available
  modalDownload.addEventListener('click', (e) => {
    if(!modalDownload.href) e.preventDefault();
  });

});
