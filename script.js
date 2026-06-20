// Tailwind configuration and other custom JS
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#E62117', // Red from the logo/buttons
                dark: '#111111',
                darker: '#0a0a0a',
                light: '#F8F8F8'
            },
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
                serif: ['Playfair Display', 'serif'] // For some headings if needed
            }
        }
    }
}

// Dynamic Menu Filtering

// --- Vegetariana App Logic ---
const vegApp = {
    state: {
        isOpen: false,
        limit: 4,
        selected: [],
        currentCall: ""
    },

    // Using the same ingredients as calzoneApp
    ingredients: [
        { id: 'v-aceitunas-n', name: 'Aceitunas Negras', emoji: '🫒' },
        { id: 'v-aceitunas-v', name: 'Aceitunas Verdes', emoji: '🍈' },
        { id: 'v-aji', name: 'Ají', emoji: '🌶️' },
        { id: 'v-albahaca', name: 'Albahaca', emoji: '🌿' },
        { id: 'v-cabanossi', name: 'Cabanossi', emoji: '🌭' },
        { id: 'v-cebolla', name: 'Cebolla', emoji: '🧅' },
        { id: 'v-cecina', name: 'Cecina', emoji: '🥩' },
        { id: 'v-champinones', name: 'Champiñones', emoji: '🍄' },
        { id: 'v-chorizo', name: 'Chorizo', emoji: '🌭' },
        { id: 'v-durazno', name: 'Durazno', emoji: '🍑' },
        { id: 'v-esparrago', name: 'Espárrago', emoji: '🥬' },
        { id: 'v-jamon', name: 'Jamón', emoji: '🍖' },
        { id: 'v-papaya', name: 'Papaya', emoji: '🥭' },
        { id: 'v-pepperoni', name: 'Pepperoni', emoji: '🍕' },
        { id: 'v-pimiento', name: 'Pimiento', emoji: '🫑' },
        { id: 'v-pina', name: 'Piña', emoji: '🍍' },
        { id: 'v-platano', name: 'Plátano', emoji: '🍌' },
        { id: 'v-pollo', name: 'Pollo', emoji: '🍗' },
        { id: 'v-salame', name: 'Salame', emoji: '🍖' },
        { id: 'v-salchicha', name: 'Salchicha', emoji: '🌭' },
        { id: 'v-tocino', name: 'Tocino', emoji: '🥓' },
        { id: 'v-tomate', name: 'Tomate en rodajas', emoji: '🍅' }
    ],

    init() {
        const grid = document.getElementById('veg-ingredients-grid');
        if (!grid) return;

        grid.innerHTML = this.ingredients.map(ing => `
            <button onclick="vegApp.toggleIngredient('${ing.id}')" id="veg-ing-${ing.id}" class="bg-white border border-gray-200 rounded-md p-1.5 flex flex-col items-center justify-center gap-1 hover:border-primary transition relative h-16 w-full">
                <div id="veg-check-${ing.id}" class="hidden absolute top-0.5 right-0.5 text-primary text-[10px]"><i class="fas fa-check-circle"></i></div>
                <div class="text-xl leading-none">${ing.emoji}</div>
                <span class="text-[8px] text-center leading-tight mt-0.5 text-gray-600 line-clamp-2">${ing.name}</span>
            </button>
        `).join('');
    },

    togglePanel() {
        if (!this.state.currentCall) {
            alert("Seleccione un tamaño antes de personalizar los ingredientes");
            return;
        }
        this.state.isOpen = !this.state.isOpen;
        const panel = document.getElementById('veg-panel');
        if (panel) {
            panel.classList.toggle('hidden', !this.state.isOpen);
        }
    },

    updateLimit(limit, callCode) {
        this.state.limit = limit;
        this.state.currentCall = callCode;

        // If they switch size and have more selected than allowed, trim the array
        if (this.state.selected.length > limit) {
            this.state.selected = this.state.selected.slice(0, limit);
        }

        this.updateUI();
    },

    toggleIngredient(id) {
        const idx = this.state.selected.indexOf(id);
        if (idx > -1) {
            this.state.selected.splice(idx, 1);
        } else {
            if (this.state.selected.length < this.state.limit) {
                this.state.selected.push(id);
            } else {
                // Optionally show a toast/alert that limit is reached
                alert(`Solo puedes escoger hasta ${this.state.limit} ingredientes en este tamaño.`);
            }
        }
        this.updateUI();
    },

    updateUI() {
        const limitText = document.getElementById('veg-limit-text');
        const countText = document.getElementById('veg-count');

        if (limitText) limitText.innerText = `Elige hasta ${this.state.limit} ingredientes`;
        if (countText) countText.innerText = this.state.selected.length;

        this.ingredients.forEach(ing => {
            const btn = document.getElementById(`veg-ing-${ing.id}`);
            const check = document.getElementById(`veg-check-${ing.id}`);
            if(!btn || !check) return;

            if (this.state.selected.includes(ing.id)) {
                btn.classList.add('border-primary', 'bg-red-50');
                btn.classList.remove('border-gray-200', 'bg-white');
                check.classList.remove('hidden');
            } else {
                btn.classList.remove('border-primary', 'bg-red-50');
                btn.classList.add('border-gray-200', 'bg-white');
                check.classList.add('hidden');
            }
        });
    },

    addToCart() {
        if (!this.state.currentCall) {
            alert("Seleccione un tamaño antes de agregar al carrito");
            return;
        }
        // We need to execute the currentCall but override the description.
        // currentCall is something like: cartApp.addItem('Vegetariana (Personal)', 18.00, 'https://...')

        // Parse it
        const match = this.state.currentCall.match(/cartApp\.addItem\('([^']+)',\s*([\d.]+),\s*'([^']+)'\)/);
        if (!match) return;

        const name = match[1];
        const price = match[2];
        const img = match[3];

        let desc = 'Ingredientes predeterminados';
        if (this.state.selected.length > 0) {
            const names = this.state.selected.map(id => this.ingredients.find(i => i.id === id).name);
            desc = "Ingredientes elegidos: " + names.join(', ');
        }

        // Use cartApp to add
        cartApp.addItem(name, price, img, desc);

        // Close panel and reset optional
        this.state.isOpen = false;
        const panel = document.getElementById('veg-panel');
        if (panel) panel.classList.add('hidden');

        this.state.selected = [];
        this.updateUI();
    }
};

