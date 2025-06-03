// js/navbar.js

export function initNavbar() {
    const mainNavbar = document.getElementById('mainNavbar');
    if (mainNavbar) {
        const navLinks = mainNavbar.querySelectorAll('nav a.nav-link');
        const siteNameText = mainNavbar.querySelector('.site-name-text');
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a.nav-link') : [];

        // Efeito da Navbar ao rolar
        window.addEventListener('scroll', () => {
            const isScrolled = window.scrollY > 50;
            mainNavbar.classList.toggle('scrolled-nav', isScrolled);
            mainNavbar.classList.toggle('bg-transparent', !isScrolled);

            navLinks.forEach(link => {
                link.classList.toggle('text-brand-text', isScrolled);
                link.classList.toggle('text-gray-100', !isScrolled);
            });
            if (siteNameText) {
                siteNameText.classList.toggle('text-brand-primary', isScrolled);
                siteNameText.classList.toggle('text-white', !isScrolled);
            }
            if (mobileMenuButton) {
                mobileMenuButton.classList.toggle('text-brand-text', isScrolled);
                mobileMenuButton.classList.toggle('text-white', !isScrolled);
            }
            if (mobileMenu) {
                if (!isScrolled) {
                    mobileMenu.style.backgroundColor = 'rgba(153, 125, 108, 0.95)';
                } else {
                    mobileMenu.style.backgroundColor = '';
                }
                if (mobileMenuLinks) {
                    mobileMenuLinks.forEach(link => {
                        link.classList.toggle('text-brand-text', isScrolled);
                        link.classList.toggle('text-white', !isScrolled);
                    });
                }
            }
        });
        // Dispara o evento scroll uma vez no carregamento para aplicar os estilos iniciais se a página já estiver rolada
        window.dispatchEvent(new Event('scroll'));

        // Mobile menu toggle
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        const closeIcon = document.getElementById('closeIcon');
        if (mobileMenuButton && mobileMenu && hamburgerIcon && closeIcon) {
            mobileMenuButton.addEventListener('click', () => {
                const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
                mobileMenu.classList.toggle('hidden');
                hamburgerIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');
                mobileMenuButton.setAttribute('aria-expanded', String(!isExpanded));
            });
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    hamburgerIcon.classList.remove('hidden');
                    closeIcon.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }
}