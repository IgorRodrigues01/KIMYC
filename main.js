/* ==========================================================================
   GIRA DISCOS — CATÁLOGO, FILTROS & CAIXOTE INTERATIVO
   ========================================================================== */

const CATALOG_DATA = [
  {
    id: "milton-01",
    title: "As Músicas de Milton Nascimento",
    artist: "Milton Nascimento",
    condition: "usado",
    grading: "VG+",
    origin: "brasil",
    curator: "brasil",
    year: "1978",
    price: 100.0,
    oldPrice: 120.0,
    promo: true,
    coverBg: "linear-gradient(135deg, #2d4739 0%, #1d2e25 100%)",
    labelColor: "#c88a22"
  },
  {
    id: "nara-02",
    title: "Com Açúcar, Com Afeto",
    artist: "Nara Leão",
    condition: "usado",
    grading: "VG+",
    origin: "brasil",
    curator: "brasil",
    year: "1980",
    price: 80.0,
    oldPrice: 100.0,
    promo: true,
    coverBg: "linear-gradient(135deg, #8c3b2b 0%, #4f1f16 100%)",
    labelColor: "#e6b85c"
  },
  {
    id: "lulu-03",
    title: "Independence",
    artist: "Lulu Santos",
    condition: "usado",
    grading: "VG",
    origin: "brasil",
    curator: "anos-80",
    year: "1987",
    price: 70.0,
    oldPrice: 100.0,
    promo: true,
    coverBg: "linear-gradient(135deg, #284b63 0%, #152938 100%)",
    labelColor: "#d96b43"
  },
  {
    id: "bessie-04",
    title: "The World's Greatest Blues Singer",
    artist: "Bessie Smith",
    condition: "usado",
    grading: "NM",
    origin: "mundo",
    curator: "jazz-blues",
    year: "1970",
    price: 200.0,
    oldPrice: null,
    promo: false,
    coverBg: "linear-gradient(135deg, #4a3525 0%, #261a11 100%)",
    labelColor: "#c88a22"
  },
  {
    id: "brubeck-05",
    title: "Jackpot!",
    artist: "Dave Brubeck Quartet",
    condition: "usado",
    grading: "VG+",
    origin: "mundo",
    curator: "jazz-blues",
    year: "1968",
    price: 300.0,
    oldPrice: null,
    promo: false,
    coverBg: "linear-gradient(135deg, #6b2d2d 0%, #331313 100%)",
    labelColor: "#e3c578"
  },
  {
    id: "siba-06",
    title: "Máquina de Fazer Festa (Lacrado)",
    artist: "Siba",
    condition: "novo",
    grading: "MINT",
    origin: "brasil",
    curator: "novos",
    year: "2023",
    price: 220.0,
    oldPrice: 250.0,
    promo: true,
    coverBg: "linear-gradient(135deg, #a64b2a 0%, #5e2714 100%)",
    labelColor: "#f2c14e"
  },
  {
    id: "anelis-07",
    title: "Sal (Lacrado)",
    artist: "Anelis Assumpção",
    condition: "novo",
    grading: "MINT",
    origin: "brasil",
    curator: "novos",
    year: "2022",
    price: 180.0,
    oldPrice: 220.0,
    promo: true,
    coverBg: "linear-gradient(135deg, #3b5249 0%, #1f2d28 100%)",
    labelColor: "#d9822b"
  },
  {
    id: "dodo-08",
    title: "Incendiou o Brasil",
    artist: "Trio Elétrico Dodô & Osmar",
    condition: "usado",
    grading: "VG+",
    origin: "brasil",
    curator: "brasil",
    year: "1979",
    price: 80.0,
    oldPrice: null,
    promo: false,
    coverBg: "linear-gradient(135deg, #9e6b21 0%, #57380c 100%)",
    labelColor: "#e05a36"
  },
  {
    id: "dylan-09",
    title: "Nashville Skyline",
    artist: "Bob Dylan",
    condition: "usado",
    grading: "VG+",
    origin: "mundo",
    curator: "jazz-blues",
    year: "1969",
    price: 280.0,
    oldPrice: 300.0,
    promo: true,
    coverBg: "linear-gradient(135deg, #5c4738 0%, #2e221a 100%)",
    labelColor: "#d49b35"
  },
  {
    id: "roxette-10",
    title: "Joyride",
    artist: "Roxette",
    condition: "usado",
    grading: "VG+",
    origin: "mundo",
    curator: "anos-80",
    year: "1991",
    price: 150.0,
    oldPrice: 180.0,
    promo: true,
    coverBg: "linear-gradient(135deg, #7a2e4d 0%, #3d1425 100%)",
    labelColor: "#e6b85c"
  },
  {
    id: "kleiton-11",
    title: "Kleiton e Kledir",
    artist: "Kleiton & Kledir",
    condition: "usado",
    grading: "VG+",
    origin: "brasil",
    curator: "brasil",
    year: "1981",
    price: 60.0,
    oldPrice: 80.0,
    promo: true,
    coverBg: "linear-gradient(135deg, #35584c 0%, #1b3029 100%)",
    labelColor: "#c88a22"
  },
  {
    id: "stones-12",
    title: "Dirty Work",
    artist: "The Rolling Stones",
    condition: "usado",
    grading: "VG+",
    origin: "mundo",
    curator: "anos-80",
    year: "1986",
    price: 100.0,
    oldPrice: 120.0,
    promo: true,
    coverBg: "linear-gradient(135deg, #8a2424 0%, #420f0f 100%)",
    labelColor: "#e3b341"
  }
];

