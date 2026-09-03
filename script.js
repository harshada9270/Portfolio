/* =========================================================================
   SCRIPT.JS - Interactions, Animations and Responsive Logic
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => document.body.classList.add('loaded'), 100);

    let hasCounted = false;

    /* --- 1. Navigation Scroll & Hide Effect --- */
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Solid background toggle
        if (currentScrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide on scroll down, show on scroll up (only when menu is closed)
        const navLinks = document.querySelector('.nav-links');
        const isMenuOpen = navLinks && navLinks.classList.contains('nav-active');
        
        if (!isMenuOpen) {
            if (currentScrollY > lastScrollY && currentScrollY > 120) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });

    /* --- 2. Mobile Menu Toggle --- */
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling when menu is open
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    document.body.style.overflow = '';
                }
            });
        });
    }

    /* --- 3. Intersection Observer for Fade-Ins & Counters --- */
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counters safely
                if (entry.target.querySelector('.counter') && !hasCounted) {
                    startCounters();
                    hasCounted = true;
                }
            }
        });
    };
    
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.05
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    document.querySelectorAll('.reveal, .reveal-item').forEach(el => {
        revealObserver.observe(el);
    });

    /* --- 4. Counter Animation Logic --- */
    function startCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 120;
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const inc = Math.max(1, Math.ceil(target / speed));

            const updateCount = () => {
                count += inc;
                if (count < target) {
                    counter.innerText = count;
                    setTimeout(updateCount, 25);
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
            if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    }, { passive: true });

    /* --- 6. Custom Scrollytelling Cursor (Desktop Fine Pointer Only) --- */
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
        
        document.querySelectorAll('a, button, input, textarea, .menu-toggle, .stat-card, .project-card, .skill-card').forEach(el => {
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
