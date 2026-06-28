const burgerIcon = document.querySelector(".burger_icon");
const burgerMenu = document.querySelector(".header_nav");
const navLinks = document.querySelectorAll(".nav_link");
const overlay = document.querySelector(".overlay");

const btnFirst = document.querySelector(".btn_first");
const btnPrev = document.querySelector(".btn_prev");
const pageNumberElement = document.querySelector(".btn_page_number");
const btnNext = document.querySelector(".btn_next");
const btnLast = document.querySelector(".btn_last");

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

let allPets = [];
let longPetsList = [];
let currentPage = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function hasNeighbourDuplicates(array) {
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i].name === array[i + 1].name) {
      return true;
    }
  }
  return false;
}

function getCardsPerPage() {
  const width = window.innerWidth;

  if (width >= 1280) {
    return 8;
  } else if (width >= 768) {
    return 6;
  } else {
    return 3;
  }
}

function getPageContent() {
  const cardsPerPage = getCardsPerPage();

  let start = currentPage * cardsPerPage;
  let end = start + cardsPerPage;

  return longPetsList.slice(start, end);
}

function renderCards() {
  const container = document.querySelector(".pets");

  if (!container) return;

  container.innerHTML = "";

  const currentCards = getPageContent();

  currentCards.forEach((pet) => {
    container.innerHTML += `
      <article class="pet_card" data-name="${pet.name}">
        <img
          src="${pet.img}"
          alt="${pet.name}"
          class="pet-card__img"
        >
        <h2 class="card_title">${pet.name}</h2>
        <button class="pet_card_btn">Learn more</button>
      </article>
    `;
  });
}

function getMaxPages() {
  const cardsPerPage = getCardsPerPage();
  return 48 / cardsPerPage;
}

function updatePaginationStatus() {
  const maxPages = getMaxPages();

  pageNumberElement.innerText = currentPage + 1;

  if (currentPage === 0) {
    btnFirst.disabled = true;
    btnPrev.disabled = true;
  } else {
    btnFirst.disabled = false;
    btnPrev.disabled = false;
  }

  if (currentPage === maxPages - 1) {
    btnNext.disabled = true;
    btnLast.disabled = true;
  } else {
    btnNext.disabled = false;
    btnLast.disabled = false;
  }
}

btnNext.addEventListener("click", () => {
  const maxPages = getMaxPages();
  if (currentPage < maxPages - 1) {
    currentPage++;
    renderCards();
    updatePaginationStatus();
  }
});

btnPrev.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    renderCards();
    updatePaginationStatus();
  }
});

btnLast.addEventListener("click", () => {
  const maxPages = getMaxPages();
  currentPage = maxPages - 1;
  renderCards();
  updatePaginationStatus();
});

btnFirst.addEventListener("click", () => {
  currentPage = 0;
  renderCards();
  updatePaginationStatus();
});

async function loadPetsData() {
  const response = await fetch("./pets.json");
  allPets = await response.json();

  console.log("Данные внутри функции:", allPets);
  for (let i = 0; i < 6; i++) {
    longPetsList.push(...allPets);
  }

  longPetsList = shuffle(longPetsList);

  while (hasNeighbourDuplicates(longPetsList)) {
    longPetsList = shuffle(longPetsList);
  }

  console.log(longPetsList);
  renderCards();
}

loadPetsData();

window.addEventListener("resize", () => {
  currentPage = 0;
  renderCards();
  updatePaginationStatus();
});