const FREE_SHIPPING_GOAL = 350.0;

const state = {
  filterType: "all",
  filterValue: "all",
  curator: "all",
  search: "",
  sort: "featured",
  crate: []
};

/* Elementos do DOM */
const recordsGrid = document.getElementById("recordsGrid");
const resultsCounter = document.getElementById("resultsCounter");
const catalogHeading = document.getElementById("catalogHeading");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const navLinks = document.querySelectorAll(".nav-link");
const curationPills = document.querySelectorAll(".pill");

/* Elementos do Caixote (Carrinho) */
const crateDrawer = document.getElementById("crateDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const openCrateBtn = document.getElementById("openCrateBtn");
const closeCrateBtn = document.getElementById("closeCrateBtn");
const crateCount = document.getElementById("crateCount");
const crateItemsContainer = document.getElementById("crateItemsContainer");
const crateSubtotal = document.getElementById("crateSubtotal");
const crateInstallments = document.getElementById("crateInstallments");
const shippingMessage = document.getElementById("shippingMessage");
const shippingBar = document.getElementById("shippingBar");
const toastNotification = document.getElementById("toastNotification");

/* Formatação Monetária BRL */
function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function getDiscountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/* Filtragem e Ordenação */
function getFilteredRecords() {
  let list = CATALOG_DATA.filter((item) => {
    if (state.filterType === "condition" && item.condition !== state.filterValue) {
      return false;
    }
    if (state.filterType === "origin" && item.origin !== state.filterValue) {
      return false;
    }
    if (state.filterType === "promo" && !item.promo) {
      return false;
    }
    if (state.curator !== "all" && item.curator !== state.curator) {
      return false;
    }
    if (state.search.trim() !== "") {
      const q = state.search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchArtist = item.artist.toLowerCase().includes(q);
      if (!matchTitle && !matchArtist) return false;
    }
    return true;
  });

  if (state.sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sort === "discount") {
    list.sort(
      (a, b) =>
        getDiscountPercent(b.price, b.oldPrice) -
        getDiscountPercent(a.price, a.oldPrice)
    );
  }

  return list;
}

/* Renderização dos Cards de Vinil */
function renderCatalog() {
  const records = getFilteredRecords();
  recordsGrid.innerHTML = "";

  resultsCounter.textContent = `${records.length} ${
    records.length === 1 ? "título encontrado" : "títulos encontrados"
  }`;

  if (records.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  records.forEach((record) => {
    const discount = getDiscountPercent(record.price, record.oldPrice);
    const installmentValue = formatBRL(record.price / 3);
    const isUsed = record.condition === "usado";

    const card = document.createElement("article");
    card.className = "record-card";

    card.innerHTML = `
      <div>
        <div class="card-badges">
          <span class="badge ${isUsed ? "badge-used" : "badge-new"}">
            ${isUsed ? `USADO • ${record.grading}` : "NOVO • LACRADO"}
          </span>
          ${discount > 0 ? `<span class="badge badge-promo">-${discount}%</span>` : ""}
        </div>

        <div class="record-visual">
          <div class="record-cover ${isUsed ? "is-used" : ""}" style="background: ${record.coverBg};">
            <span class="cover-genre">${record.origin === "brasil" ? "BRASIL" : "MUNDO"} • LP</span>
            <span class="cover-title">${record.title}</span>
            <span class="cover-year">EDIÇÃO ${record.year}</span>
          </div>
          <div class="record-vinyl" aria-hidden="true">
            <div class="vinyl-center-label" style="background-color: ${record.labelColor};">
              33⅓
            </div>
          </div>
        </div>

        <div class="record-meta">
          <span class="record-origin">${record.artist}</span>
          <h3 class="record-title">${record.title}</h3>
          <p class="record-artist">Prensagem ${record.year} • Frete protegido</p>
        </div>
      </div>

      <div class="record-pricing">
        <div>
          ${record.oldPrice ? `<span class="price-old">${formatBRL(record.oldPrice)}</span>` : ""}
          <span class="price-current">${formatBRL(record.price)}</span>
          <span class="price-installment">3x de ${installmentValue} sem juros</span>
        </div>
        <button type="button" class="add-to-crate-btn" data-id="${record.id}">
          + Caixote
        </button>
      </div>
    `;

    recordsGrid.appendChild(card);
  });
}

/* Gerenciamento do Caixote (Carrinho) */
function addToCrate(recordId) {
  const item = CATALOG_DATA.find((r) => r.id === recordId);
  if (!item) return;

  state.crate.push(item);
  updateCrateUI();
  showToast(`"${item.title}" adicionado ao caixote.`);
}

function removeFromCrate(index) {
  state.crate.splice(index, 1);
  updateCrateUI();
}

function updateCrateUI() {
  crateCount.textContent = state.crate.length;

  const subtotal = state.crate.reduce((acc, item) => acc + item.price, 0);
  crateSubtotal.textContent = formatBRL(subtotal);
  crateInstallments.textContent =
    subtotal > 0
      ? `Ou 3x de ${formatBRL(subtotal / 3)} sem juros`
      : "Parcele em até 3x sem juros";

  /* Barra de Frete Grátis */
  const progress = Math.min((subtotal / FREE_SHIPPING_GOAL) * 100, 100);
  shippingBar.style.width = `${progress}%`;

  if (subtotal >= FREE_SHIPPING_GOAL) {
    shippingMessage.innerHTML = `<strong>Sucesso!</strong> Você garantiu Frete Grátis neste pedido.`;
  } else {
    const remaining = FREE_SHIPPING_GOAL - subtotal;
    shippingMessage.innerHTML = `Faltam <strong>${formatBRL(remaining)}</strong> para ganhar Frete Grátis.`;
  }

  if (state.crate.length === 0) {
    crateItemsContainer.innerHTML = `<p class="empty-crate-msg">Seu caixote ainda está vazio. Escolha um disco no catálogo para começar.</p>`;
    return;
  }

  crateItemsContainer.innerHTML = "";
  state.crate.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "crate-item";
    row.innerHTML = `
      <div class="crate-item-info">
        <h4>${item.title}</h4>
        <span>${item.artist} • ${formatBRL(item.price)}</span>
      </div>
      <button type="button" class="remove-item-btn" data-index="${index}">Remover</button>
    `;
    crateItemsContainer.appendChild(row);
  });
}

