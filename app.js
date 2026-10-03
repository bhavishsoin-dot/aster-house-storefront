(() => {
  const state = { products: [], cart: read('aster-cart', []), wishlist: read('aster-wishlist', []), filter: 'all', toastTimer: null };
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
  function save() { localStorage.setItem('aster-cart', JSON.stringify(state.cart)); localStorage.setItem('aster-wishlist', JSON.stringify(state.wishlist)); }
  const product = id => state.products.find(item => item.id === id);
  const money = value => value == null ? 'Price on request' : new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
  function notify(message) { const node = $('#toast'); node.textContent = message; node.classList.add('show'); clearTimeout(state.toastTimer); state.toastTimer = setTimeout(() => node.classList.remove('show'), 2200); }
  function countCart() { return state.cart.reduce((sum,row) => sum + row.quantity, 0); }
  function renderCounts() { $('#cart-count').textContent = countCart(); $('#wish-count').textContent = state.wishlist.length; $('#drawer-count').textContent = `(${countCart()})`; }
  function card(item) {
    const saved = state.wishlist.includes(item.id);
    return `<article class="product-card"><div class="product-photo"><img src="${item.images[0]}" alt="${item.name}: ${item.descriptor}" loading="lazy"/><span class="product-label">${item.collection === 'solid' ? 'THE QUIET EDIT' : 'THE GARDEN EDIT'}</span><button class="heart-button ${saved?'saved':''}" data-wish="${item.id}" aria-label="${saved?'Remove from':'Add to'} wishlist">${saved?'♥':'♡'}</button><button class="quick-add" data-add="${item.id}">Add to bag <span>— ${money(item.price)}</span></button></div><div class="product-info"><span class="product-name">${item.name}</span><span class="product-descriptor">${item.descriptor}</span><span class="product-price">${money(item.price)}</span></div></article>`;
  }
  function renderProducts() {
    const search = new URLSearchParams(location.search).get('q')?.toLowerCase();
    let list = state.products.filter(item => state.filter === 'all' || item.collection === state.filter);
    if (search) list = list.filter(item => `${item.name} ${item.descriptor} ${item.collection} ${item.color} ${item.tags.join(' ')}`.toLowerCase().includes(search));
    const sort = $('#sort').value;
    if (sort === 'price-low') list.sort((a,b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === 'price-high') list.sort((a,b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    if (sort === 'name') list.sort((a,b) => a.name.localeCompare(b.name));
    $('#product-grid').innerHTML = list.length ? list.map(card).join('') : '<div class="empty-state">Nothing found just yet.<p>Try another search or explore all of our considered pieces.</p><button class="button button-outline" data-reset>View all pieces →</button></div>';
    $('#result-count').textContent = `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}`;
  }
  function openDrawer(id) { closeModal(); $('#overlay').classList.add('visible'); $('#'+id).classList.add('open'); $('#'+id).setAttribute('aria-hidden','false'); document.body.classList.add('locked'); }
  function closeAll() { $$('.drawer').forEach(d => { d.classList.remove('open'); d.setAttribute('aria-hidden','true'); }); $('#overlay').classList.remove('visible'); document.body.classList.remove('locked'); }
  function add(id) {
    const item = product(id); if (!item) return;
    const existing = state.cart.find(row => row.id === id);
    if (existing) existing.quantity++;
    else state.cart.push({id,quantity:1});
    save(); renderCounts(); renderCart(); notify('Added to your bag');
  }
  function renderCart() {
    const wrap = $('#cart-items');
    if (!state.cart.length) { wrap.innerHTML = '<div class="empty-state">A little room for something lovely.<p>Your bag is empty for now. Explore the collection to find your favourite.</p><a class="button button-outline" href="#shop">Discover the collection →</a></div>'; $('#cart-footer').innerHTML = ''; return; }
    wrap.innerHTML = state.cart.map(row => { const item=product(row.id); if(!item)return ''; return `<div class="drawer-row"><img src="${item.images[0]}" alt=""/><div><h3>${item.name}</h3><p>${item.descriptor}</p><strong>${money(item.price)}</strong><div class="qty"><button data-qty="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${row.quantity}</span><button data-qty="${item.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${item.id}" aria-label="Remove ${item.name}">×</button></div>`; }).join('');
    const total=state.cart.reduce((sum,row)=>sum+(product(row.id)?.price ?? 0)*row.quantity,0);
    $('#cart-footer').innerHTML=`<div class="subtotal"><span>Subtotal</span><strong>${state.cart.some(row=>product(row.id)?.price==null)?'To be confirmed':money(total)}</strong></div><a class="button button-dark checkout-link" href="#checkout">Continue to checkout <span>→</span></a><p>Shipping and final details are confirmed at checkout.</p>`;
  }
  function toggleWish(id) { state.wishlist = state.wishlist.includes(id) ? state.wishlist.filter(x=>x!==id) : [...state.wishlist,id]; save(); renderCounts(); renderProducts(); renderWishlist(); }
  function renderWishlist() {
    const items=state.wishlist.map(product).filter(Boolean);
    $('#wishlist-items').innerHTML=items.length ? items.map(item=>`<div class="drawer-row"><img src="${item.images[0]}" alt=""/><div><h3>${item.name}</h3><p>${item.descriptor}</p><strong>${money(item.price)}</strong><div class="qty"><button class="text-link" data-add="${item.id}">Move to bag →</button></div></div><button class="remove-item" data-wish="${item.id}" aria-label="Remove from wishlist">×</button></div>`).join('') : '<div class="empty-state">Keep the pieces you love close.<p>Save a favourite and come back to it whenever you like.</p><a class="button button-outline" href="#shop">Explore the collection →</a></div>';
  }
  function openSearch() { closeAll(); $('#search-modal').classList.add('open'); document.body.classList.add('locked'); setTimeout(()=>$('#search-input').focus(),100); }
  function closeModal() { $('#search-modal').classList.remove('open'); document.body.classList.remove('locked'); }
  function searchResults(value) {
    const q=value.trim().toLowerCase(); const results=q?state.products.filter(item=>`${item.name} ${item.descriptor} ${item.collection} ${item.color} ${item.tags.join(' ')}`.toLowerCase().includes(q)):[];
    $('#search-results').innerHTML=q ? (results.length?results.map(item=>`<a class="search-row" href="#shop" data-search-result><img src="${item.images[0]}" alt=""/><div><b>${item.name}</b><span>${item.descriptor} · ${money(item.price)}</span></div></a>`).join(''):'<div class="search-empty">No pieces found. Try “blue” or “floral”.</div>') : '<div class="search-empty">Try “blue”, “floral” or “printed”.</div>';
  }
  document.addEventListener('click', event => {
    const addButton=event.target.closest('[data-add]'); if(addButton){event.preventDefault();add(addButton.dataset.add);return;}
    const wishButton=event.target.closest('[data-wish]'); if(wishButton){event.preventDefault();toggleWish(wishButton.dataset.wish);return;}
    const qtyButton=event.target.closest('[data-qty]'); if(qtyButton){const row=state.cart.find(x=>x.id===qtyButton.dataset.qty);if(row){row.quantity+=Number(qtyButton.dataset.delta);if(row.quantity<1)state.cart=state.cart.filter(x=>x!==row);save();renderCounts();renderCart();}return;}
    const remove=event.target.closest('[data-remove]');if(remove){state.cart=state.cart.filter(x=>x.id!==remove.dataset.remove);save();renderCounts();renderCart();return;}
    if(event.target.closest('.cart-open')){renderCart();openDrawer('cart-drawer');return;}
    if(event.target.closest('.wishlist-open')){renderWishlist();openDrawer('wishlist-drawer');return;}
    if(event.target.closest('.close-drawer')||event.target.id==='overlay'){closeAll();return;}
    if(event.target.closest('.search-open')){openSearch();return;}
    if(event.target.closest('.modal-close')){closeModal();return;}
    if(event.target.closest('.filter-chip')){const button=event.target.closest('.filter-chip');state.filter=button.dataset.filter;$$('.filter-chip').forEach(chip=>chip.classList.toggle('active',chip===button));renderProducts();return;}
    if(event.target.closest('[data-filter]:not(.filter-chip)')){state.filter=event.target.closest('[data-filter]').dataset.filter;$$('.filter-chip').forEach(chip=>chip.classList.toggle('active',chip.dataset.filter===state.filter));renderProducts();return;}
    if(event.target.closest('[data-reset]')){state.filter='all';$$('.filter-chip').forEach(chip=>chip.classList.toggle('active',chip.dataset.filter==='all'));renderProducts();return;}
    if(event.target.closest('[data-search-result]')){closeModal();}
    if(event.target.closest('.menu-toggle')){const nav=$('.main-nav'),open=nav.classList.toggle('open');event.target.closest('.menu-toggle').setAttribute('aria-expanded',String(open));}
    if(event.target.closest('.main-nav a')){$('.main-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');}
  });
  $('#search-input').addEventListener('input',event=>searchResults(event.target.value));
  $('#sort').addEventListener('change',renderProducts);
  $('#newsletter-form').addEventListener('submit',event=>{event.preventDefault();$('#newsletter-message').textContent='Thank you for joining us. We’ll be in touch.';event.target.reset();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeAll();closeModal();$('.main-nav').classList.remove('open');}});
  window.addEventListener('scroll',()=>$('.header').classList.toggle('compact',scrollY>50),{passive:true});
  document.addEventListener('click',event=>{if(event.target.closest('.checkout-link')){event.preventDefault();notify('Checkout will be available once payment and shipping are connected.');}});
  fetch('products.json').then(response=>{if(!response.ok)throw new Error('Catalog unavailable');return response.json();}).then(items=>{state.products=items;renderProducts();renderCart();renderWishlist();renderCounts();}).catch(()=>{$('#product-grid').innerHTML='<div class="empty-state">Our collection is taking a moment to arrive.<p>Please refresh in a little while.</p></div>';});
})();