// Make sure to initialize vegApp
document.addEventListener('DOMContentLoaded', () => {
    const isMenuPage = window.location.pathname.includes('menu.html');
    const menuSections = document.querySelectorAll('.menu-section');
    const categoryLinks = document.querySelectorAll('a[data-category]');

    // Function to filter sections based on category string
    function filterCategory(category) {
        if (!isMenuPage || !menuSections.length) return;

        let found = false;
        menuSections.forEach(section => {
            if (section.dataset.category === category || category === 'all') {
                section.classList.remove('hidden');
                found = true;
            } else {
                section.classList.add('hidden');
            }
        });

        // Optional: If a category was requested but doesn't exist yet, we could show all or a message
        // For now, if nothing matches, maybe just show everything
        if (!found && category !== 'all') {
            // Un-hide everything just in case
            menuSections.forEach(sec => sec.classList.remove('hidden'));
        }
    }

    // Handle clicks on data-category links
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // If we are on the menu page and the link points to the menu page hash
            const category = link.getAttribute('data-category');

            if (isMenuPage) {
                e.preventDefault();
                // Change hash to naturally trigger hashchange event without reloading
                window.location.hash = category;
                filterCategory(category);
            }
            // If on index.html, let the default behavior navigate to menu.html#category
        });
    });

    // Handle initial load on menu.html
    if (isMenuPage) {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            filterCategory(hash);
        } else {
            // Default to showing all if no hash
            filterCategory('all');
        }

        // Handle browser back/forward buttons
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.replace('#', '');
            filterCategory(newHash || 'all');
        });
    }
});