function openCrateDrawer() {
  crateDrawer.classList.add("open");
  crateDrawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.classList.remove("hidden");
}

function closeCrateDrawer() {
  crateDrawer.classList.remove("open");
  crateDrawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.classList.add("hidden");
}

let toastTimer;
function showToast(message) {
  toastNotification.textContent = message;
  toastNotification.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastNotification.classList.remove("show");
  }, 2600);
}

/* Event Listeners */
navLinks.forEach((btn) => {
  btn.addEventListener("click", () => {
    navLinks.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    state.filterType = btn.dataset.filterType;
    state.filterValue = btn.dataset.filterValue;
    state.curator = "all";
    curationPills.forEach((p) =>
      p.classList.toggle("active", p.dataset.curator === "all")
    );

    renderCatalog();
  });
});

curationPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    curationPills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    state.curator = pill.dataset.curator;
    renderCatalog();
  });
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderCatalog();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderCatalog();
});

recordsGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-crate-btn");
  if (button) addToCrate(button.dataset.id);
});

crateItemsContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-item-btn");
  if (!button) return;

  removeFromCrate(Number(button.dataset.index));
});

openCrateBtn.addEventListener("click", openCrateDrawer);
closeCrateBtn.addEventListener("click", closeCrateDrawer);
drawerBackdrop.addEventListener("click", closeCrateDrawer);

