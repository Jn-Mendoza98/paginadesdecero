const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const indexUrl = 'file://' + path.resolve('index.html');
    await page.goto(indexUrl);

    console.log("Adding item on index...");
    await page.evaluate(() => cartApp.addItem('Item 1', 10, 'IM/ENTRADAS.png'));

    // Go to menu.html
    console.log("Navigating to menu.html...");
    await page.click('a[href="menu.html#entradas"]');
    await page.waitForTimeout(500);

    let length = await page.evaluate(() => cartApp.state.items.length);
    console.log("Cart on menu: " + length);

    // Reload page
    console.log("Reloading menu.html...");
    await page.reload();
    await page.waitForTimeout(500);

    length = await page.evaluate(() => cartApp.state.items.length);
    console.log("Cart after reload: " + length);

    await browser.close();
})();
