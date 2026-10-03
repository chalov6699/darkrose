import { products, categories } from './data.js';

const app = document.querySelector('#app');
const page = document.body.dataset.page || 'home';
const money = (v) => new Intl.NumberFormat('ru-RU').format(v) + ' ₽';

const cart = {
  get() { return JSON.parse(localStorage.getItem('darkRoseCart') || '[]'); },
  set(items) { localStorage.setItem('darkRoseCart', JSON.stringify(items)); updateCartCount(); },
  add(id, qty = 1) {
    const items = this.get();
    const found = items.find(i => i.id === id);
    found ? found.qty += qty : items.push({ id, qty });
    this.set(items);
    toast('Букет добавлен в корзину');
  },
  remove(id) { this.set(this.get().filter(i => i.id !== id)); renderPage(); },
  update(id, qty) {
    const items = this.get().map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i);
    this.set(items); renderPage();
  },
  count() { return this.get().reduce((sum, i) => sum + i.qty, 0); }
};

function updateCartCount() {
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = cart.count());
}

function header() {
  return `
    <header class="site-header">
      <a class="brand" href="./index.html" aria-label="Dark Rose — на главную">
        <span class="brand-mark">DR</span><span class="brand-name">Dark Rose</span>
      </a>
      <nav class="main-nav" aria-label="Основная навигация">
        <a href="./catalog.html">Каталог</a>
        <a href="./index.html#delivery">Доставка</a>
        <a href="./contacts.html">Контакты</a>
      </nav>
      <div class="header-actions">
        <a class="icon-link" href="./account.html" aria-label="Личный кабинет">Профиль</a>
        <a class="cart-link" href="./cart.html" aria-label="Корзина">Корзина <span data-cart-count>${cart.count()}</span></a>
        <button class="menu-button" aria-label="Открыть меню" data-menu-button><span></span><span></span></button>
      </div>
    </header>
    <div class="mobile-menu" data-mobile-menu>
      <a href="./catalog.html">Каталог</a>
      <a href="./index.html#delivery">Доставка</a>
      <a href="./contacts.html">Контакты</a>
      <a href="./account.html">Личный кабинет</a>
      <a href="./cart.html">Корзина</a>
    </div>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="footer-wordmark">DARK ROSE</div>
      <div class="footer-grid">
        <div><p class="eyebrow">Dark Rose</p><p>Цветочный дом с доставкой по городу.<br>Каждый день, 09:00–22:00.</p></div>
        <div><p class="eyebrow">Навигация</p><a href="./catalog.html">Каталог</a><a href="./contacts.html">Контакты</a><a href="./cart.html">Корзина</a></div>
        <div><p class="eyebrow">Связь</p><a href="tel:+79990000000">+7 999 000-00-00</a><a href="mailto:hello@darkrose.ru">hello@darkrose.ru</a><span>Telegram · WhatsApp</span></div>
      </div>
      <div class="footer-bottom"><span>© 2026 Dark Rose</span><span>Россия · RUB</span></div>
      <a class="deerflow-signature" href="https://deerflow.tech" target="_blank" rel="noreferrer">Created By Deerflow</a>
    </footer>`;
}

function productCard(p, featured = false) {
  return `
    <article class="product-card ${featured ? 'product-card--featured' : ''}" data-reveal>
      <a class="product-image" href="./product.html?id=${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <span class="product-arrow">↗</span>
      </a>
      <div class="product-meta">
        <div><a class="product-name" href="./product.html?id=${p.id}">${p.name}</a><p>${p.subtitle}</p></div>
        <div class="product-buy"><strong>${money(p.price)}</strong><button class="plus-button" data-add="${p.id}" aria-label="Добавить ${p.name} в корзину">+</button></div>
      </div>
    </article>`;
}

