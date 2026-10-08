const PRODUCTS = [
  {
    id: 'oversize',
    name: 'Camisa Oversize',
    price: 25,
    tag: 'Más vendida',
    colors: ['#111111', '#ffffff', '#7c5cff', '#00e0c6', '#e63946']
  },
  {
    id: 'clasica',
    name: 'Camisa Clásica',
    price: 20,
    tag: '',
    colors: ['#111111', '#ffffff', '#1d3557', '#8b5e3c']
  },
  {
    id: 'taza',
    name: 'Taza Cerámica',
    price: 12,
    tag: 'Regalo ideal',
    colors: ['#ffffff', '#111111']
  },
  {
    id: 'gorra',
    name: 'Gorra Snapback',
    price: 18,
    tag: '',
    colors: ['#111111', '#ffffff', '#7c5cff']
  }
];

const WHATSAPP_PHONE = '';
const state = {
  selectedProduct: PRODUCTS[0],
  selectedColor: PRODUCTS[0].colors[0],
  designImage: '',
  designText: '',
  textColor: '#111111',
  textSize: 36,
  size: 'M',
  cart: []
};

const elements = {
  productGrid: document.getElementById('productGrid'),
  mockupImg: document.getElementById('mockupImg'),
  mockup: document.getElementById('mockup'),
  designImg: document.getElementById('designImg'),
  designText: document.getElementById('designText'),
  swatches: document.getElementById('swatches'),
  selectedProduct: document.getElementById('selectedProduct'),
  uploadLogo: document.getElementById('uploadLogo'),
  textInput: document.getElementById('textInput'),
  textColor: document.getElementById('textColor'),
  textSize: document.getElementById('textSize'),
  sizeSelect: document.getElementById('sizeSelect'),
  priceValue: document.getElementById('priceValue'),
  addToCart: document.getElementById('addToCart'),
  whatsappBtn: document.getElementById('whatsappBtn'),
  cartBtn: document.getElementById('cartBtn'),
  cartCount: document.getElementById('cartCount'),
  cartDrawer: document.getElementById('cartDrawer'),
  closeCart: document.getElementById('closeCart'),
  cartItems: document.getElementById('cartItems'),
  cartTotal: document.getElementById('cartTotal'),
  checkoutBtn: document.getElementById('checkoutBtn'),
  overlay: document.getElementById('overlay'),
  toast: document.getElementById('toast')
};

const currency = new Intl.NumberFormat('es-VE', {
  style: 'currency',
  currency: 'USD'
});

