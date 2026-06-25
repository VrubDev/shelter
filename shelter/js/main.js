const burgerIcon = document.querySelector(".burger_icon");
const burgerMenu = document.querySelector(".header_nav");
const navLinks = document.querySelectorAll(".nav_link");
const overlay = document.querySelector(".overlay");

function closeMenu() {
  burgerMenu.classList.remove("open");
  burgerIcon.classList.remove("open");
  overlay.classList.remove("open");
  document.body.classList.remove("noscroll");
}

burgerIcon.addEventListener("click", () => {
  burgerMenu.classList.toggle("open");
  burgerIcon.classList.toggle("open");
  overlay.classList.toggle("open");
  document.body.classList.toggle("noscroll");
});

overlay.addEventListener("click", closeMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});