function homePage() {
  const selected = [products[0], products[1], products[2], products[3]];
  return `
    ${header()}
    <main>
      <section class="hero" data-hero>
        <div class="hero-noise"></div>
        <div class="hero-copy">
          <p class="hero-index">01 / Floral house</p>
          <h1><span>Dark</span><span>Rose</span></h1>
          <p class="hero-tagline">Цветы вместо слов.</p>
          <div class="hero-cta"><a class="button button--solid" href="./catalog.html">Выбрать букет</a><a class="text-link" href="#custom">Собрать свой <span>↗</span></a></div>
        </div>
        <div class="hero-rose-wrap" aria-hidden="true">
          <div class="hero-glow"></div>
          <div class="hero-rose-aura"></div>
          <img class="hero-rose" src="./public/images/hero-rose-main.webp?v=4" alt="" />
        </div>
        <div class="hero-side-note">Fresh daily · handcrafted · delivered</div>
        <a class="hero-scroll" href="#selected"><span>Scroll</span><i></i></a>
      </section>

      <section class="selected section" id="selected">
        <div class="section-head" data-reveal><div><p class="eyebrow">02 / Selection</p><h2>Выбрано<br>флористом</h2></div><a class="text-link" href="./catalog.html">Весь каталог <span>↗</span></a></div>
        <div class="selected-grid">${selected.map((p,i)=>productCard(p, i===0)).join('')}</div>
      </section>

      <section class="manifesto section">
        <div class="manifesto-line" data-reveal>WE DON'T MAKE</div>
        <div class="manifesto-line manifesto-line--accent" data-reveal>THE SAME BOUQUETS.</div>
        <div class="manifesto-copy" data-reveal><p class="eyebrow">03 / Manifesto</p><p>Dark Rose — не конвейер. Каждый букет собирается перед отправкой: по сезону, характеру цветов и вашему поводу.</p></div>
      </section>

      <section class="category-editorial section">
        <div class="section-head" data-reveal><div><p class="eyebrow">04 / Collections</p><h2>Не по правилам.<br>По настроению.</h2></div></div>
        <div class="editorial-grid">
          <a class="editorial-tile tile-1" href="./catalog.html?category=Розы"><img src="${products[0].image}" alt="Красные розы"><span><b>Roses</b><em>01</em></span></a>
          <a class="editorial-tile tile-2" href="./catalog.html?category=Авторские"><img src="${products[7].image}" alt="Авторские букеты"><span><b>Signature</b><em>02</em></span></a>
          <a class="editorial-tile tile-3" href="./catalog.html?category=Premium"><img src="${products[3].image}" alt="Премиальные букеты"><span><b>Premium</b><em>03</em></span></a>
          <a class="editorial-tile tile-4" href="./catalog.html?category=Монобукеты"><img src="${products[2].image}" alt="Монобукеты"><span><b>Mono</b><em>04</em></span></a>
        </div>
      </section>

      <section class="exclusive section" data-reveal>
        <div class="exclusive-media"><img src="${products[3].image}" alt="Obsession — 101 красная роза"></div>
        <div class="exclusive-content"><p class="eyebrow">05 / Dark Rose Exclusive</p><h2>Obsession<br><i>№01</i></h2><p>101 Red Naomi. Большой жест, собранный в абсолютный красный.</p><strong>${money(products[3].price)}</strong><a class="button button--outline" href="./product.html?id=obsession">Смотреть букет</a></div>
      </section>

      <section class="delivery section" id="delivery">
        <div class="section-head" data-reveal><div><p class="eyebrow">06 / Delivery</p><h2>Соберём.<br>Покажем.<br>Доставим.</h2></div><p class="section-intro">Перед отправкой пришлём фотографию именно вашего букета. Доставим в выбранный интервал или срочно — в день заказа.</p></div>
        <div class="delivery-steps">
          <div data-reveal><span>01</span><h3>Заказ</h3><p>Вы выбираете готовый букет или задаёте направление флористу.</p></div>
          <div data-reveal><span>02</span><h3>Фото</h3><p>Покажем готовую композицию до того, как она отправится к получателю.</p></div>
          <div data-reveal><span>03</span><h3>Доставка</h3><p>Курьер бережно доставит цветы и подтвердит вручение.</p></div>
        </div>
      </section>

      <section class="custom section" id="custom">
        <div class="custom-title" data-reveal><p class="eyebrow">07 / Bespoke</p><h2>Не нашли<br><i>тот самый?</i></h2></div>
        <form class="custom-form" data-custom-form>
          <label><span>Бюджет</span><select><option>до 5 000 ₽</option><option>5 000–10 000 ₽</option><option>10 000–20 000 ₽</option><option>20 000 ₽ +</option></select></label>
          <label><span>Повод</span><select><option>Без повода</option><option>День рождения</option><option>Любовь</option><option>Свадьба</option><option>Благодарность</option></select></label>
          <label><span>Ваш телефон</span><input type="tel" placeholder="+7 999 000-00-00" required></label>
          <button class="button button--solid" type="submit">Обсудить с флористом</button>
        </form>
      </section>
    </main>
    ${footer()}`;
}