function productArtwork(product, color) {
  const artwork = {
    taza: `<path d="M105 92h120l-12 128a18 18 0 0 1-18 16h-60a18 18 0 0 1-18-16L105 92Z" fill="${color}" stroke="#ffffff" stroke-opacity=".2" stroke-width="5"/><path d="M225 116h17a32 32 0 0 1 0 64h-23" fill="none" stroke="${color}" stroke-width="18"/>`,
    gorra: `<path d="M57 161c9-54 43-89 91-89 48 0 81 35 89 89H57Z" fill="${color}" stroke="#ffffff" stroke-opacity=".2" stroke-width="5"/><path d="M57 161h180c-12 31-44 47-89 47-45 0-77-16-91-47Z" fill="${color}" stroke="#ffffff" stroke-opacity=".2" stroke-width="5"/><path d="M148 73v87" stroke="#ffffff" stroke-opacity=".16" stroke-width="4"/>`,
    default: `<path d="m90 65 39-19h38l39 19 53 40-34 45-27-19v111H98V131l-27 19-34-45 53-40Z" fill="${color}" stroke="#ffffff" stroke-opacity=".2" stroke-width="5" stroke-linejoin="round"/>`
  };
  const shape = product.id === 'taza' ? artwork.taza : product.id === 'gorra' ? artwork.gorra : artwork.default;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 280"><defs><linearGradient id="shade" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs><ellipse cx="150" cy="240" rx="100" ry="14" fill="#000" opacity=".25"/>${shape}<path d="M0 0h300v280H0z" fill="url(#shade)" opacity=".45" pointer-events="none"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderProducts() {
  elements.productGrid.replaceChildren();
  PRODUCTS.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Personalizar ${product.name}, ${currency.format(product.price)}`);

    const thumb = document.createElement('div');
    thumb.className = 'product-thumb';
    if (product.tag) {
      const tag = document.createElement('span');
      tag.className = 'product-tag';
      tag.textContent = product.tag;
      thumb.append(tag);
    }
    const image = document.createElement('img');
    image.src = productArtwork(product, product.colors[0]);
    image.alt = product.name;
    thumb.append(image);

    const info = document.createElement('div');
    info.className = 'product-info';
    const title = document.createElement('h3');
    title.textContent = product.name;
    const price = document.createElement('span');
    price.className = 'price';
    price.textContent = currency.format(product.price);
    info.append(title, price);
    card.append(thumb, info);

    const selectProduct = () => {
      selectProductById(product.id);
      document.getElementById('configurador').scrollIntoView({ behavior: 'smooth' });
    };
    card.addEventListener('click', selectProduct);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectProduct();
      }
    });
    elements.productGrid.append(card);
  });
}

function selectProductById(id) {
  const product = PRODUCTS.find((item) => item.id === id);
  if (!product) {
    showToast('No se pudo seleccionar ese producto.');
    return;
  }
  state.selectedProduct = product;
  state.selectedColor = product.colors[0];
  elements.selectedProduct.textContent = product.name;
  renderSwatches();
  renderPreview();
  elements.priceValue.textContent = currency.format(product.price);
}

function renderSwatches() {
  elements.swatches.replaceChildren();
  state.selectedProduct.colors.forEach((color) => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = `swatch${color === state.selectedColor ? ' active' : ''}`;
    swatch.style.backgroundColor = color;
    swatch.setAttribute('aria-label', `Elegir color ${color}`);
    swatch.setAttribute('aria-pressed', String(color === state.selectedColor));
    swatch.addEventListener('click', () => {
      state.selectedColor = color;
      renderSwatches();
      renderPreview();
    });
    elements.swatches.append(swatch);
  });
}

function renderPreview() {
  elements.mockupImg.src = productArtwork(state.selectedProduct, state.selectedColor);
  elements.mockupImg.alt = state.selectedProduct.name;
  elements.designText.textContent = state.designText;
  elements.designText.style.color = state.textColor;
  elements.designText.style.fontSize = `${state.textSize}px`;
  elements.designImg.src = state.designImage;
  elements.designImg.classList.toggle('hidden', !state.designImage);
}

function renderCart() {
  elements.cartItems.replaceChildren();
  elements.cartCount.textContent = String(state.cart.length);
  elements.cartTotal.textContent = currency.format(
    state.cart.reduce((total, item) => total + item.product.price, 0)
  );

  if (state.cart.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'cart-empty';
    emptyMessage.textContent = 'Tu carrito está vacío.';
    elements.cartItems.append(emptyMessage);
    return;
  }

  state.cart.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    const info = document.createElement('div');
    info.className = 'cart-item-info';
    const title = document.createElement('h4');
    title.textContent = item.product.name;
    const details = document.createElement('span');
    const customization = item.designText ? ` · "${item.designText}"` : item.hasImage ? ' · Diseño personalizado' : '';
    details.textContent = `Talla ${item.size} · ${item.color}${customization}`;
    const price = document.createElement('span');
    price.className = 'cart-item-price';
    price.textContent = currency.format(item.product.price);
    info.append(title, details, price);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'cart-remove';
    remove.setAttribute('aria-label', `Quitar ${item.product.name} del carrito`);
    remove.textContent = '✕';
    remove.addEventListener('click', () => {
      state.cart.splice(index, 1);
      renderCart();
    });
    row.append(info, remove);
    elements.cartItems.append(row);
  });
}

function openCart() {
  elements.cartDrawer.classList.add('open');
  elements.overlay.classList.add('active');
}

function closeCart() {
  elements.cartDrawer.classList.remove('open');
  elements.overlay.classList.remove('active');
}

let toastTimer;
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove('show'), 2800);
}

function sendToWhatsApp(message) {
  const phone = WHATSAPP_PHONE.replace(/\D/g, '');
  if (!phone) {
    showToast('Configura el número de WhatsApp del negocio antes de recibir pedidos.');
    return;
  }
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

elements.textInput.addEventListener('input', () => {
  state.designText = elements.textInput.value.trim();
  renderPreview();
});
elements.textColor.addEventListener('input', () => {
  state.textColor = elements.textColor.value;
  renderPreview();
});
elements.textSize.addEventListener('input', () => {
  state.textSize = Number(elements.textSize.value);
  renderPreview();
});
elements.sizeSelect.addEventListener('change', () => {
  state.size = elements.sizeSelect.value;
});
elements.uploadLogo.addEventListener('change', () => {
  const [file] = elements.uploadLogo.files;
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Selecciona un archivo de imagen válido.');
    elements.uploadLogo.value = '';
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    if (typeof reader.result !== 'string') {
      showToast('No se pudo cargar la imagen. Inténtalo de nuevo.');
      return;
    }
    state.designImage = reader.result;
    renderPreview();
  });
  reader.addEventListener('error', () => showToast('No se pudo leer la imagen seleccionada.'));
  reader.readAsDataURL(file);
});
elements.addToCart.addEventListener('click', () => {
  state.cart.push({
    product: state.selectedProduct,
    color: state.selectedColor,
    size: state.size,
    designText: state.designText,
    hasImage: Boolean(state.designImage)
  });
  renderCart();
  showToast('Producto agregado al carrito.');
});
elements.whatsappBtn.addEventListener('click', () => {
  const details = [
    `Pedido: ${state.selectedProduct.name}`,
    `Precio: ${currency.format(state.selectedProduct.price)}`,
    `Color: ${state.selectedColor}`,
    `Talla: ${state.size}`,
    state.designText ? `Texto: ${state.designText}` : '',
    state.designImage ? 'Incluye diseño adjunto en la página.' : ''
  ].filter(Boolean);
  sendToWhatsApp(details.join('\n'));
});
elements.cartBtn.addEventListener('click', openCart);
elements.closeCart.addEventListener('click', closeCart);
elements.overlay.addEventListener('click', closeCart);
elements.checkoutBtn.addEventListener('click', () => {
  if (state.cart.length === 0) {
    showToast('Agrega un producto antes de finalizar el pedido.');
    return;
  }
  const lines = state.cart.map((item, index) =>
    `${index + 1}. ${item.product.name} — ${currency.format(item.product.price)}, talla ${item.size}, color ${item.color}`
  );
  lines.push(`Total: ${currency.format(state.cart.reduce((total, item) => total + item.product.price, 0))}`);
  sendToWhatsApp(lines.join('\n'));
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCart();
});

renderProducts();
renderSwatches();
renderPreview();
renderCart();
elements.priceValue.textContent = currency.format(state.selectedProduct.price);