// --- Cart Logic ---
const cartApp = {
    state: {
        items: [],
        isOpen: false
    },

    init() {
        this.loadCart();
        this.updateBadge();
        this.renderCart();
    },

    loadCart() {
        try {
            // Use pathname + search to avoid false matches, but EXCLUDE hash to not mistake hash changes for navigation.
            const currentUrl = window.location.pathname + window.location.search;
            const lastUrl = sessionStorage.getItem('chezMaggyLastUrl');
            let isManualReload = false;

            if (lastUrl === currentUrl) {
                const navType = window.performance && window.performance.navigation ? window.performance.navigation.type : 0;
                const navEntry = window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType("navigation").length > 0 ? window.performance.getEntriesByType("navigation")[0].type : '';
                if (navType === 1 || navEntry === "reload") {
                    isManualReload = true;
                }
            }
            sessionStorage.setItem('chezMaggyLastUrl', currentUrl);

            if (isManualReload) {
                // Clear cart on manual reload
                sessionStorage.removeItem('chezMaggyCart');
                this.state.items = [];
            } else {
                const savedItems = sessionStorage.getItem('chezMaggyCart');
                if (savedItems) {
                    this.state.items = JSON.parse(savedItems);
                }
            }
        } catch (e) {
            console.error('Error loading cart from sessionStorage', e);
        }
    },

    saveCart() {
        try {
            sessionStorage.setItem('chezMaggyCart', JSON.stringify(this.state.items));
        } catch (e) {
            console.error('Error saving cart to sessionStorage', e);
        }
    },

    toggleModal() {
        const modal = document.getElementById('cart-modal');
        if (!modal) return;
        this.state.isOpen = !this.state.isOpen;
        modal.classList.toggle('hidden', !this.state.isOpen);
    },

    addItem(name, price, imageSrc, desc = '') {
        // Check if item exists (match by both name and exact description)
        const existing = this.state.items.find(i => i.name === name && i.desc === desc);
        if (existing) {
            existing.qty += 1;
        } else {
            this.state.items.push({
                id: Date.now().toString(),
                name,
                price: parseFloat(price),
                imageSrc,
                desc,
                qty: 1
            });
        }
        this.saveCart();
        this.updateBadge();
        this.renderCart();

        // Show subtle feedback (optional, we'll just update the UI)
    },

    updateBadge() {
        const badge = document.getElementById('cart-badge');
        if (!badge) return;

        const totalItems = this.state.items.reduce((sum, item) => sum + item.qty, 0);
        badge.innerText = totalItems;

        if (totalItems > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    },

    renderCart() {
        const container = document.getElementById('cart-items-container');
        const emptyState = document.getElementById('cart-empty-state');
        const totalEl = document.getElementById('cart-total-price');

        if (!container || !emptyState || !totalEl) return;

        if (this.state.items.length === 0) {
            container.innerHTML = '';
            container.classList.add('hidden');
            emptyState.classList.remove('hidden');
            totalEl.innerText = 'S/ 0.00';
            return;
        }

        container.classList.remove('hidden');
        emptyState.classList.add('hidden');

        let html = '';
        let total = 0;

        this.state.items.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            const descHtml = item.desc ? `<div class="text-[10px] sm:text-xs text-gray-500 mt-0.5 line-clamp-2 leading-tight">${item.desc}</div>` : '';
            html += `
                <div class="bg-[#f8f9fa] rounded-xl p-3 flex items-center gap-4 border border-gray-100">
                    <div class="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <img src="${item.imageSrc}" alt="${item.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-grow min-w-0">
                        <h4 class="font-bold text-gray-800 text-sm truncate">${item.name}</h4>
                        ${descHtml}
                        <div class="text-xs text-gray-400 mt-0.5 truncate">S/ ${item.price.toFixed(2)} x ${item.qty}</div>
                    </div>
                    <div class="font-bold text-gray-800 whitespace-nowrap">S/ ${itemTotal.toFixed(2)}</div>
                </div>
            `;
        });

        container.innerHTML = html;
        totalEl.innerText = `S/ ${total.toFixed(2)}`;
    }
};

// Bind existing menu '+' buttons
function bindGridAddButtons() {
    const gridItems = document.querySelectorAll('.grid > div');
    gridItems.forEach(item => {
        const addBtn = item.querySelector('button');
        if (addBtn && !addBtn.hasAttribute('onclick')) {
            addBtn.addEventListener('click', () => {
                const name = item.querySelector('h4').innerText;
                const priceStr = item.querySelector('.text-primary.font-bold').innerText;
                const price = priceStr.replace('S/ ', '').trim();
                const img = item.querySelector('img').src;

                cartApp.addItem(name, price, img);
            });
        }
    });
}


