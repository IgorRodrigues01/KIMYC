const products = [
  { id: "mar-de-dentro", title: "Mar de Dentro", artist: "Nina Valente", state: "novo", region: "brasil", genre: "MPB", year: 2025, price: 168, oldPrice: 190, colors: ["#d3794f", "#e7b786", "#355d52"], art: 0, note: "Canções de mar aberto, gravadas ao vivo em uma tarde de verão." },
  { id: "blue-hour", title: "Blue Hour", artist: "The Slow Orbit", state: "usado", region: "mundo", genre: "Jazz", year: 1978, price: 142, oldPrice: 168, colors: ["#4c6881", "#d0a76e", "#d9d3ba"], art: 1, note: "Um quarteto intimista entre o jazz modal e a música de câmara." },
  { id: "cidade-lateral", title: "Cidade Lateral", artist: "Grupo Varanda", state: "novo", region: "brasil", genre: "Samba", year: 2024, price: 154, oldPrice: 154, colors: ["#c35b3f", "#e9c271", "#385144"], art: 2, note: "Ritmos de esquina e histórias pequenas em uma edição colorida." },
  { id: "soft-focus", title: "Soft Focus", artist: "Mira Sol", state: "usado", region: "mundo", genre: "Indie", year: 1996, price: 118, oldPrice: 145, colors: ["#d7c7a6", "#a95c54", "#414d43"], art: 3, note: "Guitarras enevoadas e melodias delicadas, em bom estado de conservação." },
  { id: "linha-de-fuga", title: "Linha de Fuga", artist: "Caio Nobre", state: "usado", region: "brasil", genre: "MPB", year: 1985, price: 96, oldPrice: 96, colors: ["#bd7153", "#e4c284", "#384f47"], art: 1, note: "Uma joia brasileira de arranjos econômicos e voz próxima." },
  { id: "northern-lights", title: "Northern Lights", artist: "Aster & Co.", state: "novo", region: "mundo", genre: "Eletrônica", year: 2023, price: 176, oldPrice: 198, colors: ["#5d7084", "#c79b75", "#263a4d"], art: 2, note: "Paisagens eletrônicas em uma prensagem de 180 gramas." },
  { id: "quintal-azul", title: "Quintal Azul", artist: "Dora Reis", state: "usado", region: "brasil", genre: "Samba", year: 1974, price: 132, oldPrice: 156, colors: ["#d59658", "#538178", "#e4cfaa"], art: 0, note: "Sambas ensolarados com encarte original e capa bem preservada." },
  { id: "after-the-rain", title: "After the Rain", artist: "Milo Greene Trio", state: "novo", region: "mundo", genre: "Jazz", year: 2025, price: 188, oldPrice: 188, colors: ["#425b62", "#d3b388", "#b86449"], art: 3, note: "Três músicos, um estúdio pequeno e espaço para respirar." },
  { id: "jardim-invertido", title: "Jardim Invertido", artist: "Lia Monte", state: "novo", region: "brasil", genre: "Indie", year: 2022, price: 146, oldPrice: 174, colors: ["#73836b", "#d5a77e", "#394a40"], art: 2, note: "Canções de quarto que crescem em arranjos luminosos." },
  { id: "midnight-postcard", title: "Midnight Postcard", artist: "June Arcade", state: "usado", region: "mundo", genre: "Indie", year: 1989, price: 110, oldPrice: 110, colors: ["#4b536b", "#cb7a61", "#e2d2ac"], art: 0, note: "Pop noturno dos anos 80 com sinais leves de uso na capa." },
  { id: "chao-de-sol", title: "Chão de Sol", artist: "Banda Horizonte", state: "usado", region: "brasil", genre: "MPB", year: 1981, price: 124, oldPrice: 150, colors: ["#d07a4d", "#e4c38d", "#54705a"], art: 3, note: "Uma prensagem brasileira de grooves macios e refrões abertos." },
  { id: "glass-garden", title: "Glass Garden", artist: "The Field Notes", state: "novo", region: "mundo", genre: "Eletrônica", year: 2024, price: 162, oldPrice: 162, colors: ["#577a78", "#d2ae7b", "#354f66"], art: 1, note: "Texturas analógicas e melodias instrumentais para ouvir inteiro." },
];

