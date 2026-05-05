import re

html_content = """
<!-- Pizza Menu Section -->
<section id="pizzas-menu" class="py-12 bg-white border-t border-gray-100 menu-section" data-category="pizzas">
    <div class="flex items-center gap-3 mb-8">
        <i class="fas fa-pizza-slice text-primary text-2xl"></i>
        <h2 class="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-dark">Nuestras Pizzas Tradicionales</h2>
        <div class="h-1 flex-grow bg-gradient-to-r from-primary to-transparent rounded-full ml-4 opacity-20"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
"""

pizzas = [
    ("Americana", "Jamón, queso mozzarella y salsa de tomate.", 15.00, 25.00, 35.00),
    ("Hawaiana", "Jamón, piña, queso mozzarella y salsa de tomate.", 16.00, 26.00, 36.00),
    ("Pepperoni", "Pepperoni, queso mozzarella y salsa de tomate.", 17.00, 27.00, 37.00),
    ("Vegetariana", "Champiñones, pimientos, cebolla, aceitunas y mozzarella.", 18.00, 28.00, 38.00),
    ("Meat Lover", "Jamón, pepperoni, tocino, salchicha y mozzarella.", 20.00, 30.00, 42.00),
    ("Suprema", "Pepperoni, salchicha, pimientos, cebolla, champiñones y aceitunas.", 20.00, 32.00, 44.00),
    ("Margarita", "Tomate fresco, albahaca, queso mozzarella y aceite de oliva.", 16.00, 26.00, 35.00),
    ("Mexicana", "Carne molida, jalapeños, cebolla, pimientos y mozzarella.", 19.00, 29.00, 40.00),
    ("Cuatro Quesos", "Mozzarella, parmesano, provolone y queso azul.", 22.00, 32.00, 45.00),
    ("BBQ Chicken", "Pollo, cebolla roja, cilantro, queso y salsa BBQ.", 19.00, 29.00, 40.00),
    ("Italiana", "Prosciutto, rúcula, tomate cherry y parmesano.", 22.00, 34.00, 46.00),
    ("Chorizo", "Chorizo artesanal, cebolla caramelizada y mozzarella.", 18.00, 28.00, 38.00),
    ("Napolitana", "Anchoas, alcaparras, orégano, ajo y mozzarella.", 17.00, 27.00, 37.00),
    ("Prosciutto e Funghi", "Prosciutto, champiñones, mozzarella y salsa de tomate.", 20.00, 30.00, 42.00),
    ("Capricciosa", "Jamón, alcachofas, champiñones, aceitunas y mozzarella.", 21.00, 31.00, 43.00),
    ("Diavola", "Salami picante, peperoncino, mozzarella y salsa.", 19.00, 29.00, 40.00),
    ("Pollo y Champiñones", "Pollo desmenuzado, champiñones frescos y mozzarella.", 18.00, 28.00, 39.00),
    ("Bacon & Egg", "Tocino crujiente, huevo frito, cebolla y mozzarella.", 19.00, 29.00, 41.00),
    ("Pesto y Tomate", "Salsa pesto, tomates secos, pollo y queso provolone.", 20.00, 30.00, 42.00),
    ("Española", "Jamón serrano, pimientos asados, aceitunas y manchego.", 23.00, 35.00, 48.00),
    ("Mariscos", "Camarones, calamares, mejillones, ajo y perejil.", 25.00, 38.00, 50.00),
    ("Alpina", "Tocino, cebolla, papas, crema fresca y queso gruyere.", 21.00, 31.00, 44.00),
    ("Andina", "Carne seca, maíz dulce, queso andino y salsa criolla.", 20.00, 30.00, 42.00),
    ("Mediterránea", "Queso feta, aceitunas kalamata, espinaca y tomate.", 19.00, 29.00, 40.00),
    ("Gourmet", "Queso de cabra, higos, prosciutto y reducción balsámica.", 24.00, 36.00, 49.00),
    ("Rústica", "Berenjena asada, calabacín, pimientos y queso ricotta.", 18.00, 28.00, 39.00),
    ("Especial de la Casa", "Todos los ingredientes clásicos con un toque secreto.", 25.00, 35.00, 50.00)
]

for idx, (name, desc, p_price, m_price, g_price) in enumerate(pizzas, 1):
    html_content += f'''
        <!-- Pizza {idx} -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="h-48 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80" alt="{name}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <span class="text-primary font-bold text-sm"><i class="fas fa-star text-yellow-400 text-xs mr-1"></i>Top</span>
                </div>
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <h4 class="font-bold text-dark text-lg mb-2">{name}</h4>
                <p class="text-gray-500 text-sm mb-4 line-clamp-2">{desc}</p>
                <div class="mt-auto">
                    <p class="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Elige tu tamaño:</p>
                    <div class="grid grid-cols-3 gap-2">
                        <button onclick="cartApp.addItem('{name} (Personal)', {p_price:.2f})" class="flex flex-col items-center justify-center py-2 px-1 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group">
                            <span class="text-xs font-bold text-gray-700 group-hover:text-primary">P</span>
                            <span class="text-[10px] text-gray-500">S/{p_price:.2f}</span>
                        </button>
                        <button onclick="cartApp.addItem('{name} (Mediana)', {m_price:.2f})" class="flex flex-col items-center justify-center py-2 px-1 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group">
                            <span class="text-xs font-bold text-gray-700 group-hover:text-primary">M</span>
                            <span class="text-[10px] text-gray-500">S/{m_price:.2f}</span>
                        </button>
                        <button onclick="cartApp.addItem('{name} (Grande)', {g_price:.2f})" class="flex flex-col items-center justify-center py-2 px-1 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group bg-primary/5 border-primary/30">
                            <span class="text-xs font-bold text-primary">G</span>
                            <span class="text-[10px] text-primary">S/{g_price:.2f}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
'''

html_content += """
    </div>
</section>
"""

with open('menu.html', 'r', encoding='utf-8') as f:
    content = f.read()

if '<section id="pizzas-menu"' not in content:
    # Insert before calzone menu
    new_content = content.replace('<section class="py-12 bg-white border-t border-gray-100 menu-section hidden" data-category="calzone" id="calzone-menu">', html_content + '\n<section class="py-12 bg-white border-t border-gray-100 menu-section hidden" data-category="calzone" id="calzone-menu">')
    with open('menu.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully inserted pizzas-menu into menu.html")
else:
    print("pizzas-menu already exists.")