function catalogPage() {
  const params = new URLSearchParams(location.search);
  const initial = params.get('category') || 'Все';
  return `
    ${header()}
    <main class="catalog-page">
      <section class="page-hero compact">
        <p class="eyebrow">Collection / 2026</p>
        <h1>Каталог</h1>
        <p>Собранные вручную композиции — от спокойных монобукетов до крупных Dark Rose Exclusive.</p>
      </section>
      <section class="catalog-shell">
        <aside class="filters" data-filters>
          <div class="filter-group"><p>Категория</p>${categories.map(c=>`<button class="filter-chip ${c===initial?'active':''}" data-category="${c}">${c}</button>`).join('')}</div>
          <div class="filter-group"><p>Цена</p><label><input type="radio" name="price" value="all" checked>Любая</label><label><input type="radio" name="price" value="5000">до 5 000 ₽</label><label><input type="radio" name="price" value="10000">5–10 000 ₽</label><label><input type="radio" name="price" value="20000">10–20 000 ₽</label><label><input type="radio" name="price" value="20001">20 000 ₽ +</label></div>
          <div class="filter-group"><p>Цвет</p><select data-color><option value="all">Любой</option><option>Красный</option><option>Белый</option><option>Розовый</option><option>Пастель</option><option>Mixed</option></select></div>
        </aside>
        <div class="catalog-content"><div class="catalog-toolbar"><p><span data-result-count>${products.length}</span> композиций</p><select data-sort><option value="featured">По умолчанию</option><option value="asc">Сначала дешевле</option><option value="desc">Сначала дороже</option></select></div><div class="catalog-grid" data-catalog-grid></div></div>
      </section>
    </main>
    ${footer()}`;
}

function productPage() {
  const id = new URLSearchParams(location.search).get('id') || products[0].id;
  const p = products.find(x => x.id === id) || products[0];
  const related = products.filter(x => x.id !== p.id && (x.category === p.category || x.color === p.color)).slice(0,3);
  document.title = `${p.name} — Dark Rose`;
  return `
    ${header()}
    <main class="product-page">
      <section class="product-detail">
        <div class="product-detail-media"><img src="${p.image}" alt="${p.name}"><span class="image-caption">${p.category} · ${p.size}</span></div>
        <div class="product-detail-info">
          <a class="back-link" href="./catalog.html">← Каталог</a>
          <p class="eyebrow">${p.badge || 'Dark Rose Selection'}</p>
          <h1>${p.name}</h1><p class="product-subtitle">${p.subtitle}</p>
          <div class="product-price">${money(p.price)}</div>
          <p class="product-description">${p.description}</p>
          <div class="product-options"><div><span>Размер</span><div class="size-pills"><button>S</button><button class="active">${p.size}</button><button>XL</button></div></div><div><span>Открытка</span><label class="switch-row"><input type="checkbox" checked><i></i><span>Добавить бесплатно</span></label></div></div>
          <button class="button button--solid button--wide" data-add="${p.id}">Добавить в корзину · ${money(p.price)}</button>
          <div class="product-notes"><p>Фото букета перед отправкой</p><p>Доставка в день заказа</p><p>Подпишем открытку от руки</p></div>
        </div>
      </section>
      <section class="section related"><div class="section-head"><div><p class="eyebrow">You may also like</p><h2>Продолжить<br>выбор</h2></div></div><div class="catalog-grid">${related.map(p=>productCard(p)).join('')}</div></section>
    </main>
    ${footer()}`;
}