const banners = [
  { eyebrow: "Escuta de outono", title: "Discos para ouvir sem pressa.", copy: "Uma curadoria pequena, feita para quem gosta de virar o lado e deixar a música ficar.", action: "Descubra a seleção", href: "#/colecao" },
  { eyebrow: "Garimpos com história", title: "O próximo favorito já existe.", copy: "Vinis usados escolhidos um a um, com estado e procedência explicados sem mistério.", action: "Explorar usados", href: "#/colecao?estado=usado" },
  { eyebrow: "Novas prensagens", title: "A música também mora no sulco.", copy: "Lançamentos independentes e boas descobertas para renovar a sua estante.", action: "Ver discos novos", href: "#/colecao?estado=novo" },
];

const app = document.querySelector("#app");
const cartCount = document.querySelector("[data-cart-count]");
const cartLink = document.querySelector(".cart-link");
const toast = document.querySelector("[data-toast]");
let toastTimer;
let slideIndex = 0;
let state = readState();

function readState() {
  try {
    const stored = JSON.parse(localStorage.getItem("lado-sul-demo") || "{}");
    const cart = stored.cart && typeof stored.cart === "object" ? stored.cart : {};
    const validCart = Object.fromEntries(
      Object.entries(cart).filter(([id, quantity]) => products.some((product) => product.id === id) && Number.isInteger(quantity) && quantity > 0),
    );
    return { cart: validCart };
  } catch {
    return { cart: {} };
  }
}

