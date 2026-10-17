window.toggleMenu = function(button) {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

function initMenus() {
    document.querySelectorAll('.menu-button[aria-controls]').forEach(function (button) {
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
