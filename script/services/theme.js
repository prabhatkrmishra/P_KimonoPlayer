import { $ } from '../utils/dom.js';

export function initTheme() {
    loadThemeFromStorage();

    const themeToggle = $('#theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);

    try {
        localStorage.setItem('theme', newTheme);
    } catch {
        // ignore storage failures
    }
}

export function loadThemeFromStorage() {
    let savedTheme = 'light';
    try {
        savedTheme = localStorage.getItem('theme') || 'light';
    } catch {
        savedTheme = 'light';
    }

    applyTheme(savedTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    const themeToggle = $('#theme-toggle');
    if (!themeToggle) return;

    themeToggle.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i> Light Mode'
        : '<i class="fas fa-moon"></i> Dark Mode';
    themeToggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}
