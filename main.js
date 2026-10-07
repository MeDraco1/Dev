const pages = Array.from(document.querySelectorAll('.page'));
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const profileMark = document.querySelector('.home-profile-stage img');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const profileImageCandidates = [
    'image.png',
    'profile.png',
    'profile.jpg',
    'profile.jpeg',
    'profile.webp',
    'avatar.png',
    'avatar.jpg',
    'avatar.jpeg',
    'avatar.webp',
    'pfp.png',
    'pfp.jpg',
    'pfp.jpeg',
    'pfp.webp',
    'profile.svg',
    'avatar.svg',
    'pfp.svg'
];

function activatePage(pageId, updateHistory = true) {
    const activePage = document.getElementById(pageId) || pages[0];
    if (!activePage) return;

    pages.forEach((page) => {
        const isActive = page === activePage;
        page.classList.toggle('active', isActive);
        page.setAttribute('aria-hidden', String(!isActive));

        const video = page.querySelector('.page-video');
        if (!video) return;

        if (isActive) {
            video.currentTime = 0;
            if (prefersReducedMotion.matches) {
                video.pause();
            } else {
                video.play().catch(() => { });
            }
        } else {
            video.pause();
            video.currentTime = 0;
        }
    });

    navLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.page === activePage.id));

    if (updateHistory) {
        history.replaceState(null, '', `#${activePage.id}`);
    }

    activePage.scrollTop = 0;
}

function initializePageNavigation() {
    document.querySelectorAll('[data-page]').forEach((trigger) => {
        trigger.addEventListener('click', () => activatePage(trigger.dataset.page));
    });

    const requestedPage = window.location.hash.slice(1);
    activatePage(pages.some((page) => page.id === requestedPage) ? requestedPage : 'page-1', false);
}

function initializeHoverLift() {
    if (prefersReducedMotion.matches) return;

    const hoverTargets = document.querySelectorAll('.stats-panel, .contact-panel, .tech-card, .project-grid, .skills-intro-card, .stack-showcase, .contact-item');

    hoverTargets.forEach((target) => {
        const isContactItem = target.classList.contains('contact-item');
        target.addEventListener('pointerenter', () => {
            target.style.transform = isContactItem
                ? 'translate3d(5px, 0, 0) scale(1.018)'
                : 'translate3d(0, -7px, 0) scale(1.025)';
            target.style.zIndex = '4';
        });

        target.addEventListener('pointerleave', () => {
            target.style.removeProperty('transform');
            target.style.removeProperty('z-index');
        });
    });
}

function loadProfileImage(index = 0) {
    if (!profileMark || index >= profileImageCandidates.length) return;

    const candidate = profileImageCandidates[index];
    const testImage = new Image();

    testImage.onload = () => {
        profileMark.src = candidate;
    };

    testImage.onerror = () => loadProfileImage(index + 1);
    testImage.src = candidate;
}

loadProfileImage();
initializePageNavigation();
initializeHoverLift();