// --- Calzone App Logic ---
const calzoneApp = {
    state: {
        type: 'tradicional', // tradicional, vegetariano, amigusto
        qty: 1,
        basePrice: 31.00,
        aceituna: null, // negras, verdes, mixtas, null
        ingredients: [] // max 6
    },

    prices: {
        tradicional: 31.00,
        vegetariano: 30.00,
        amigusto: 31.00 // A Mi Gusto base price
    },

    ingList: [
        { id: 'aceitunas-n', name: 'Aceitunas Negras', emoji: '🫒' },
        { id: 'aceitunas-v', name: 'Aceitunas Verdes', emoji: '🍈' },
        { id: 'aji', name: 'Ají', emoji: '🌶️' },
        { id: 'albahaca', name: 'Albahaca', emoji: '🌿' },
        { id: 'cabanossi', name: 'Cabanossi', emoji: '🌭' },
        { id: 'cebolla', name: 'Cebolla', emoji: '🧅' },
        { id: 'cecina', name: 'Cecina', emoji: '🥩' },
        { id: 'champinones', name: 'Champiñones', emoji: '🍄' },
        { id: 'chorizo', name: 'Chorizo', emoji: '🌭' },
        { id: 'durazno', name: 'Durazno', emoji: '🍑' },
        { id: 'esparrago', name: 'Espárrago', emoji: '🥬' },
        { id: 'jamon', name: 'Jamón', emoji: '🍖' },
        { id: 'papaya', name: 'Papaya', emoji: '🥭' },
        { id: 'pepperoni', name: 'Pepperoni', emoji: '🍕' },
        { id: 'pimiento', name: 'Pimiento', emoji: '🫑' },
        { id: 'pina', name: 'Piña', emoji: '🍍' },
        { id: 'platano', name: 'Plátano', emoji: '🍌' },
        { id: 'pollo', name: 'Pollo', emoji: '🍗' },
        { id: 'salame', name: 'Salame', emoji: '🍖' },
        { id: 'salchicha', name: 'Salchicha', emoji: '🌭' },
        { id: 'tocino', name: 'Tocino', emoji: '🥓' },
        { id: 'tomate', name: 'Tomate en rodajas', emoji: '🍅' }
    ],

    init() {
        // Only run if calzone section exists
        if (!document.getElementById('calzone-menu')) return;

        this.renderIngredients();
        this.updateUI();
    },

    selectType(type) {
        this.state.type = type;
        this.state.qty = 1;
        this.state.ingredients = [];
        this.state.aceituna = null;
        this.state.basePrice = this.prices[type];
        this.updateUI();
    },

    updateQty(change) {
        if (this.state.qty + change > 0) {
            this.state.qty += change;
            this.updateUI();
        }
    },

    selectAceituna(type) {
        this.state.aceituna = type;
        this.updateUI();
    },

    toggleIngredient(id) {
        const idx = this.state.ingredients.indexOf(id);
        if (idx > -1) {
            this.state.ingredients.splice(idx, 1);
        } else {
            if (this.state.ingredients.length < 6) {
                this.state.ingredients.push(id);
            }
        }
        this.updateUI();
    },

    renderIngredients() {
        const grid = document.getElementById('calzone-ingredients-grid');
        if(!grid) return;

        grid.innerHTML = this.ingList.map(ing => `
            <button onclick="calzoneApp.toggleIngredient('${ing.id}')" id="calzone-ing-${ing.id}" class="bg-white border border-gray-200 rounded-lg p-2 flex flex-col items-center justify-center gap-1 hover:border-primary transition relative h-20">
                <div id="calzone-check-${ing.id}" class="hidden absolute top-1 right-1 text-primary text-xs"><i class="fas fa-check-circle"></i></div>
                <div id="calzone-circle-${ing.id}" class="absolute top-1 right-1 text-gray-200 text-xs"><i class="far fa-circle"></i></div>
                <div class="text-2xl">${ing.emoji}</div>
                <span class="text-[9px] text-center leading-tight mt-1 text-gray-600">${ing.name}</span>
            </button>
        `).join('');
    },

    updateUI() {
        // Update Tabs
        ['tradicional', 'vegetariano', 'amigusto'].forEach(t => {
            const btn = document.getElementById(`calzone-tab-${t}`);
            if(!btn) return;
            if (t === this.state.type) {
                btn.classList.add('bg-primary', 'text-white');
                btn.classList.remove('bg-white', 'text-gray-600', 'hover:bg-red-50');
                btn.querySelector('.opacity-80')?.classList.replace('opacity-80', 'opacity-90');
            } else {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-white', 'text-gray-600', 'hover:bg-red-50');
                btn.querySelector('.opacity-90')?.classList.replace('opacity-90', 'opacity-80');
            }
        });

        // Update Sections visibility
        const sTrad = document.getElementById('calzone-section-tradicional');
        const sVeg = document.getElementById('calzone-section-vegetariano');
        const sAmi = document.getElementById('calzone-section-amigusto');

        if(sTrad) sTrad.classList.toggle('hidden', this.state.type !== 'tradicional');
        if(sVeg) sVeg.classList.toggle('hidden', this.state.type !== 'vegetariano');
        if(sAmi) sAmi.classList.toggle('hidden', this.state.type !== 'amigusto');

        // Update Hero
        const titles = {
            tradicional: 'CALZONE<br>TRADICIONAL',
            vegetariano: 'CALZONE<br>VEGETARIANO',
            amigusto: 'CALZONE<br>A MI GUSTO'
        };
        const descs = {
            tradicional: 'Clásico relleno de jamón, queso mozzarella y champiñones con salsa pomodoro.',
            vegetariano: 'Relleno de vegetales frescos, queso mozzarella y nuestra salsa de la casa.',
            amigusto: 'Tú eliges los ingredientes y creamos tu calzone perfecto.'
        };

        const hTitle = document.getElementById('calzone-hero-title');
        const hDesc = document.getElementById('calzone-hero-desc');
        if(hTitle) hTitle.innerHTML = titles[this.state.type];
        if(hDesc) hDesc.innerHTML = descs[this.state.type];

        // Update Aceitunas Selection
        if (this.state.type === 'vegetariano') {
            ['negras', 'verdes', 'mixtas'].forEach(a => {
                const btn = document.getElementById(`calzone-opt-${a}`);
                const check = document.getElementById(`calzone-check-${a}`);
                if(!btn || !check) return;

                if (a === this.state.aceituna) {
                    btn.classList.add('border-primary');
                    btn.classList.remove('border-gray-200');
                    check.classList.remove('hidden');
                } else {
                    btn.classList.remove('border-primary');
                    btn.classList.add('border-gray-200');
                    check.classList.add('hidden');
                }
            });
        }

        // Update Ingredients Selection
        if (this.state.type === 'amigusto') {
            const counter = document.getElementById('calzone-ing-counter');
            if(counter) counter.innerText = this.state.ingredients.length;

            this.ingList.forEach(ing => {
                const btn = document.getElementById(`calzone-ing-${ing.id}`);
                const check = document.getElementById(`calzone-check-${ing.id}`);
                const circle = document.getElementById(`calzone-circle-${ing.id}`);
                if(!btn || !check || !circle) return;

                if (this.state.ingredients.includes(ing.id)) {
                    btn.classList.add('border-primary', 'bg-red-50');
                    btn.classList.remove('border-gray-200', 'bg-white');
                    check.classList.remove('hidden');
                    circle.classList.add('hidden');
                } else {
                    btn.classList.remove('border-primary', 'bg-red-50');
                    btn.classList.add('border-gray-200', 'bg-white');
                    check.classList.add('hidden');
                    circle.classList.remove('hidden');
                }
            });
        }

        // Update Summary
        const titleMap = { tradicional: 'Tradicional', vegetariano: 'Vegetariano', amigusto: 'A Mi Gusto' };
        const sTitle = document.getElementById('calzone-summary-title');
        if(sTitle) sTitle.innerText = `Calzone: ${titleMap[this.state.type]}`;

        let details = '';
        if (this.state.type === 'vegetariano') {
            const aName = this.state.aceituna.charAt(0).toUpperCase() + this.state.aceituna.slice(1);
            details = `Aceitunas: ${aName}`;
        } else if (this.state.type === 'amigusto') {
            details = `Ingredientes: ${this.state.ingredients.length}/6`;
        } else {
            details = 'Clásico';
        }

        const sDetails = document.getElementById('calzone-summary-details');
        if(sDetails) sDetails.innerText = details;

        const qVal = document.getElementById('calzone-qty-val');
        if(qVal) qVal.innerText = this.state.qty;

        // Price Calculation
        let base = this.prices[this.state.type];
        let total = base * this.state.qty;

        const priceStr = `S/ ${total.toFixed(2)}`;
        const sPrice = document.getElementById('calzone-summary-price');
        const bPrice = document.getElementById('calzone-btn-price');

        if(sPrice) sPrice.innerHTML = `<span class="text-sm sm:text-base">S/</span><span>${total.toFixed(2)}</span>`;
        if(bPrice) bPrice.innerText = priceStr;
    },

    addToCart() {
        const titleMap = { tradicional: 'Tradicional', vegetariano: 'Vegetariano', amigusto: 'A Mi Gusto' };
        const name = `Calzone ${titleMap[this.state.type]}`;
        const price = this.prices[this.state.type];
        const img = 'IM/CAL.jpg';

        let desc = '';
        if (this.state.type === 'vegetariano') {
            if (!this.state.aceituna) {
                alert('Por favor selecciona el tipo de aceituna.');
                return;
            }
            const aName = this.state.aceituna.charAt(0).toUpperCase() + this.state.aceituna.slice(1);
            desc = `Aceitunas: ${aName}`;
        } else if (this.state.type === 'amigusto') {
            if (this.state.ingredients.length > 0) {
                const ingNames = this.state.ingredients.map(id => {
                    const found = this.ingList.find(ing => ing.id === id);
                    return found ? found.name : id;
                });
                desc = ingNames.join(', ');
            } else {
                desc = 'Sin ingredientes adicionales';
            }
        }

        // Add the current quantity of calzones to the cart
        for(let i=0; i < this.state.qty; i++) {
            cartApp.addItem(name, price, img, desc);
        }

        // Reset quantity back to 1 after adding
        this.state.qty = 1;
        this.updateUI();
    }
};

