const burgerIcon = document.querySelector(".burger_icon");
const burgerMenu = document.querySelector(".header_nav");
const navLinks = document.querySelectorAll(".nav_link");
const overlay = document.querySelector(".overlay");

const popupWrapper = document.querySelector(".popup");
const popupCloseBtn = document.querySelector(".popup_close_btn");

const btnFirst = document.querySelector(".btn_first");
const btnPrev = document.querySelector(".btn_prev");
const pageNumberElement = document.querySelector(".btn_page_number");
const btnNext = document.querySelector(".btn_next");
const btnLast = document.querySelector(".btn_last");

function closeMenu() {
  if (burgerMenu) burgerMenu.classList.remove("open");
  if (burgerIcon) burgerIcon.classList.remove("open");
  if (overlay && (!popupWrapper || !popupWrapper.classList.contains("open"))) {
    overlay.classList.remove("open");
  }
  document.body.classList.remove("noscroll");
}

function closePopup() {
  if (popupWrapper) popupWrapper.classList.remove("open");
  if (overlay && (!burgerMenu || !burgerMenu.classList.contains("open"))) {
    overlay.classList.remove("open");
  }
  document.body.classList.remove("noscroll");
}

if (burgerIcon) {
  burgerIcon.addEventListener("click", () => {
    if (burgerMenu) burgerMenu.classList.toggle("open");
    burgerIcon.classList.toggle("open");
    if (overlay) overlay.classList.toggle("open");
    document.body.classList.toggle("noscroll");
  });
}

if (overlay) {
  overlay.addEventListener("click", () => {
    closeMenu();
    closePopup();
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

if (popupCloseBtn) {
  popupCloseBtn.addEventListener("click", closePopup);
}

if (popupWrapper) {
  popupWrapper.addEventListener("click", (event) => {
    if (event.target === popupWrapper) {
      closePopup();
    }
  });
}

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
  if (!pageNumberElement) return;
  const maxPages = getMaxPages();

  pageNumberElement.innerText = currentPage + 1;

  if (currentPage === 0) {
    if (btnFirst) btnFirst.disabled = true;
    if (btnPrev) btnPrev.disabled = true;
  } else {
    if (btnFirst) btnFirst.disabled = false;
    if (btnPrev) btnPrev.disabled = false;
  }

  if (currentPage === maxPages - 1) {
    if (btnNext) btnNext.disabled = true;
    if (btnLast) btnLast.disabled = true;
  } else {
    if (btnNext) btnNext.disabled = false;
    if (btnLast) btnLast.disabled = false;
  }
}

if (btnNext) {
  btnNext.addEventListener("click", () => {
    const maxPages = getMaxPages();
    if (currentPage < maxPages - 1) {
      currentPage++;
      renderCards();
      updatePaginationStatus();
    }
  });
}

if (btnPrev) {
  btnPrev.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      renderCards();
      updatePaginationStatus();
    }
  });
}

if (btnLast) {
  btnLast.addEventListener("click", () => {
    const maxPages = getMaxPages();
    currentPage = maxPages - 1;
    renderCards();
    updatePaginationStatus();
  });
}

if (btnFirst) {
  btnFirst.addEventListener("click", () => {
    currentPage = 0;
    renderCards();
    updatePaginationStatus();
  });
}

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

document.addEventListener("click", (event) => {
  const clickedCard = event.target.closest(".pet_card");
  if (!clickedCard) return;

  const petName =
    clickedCard.dataset.name ||
    (clickedCard.querySelector(".card_title") &&
      clickedCard.querySelector(".card_title").innerText.trim());
  if (petName) {
    setupAndOpenPopup(petName);
  }
});

function openPopup() {
  if (popupWrapper) popupWrapper.classList.add("open");
  document.body.classList.add("noscroll");
}

function setupAndOpenPopup(name) {
  const targetPet = allPets.find((pet) => pet.name === name);

  if (targetPet) {
    fillPopupData(targetPet);
    openPopup();
  }
}

function fillPopupData(petObject) {
  const popupImg = document.querySelector(".popup_img");
  const popupTitle = document.querySelector(".popup_title");
  const popupSubtitle = document.querySelector(".popup_subtitle");
  const popupDescription = document.querySelector(".popup_description");

  const popupAge = document.querySelector(".popup_age");
  const popupInoculations = document.querySelector(".popup_inoculations");
  const popupDiseases = document.querySelector(".popup_diseases");
  const popupParasites = document.querySelector(".popup_parasites");

  if (popupImg) {
    popupImg.src = petObject.img;
    popupImg.alt = petObject.name;
  }
  if (popupTitle) popupTitle.innerText = petObject.name;
  if (popupSubtitle)
    popupSubtitle.innerText = `${petObject.type} - ${petObject.breed}`;
  if (popupDescription) popupDescription.innerText = petObject.description;

  if (popupAge) popupAge.innerText = petObject.age;
  if (popupInoculations)
    popupInoculations.innerText = petObject.inoculations.join(", ");
  if (popupDiseases) popupDiseases.innerText = petObject.diseases.join(", ");
  if (popupParasites) popupParasites.innerText = petObject.parasites.join(", ");
}
