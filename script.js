/* =========================================================================
   SCRIPT.JS - Interactions and Storytelling Logic
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => document.body.classList.add('loaded'), 100);

    /* --- 1. Navigation Scroll & Hide Effect --- */
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Solid background toggle
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
        
        lastScrollY = currentScrollY;
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

    /* --- 3. Intersection Observer for Fade-Ins --- */
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
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    document.querySelectorAll('.reveal, .reveal-item').forEach(el => {
        revealObserver.observe(el);
    });

    /* --- 4. Counter Animation Observer Logic --- */

    function startCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200;
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
