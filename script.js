/* =========================================================================
   SCRIPT.JS - Interactions and Storytelling Logic
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => document.body.classList.add('loaded'), 100);

    /* --- 1. Navigation Scroll Effect --- */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- 2. Mobile Menu Toggle --- */
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('nav-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    /* --- 3. True Scrollytelling Engine --- */
    const heroContainer = document.getElementById('hero-container');
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.image-wrapper img');
    let isTicking = false;
    let hasCounted = false;

    // Intersection Observer for Reveal Items (Smooth Apple-style stagger fade-up)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Remove visibility to replay animation when scrolling back up (continuous feel)
                const currentScroll = window.scrollY;
                if (currentScroll > entry.boundingClientRect.top) {
                    entry.target.classList.remove('visible');
                }
            }
        });
    };
    
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    document.querySelectorAll('.reveal, .reveal-item').forEach(el => {
        revealObserver.observe(el);
    });

    // Request Animation Frame loop for specific continuous parallax (Hero)
    window.addEventListener('scroll', () => {
        if (!isTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const wHeight = window.innerHeight;

                // Sync global scroll variable for CSS parallax
                document.body.style.setProperty('--scroll', `${scrollY}px`);

                // A. Hero Pinned Progression (Fade out and Scale down)
                if (heroContainer) {
                    const heroScroll = window.scrollY; // Distance scrolled from top (hero is top of page)
                    if (heroScroll <= wHeight * 2) { // Container height is 200vh
                        const heroProgress = heroScroll / wHeight; // 0 to 2
                        
                        if (heroText) {
                            heroText.style.opacity = Math.max(0, 1 - (heroProgress * 1.5));
                            heroText.style.transform = `translateY(${heroProgress * 120}px)`;
                        }
                        if (heroImage) {
                            heroImage.style.transform = `translateY(${heroProgress * 50}px) scale(${1 - (heroProgress * 0.1)})`;
                        }
                    }
                }

                isTicking = false;
            });
            isTicking = true;
        }
    });

    /* --- 4. Counter Animation Observer Logic --- */
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const counterObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !hasCounted) {
            startCounters();
            hasCounted = true;
        }
    }, { threshold: 0.2 });

    const achievementsSection = document.getElementById('achievements');
    if (achievementsSection) counterObserver.observe(achievementsSection);

    function startCounters() {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    /* --- 5. Active Link Highlight on Scroll --- */
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });
    
    /* --- 6. Form Submission Prevention (Demo) --- */
    const form = document.getElementById('form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = '#00c853';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                form.reset();
            }, 3000);
        });
    }

    /* --- 6. Custom Scrollytelling Cursor --- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        
        const animateCursor = () => {
            let distX = mouseX - outlineX;
            let distY = mouseY - outlineY;
            
            outlineX += distX * 0.15;
            outlineY += distY * 0.15;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(animateCursor);
        };
        animateCursor();
        
        document.querySelectorAll('a, button, input, textarea, .menu-toggle, .stat-card, .project-card, .dive-card, .case-study-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover-state');
                cursorDot.classList.add('hover-state');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover-state');
                cursorDot.classList.remove('hover-state');
            });
        });
    }

});