function saveState() {
  localStorage.setItem("lado-sul-demo", JSON.stringify({ cart: state.cart }));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function coverFor(product) {
  const [first, second, third] = product.colors;
  const uid = `art-${product.id}`;
  const title = escapeHtml(product.title.toUpperCase());
  const artist = escapeHtml(product.artist.toUpperCase());
  let artwork;

  if (product.art === 0) {
    artwork = `<rect width="600" height="600" fill="${first}"/><circle cx="432" cy="165" r="174" fill="${second}"/><path d="M0 415 235 215l365 308v77H0z" fill="${third}"/><circle cx="432" cy="165" r="116" fill="none" stroke="#f4e8d1" stroke-width="2" opacity=".8"/><circle cx="432" cy="165" r="88" fill="none" stroke="#f4e8d1" stroke-width="1" opacity=".55"/>`;
  } else if (product.art === 1) {
    artwork = `<rect width="600" height="600" fill="${first}"/><path d="M0 0h600L315 260 0 205z" fill="${second}"/><path d="M0 600V334l280-96 320 158v204z" fill="${third}"/><circle cx="390" cy="310" r="113" fill="none" stroke="#f8efdb" stroke-width="3"/><circle cx="390" cy="310" r="83" fill="none" stroke="#f8efdb" stroke-width="1" opacity=".55"/>`;
  } else if (product.art === 2) {
    artwork = `<rect width="600" height="600" fill="${first}"/><path d="M0 0h600v600H0z" fill="url(#${uid})"/><path d="m80 600 220-510 220 510z" fill="${second}" opacity=".94"/><circle cx="300" cy="335" r="112" fill="${third}"/><circle cx="300" cy="335" r="85" fill="none" stroke="#f2e7d0" stroke-width="2"/><circle cx="300" cy="335" r="56" fill="none" stroke="#f2e7d0" stroke-width="1" opacity=".7"/>`;
  } else {
    artwork = `<rect width="600" height="600" fill="${first}"/><circle cx="300" cy="275" r="210" fill="${second}"/><path d="M0 455q130-108 255-15t345-34v194H0z" fill="${third}"/><path d="M0 495q145-82 280-4t320-22" fill="none" stroke="#f6edda" stroke-width="3" opacity=".8"/><circle cx="300" cy="275" r="145" fill="none" stroke="#f6edda" stroke-width="2" opacity=".75"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="${uid}" x2="1" y2="1"><stop stop-color="${first}"/><stop offset="1" stop-color="${third}"/></linearGradient></defs>${artwork}<path d="M0 0h600v600H0z" fill="none" stroke="#f5eddb" stroke-width="14" opacity=".65"/><text x="42" y="58" fill="#fff9e9" font-family="Georgia,serif" font-size="21" letter-spacing="3">${title}</text><text x="44" y="88" fill="#fff9e9" font-family="Arial,sans-serif" font-size="10" letter-spacing="2" opacity=".9">${artist}</text><text x="44" y="552" fill="#fff9e9" font-family="Arial,sans-serif" font-size="10" letter-spacing="4" opacity=".85">LADO SUL · LS${String(products.indexOf(product) + 1).padStart(2, "0")}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function discountFor(product) {
  return product.oldPrice > product.price ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
}

function productCard(product) {
  const discount = discountFor(product);
  const installment = product.price / 3;
  return `<article class="product-card">
    <div class="product-card-image">
      <a href="#/produto/${product.id}" aria-label="Ver ${escapeHtml(product.title)}, de ${escapeHtml(product.artist)}">
        <img src="${coverFor(product)}" alt="Capa ilustrada de ${escapeHtml(product.title)}" loading="lazy" />
      </a>
      ${discount ? `<span class="product-badge">${discount}% menos</span>` : ""}
      <span class="product-condition">${product.state === "novo" ? "Novo" : "Garimpo"}</span>
    </div>
    <div class="product-card-info">
      <div class="product-meta"><span>${escapeHtml(product.genre)}</span><span>${product.region === "brasil" ? "Brasil" : "Internacional"}</span></div>
      <a class="product-title" href="#/produto/${product.id}">${escapeHtml(product.title)}</a>
      <p class="product-artist">${escapeHtml(product.artist)} · ${product.year}</p>
      <div class="product-price"><strong>${money(product.price)}</strong>${discount ? `<del>${money(product.oldPrice)}</del>` : ""}</div>
      <p class="installments">3x de ${money(installment)} sem juros</p>
      <button class="button button-light button-small" type="button" data-action="add-cart" data-id="${product.id}">Adicionar à sacola</button>
    </div>
  </article>`;
}

function breadcrumb(label) {
  return `<div class="breadcrumb"><a href="#/">Início</a><span aria-hidden="true">/</span><span>${escapeHtml(label)}</span></div>`;
}

function renderHome() {
  const banner = banners[slideIndex];
  const selection = products.slice(0, 8);
  app.innerHTML = `<div class="page-shell">
    <section class="hero" aria-label="Destaque da loja">
      <div class="hero-copy">
        <p class="eyebrow" data-hero-eyebrow>${banner.eyebrow}</p>
        <h1 data-hero-title>${banner.title}</h1>
        <p data-hero-copy>${banner.copy}</p>
        <a class="button button-orange" data-hero-link href="${banner.href}">${banner.action}<span aria-hidden="true">→</span></a>
      </div>
      <div class="hero-art">
        <div class="hero-record" aria-hidden="true"></div>
        <div class="hero-sleeve hero-sleeve-one"><img src="${coverFor(products[0])}" alt="" /></div>
        <div class="hero-sleeve hero-sleeve-two"><img src="${coverFor(products[1])}" alt="" /></div>
        <span class="hero-slide-label" data-slide-label>Seleção ${String(slideIndex + 1).padStart(2, "0")} · 03</span>
        <div class="hero-controls">
          <button class="hero-control" type="button" data-action="slide-prev" aria-label="Destaque anterior">←</button>
          <button class="hero-control" type="button" data-action="slide-next" aria-label="Próximo destaque">→</button>
        </div>
      </div>
    </section>

    <section aria-labelledby="featured-heading">
      <div class="section-heading">
        <div><p class="eyebrow">Achados da semana</p><h2 id="featured-heading">Para deixar girando</h2></div>
        <a class="text-link" href="#/colecao">Ver coleção completa <span aria-hidden="true">→</span></a>
      </div>
      <div class="product-grid">${selection.map(productCard).join("")}</div>
    </section>

    <section class="service-strip" aria-label="Sobre a loja">
      <div class="service-item"><span class="service-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" /><circle cx="7" cy="18" r="1.5" /><circle cx="18" cy="18" r="1.5" /></svg></span><div><strong>Envio cuidadoso</strong><span>Para todo o Brasil</span></div></div>
      <div class="service-item"><span class="service-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.4-2.7 7.7-7 10-4.3-2.3-7-5.6-7-10V6z" /><path d="m9 12 2 2 4-4" /></svg></span><div><strong>Estado bem descrito</strong><span>Sem surpresas no garimpo</span></div></div>
      <div class="service-item"><span class="service-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="2" /><path d="M12 3.5v6M20.5 12h-6" /></svg></span><div><strong>Curadoria independente</strong><span>Escolhas feitas com carinho</span></div></div>
    </section>

    <section class="editorial-banner">
      <div><p class="eyebrow">O lado B também importa</p><h2>Histórias que soam melhor no vinil.</h2><p>Explore prensagens novas, garimpos e sons de todo lugar.</p></div>
      <a class="button" href="#/colecao?estado=usado">Garimpar discos <span aria-hidden="true">→</span></a>
    </section>

    <section aria-labelledby="new-heading">
      <div class="section-heading">
        <div><p class="eyebrow">Chegaram agora</p><h2 id="new-heading">Novas prensagens</h2></div>
        <a class="text-link" href="#/colecao?estado=novo">Ver discos novos <span aria-hidden="true">→</span></a>
      </div>
      <div class="product-grid">${products.filter((product) => product.state === "novo").slice(0, 4).map(productCard).join("")}</div>
    </section>
  </div>`;
}

function currentRoute() {
  const [rawPath, rawQuery = ""] = location.hash.slice(1).split("?");
  const segments = rawPath.split("/").filter(Boolean);
  return { path: rawPath || "/", segments, params: new URLSearchParams(rawQuery) };
}

function renderCollection(route, searchText = "") {
  const stateFilter = route.params.get("estado");
  const regionFilter = route.params.get("origem");
  const saleFilter = route.params.get("oferta") === "sim";
  const title = searchText ? `Busca: ${searchText}` : stateFilter === "novo" ? "Discos novos" : stateFilter === "usado" ? "Discos usados" : saleFilter ? "Ofertas da estante" : "Nossa coleção";
  const productsFound = products.filter((product) => {
    const searchable = `${product.title} ${product.artist} ${product.genre} ${product.region}`.toLocaleLowerCase("pt-BR");
    return (!stateFilter || product.state === stateFilter)
      && (!regionFilter || product.region === regionFilter)
      && (!saleFilter || discountFor(product) > 0)
      && (!searchText || searchable.includes(searchText.toLocaleLowerCase("pt-BR")));
  });
  const sortBy = route.params.get("ordem") || "destaque";
  if (sortBy === "preco-asc") productsFound.sort((a, b) => a.price - b.price);
  if (sortBy === "preco-desc") productsFound.sort((a, b) => b.price - a.price);
  if (sortBy === "nome-asc") productsFound.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
  if (sortBy === "recentes") productsFound.sort((a, b) => b.year - a.year);

  app.innerHTML = `<div class="page-shell">
    ${breadcrumb(title)}
    <header class="page-heading"><p class="eyebrow">Seleção Lado Sul</p><h1>${escapeHtml(title)}</h1><p>Discos escolhidos para escutar de ponta a ponta. Cada capa é uma ilustração original criada para este protótipo.</p></header>
    <div class="collection-toolbar">
      <span class="result-count">${productsFound.length} ${productsFound.length === 1 ? "disco encontrado" : "discos encontrados"}</span>
      <label class="sort-control">Ordenar por
        <select data-sort aria-label="Ordenar produtos">
          <option value="destaque" ${sortBy === "destaque" ? "selected" : ""}>Destaques</option>
          <option value="preco-asc" ${sortBy === "preco-asc" ? "selected" : ""}>Menor preço</option>
          <option value="preco-desc" ${sortBy === "preco-desc" ? "selected" : ""}>Maior preço</option>
          <option value="nome-asc" ${sortBy === "nome-asc" ? "selected" : ""}>Nome: A a Z</option>
          <option value="recentes" ${sortBy === "recentes" ? "selected" : ""}>Mais recentes</option>
        </select>
      </label>
    </div>
    <div class="collection-layout">
      <aside class="filter-panel" aria-label="Filtros de produtos">
        <h2>Filtrar por</h2>
        <div class="filter-group"><h3>Estado</h3>
          <label><input type="checkbox" data-filter-state value="novo" ${stateFilter === "novo" ? "checked" : ""}/> Novo</label>
          <label><input type="checkbox" data-filter-state value="usado" ${stateFilter === "usado" ? "checked" : ""}/> Usado</label>
        </div>
        <div class="filter-group"><h3>Origem</h3>
          <label><input type="checkbox" data-filter-region value="brasil" ${regionFilter === "brasil" ? "checked" : ""}/> Brasil</label>
          <label><input type="checkbox" data-filter-region value="mundo" ${regionFilter === "mundo" ? "checked" : ""}/> Mundo</label>
        </div>
        <div class="filter-group"><h3>Preço</h3>
          <div class="price-range"><label class="sr-only" for="min-price">Preço mínimo</label><input id="min-price" data-min-price type="number" min="0" placeholder="De R$" /><label class="sr-only" for="max-price">Preço máximo</label><input id="max-price" data-max-price type="number" min="0" placeholder="Até R$" /></div>
          <button class="button button-small" type="button" data-action="apply-price">Aplicar preço</button>
        </div>
        <div class="filter-group"><label><input type="checkbox" data-filter-sale ${saleFilter ? "checked" : ""}/> Só ofertas</label></div>
      </aside>
      <div class="collection-results" data-collection-results>
        ${productsFound.length ? `<div class="product-grid">${productsFound.map(productCard).join("")}</div>` : `<div class="empty-state"><h2>Nenhum disco por aqui</h2><p>Tente remover um filtro ou faça outra busca para encontrar sua próxima escuta.</p><a class="button" href="#/colecao">Ver toda a coleção</a></div>`}
      </div>
    </div>
  </div>`;
}

function renderProduct(product) {
  app.innerHTML = `<div class="page-shell">
    ${breadcrumb(product.title)}
    <section class="product-detail">
      <div class="product-detail-art"><img src="${coverFor(product)}" alt="Capa ilustrada de ${escapeHtml(product.title)}" /></div>
      <div class="detail-copy">
        <p class="eyebrow">${product.state === "novo" ? "Nova prensagem" : "Garimpo selecionado"} · ${product.region === "brasil" ? "Brasil" : "Internacional"}</p>
        <h1>${escapeHtml(product.title)}</h1>
        <p class="detail-artist">${escapeHtml(product.artist)} · ${product.year}</p>
        <div class="detail-price"><strong>${money(product.price)}</strong>${product.oldPrice > product.price ? `<del>${money(product.oldPrice)}</del>` : ""}</div>
        <p class="detail-installments">Em até 3x de ${money(product.price / 3)} sem juros (simulação)</p>
        <p class="detail-description">${escapeHtml(product.note)} ${product.state === "usado" ? "Condição: capa e disco avaliados visualmente; descrição demonstrativa." : "Edição demonstrativa, sem estoque ou venda real."}</p>
        <dl class="detail-facts">
          <div><dt>Formato</dt><dd>LP · 33⅓ RPM</dd></div>
          <div><dt>Estilo</dt><dd>${escapeHtml(product.genre)}</dd></div>
          <div><dt>Estado</dt><dd>${product.state === "novo" ? "Novo, lacrado" : "Usado, muito bom"}</dd></div>
          <div><dt>Disponibilidade</dt><dd>Estoque ilustrativo</dd></div>
        </dl>
        <div class="add-to-cart-row">
          <label class="sr-only" for="detail-quantity">Quantidade</label>
          <input class="quantity-input" id="detail-quantity" type="number" min="1" max="10" value="1" data-product-quantity />
          <button class="button button-orange" type="button" data-action="add-cart" data-id="${product.id}" data-quantity-input>Adicionar à sacola <span aria-hidden="true">→</span></button>
        </div>
        <p class="shipping-note"><span aria-hidden="true">◇</span> Frete grátis em compras demonstrativas acima de R$ 350.</p>
      </div>
    </section>
  </div>`;
}

function cartRows() {
  return Object.entries(state.cart).map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    if (!product) return "";
    return `<article class="cart-row">
      <img src="${coverFor(product)}" alt="Capa de ${escapeHtml(product.title)}" />
      <div class="cart-row-info"><h2><a href="#/produto/${product.id}">${escapeHtml(product.title)}</a></h2><p>${escapeHtml(product.artist)}</p></div>
      <div class="cart-qty" aria-label="Quantidade">
        <button type="button" data-action="quantity" data-id="${id}" data-delta="-1" aria-label="Diminuir quantidade">−</button>
        <output>${quantity}</output>
        <button type="button" data-action="quantity" data-id="${id}" data-delta="1" aria-label="Aumentar quantidade">+</button>
      </div>
      <strong class="cart-line-price">${money(product.price * quantity)}</strong>
      <button class="remove-item" type="button" data-action="remove-item" data-id="${id}" aria-label="Remover ${escapeHtml(product.title)}">×</button>
    </article>`;
  }).join("");
}

function renderCart() {
  const entries = Object.entries(state.cart);
  const subtotal = entries.reduce((sum, [id, quantity]) => sum + (products.find((product) => product.id === id)?.price || 0) * quantity, 0);
  const quantity = entries.reduce((sum, [, count]) => sum + count, 0);
  const shipping = subtotal === 0 || subtotal >= 350 ? 0 : 24.9;
  app.innerHTML = `<div class="page-shell">
    ${breadcrumb("Carrinho")}
    <header class="page-heading"><p class="eyebrow">Sua seleção</p><h1>Sacola de discos</h1><p>Confira seus achados antes de continuar. Esta sacola fica salva apenas neste navegador.</p></header>
    ${quantity ? `<div class="cart-layout">
      <section class="cart-items" aria-label="Itens na sacola">${cartRows()}</section>
      <aside class="cart-summary">
        <h2>Resumo do pedido</h2>
        <div class="summary-line"><span>Subtotal (${quantity} ${quantity === 1 ? "item" : "itens"})</span><strong>${money(subtotal)}</strong></div>
        <div class="summary-line"><span>Entrega simulada</span><strong>${shipping ? money(shipping) : "Grátis"}</strong></div>
        <div class="summary-shipping">${subtotal >= 350 ? "Você alcançou o frete grátis demonstrativo." : `Faltam ${money(Math.max(0, 350 - subtotal))} para o frete grátis.`}</div>
        <div class="summary-line total"><span>Total estimado</span><strong>${money(subtotal + shipping)}</strong></div>
        <button class="button button-orange" type="button" data-action="checkout">Continuar compra</button>
        <p class="cart-disclaimer">Checkout, pagamento e cálculo real de frete não estão conectados.</p>
      </aside>
    </div>` : `<div class="empty-state"><h2>Sua sacola está esperando uma trilha sonora</h2><p>Adicione um disco da coleção para vê-lo aqui.</p><a class="button" href="#/colecao">Explorar discos</a></div>`}
  </div>`;
}

function renderFormPage(kind) {
  if (kind === "contato") {
    app.innerHTML = `<div class="page-shell">
      ${breadcrumb("Contato")}
      <section class="form-page">
        <header class="page-heading"><p class="eyebrow">Estamos por perto</p><h1>Vamos conversar?</h1><p>Envie uma mensagem para a equipe fictícia da Lado Sul. Este formulário demonstra validação local e não envia dados a um servidor.</p></header>
        <div class="contact-cards"><div class="contact-card"><strong>E-mail</strong><span>oi@ladosul.example</span></div><div class="contact-card"><strong>Atendimento</strong><span>Segunda a sexta, 10h–17h</span></div><div class="contact-card"><strong>Base</strong><span>Porto Alegre · RS</span></div></div>
        <form class="form-card" data-form="contact">
          <div class="form-grid">
            <div class="field"><label for="contact-name">Nome</label><input id="contact-name" name="name" autocomplete="name" required /></div>
            <div class="field"><label for="contact-email">E-mail</label><input id="contact-email" name="email" type="email" autocomplete="email" required /></div>
            <div class="field field-full"><label for="contact-subject">Assunto</label><input id="contact-subject" name="subject" required /></div>
            <div class="field field-full"><label for="contact-message">Mensagem</label><textarea id="contact-message" name="message" minlength="10" required></textarea></div>
          </div>
          <button class="button" type="submit">Enviar mensagem</button>
          <p class="form-feedback" data-feedback="contact" aria-live="polite"></p>
        </form>
      </section>
    </div>`;
    return;
  }

  const isRegister = kind === "cadastro";
  const title = isRegister ? "Criar conta" : "Boas escutas começam por aqui";
  app.innerHTML = `<div class="page-shell">
    ${breadcrumb(isRegister ? "Cadastro" : "Entrar")}
    <section class="form-page">
      <header class="page-heading"><p class="eyebrow">Lado Sul · Discoteria</p><h1>${title}</h1><p>Área demonstrativa: não há autenticação, perfil ou armazenamento de credenciais.</p></header>
      <form class="form-card" data-form="${isRegister ? "register" : "login"}">
        <div class="form-grid">
          ${isRegister ? `<div class="field field-full"><label for="account-name">Nome</label><input id="account-name" name="name" autocomplete="name" required minlength="2" /></div>` : ""}
          <div class="field field-full"><label for="account-email">E-mail</label><input id="account-email" name="email" type="email" autocomplete="email" required /></div>
          <div class="field field-full"><label for="account-password">Senha</label><input id="account-password" name="password" type="password" autocomplete="${isRegister ? "new-password" : "current-password"}" minlength="8" required /></div>
          ${isRegister ? `<div class="field field-full"><label><input type="checkbox" name="terms" required /> Li e aceito os termos demonstrativos.</label></div>` : ""}
        </div>
        <button class="button" type="submit">${isRegister ? "Cadastrar" : "Entrar"}</button>
        <p class="form-feedback" data-feedback="account" aria-live="polite"></p>
        <p class="form-note">${isRegister ? `Já tem uma conta? <a class="text-link" href="#/login">Entrar</a>` : `Ainda não tem cadastro? <a class="text-link" href="#/cadastro">Criar conta</a>`}</p>
      </form>
    </section>
  </div>`;
}

function render() {
  const route = currentRoute();
  if (route.segments[0] === "produto") {
    const product = products.find((item) => item.id === route.segments[1]);
    product ? renderProduct(product) : renderCollection({ path: "/colecao", segments: ["colecao"], params: new URLSearchParams() });
  } else if (route.segments[0] === "colecao") {
    renderCollection(route);
  } else if (route.segments[0] === "buscar") {
    renderCollection(route, route.params.get("q") || "");
  } else if (route.segments[0] === "carrinho") {
    renderCart();
  } else if (["contato", "login", "cadastro"].includes(route.segments[0])) {
    renderFormPage(route.segments[0]);
  } else {
    renderHome();
  }
  updateCartBadge();
  document.querySelector("[data-mobile-nav]")?.classList.remove("is-open");
  document.querySelector("[data-action='toggle-menu']")?.setAttribute("aria-expanded", "false");
}

function updateCartBadge() {
  const count = Object.values(state.cart).reduce((sum, quantity) => sum + quantity, 0);
  if (cartCount) cartCount.textContent = String(count);
  cartLink?.setAttribute("aria-label", `Carrinho, ${count} ${count === 1 ? "item" : "itens"}`);
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function addToCart(id, quantity = 1) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const amount = Math.max(1, Math.min(10, Math.floor(quantity) || 1));
  state.cart[id] = Math.min(10, (state.cart[id] || 0) + amount);
  saveState();
  updateCartBadge();
  notify(`${product.title} foi adicionado à sua sacola.`);
  if (currentRoute().segments[0] === "carrinho") renderCart();
}

function setQueryParam(name, value) {
  const route = currentRoute();
  if (value) route.params.set(name, value);
  else route.params.delete(name);
  const query = route.params.toString();
  location.hash = `${route.path}${query ? `?${query}` : ""}`;
}

function moveSlide(delta) {
  slideIndex = (slideIndex + delta + banners.length) % banners.length;
  const banner = banners[slideIndex];
  const eyebrow = document.querySelector("[data-hero-eyebrow]");
  if (!eyebrow) return;
  document.querySelector("[data-hero-eyebrow]").textContent = banner.eyebrow;
  document.querySelector("[data-hero-title]").textContent = banner.title;
  document.querySelector("[data-hero-copy]").textContent = banner.copy;
  const link = document.querySelector("[data-hero-link]");
  link.href = banner.href;
  link.innerHTML = `${banner.action}<span aria-hidden="true">→</span>`;
  document.querySelector("[data-slide-label]").textContent = `Seleção ${String(slideIndex + 1).padStart(2, "0")} · 03`;
}

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const { action, id } = actionButton.dataset;
  if (action === "add-cart") {
    const quantity = actionButton.hasAttribute("data-quantity-input") ? Number(document.querySelector("[data-product-quantity]")?.value) : 1;
    addToCart(id, quantity);
  } else if (action === "remove-item") {
    delete state.cart[id];
    saveState();
    renderCart();
    notify("Disco removido da sacola.");
  } else if (action === "quantity") {
    const next = (state.cart[id] || 0) + Number(actionButton.dataset.delta);
    if (next < 1) delete state.cart[id];
    else state.cart[id] = Math.min(10, next);
    saveState();
    renderCart();
  } else if (action === "checkout") {
    notify("Checkout demonstrativo: nenhum pedido ou pagamento será realizado.");
  } else if (action === "slide-prev") {
    moveSlide(-1);
  } else if (action === "slide-next") {
    moveSlide(1);
  } else if (action === "toggle-menu") {
    const menu = document.querySelector("[data-mobile-nav]");
    const isOpen = menu.classList.toggle("is-open");
    actionButton.setAttribute("aria-expanded", String(isOpen));
    actionButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  } else if (action === "apply-price") {
    const route = currentRoute();
    const min = Number(document.querySelector("[data-min-price]")?.value || 0);
    const max = Number(document.querySelector("[data-max-price]")?.value || 0);
    const filtered = products.filter((product) => {
      return (!route.params.get("estado") || product.state === route.params.get("estado"))
        && (!route.params.get("origem") || product.region === route.params.get("origem"))
        && (!route.params.get("oferta") || discountFor(product) > 0)
        && (!min || product.price >= min)
        && (!max || product.price <= max);
    });
    const result = document.querySelector("[data-collection-results]");
    result.innerHTML = filtered.length ? `<div class="product-grid">${filtered.map(productCard).join("")}</div>` : `<div class="empty-state"><h2>Nenhum disco nessa faixa</h2><p>Ajuste os valores e tente novamente.</p></div>`;
    document.querySelector(".result-count").textContent = `${filtered.length} ${filtered.length === 1 ? "disco encontrado" : "discos encontrados"}`;
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-sort]")) {
    setQueryParam("ordem", event.target.value === "destaque" ? "" : event.target.value);
  } else if (event.target.matches("[data-filter-state]")) {
    const selected = [...document.querySelectorAll("[data-filter-state]:checked")].map((input) => input.value);
    setQueryParam("estado", selected.length === 1 ? selected[0] : "");
  } else if (event.target.matches("[data-filter-region]")) {
    const selected = [...document.querySelectorAll("[data-filter-region]:checked")].map((input) => input.value);
    setQueryParam("origem", selected.length === 1 ? selected[0] : "");
  } else if (event.target.matches("[data-filter-sale]")) {
    setQueryParam("oferta", event.target.checked ? "sim" : "");
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target;
  const kind = form.dataset.form;
  if (!kind) return;
  event.preventDefault();
  if (kind === "search") {
    const query = new FormData(form).get("q").toString().trim();
    if (query) location.hash = `/buscar?q=${encodeURIComponent(query)}`;
    return;
  }
  if (kind === "newsletter") {
    const feedback = document.querySelector('[data-feedback="newsletter"]');
    feedback.textContent = "Inscrição demonstrativa concluída. Nenhum e-mail foi armazenado.";
    form.reset();
  } else if (kind === "contact") {
    const feedback = document.querySelector('[data-feedback="contact"]');
    feedback.textContent = "Mensagem validada localmente. Este protótipo não a enviou.";
    form.reset();
  } else if (kind === "register" || kind === "login") {
    const feedback = document.querySelector('[data-feedback="account"]');
    feedback.textContent = kind === "register"
      ? "Cadastro validado localmente. Nenhuma conta ou senha foi armazenada."
      : "Demonstração somente visual: autenticação não está conectada.";
    form.reset();
  }
});

window.addEventListener("hashchange", render);
document.querySelector("[data-year]").textContent = String(new Date().getFullYear());
render();
