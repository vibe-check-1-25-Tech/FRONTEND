// =========================
// SIDEBAR MENU
// =========================
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("closeBtn");
const overlay = document.getElementById("overlay");

function openMenu() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
    menuBtn.classList.add("hide");
}

function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    menuBtn.classList.remove("hide");
}

menuBtn.addEventListener("click", () => {

    if (sidebar.classList.contains("open")) {
        closeMenu();
    } else {
        openMenu();
    }

});closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);