declare global {
    interface Window {
        toggleMenu: (button: HTMLButtonElement) => void;
    }
}

window.toggleMenu = function (button: HTMLButtonElement): void {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

function initMenus(): void {
    document.querySelectorAll<HTMLButtonElement>('.menu-button[aria-controls]').forEach(function (button) {
        button.addEventListener('click', function () {
            window.toggleMenu(button);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenus);
} else {
    initMenus();
}

export {}