document.querySelector(".btn-add-featured").addEventListener("click", (event) => {
  addToCrate(event.currentTarget.dataset.id);
});

document.getElementById("btnFilterUsedHero").addEventListener("click", () => {
  state.filterType = "condition";
  state.filterValue = "usado";
  state.curator = "all";

  navLinks.forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.dataset.filterType === "condition" &&
        btn.dataset.filterValue === "usado"
    );
  });
  curationPills.forEach((pill) =>
    pill.classList.toggle("active", pill.dataset.curator === "all")
  );
  renderCatalog();
  document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
});

function resetFilters() {
  state.filterType = "all";
  state.filterValue = "all";
  state.curator = "all";
  state.search = "";
  state.sort = "featured";

  searchInput.value = "";
  sortSelect.value = "featured";
  navLinks.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.filterType === "all")
  );
  curationPills.forEach((pill) =>
    pill.classList.toggle("active", pill.dataset.curator === "all")
  );
  renderCatalog();
}

document
  .getElementById("resetFiltersBrand")
  .addEventListener("click", (event) => {
    event.preventDefault();
    resetFilters();
  });

document
  .getElementById("clearAllFiltersBtn")
  .addEventListener("click", resetFilters);

document
  .getElementById("newsletterForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const emailInput = document.getElementById("newsletterEmail");
    const feedback = document.getElementById("newsletterFeedback");
    feedback.textContent = `Obrigado! Avisaremos ${emailInput.value} sobre os próximos lotes.`;
    event.currentTarget.reset();
  });

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (state.crate.length === 0) {
    showToast("Adicione pelo menos um disco ao caixote.");
    return;
  }

  const total = state.crate.reduce((sum, item) => sum + item.price, 0);
  const itens = state.crate
    .map((item, index) => `${index + 1}. ${item.title} - ${formatBRL(item.price)}`)
    .join("\n");
  const message =
    `Olá! Gostaria de finalizar meu pedido:\n\n${itens}\n\n` +
    `Subtotal: ${formatBRL(total)}`;

  window.open(
    `https://wa.me/5551991676515?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && crateDrawer.classList.contains("open")) {
    closeCrateDrawer();
  }
});

updateCrateUI();
renderCatalog();