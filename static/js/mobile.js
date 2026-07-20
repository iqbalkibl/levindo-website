document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.querySelector(".mobile-toggle");
    const menu = document.querySelector(".nav-right");
    const overlay = document.querySelector(".nav-overlay");

    if (!toggle || !menu) return;

    function openMenu() {
        menu.classList.add("open");

        if (overlay) {
            overlay.classList.add("show");
        }

        toggle.classList.add("active");
    }

    function closeMenu() {
        menu.classList.remove("open");

        if (overlay) {
            overlay.classList.remove("show");
        }

        toggle.classList.remove("active");
    }

    toggle.addEventListener("click", () => {

        if (menu.classList.contains("open")) {

            closeMenu();

        } else {

            openMenu();

        }

    });

    if (overlay) {

        overlay.addEventListener("click", closeMenu);

    }

    

});