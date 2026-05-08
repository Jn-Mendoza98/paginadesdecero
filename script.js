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
                // If it's a link to #category or menu.html#category
                e.preventDefault();
                // Update URL hash without reloading
                window.history.pushState(null, null, `#${category}`);
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
            // Check if page was reloaded
            const isReload = (window.performance && window.performance.navigation && window.performance.navigation.type === 1) ||
                             (window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType("navigation").length > 0 && window.performance.getEntriesByType("navigation")[0].type === "reload");

            if (isReload) {
                // Clear cart on reload
                localStorage.removeItem('chezMaggyCart');
                this.state.items = [];
            } else {
                const savedItems = localStorage.getItem('chezMaggyCart');
                if (savedItems) {
                    this.state.items = JSON.parse(savedItems);
                }
            }
        } catch (e) {
            console.error('Error loading cart from localStorage', e);
        }
    },

    saveCart() {
        try {
            localStorage.setItem('chezMaggyCart', JSON.stringify(this.state.items));
        } catch (e) {
            console.error('Error saving cart to localStorage', e);
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
        type: 'vegetariano', // tradicional, vegetariano, amigusto
        qty: 1,
        basePrice: 26.90,
        aceituna: 'mixtas', // negras, verdes, mixtas
        ingredients: [] // max 6
    },

    prices: {
        tradicional: 24.90,
        vegetariano: 26.90,
        amigusto: 28.90 // A Mi Gusto base price
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

// --- Pizza Search Logic ---
function initPizzaSearch() {
    const searchInput = document.getElementById('pizza-search-input');
    const searchBtn = document.getElementById('pizza-search-btn');
    const pizzaGrid = document.getElementById('pizza-grid');

    if (!searchInput || !pizzaGrid) return;

    const pizzaCards = Array.from(pizzaGrid.children);

    function filterPizzas() {
        const query = searchInput.value.toLowerCase().trim();

        pizzaCards.forEach(card => {
            const titleEl = card.querySelector('h4');
            const descEl = card.querySelector('p.line-clamp-2');

            const title = titleEl ? titleEl.innerText.toLowerCase() : '';
            const desc = descEl ? descEl.innerText.toLowerCase() : '';

            if (title.includes(query) || desc.includes(query)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    searchInput.addEventListener('input', filterPizzas);
    if (searchBtn) {
        searchBtn.addEventListener('click', filterPizzas);
    }
}

// Initialize apps when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    cartApp.init();
    calzoneApp.init();
    bindGridAddButtons();
    initPizzaSearch();
});
