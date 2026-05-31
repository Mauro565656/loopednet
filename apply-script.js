// ========== COOLDOWN SYSTEM ==========
const COOLDOWN_MS = 60 * 60 * 1000;
const COOLDOWN_KEY = 'looped_app_last_submit';

function checkCooldown() {
    const lastSubmit = localStorage.getItem(COOLDOWN_KEY);
    if (!lastSubmit) return false;
    const elapsed = Date.now() - parseInt(lastSubmit);
    if (elapsed < COOLDOWN_MS) return COOLDOWN_MS - elapsed;
    return false;
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

function showCooldownBanner() {
    const remaining = checkCooldown();
    if (!remaining) return;
    const banner = document.getElementById('cooldownBanner');
    const timeEl = document.getElementById('cooldownTime');
    const formEl = document.getElementById('applicationForm');
    const submitBtn = document.getElementById('submitBtn');
    banner.style.display = 'flex';
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Cooldown Active';
    formEl.style.opacity = '0.5';
    formEl.style.pointerEvents = 'none';
    function updateTimer() {
        const r = checkCooldown();
        if (!r) {
            banner.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Submit Application';
            formEl.style.opacity = '1';
            formEl.style.pointerEvents = 'auto';
            return;
        }
        timeEl.textContent = formatTime(r);
        setTimeout(updateTimer, 1000);
    }
    updateTimer();
}

function setCooldown() {
    localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
}

showCooldownBanner();

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });

const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
mobileToggle.addEventListener('click', () => { mobileToggle.classList.toggle('active'); navLinks.classList.toggle('active'); });
document.addEventListener('click', (e) => { if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) { mobileToggle.classList.remove('active'); navLinks.classList.remove('active'); } });
navLinks.querySelectorAll('a').forEach(link => { link.addEventListener('click', () => { mobileToggle.classList.remove('active'); navLinks.classList.remove('active'); }); });

function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 10 + 8) + 's';
        p.style.animationDelay = (Math.random() * 12) + 's';
        p.style.width = (Math.random() * 3 + 1) + 'px';
        p.style.height = p.style.width;
        container.appendChild(p);
    }
}
createParticles();

function dismissNotice() {
    const notice = document.getElementById('noticeCard');
    notice.classList.add('dismissed');
    setTimeout(() => { notice.style.display = 'none'; }, 400);
}

const textareas = [
    { id: 'experience', countId: 'experienceCount', max: 2000 },
    { id: 'scenario1', countId: 'scenario1Count', max: 2000 },
    { id: 'scenario2', countId: 'scenario2Count', max: 2000 },
    { id: 'whyjoin', countId: 'whyjoinCount', max: 2000 },
    { id: 'strengths', countId: 'strengthsCount', max: 2000 },
    { id: 'weaknesses', countId: 'weaknessesCount', max: 2000 },
    { id: 'whyyou', countId: 'whyyouCount', max: 2000 }
];

textareas.forEach(({ id, countId, max }) => {
    const textarea = document.getElementById(id);
    const counter = document.getElementById(countId);
    if (textarea && counter) {
        textarea.setAttribute('maxlength', max);
        textarea.addEventListener('input', () => {
            const len = textarea.value.length;
            counter.textContent = `${len} / ${max}`;
            if (len > max * 0.95) counter.style.color = 'var(--danger)';
            else if (len > max * 0.9) counter.style.color = 'var(--warning)';
            else counter.style.color = 'var(--text-muted)';
        });
    }
});

const formFields = document.querySelectorAll('input[required], textarea[required]');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');

function updateProgress() {
    let filledCount = 0;
    let totalCount = 0;
    const checkedRadioNames = new Set();
    formFields.forEach(field => {
        if (field.type === 'radio') {
            if (!checkedRadioNames.has(field.name)) {
                checkedRadioNames.add(field.name);
                totalCount++;
                const group = document.querySelectorAll(`input[name="${field.name}"]`);
                if (Array.from(group).some(r => r.checked)) filledCount++;
            }
        } else if (field.type === 'checkbox') {
            totalCount++;
            if (field.checked) filledCount++;
        } else {
            totalCount++;
            if (field.value.trim() !== '') filledCount++;
        }
    });
    const percent = Math.round((filledCount / totalCount) * 100);
    progressFill.style.width = percent + '%';
    progressPercent.textContent = percent + '%';
    updateStepIndicators();
}