function cartPage() {
  const items = cart.get().map(i => ({...i, product: products.find(p=>p.id===i.id)})).filter(i=>i.product);
  const subtotal = items.reduce((s,i)=>s+i.product.price*i.qty,0);
  return `
    ${header()}
    <main class="cart-page">
      <section class="page-hero compact"><p class="eyebrow">Order / ${String(cart.count()).padStart(2,'0')}</p><h1>Корзина</h1><p>Последняя проверка перед оформлением.</p></section>
      ${items.length ? `<section class="cart-layout"><div class="cart-items">${items.map(i=>`<article class="cart-item"><a href="./product.html?id=${i.product.id}"><img src="${i.product.image}" alt="${i.product.name}"></a><div class="cart-item-info"><div><a href="./product.html?id=${i.product.id}"><h3>${i.product.name}</h3></a><p>${i.product.subtitle}</p></div><div class="cart-item-bottom"><div class="qty"><button data-qty="${i.product.id}" data-delta="-1">−</button><span>${i.qty}</span><button data-qty="${i.product.id}" data-delta="1">+</button></div><strong>${money(i.product.price*i.qty)}</strong><button class="remove" data-remove="${i.product.id}">Удалить</button></div></div></article>`).join('')}</div><aside class="order-summary"><p class="eyebrow">Итого</p><div><span>Букеты</span><b>${money(subtotal)}</b></div><div><span>Доставка</span><b>рассчитаем по адресу</b></div><div class="summary-total"><span>К оплате</span><strong>${money(subtotal)}</strong></div><button class="button button--solid button--wide" data-checkout>Оформить заказ</button><small>Оплата картой, СБП или при получении.</small></aside></section>` : `<section class="empty-cart"><p>Корзина пока пуста.</p><a class="button button--solid" href="./catalog.html">Перейти в каталог</a></section>`}
    </main>
    ${footer()}`;
}

function contactsPage() {
  return `
    ${header()}
    <main class="contacts-page">
      <section class="page-hero contacts-hero"><p class="eyebrow">Dark Rose / Contact</p><h1>Мы рядом,<br>когда нужны<br><i>цветы.</i></h1></section>
      <section class="contacts-grid">
        <div class="contact-block"><p class="eyebrow">Телефон</p><a href="tel:+79990000000">+7 999 000-00-00</a><span>Ежедневно · 09:00–22:00</span></div>
        <div class="contact-block"><p class="eyebrow">Мессенджеры</p><a href="#">Telegram ↗</a><a href="#">WhatsApp ↗</a></div>
        <div class="contact-block"><p class="eyebrow">Бутик</p><strong>Москва, ул. Примерная, 18</strong><span>Демо-адрес — заменим на реальный</span></div>
        <div class="contact-block contact-block--wide"><p class="eyebrow">Написать нам</p><form data-contact-form><input type="text" placeholder="Ваше имя" required><input type="tel" placeholder="Телефон" required><textarea placeholder="Что вы ищете?"></textarea><button class="button button--solid">Отправить</button></form></div>
      </section>
    </main>
    ${footer()}`;
}

function accountPage() {
  return `
    ${header()}
    <main class="account-page">
      <section class="account-panel">
        <div class="account-copy"><p class="eyebrow">Private / Account</p><h1>Ваши цветы.<br>Ваши даты.</h1><p>История заказов, любимые адреса и сохранённые получатели — в одном месте.</p></div>
        <form class="login-form" data-login-form><p class="eyebrow">Войти по телефону</p><label><span>Номер телефона</span><input type="tel" placeholder="+7 999 000-00-00" required></label><button class="button button--solid button--wide">Получить код</button><small>На следующем этапе подключим реальную SMS-авторизацию.</small></form>
      </section>
    </main>
    ${footer()}`;
}

