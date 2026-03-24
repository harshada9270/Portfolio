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
        
        // Hide/Show logic for cinematic feel
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

    /* --- 3. Cinematic Scrollytelling Engine --- */
    const heroContainer = document.getElementById('hero-container');
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.image-wrapper img');
    const heroBgGradient = document.getElementById('hero-bg-gradient');
    let isTicking = false;
    let hasCounted = false;

    // Intersection Observer for Details (Blur-to-Sharp & Stagger)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
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
    document.querySelectorAll('.reveal, .reveal-item, .blur-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Main Scroll Timeline Loop
    window.addEventListener('scroll', () => {
        if (!isTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const wHeight = window.innerHeight;

                document.body.style.setProperty('--scroll', `${scrollY}px`);

                // A. Hero Pinned Progression (300vh height = 3 multipliers)
                if (heroContainer) {
                    const heroScroll = window.scrollY;
                    if (heroScroll <= wHeight * 3) {
                        const heroProgress = heroScroll / (wHeight * 2); // Normalize 0 to 1 over first 200vh
                        const clampedProgress = Math.min(Math.max(heroProgress, 0), 1);
                        
                        if (heroText) {
                            heroText.style.opacity = 1 - clampedProgress;
                            heroText.style.transform = `translateY(${clampedProgress * -100}px)`; // move upward
                            heroText.style.filter = `blur(${clampedProgress * 20}px)`;
                        }
                        if (heroImage) {
                            heroImage.style.transform = `translateY(${clampedProgress * -150}px) scale(${1 - (clampedProgress * 0.2)})`; // Scale down to 0.8
                        }
                        if (heroBgGradient) {
                            heroBgGradient.style.transform = `translateY(${clampedProgress * 200}px) scale(${1 + clampedProgress * 0.5})`;
                            heroBgGradient.style.opacity = 1 - (clampedProgress * 0.8);
                        }
                    }
                }

                // B. Skills Pinned Progression
                const skillsContainer = document.getElementById('skills-container');
                if (skillsContainer) {
                    const rect = skillsContainer.getBoundingClientRect();
                    const scrollable = skillsContainer.offsetHeight - wHeight;
                    const scrolled = -rect.top;
                    
                    if (scrolled >= -wHeight && scrolled <= scrollable + wHeight) {
                        const progress = Math.min(Math.max(scrolled / scrollable, 0), 1);
                        
                        const step1 = document.getElementById('skill-step-1');
                        const step2 = document.getElementById('skill-step-2');
                        const step3 = document.getElementById('skill-step-3');
                        
                        if (step1 && step2 && step3) {
                            if (progress < 0.33) {
                                step1.style.opacity = 1; step1.style.transform = 'translateY(0)';
                                step2.style.opacity = 0; step2.style.transform = 'translateY(50px)';
                                step3.style.opacity = 0; step3.style.transform = 'translateY(50px)';
                            } else if (progress >= 0.33 && progress < 0.66) {
                                step1.style.opacity = 0; step1.style.transform = 'translateY(-50px)';
                                step2.style.opacity = 1; step2.style.transform = 'translateY(0)';
                                step3.style.opacity = 0; step3.style.transform = 'translateY(50px)';
                            } else {
                                step1.style.opacity = 0; step1.style.transform = 'translateY(-50px)';
                                step2.style.opacity = 0; step2.style.transform = 'translateY(-50px)';
                                step3.style.opacity = 1; step3.style.transform = 'translateY(0)';
                            }
                        }
                    }
                }

                // C. Sat-LM 7-Step Cinematic Pinned Progression
                const satContainer = document.getElementById('sat-container');
                if (satContainer) {
                    const rect = satContainer.getBoundingClientRect();
                    const scrollable = satContainer.offsetHeight - wHeight;
                    const scrolled = -rect.top;
                    
                    if (scrolled >= -wHeight && scrolled <= scrollable + wHeight) {
                        const p = Math.min(Math.max(scrolled / scrollable, 0), 1);
                        
                        const s1 = document.getElementById('sat-step-1');
                        const img = document.getElementById('sat-image');
                        const s3 = document.getElementById('sat-step-3');
                        const s4 = document.getElementById('sat-step-4');
                        const s5 = document.getElementById('sat-step-5');
                        const s6 = document.getElementById('sat-step-6');
                        const s7 = document.getElementById('sat-step-7');

                        // Step 1: Title (Starts early)
                        if (s1) {
                            if (p > 0.02) { s1.style.opacity = 1; s1.style.transform = 'translateY(0)'; }
                            else { s1.style.opacity = 0; s1.style.transform = 'translateY(30px)'; }
                        }

                        // Step 2: Image
                        if (img) {
                            if (p > 0.1) { img.style.opacity = 1; img.style.transform = 'scale(1) translateY(0)'; img.style.filter = 'blur(0)'; }
                            else { img.style.opacity = 0; img.style.transform = 'scale(0.9) translateY(40px)'; img.style.filter = 'blur(5px)'; }
                        }

                        // Steps 3-7: Replacing Text sequence
                        const updateStep = (el, active) => {
                            if (!el) return;
                            if (active) {
                                el.style.opacity = 1; el.style.transform = 'translateY(0)'; el.style.pointerEvents = 'auto';
                            } else {
                                el.style.opacity = 0; el.style.transform = 'translateY(30px)'; el.style.pointerEvents = 'none';
                            }
                        };

                        if (p > 0.2 && p < 0.35) {
                            updateStep(s3, true); updateStep(s4, false); updateStep(s5, false); updateStep(s6, false); updateStep(s7, false);
                        } else if (p >= 0.35 && p < 0.5) {
                            updateStep(s3, false); updateStep(s4, true); updateStep(s5, false); updateStep(s6, false); updateStep(s7, false);
                        } else if (p >= 0.5 && p < 0.65) {
                            updateStep(s3, false); updateStep(s4, false); updateStep(s5, true); updateStep(s6, false); updateStep(s7, false);
                        } else if (p >= 0.65 && p < 0.8) {
                            updateStep(s3, false); updateStep(s4, false); updateStep(s5, false); updateStep(s6, true); updateStep(s7, false);
                        } else if (p >= 0.8) {
                            updateStep(s3, false); updateStep(s4, false); updateStep(s5, false); updateStep(s6, false); updateStep(s7, true);
                        } else {
                            updateStep(s3, false); updateStep(s4, false); updateStep(s5, false); updateStep(s6, false); updateStep(s7, false);
                        }
                    }
                }

                isTicking = false;
            });
            isTicking = true;
        }
    });

    // --- Image Hover Tilt Logic --- 
    const tiltImgWrap = document.querySelector('.hero-img-wrap');
    if (tiltImgWrap && window.matchMedia("(pointer: fine)").matches) {
        tiltImgWrap.addEventListener('mousemove', (e) => {
            const rect = tiltImgWrap.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPos = (x / rect.width - 0.5) * 15; // -7.5 to 7.5 deg
            const yPos = (y / rect.height - 0.5) * -15;
            // Retain the scrollytelling transform on the child image so they don't fight
            tiltImgWrap.querySelector('.tilt-img').style.transform = `rotateY(${xPos}deg) rotateX(${yPos}deg) scale(1.05)`;
        });
        tiltImgWrap.addEventListener('mouseleave', () => {
            tiltImgWrap.querySelector('.tilt-img').style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`;
        });
        // smooth reset transition
        tiltImgWrap.querySelector('.tilt-img').style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    }

    /* --- 4. Counter Animation Observer Logic --- */

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