function updateStepIndicators() {
    document.querySelectorAll('.form-section').forEach(section => {
        const num = section.dataset.section;
        const fields = section.querySelectorAll('input[required], textarea[required]');
        const step = document.querySelector(`.progress-step[data-section="${num}"]`);
        if (!step || fields.length === 0) return;
        let allFilled = true, anyFilled = false;
        const names = new Set();
        fields.forEach(field => {
            if (field.type === 'radio') {
                if (!names.has(field.name)) {
                    names.add(field.name);
                    const group = section.querySelectorAll(`input[name="${field.name}"]`);
                    if (Array.from(group).some(r => r.checked)) anyFilled = true;
                    else allFilled = false;
                }
            } else if (field.type === 'checkbox') {
                if (field.checked) anyFilled = true; else allFilled = false;
            } else {
                if (field.value.trim() !== '') anyFilled = true; else allFilled = false;
            }
        });
        step.classList.remove('active', 'completed');
        if (allFilled) step.classList.add('completed');
        else if (anyFilled) step.classList.add('active');
    });
}

document.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', updateProgress);
    field.addEventListener('change', updateProgress);
});

document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => {
    input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (!group) return;
        group.classList.remove('error');
        const msg = group.querySelector('.error-message');
        if (msg) msg.remove();
    });
});

const form = document.getElementById('applicationForm');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cooldownRemaining = checkCooldown();
    if (cooldownRemaining) {
        alert(`Please wait ${formatTime(cooldownRemaining)} before submitting another application.`);
        return;
    }

    let firstError = null;
    let hasErrors = false;
    const checkedNames = new Set();

    formFields.forEach(field => {
        const group = field.closest('.form-group') || field.closest('.agreement-box');
        if (!group) return;
        if (field.type === 'radio') {
            if (checkedNames.has(field.name)) return;
            checkedNames.add(field.name);
            const radioGroup = document.querySelectorAll(`input[name="${field.name}"]`);
            if (!Array.from(radioGroup).some(r => r.checked)) {
                hasErrors = true;
                if (!firstError) firstError = group;
                group.classList.add('error');
            }
        } else if (field.type === 'checkbox') {
            if (!field.checked) {
                hasErrors = true;
                if (!firstError) firstError = group;
            }
        } else {
            group.classList.remove('error');
            const existing = group.querySelector('.error-message');
            if (existing) existing.remove();
            if (field.value.trim() === '') {
                hasErrors = true;
                group.classList.add('error');
                if (!firstError) firstError = group;
                const msg = document.createElement('span');
                msg.className = 'error-message';
                msg.textContent = 'This field is required';
                group.appendChild(msg);
            }
        }
    });

    // Age check — minimum 14
    const ageField = document.getElementById('age');
    const ageGroup = ageField.closest('.form-group');
    if (ageField.value && parseInt(ageField.value) < 14) {
        hasErrors = true;
        ageGroup.classList.add('error');
        if (!firstError) firstError = ageGroup;
        const existing = ageGroup.querySelector('.error-message');
        if (existing) existing.remove();
        const msg = document.createElement('span');
        msg.className = 'error-message';
        msg.textContent = 'You must be at least 14 years old to apply';
        ageGroup.appendChild(msg);
    }

    if (hasErrors) {
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.classList.add('shake');
            setTimeout(() => firstError.classList.remove('shake'), 500);
        }
        return;
    }

    submitBtn.classList.add('loading');
    submitBtn.querySelector('span').textContent = 'Submitting...';

    const ign = document.getElementById('ign').value;
    const discord = document.getElementById('discord').value;

    // Build JSON payload — _subject sets the title in FormBold
    const data = {
        _subject: `${discord} (${ign})`,
        ign: ign,
        discord: discord,
        age: document.getElementById('age').value,
        platform: document.querySelector('input[name="platform"]:checked')?.value || '',
        experience: document.getElementById('experience').value,
        toxic_player_scenario: document.getElementById('scenario1').value,
        cheating_scenario: document.getElementById('scenario2').value,
        hours: document.getElementById('hours').value,
        timezone: document.getElementById('timezone').value,
        why_join: document.getElementById('whyjoin').value,
        strengths: document.getElementById('strengths').value,
        weaknesses: document.getElementById('weaknesses').value,
        why_you: document.getElementById('whyyou').value,
        agreement: document.getElementById('agreement').checked ? 'Yes, I confirm' : 'No'
    };

    console.log('Submitting data:', data);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response body:', responseText);

        if (response.ok) {
            setCooldown();
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            form.reset();
            updateProgress();
        } else {
            alert(`Submission failed (Status ${response.status}).\n\nServer response: ${responseText}\n\nPlease contact us on Discord.`);
        }
    } catch (err) {
        console.error('Submission error:', err);
        alert('Could not submit application. Check your internet and try again.');
    }

    submitBtn.classList.remove('loading');
    submitBtn.querySelector('span').textContent = 'Submit Application';
});

updateProgress();