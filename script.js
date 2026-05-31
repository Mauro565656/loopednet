const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });

const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
mobileToggle.addEventListener('click', () => { mobileToggle.classList.toggle('active'); navLinks.classList.toggle('active'); });
navLinks.querySelectorAll('a').forEach(link => { link.addEventListener('click', () => { mobileToggle.classList.remove('active'); navLinks.classList.remove('active'); }); });
document.addEventListener('click', (e) => { if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) { mobileToggle.classList.remove('active'); navLinks.classList.remove('active'); } });

function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 8 + 6) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        p.style.width = (Math.random() * 3 + 1) + 'px';
        p.style.height = p.style.width;
        container.appendChild(p);
    }
}
createParticles();

async function fetchServerStatus() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    const playerCountEl = document.getElementById('playerCount').querySelector('span');
    const motdContent = document.getElementById('motdContent');
    try {
        const response = await fetch('https://api.mcsrvstat.us/3/34.35.118.129:25570');
        const data = await response.json();
        if (data.online) {
            statusDot.classList.add('online'); statusDot.classList.remove('offline');
            statusText.textContent = 'Server Online';
            playerCountEl.textContent = `${data.players?.online || 0}/${data.players?.max || 0} players online`;
            if (data.motd?.clean?.length > 0) { motdContent.innerHTML = data.motd.clean.map(l => `<span class="motd-line">${l.replace(/</g,'&lt;')}</span>`).join('<br>'); }
            else { motdContent.innerHTML = '<span class="motd-line">Welcome to Looped Network!</span>'; }
        } else {
            statusDot.classList.add('offline'); statusDot.classList.remove('online');
            statusText.textContent = 'Server Offline'; playerCountEl.textContent = '0 players online';
            motdContent.innerHTML = '<span class="motd-line">Server is currently offline</span>';
        }
    } catch (e) { statusText.textContent = 'Status unavailable'; playerCountEl.textContent = '-- players'; motdContent.innerHTML = '<span class="motd-line">Could not fetch MOTD</span>'; }
}
fetchServerStatus(); setInterval(fetchServerStatus, 60000);

function copyIP(text, el) {
    navigator.clipboard.writeText(text).then(() => {
        const hint = el.querySelector('.copy-hint');
        if (hint) { const orig = hint.textContent; hint.textContent = 'Copied!'; hint.style.color = '#4ade80'; setTimeout(() => { hint.textContent = orig; hint.style.color = ''; }, 2000); }
        el.style.borderColor = '#4ade80'; setTimeout(() => { el.style.borderColor = ''; }, 2000);
    }).catch(() => {});
}

const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.gamemode-card, .connect-card, .staff-card, .social-card, .hosting-card, .discord-layout, .section-header').forEach(el => { el.classList.add('fade-in'); observer.observe(el); });

document.querySelectorAll('a[href^="#"]').forEach(anchor => { anchor.addEventListener('click', function(e) { e.preventDefault(); const t = document.querySelector(this.getAttribute('href')); if (t) { window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); } }); });

const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => { const s = window.scrollY + 120; sections.forEach(sec => { const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`); if (link) { link.style.color = (s >= sec.offsetTop && s < sec.offsetTop + sec.offsetHeight) ? 'var(--primary)' : ''; } }); });