// Initialize apps when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    cartApp.init();
    calzoneApp.init();
    vegApp.init();
    bebidasApp.init();
    bindGridAddButtons();

    // Mobile menu toggle logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when a link inside it is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
});

// Handle Back-Forward Cache (bfcache) navigation
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // The page was restored from the bfcache (e.g., user swiped back).
        // The DOMContentLoaded event is NOT fired in this case, so we need to
        // explicitly sync the UI with the latest state from sessionStorage.
        console.log('Page restored from bfcache, syncing cart...');
        cartApp.loadCart();
        cartApp.updateBadge();
        cartApp.renderCart();
    }
});

const bebidasApp = {
    state: {
        marca: 'Inca Kola', // Inca Kola, Coca-Cola, Fanta
        tamano: '1 1/2 Litros', // 1 1/2 Litros, 1/2 Litro
        temperatura: 'Helada', // Helada, Sin helar
        qty: 1
    },

    prices: {
        '1 1/2 Litros': 12.00,
        '1/2 Litro': 5.00
    },

    images: {
        'Inca Kola': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
        'Coca-Cola': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
        'Fanta': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80'
    },

    init() {
        this.updateUI();
    },

    selectMarca(marca) {
        this.state.marca = marca;
        this.updateUI();
    },

    selectTamano(tamano) {
        this.state.tamano = tamano;
        this.updateUI();
    },

    selectTemperatura(temperatura) {
        this.state.temperatura = temperatura;
        this.updateUI();
    },

    updateUI() {
        const pPrice = document.getElementById('bebidas-price');
        const pTitle = document.getElementById('bebidas-title');

        if (pPrice && pTitle) {
            pPrice.innerText = 'S/ ' + this.prices[this.state.tamano].toFixed(2);
            pTitle.innerText = `${this.state.marca} (${this.state.tamano}) - ${this.state.temperatura}`;
        }

        // Update selected states of buttons
        ['Inca Kola', 'Coca-Cola', 'Fanta'].forEach(m => {
            const btn = document.getElementById(`bebidas-marca-${m.replace(/ /g, '-')}`);
            if (btn) {
                if (m === this.state.marca) {
                    btn.classList.add('border-primary', 'bg-primary/5');
                    btn.classList.remove('border-gray-200');
                } else {
                    btn.classList.remove('border-primary', 'bg-primary/5');
                    btn.classList.add('border-gray-200');
                }
            }
        });

        ['1 1/2 Litros', '1/2 Litro'].forEach(t => {
            const btn = document.getElementById(`bebidas-tamano-${t.replace(/[\/ ]/g, '-')}`);
            if (btn) {
                if (t === this.state.tamano) {
                    btn.classList.add('border-primary', 'bg-primary/5');
                    btn.classList.remove('border-gray-200');
                } else {
                    btn.classList.remove('border-primary', 'bg-primary/5');
                    btn.classList.add('border-gray-200');
                }
            }
        });

        ['Helada', 'Sin helar'].forEach(temp => {
            const btn = document.getElementById(`bebidas-temp-${temp.replace(/ /g, '-')}`);
            if (btn) {
                if (temp === this.state.temperatura) {
                    btn.classList.add('border-primary', 'bg-primary/5');
                    btn.classList.remove('border-gray-200');
                } else {
                    btn.classList.remove('border-primary', 'bg-primary/5');
                    btn.classList.add('border-gray-200');
                }
            }
        });
    },

    addToCart() {
        const name = `${this.state.marca} ${this.state.tamano}`;
        const price = this.prices[this.state.tamano];
        const img = this.images[this.state.marca] || 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80';
        const desc = `Temp: ${this.state.temperatura}`;

        cartApp.addItem(name, price, img, desc, document.getElementById('add-bebida-btn'));
    }
};
