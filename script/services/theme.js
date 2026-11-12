
import { $ } from '../utils/dom.js';

const THEME_ATTRIBUTE = 'data-theme';

export function initTheme() {
    loadThemeFromStorage();

    const themeToggle = $('#theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute(THEME_ATTRIBUTE) || 'light';

    let newTheme = 'light';
    if (currentTheme === 'light') {
        newTheme = 'dark';
    }

    applyTheme(newTheme);
    saveThemeToStorage(newTheme);
}

export function loadThemeFromStorage() {
    let savedTheme = 'light';

    try {
        savedTheme = localStorage.getItem('theme');
    } catch (error) {
        savedTheme = 'light';
    }

    if (!savedTheme) {
        savedTheme = 'light';
    }

    applyTheme(savedTheme);
}

function saveThemeToStorage(theme) {
    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);

    const themeToggle = $('#theme-toggle');
    if (!themeToggle) {
        return;
    }

    const isDark = theme === 'dark';
    themeToggle.innerHTML = isDark
        ? '<i class="fas fa-sun"></i> Light Mode'
        : '<i class="fas fa-moon"></i> Dark Mode';
    themeToggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
}
