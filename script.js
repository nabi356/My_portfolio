/**
 * K. NABIDUL HASAN — PORTFOLIO JAVASCRIPT CONTROLLER
 * Animations, 3D Interactive Avatar, ScrollTrigger, Modals & Utility Systems
 */

// Register GSAP Plugins safely
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. AMBIENT CURSOR GLOW (Desktop)
     -------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorGlow = document.getElementById('cursor-glow');

  if (cursorDot && cursorGlow && !prefersReducedMotion && window.innerWidth > 900) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const renderCursor = () => {
      glowX += (mouseX - glowX) * 0.16;
      glowY += (mouseY - glowY) * 0.16;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    // Enlarge glow on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .skill-tile, .project-card, .edu-card, .cert-card, .channel-card');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '60px';
        cursorGlow.style.height = '60px';
        cursorGlow.style.borderColor = 'rgba(245, 215, 127, 0.7)';
        cursorGlow.style.backgroundColor = 'rgba(245, 215, 127, 0.08)';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '36px';
        cursorGlow.style.height = '36px';
        cursorGlow.style.borderColor = 'rgba(245, 215, 127, 0.4)';
        cursorGlow.style.backgroundColor = 'rgba(245, 215, 127, 0.04)';
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. 3D AVATAR STAGE INTERACTIVE PARALLAX & DEPTH
     -------------------------------------------------------------------------- */
  const avatarStage = document.getElementById('avatar-stage');
  const avatarCard = document.getElementById('avatar-card');
  const tagSde = document.getElementById('tag-sde');
  const tagUniv = document.getElementById('tag-univ');
  const whiteHalo = document.querySelector('.avatar-white-halo');

  if (avatarStage && avatarCard && !prefersReducedMotion && window.innerWidth > 768) {
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let isHoveringHero = false;

    const heroSection = document.querySelector('.hero');

    const onHeroMouseMove = (e) => {
      isHoveringHero = true;
      const rect = avatarStage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates from -1 to 1
      const normX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Tilt angles (limited to subtle, realistic range ±11 degrees)
      targetTiltY = Math.max(-12, Math.min(12, normX * 12));
      targetTiltX = Math.max(-10, Math.min(10, -normY * 10));
    };

    const onHeroMouseLeave = () => {
      isHoveringHero = false;
      targetTiltX = 0;
      targetTiltY = 0;
    };

    if (heroSection) {
      heroSection.addEventListener('mousemove', onHeroMouseMove);
      heroSection.addEventListener('mouseleave', onHeroMouseLeave);
    }

    // Animation Loop with smooth inertia
    const updateAvatar3D = () => {
      currentTiltX += (targetTiltX - currentTiltX) * 0.1;
      currentTiltY += (targetTiltY - currentTiltY) * 0.1;

      // Apply transform only if difference is noticeable
      if (Math.abs(currentTiltX) > 0.01 || Math.abs(currentTiltY) > 0.01 || isHoveringHero) {
        avatarCard.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) translateZ(10px)`;

        // Parallax depth for floating badges
        if (tagSde) {
          tagSde.style.transform = `translateZ(45px) translateX(${(currentTiltY * 1.4).toFixed(1)}px) translateY(${(-currentTiltX * 1.4).toFixed(1)}px)`;
        }
        if (tagUniv) {
          tagUniv.style.transform = `translateZ(50px) translateX(${(currentTiltY * 1.8).toFixed(1)}px) translateY(${(-currentTiltX * 1.8).toFixed(1)}px)`;
        }

        // Opposite movement for halo glow for optical depth illusion
        if (whiteHalo) {
          whiteHalo.style.transform = `translate(${(-currentTiltY * 2).toFixed(1)}px, ${(currentTiltX * 2).toFixed(1)}px) scale(1)`;
        }
      }

      requestAnimationFrame(updateAvatar3D);
    };

    updateAvatar3D();
  }

  /* --------------------------------------------------------------------------
     3. STICKY NAVBAR SCROLLSPY & MOBILE DRAWER
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  // Sticky header background transition
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ScrollSpy to highlight active section
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update desktop links
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });

        // Update mobile links
        mobileNavLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => sectionObserver.observe(sec));

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
      mobileDrawer.setAttribute('aria-hidden', isExpanded);
    });

    // Close mobile drawer upon clicking any link
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. GSAP & SCROLLTRIGGER ENTRANCE ANIMATIONS
     -------------------------------------------------------------------------- */
  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    // Hero Entrance Timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .from('.hero-left', {
        x: -40,
        opacity: 0,
        duration: 0.9,
        delay: 0.1
      })
      .from('.avatar-stage', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.2)'
      }, '-=0.7')
      .from('.hero-right', {
        x: 40,
        opacity: 0,
        duration: 0.9
      }, '-=0.8');

    // Section reveal on scroll
    gsap.utils.toArray('.section-wrapper').forEach((sec) => {
      gsap.from(sec.querySelector('.section-header'), {
        scrollTrigger: {
          trigger: sec,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // Skills Category Headings Entrance
    gsap.fromTo(
      '.skills-category-group .category-heading',
      { x: -35, opacity: 0.2 },
      {
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 85%',
          once: true
        },
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.14,
        ease: 'power2.out',
        clearProps: 'all'
      }
    );

    // Staggered Skill Tiles 3D Pop & Entrance
    gsap.fromTo(
      '.skill-tile',
      { y: 30, opacity: 0.15, scale: 0.94 },
      {
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 82%',
          once: true
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: {
          amount: 0.45,
          from: 'start'
        },
        ease: 'back.out(1.3)',
        clearProps: 'all'
      }
    );

    // Project Cards Reveal
    gsap.fromTo(
      '.project-card',
      { y: 35, opacity: 0.2 },
      {
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 82%',
          once: true
        },
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        clearProps: 'all'
      }
    );

    // Rolling from Left to Right: Experience Timeline (Safe fromTo, never stuck)
    gsap.fromTo(
      '.rolling-section .timeline-item',
      { x: -60, opacity: 0.25 },
      {
        scrollTrigger: {
          trigger: '#experience',
          start: 'top 85%',
          once: true
        },
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.18,
        ease: 'power3.out',
        clearProps: 'all'
      }
    );

    // 3D Flipping in Education Section (Safe fromTo, never stuck sideways)
    gsap.fromTo(
      '.flipping-section .edu-card',
      { rotationY: -35, opacity: 0.25, y: 25 },
      {
        scrollTrigger: {
          trigger: '#education',
          start: 'top 85%',
          once: true
        },
        rotationY: 0,
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        clearProps: 'all'
      }
    );

    // Spotlight Honors Reveal (AI Utsav Prize & Reality Show Winner)
    gsap.fromTo(
      '.spotlight-honors-grid .honor-card',
      { y: 35, opacity: 0.25, scale: 0.97 },
      {
        scrollTrigger: {
          trigger: '#achievements',
          start: 'top 85%',
          once: true
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.18,
        ease: 'power2.out',
        clearProps: 'all'
      }
    );

    // Certifications Cards Reveal
    gsap.fromTo(
      '.cert-card',
      { y: 25, opacity: 0.25 },
      {
        scrollTrigger: {
          trigger: '.certs-grid',
          start: 'top 88%',
          once: true
        },
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.out',
        clearProps: 'all'
      }
    );
  }

  /* --------------------------------------------------------------------------
     5. STAT COUNTER ANIMATION
     -------------------------------------------------------------------------- */
  const counterElements = document.querySelectorAll('[data-counter]');

  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseFloat(el.getAttribute('data-counter'));
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const suffix = el.getAttribute('data-suffix') || '';
          
          let current = 0;
          const stepCount = 45;
          const stepIncrement = targetNum / stepCount;
          let currentStep = 0;

          const counterInterval = setInterval(() => {
            currentStep++;
            current += stepIncrement;
            if (currentStep >= stepCount) {
              current = targetNum;
              clearInterval(counterInterval);
            }
            el.textContent = current.toFixed(decimals) + suffix;
          }, 25);

          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach((el) => counterObserver.observe(el));
  }

  /* --------------------------------------------------------------------------
     6. CARD 3D TILT ON HOVER
     -------------------------------------------------------------------------- */
  if (!prefersReducedMotion && window.innerWidth > 900) {
    const tiltCards = document.querySelectorAll('.project-card, .skill-tile');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const py = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `perspective(800px) rotateX(${-py * 7}deg) rotateY(${px * 7}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. C PROJECTS SOURCE CODE PREVIEW MODAL
     -------------------------------------------------------------------------- */
  const codeModal = document.getElementById('code-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCode = document.getElementById('modal-code');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalDownloadBtn = document.getElementById('modal-download-btn');
  const modalCopyBtn = document.getElementById('modal-copy-btn');

  // Fallback inline cache to guarantee instant preview even offline or on file:/// protocol
  const cCodeFallbacks = {
    'cprojects/calc.c': `#include<stdio.h>
#include<math.h>

double division(double a, double b);
int modulation(int a, int b);
int calculator_menu();

int main() {
    int choice;
    double number1, number2, result;
    
    while (1) {
        choice = calculator_menu();
        
        if (choice == 7) {
            break;
        }
        
        printf("Enter two numbers: ");
        scanf("%lf %lf", &number1, &number2);

        switch (choice) {
            case 1: result = number1 + number2; break;
            case 2: result = number1 - number2; break;
            case 3: result = number1 * number2; break;
            case 4: result = division(number1, number2); break;
            case 5: result = pow(number1, number2); break;
            case 6: result = modulation((int)number1, (int)number2); break;
            default:
                printf("\\nInvalid choice, please enter a valid option.\\n");
                continue;
        }

        if (result != NAN) {
            printf("The result is %.2lf\\n", result);
        }
    }
    return 0;
}

double division(double a, double b) {
    if (b == 0) {
        printf("\\nThe division is not possible (division by zero).\\n");
        return NAN; 
    } else {
        return a / b;
    }
}

int modulation(int a, int b) {
    if (b == 0) {
        printf("\\nThe modulus operation is not possible (division by zero).\\n");
        return NAN;
    } else {
        return a % b;
    }
}

int calculator_menu() {
    int choice;
    printf("\\n\\nWelcome to the calculator");
    printf("\\nEnter your choice (1-7):\\n");
    printf("1. Addition\\n");
    printf("2. Subtraction\\n");
    printf("3. Multiplication\\n");
    printf("4. Division\\n");
    printf("5. Power\\n");
    printf("6. Modulus\\n");
    printf("7. Exit\\n");
    printf("Choice: ");
    scanf("%d", &choice);
    return choice;
}`,
    'cprojects/progressbar.c': `#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <time.h>

const int bar_length = 50; // Length of the progress bar
int max_tasks = 5;         // Number of tasks

struct task {
    int id;
    int progress;
    int step;
};

void progress_bar(struct task task);

int main() {
    struct task tasks[max_tasks];
    srand(time(NULL)); // Seed for random number generation

    // Initialize tasks
    for (int i = 0; i < max_tasks; i++) {
        tasks[i].id = i + 1;
        tasks[i].progress = 0;
        tasks[i].step = rand() % 5 + 1; // Random progress step between 1 and 5
    }

    int task_is_incomplete = 1;

    // Print initial placeholders for all progress bars
    for (int i = 0; i < max_tasks; i++) {
        printf("Task %d: [%-*s] 0%%\\n", tasks[i].id, bar_length, ""); 
    }

    while (task_is_incomplete) {
        task_is_incomplete = 0;

        // Move the cursor to the start of the progress bars
        printf("\\033[%dA", max_tasks); // Move cursor up by max_tasks lines

        // Update and display progress for each task
        for (int i = 0; i < max_tasks; i++) {
            tasks[i].progress += tasks[i].step;
            if (tasks[i].progress > 100) {
                tasks[i].progress = 100;
            } else if (tasks[i].progress < 100) {
                task_is_incomplete = 1;
            }
            progress_bar(tasks[i]);
        }

        // Delay for 0.5 seconds for visual pacing
        usleep(500000);
    }

    printf("\\nAll tasks are completed\\n");
    return 0;
}

void progress_bar(struct task task) {
    int bars_to_show = (task.progress * bar_length) / 100;
    printf("Task %d: [", task.id);
    for (int i = 0; i < bar_length; i++) {
        if (i < bars_to_show) printf("=");
        else printf(" ");
    }
    printf("] %d%%\\n", task.progress);
}`,
    'cprojects/suduko.c': `#include<stdio.h>

int puzzle[9][9] = {
    {5,3,0,0,7,0,0,0,0},  
    {6,0,0,1,9,5,0,0,0},  
    {0,9,8,0,0,0,0,6,0}, 
    {8,0,0,0,6,0,0,0,3},  
    {4,0,0,8,0,3,0,0,1},  
    {7,0,0,0,2,0,0,0,6},  
    {0,6,0,0,0,0,2,8,0},  
    {0,0,0,4,1,9,0,0,5},  
    {0,0,0,0,8,0,0,7,9}
};

void print_puzzle(int puzzle[9][9]);
int valid_move(int puzzle[9][9], int row, int column, int value);

int main() {
    printf("Welcome to the Sudoku Puzzle Matrix\\n");
    printf("\\nThe puzzle before solved:\\n");
    print_puzzle(puzzle);
    return 0;
}

int valid_move(int puzzle[9][9], int row, int column, int value) {
    for (int i = 0; i < 9; i++) {
        if (puzzle[row][i] == value) return 0;
    }
    for (int i = 0; i < 9; i++) {
        if (puzzle[i][column] == value) return 0;
    }
    int r = row - row % 3;
    int c = column - column % 3;
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (puzzle[r + i][c + j] == value) return 0;
        }
    }
    return 1;
}

void print_puzzle(int puzzle[9][9]) {
    printf("\\n+-------+-------+-------+");
    for (int row = 0; row < 9; row++) {
        if (row % 3 == 0 && row != 0) {
            printf("\\n+-------+-------+-------+");
        }
        printf("\\n");
        for (int column = 0; column < 9; column++) {
            if (column % 3 == 0) printf("| ");
            if (puzzle[row][column] != 0) printf("%d ", puzzle[row][column]);
            else printf("  ");
        }
        printf("|");
    }
    printf("\\n+-------+-------+-------+\\n");
}`
  };

  const openCodeModal = (filePath, title) => {
    modalTitle.textContent = title;
    modalDownloadBtn.href = filePath;
    modalCode.textContent = '// Loading code source...';
    codeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Try fetching first, with guaranteed fallback
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.text();
      })
      .then((text) => {
        modalCode.textContent = text;
      })
      .catch(() => {
        if (cCodeFallbacks[filePath]) {
          modalCode.textContent = cCodeFallbacks[filePath];
        } else {
          modalCode.textContent = '// Unable to display code file.';
        }
      });
  };

  const closeCodeModal = () => {
    codeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.view-source').forEach((btn) => {
    btn.addEventListener('click', () => {
      const file = btn.getAttribute('data-file');
      const title = btn.getAttribute('data-title') || 'Source Code';
      openCodeModal(file, title);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCodeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeCodeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && codeModal.getAttribute('aria-hidden') === 'false') {
      closeCodeModal();
    }
  });

  // Modal Copy Button
  if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', () => {
      if (modalCode.textContent) {
        navigator.clipboard.writeText(modalCode.textContent).then(() => {
          showToast('Source code copied to clipboard!');
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. TOAST NOTIFICATION SYSTEM
     -------------------------------------------------------------------------- */
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message) => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  };

  /* --------------------------------------------------------------------------
     9. 1-CLICK COPY FOR CONTACT CHANNELS
     -------------------------------------------------------------------------- */
  document.querySelectorAll('.channel-copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const copyVal = btn.getAttribute('data-copy');
      if (copyVal) {
        navigator.clipboard.writeText(copyVal).then(() => {
          showToast(`Copied ${copyVal} to clipboard!`);
        }).catch(() => {
          showToast('Copied to clipboard!');
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     10. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !subject || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill out all required fields.';
        return;
      }

      // Visual sending state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Transmitting Message...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        contactForm.reset();
        
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = `Thank you, ${name}! Your transmission has been recorded. I'll get back to you shortly.`;
        showToast('Message sent successfully!');

        setTimeout(() => {
          formFeedback.textContent = '';
        }, 6000);
      }, 1000);
    });
  }

  /* --------------------------------------------------------------------------
     11. CERTIFICATES CATEGORY FILTER TABS (Solves Visual Overwhelm)
     -------------------------------------------------------------------------- */
  const certTabBtns = document.querySelectorAll('.cert-tab-btn');
  const certCards = document.querySelectorAll('.cert-card');

  if (certTabBtns.length > 0 && certCards.length > 0) {
    certTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        certTabBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        certCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          const isMatch = filter === 'all' || category === filter;

          if (isMatch) {
            card.classList.remove('filtered-out');
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', clearProps: 'all' });
            }
          } else {
            card.classList.add('filtered-out');
          }
        });

        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     12. CONTENT VISIBILITY FAILSAFE
     -------------------------------------------------------------------------- */
  // Guarantee that Experience, Leadership, Education, and Skills are NEVER left unloaded
  const ensureContentVisibility = () => {
    document.querySelectorAll('.timeline-item, .edu-card, .honor-card, .cert-card, .skill-tile, .category-heading').forEach((el) => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  };

  setTimeout(ensureContentVisibility, 400);
  window.addEventListener('load', () => {
    setTimeout(ensureContentVisibility, 200);
  });

});

