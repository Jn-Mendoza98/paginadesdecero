#!/bin/bash
sed -i 's/class="size-btn flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 relative border-2 border-transparent w-full bg-gradient-to-br from-primary to-red-700 shadow-\[0_4px_12px_rgba(230,33,23,0.3)\] text-white scale-\[1.02\]"/class="size-btn flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 relative border-2 border-transparent w-full bg-gray-50 text-gray-500 hover:bg-gray-100"/g' menu.html

# Fix all add buttons except vegetariana (4) to alert if no size selected
sed -i -E "s/id=\"add-btn-([0-9]+)\" onclick=\"cartApp.addItem[^\"]+\"/id=\"add-btn-\1\" onclick=\"alert('Seleccione un tamaño antes de agregar al carrito')\"/g" menu.html

# Fix vegetariana button to alert if no size selected initially
sed -i 's/id="add-btn-4" onclick="vegApp.addToCart()"/id="add-btn-4" onclick="alert('"'"'Seleccione un tamaño antes de agregar al carrito'"'"')"/g' menu.html

# Fix script.js
sed -i "s/currentCall: \"cartApp.addItem('Vegetariana (Personal)', 18.00, 'https:\/\/images.unsplash.com\/photo-1513104890138-7c749659a591?auto=format\&fit=crop\&w=600\&q=80')\"/currentCall: \"\"/g" script.js

sed -i 's/togglePanel() {/togglePanel() {\n        if (!this.state.currentCall) {\n            alert("Seleccione un tamaño antes de personalizar los ingredientes");\n            return;\n        }/g' script.js

sed -i '128s/addToCart() {/addToCart() {\n        if (!this.state.currentCall) {\n            alert("Seleccione un tamaño antes de agregar al carrito");\n            return;\n        }/g' script.js

# Fix menu.html JS
sed -i "s/if (window.vegApp) {/if (typeof vegApp !== 'undefined') {/g" menu.html
sed -i "s/window.vegApp.updateLimit/vegApp.updateLimit/g" menu.html
sed -i '1706a\                addBtn.setAttribute("onclick", "vegApp.addToCart()");' menu.html