function renderPage() {
  const pages = { home: homePage, catalog: catalogPage, product: productPage, cart: cartPage, contacts: contactsPage, account: accountPage };
  app.innerHTML = (pages[page] || homePage)();
  bindGlobal();
  if (page === 'home') bindHome();
  if (page === 'catalog') bindCatalog();
  if (page === 'cart') bindCart();
  bindForms();
  revealObserver();
}

function bindGlobal() {
  document.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => cart.add(b.dataset.add)));
  const menuBtn = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (menuBtn && menu) menuBtn.addEventListener('click', () => { menuBtn.classList.toggle('open'); menu.classList.toggle('open'); });
  updateCartCount();
}

function bindHome() {
  const hero = document.querySelector('[data-hero]');
  if (hero) {
    hero.addEventListener('pointermove', (e) => {
      const x = (e.clientX / innerWidth - .5) * 2;
      const y = (e.clientY / innerHeight - .5) * 2;
      hero.style.setProperty('--mx', x.toFixed(3)); hero.style.setProperty('--my', y.toFixed(3));
    });
    window.addEventListener('scroll', () => hero.style.setProperty('--sy', Math.min(scrollY / innerHeight, 1).toFixed(3)), {passive:true});
  }
}

function bindCatalog() {
  const grid = document.querySelector('[data-catalog-grid]');
  const count = document.querySelector('[data-result-count]');
  let category = document.querySelector('.filter-chip.active')?.dataset.category || 'Все';
  let price = 'all', color='all', sort='featured';
  const render = () => {
    let list = products.filter(p => (category==='Все'||p.category===category) && (color==='all'||p.color===color));
    list = list.filter(p => price==='all' || (price==='5000'&&p.price<=5000) || (price==='10000'&&p.price>5000&&p.price<=10000) || (price==='20000'&&p.price>10000&&p.price<=20000) || (price==='20001'&&p.price>20000));
    if (sort==='asc') list.sort((a,b)=>a.price-b.price); if (sort==='desc') list.sort((a,b)=>b.price-a.price);
    grid.innerHTML = list.map(p=>productCard(p)).join('') || '<div class="no-results">Нет букетов с такими параметрами.</div>';
    count.textContent = list.length; bindGlobal(); revealObserver();
  };
  document.querySelectorAll('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-category]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');category=btn.dataset.category;render();}));
  document.querySelectorAll('input[name="price"]').forEach(r=>r.addEventListener('change',()=>{price=r.value;render();}));
  document.querySelector('[data-color]')?.addEventListener('change',e=>{color=e.target.value;render();});
  document.querySelector('[data-sort]')?.addEventListener('change',e=>{sort=e.target.value;render();});
  render();
}

function bindCart() {
  document.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>cart.remove(btn.dataset.remove)));
  document.querySelectorAll('[data-qty]').forEach(btn=>btn.addEventListener('click',()=>{const item=cart.get().find(i=>i.id===btn.dataset.qty); if(item) cart.update(item.id,item.qty+Number(btn.dataset.delta));}));
  document.querySelector('[data-checkout]')?.addEventListener('click',()=>toast('Оформление заказа подключим на backend-этапе'));
}

function bindForms() {
  document.querySelector('[data-custom-form]')?.addEventListener('submit',e=>{e.preventDefault();toast('Заявка принята — демо-режим');e.target.reset();});
  document.querySelector('[data-contact-form]')?.addEventListener('submit',e=>{e.preventDefault();toast('Сообщение отправлено — демо-режим');e.target.reset();});
  document.querySelector('[data-login-form]')?.addEventListener('submit',e=>{e.preventDefault();toast('SMS-код будет подключён на следующем этапе');});
}

function toast(text) {
  document.querySelector('.toast')?.remove();
  const el=document.createElement('div'); el.className='toast'; el.textContent=text; document.body.append(el);
  requestAnimationFrame(()=>el.classList.add('show')); setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),300)},2600);
}

function revealObserver() {
  const nodes = [...document.querySelectorAll('[data-reveal]:not(.revealed)')];
  const obs = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');obs.unobserve(e.target)}}),{threshold:.12});
  nodes.forEach(n=>obs.observe(n));
}

renderPage();
