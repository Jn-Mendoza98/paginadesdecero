const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const indexUrl = 'file://' + path.resolve('index.html');
    await page.goto(indexUrl);

    // Go to menu.html
    console.log("Navigating to menu.html...");
    await page.click('a[href="menu.html#entradas"]');
    await page.waitForTimeout(500);

    // Add item
    console.log("Adding item...");
    await page.evaluate(() => cartApp.addItem('Item 1', 10, 'IM/ENTRADAS.png'));

    let length = await page.evaluate(() => cartApp.state.items.length);
    console.log("Cart on menu: " + length);

    // Go back
    console.log("Navigating Back...");
    await page.goBack();
    await page.waitForTimeout(500);

    length = await page.evaluate(() => cartApp.state.items.length);
    console.log("Cart on index: " + length);

    // Go back to menu (by clicking link again)
    console.log("Clicking menu link again...");
    await page.click('a[href="menu.html#entradas"]');
    await page.waitForTimeout(500);

    length = await page.evaluate(() => cartApp.state.items.length);
    let isReload = await page.evaluate(() => {
        return (window.performance && window.performance.navigation && window.performance.navigation.type === 1) ||
               (window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType("navigation").length > 0 && window.performance.getEntriesByType("navigation")[0].type === "reload");
    });
    console.log("Cart on menu after returning: " + length);
    console.log("isReload variable is: " + isReload);

    await browser.close();
})();
