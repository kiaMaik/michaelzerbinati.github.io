(function() {
    "use strict";

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- NAV ---------- */
    var nav = document.getElementById('nav');
    var onScroll = function() {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var burger = document.getElementById('burger');
    var links = document.querySelector('.nav-links');
    if (burger && links) {
        burger.addEventListener('click', function() {
            var open = links.classList.contains('mobile-open');
            links.classList.toggle('mobile-open', !open);
            if (!open) {
                links.style.display = 'flex';
                links.style.cssText = 'display:flex; position:fixed; top:64px; left:0; right:0; flex-direction:column; gap:0; background:var(--bg-panel); border-bottom:1px solid var(--line); padding:8px var(--gutter) 20px;';
                Array.prototype.forEach.call(links.querySelectorAll('a'), function(a) {
                    a.style.padding = '14px 0';
                    a.style.borderBottom = '1px solid var(--line-soft)';
                });
            } else {
                links.style = '';
            }
        });
        Array.prototype.forEach.call(links.querySelectorAll('a'), function(a) {
            a.addEventListener('click', function() {
                if (window.innerWidth <= 720) {
                    links.classList.remove('mobile-open');
                    links.style = '';
                }
            });
        });
    }

    /* ---------- HERO TYPOGRAPHY ---------- */
    var heroLines = document.querySelectorAll('.hero h1 .line span');
    if (reduceMotion) {
        heroLines.forEach(function(el) { el.style.transform = 'translateY(0)'; });
    } else {
        heroLines.forEach(function(el, i) {
            el.style.transition = 'transform 0.85s cubic-bezier(0.16,1,0.3,1)';
            el.style.transitionDelay = (0.15 + i * 0.11) + 's';
            requestAnimationFrame(function() {
                requestAnimationFrame(function() { el.style.transform = 'translateY(0)'; });
            });
        });
    }

    /* ---------- TERMINAL ---------- */
    var termBody = document.getElementById('termBody');
    var termScript = [
        { text: '$ whoami', typed: true, cls: 'prompt' },
        { text: 'michael_zerbinati' },
        { text: 'role: junior web · IT · cybersecurity' },
        { text: '$ cat stack.txt', typed: true, cls: 'prompt' },
        { text: '> HTML / CSS / JavaScript' },
        { text: '> PHP / MySQL / SQL' },
        { text: '> Windows / Linux / Cisco' },
        { text: '> Kali / Nmap / Wireshark / Metasploit' },
        { text: '$ status --learning', typed: true, cls: 'prompt' },
        { text: '[OK] Cisco Networking Academy .... 7 corsi' , hi: true },
        { text: '[OK] Security+ .................... in corso' , hi: true },
        { text: '[OK] PenTest+ ..................... in corso' , hi: true },
        { text: '$ echo $AVAILABILITY', typed: true, cls: 'prompt' },
        { text: 'disponibile · preavviso ~1 mese_' }
    ];

    function typeTerminal() {
        if (!termBody) return;
        termBody.innerHTML = '';
        var i = 0;
        function nextLine() {
            if (i >= termScript.length) return;
            var item = termScript[i];
            var div = document.createElement('div');
            div.className = 't-line' + (item.hi ? ' t-hi' : (!item.typed ? ' t-out' : ''));
            termBody.appendChild(div);
            if (reduceMotion || !item.typed) {
                div.textContent = item.text;
                i++;
                setTimeout(nextLine, reduceMotion ? 0 : 85);
                return;
            }
            var chars = item.text.split('');
            var ci = 0;
            var span = document.createElement('span');
            span.className = item.cls || '';
            div.appendChild(span);
            var caret = document.createElement('span');
            caret.className = 'cursor';
            div.appendChild(caret);
            var typer = setInterval(function() {
                span.textContent += chars[ci];
                ci++;
                if (ci >= chars.length) {
                    clearInterval(typer);
                    caret.remove();
                    i++;
                    setTimeout(nextLine, 230);
                }
            }, 28);
        }
        nextLine();
    }

    /* ---------- SCROLL REVEAL ---------- */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach(function(el) { io.observe(el); });
    } else {
        revealEls.forEach(function(el) { el.classList.add('is-in'); });
    }

    /* ---------- CERT BARS ---------- */
    var bars = document.querySelectorAll('.cert-bar-fill');
    if ('IntersectionObserver' in window) {
        var barIo = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    el.style.width = el.getAttribute('data-fill') + '%';
                    barIo.unobserve(el);
                }
            });
        }, { threshold: 0.4 });
        bars.forEach(function(b) { barIo.observe(b); });
    } else {
        bars.forEach(function(b) { b.style.width = b.getAttribute('data-fill') + '%'; });
    }

    setTimeout(typeTerminal, reduceMotion ? 0 : 650);
})();
