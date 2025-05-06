# Test info

- Name: Responsive Navigation >> Mobile Viewport (375x667) >> clicking burger button toggles nav menu visibility and aria-expanded
- Location: /Users/michaelfuscoletti/Desktop/mfl/tests/e2e/navigation.spec.js:30:5

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('#mainNav')
Expected: visible
Received: hidden
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('#mainNav')
    9 × locator resolved to <nav id="mainNav" class="hidden sm:flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm uppercase tracking-wider">…</nav>
      - unexpected value "hidden"

    at /Users/michaelfuscoletti/Desktop/mfl/tests/e2e/navigation.spec.js:40:29
```

# Page snapshot

```yaml
- banner:
  - text: "[Logo]"
  - button "Toggle navigation": ☰
- main: Scoreboard Content Standings Content Transactions Content Waivers Content CTA Content
- contentinfo:
  - paragraph: © 2025 MFL League. All rights reserved.
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 |
   3 | // Path to the local HTML file. Adjust if your server setup is different.
   4 | // This assumes you run tests from the project root.
   5 | const LOCAL_HTML_FILE = 'file://' + require('path').resolve(__dirname, '../../docs/index.html');
   6 |
   7 | test.describe('Responsive Navigation', () => {
   8 |   test.beforeEach(async ({ page }) => {
   9 |     // Build the project to ensure dist/index.html is up-to-date
  10 |     // Note: In a real CI setup, the build step would typically be separate.
  11 |     const execSync = require('child_process').execSync;
  12 |     try {
  13 |       execSync('npm run build', { stdio: 'pipe' });
  14 |     } catch (e) {
  15 |       console.error("Build failed before Playwright test:", e.toString());
  16 |       throw e; // Fail test if build fails
  17 |     }
  18 |     await page.goto(LOCAL_HTML_FILE);
  19 |   });
  20 |
  21 |   test.describe('Mobile Viewport (375x667)', () => {
  22 |     test.use({ viewport: { width: 375, height: 667 } });
  23 |
  24 |     test('burger button should be visible and nav menu hidden initially', async ({ page }) => {
  25 |       await expect(page.locator('#burgerBtn')).toBeVisible();
  26 |       await expect(page.locator('#mainNav')).toBeHidden();
  27 |       await expect(page.locator('#burgerBtn')).toHaveAttribute('aria-expanded', 'false');
  28 |     });
  29 |
  30 |     test('clicking burger button toggles nav menu visibility and aria-expanded', async ({ page }) => {
  31 |       const burgerBtn = page.locator('#burgerBtn');
  32 |       const mainNav = page.locator('#mainNav');
  33 |
  34 |       // Initial state (as per previous test, but good to re-verify in context)
  35 |       await expect(mainNav).toBeHidden();
  36 |       await expect(burgerBtn).toHaveAttribute('aria-expanded', 'false');
  37 |
  38 |       // Click to open
  39 |       await burgerBtn.click();
> 40 |       await expect(mainNav).toBeVisible();
     |                             ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  41 |       await expect(mainNav).toHaveClass(/flex/); // Check for flex class
  42 |       await expect(burgerBtn).toHaveAttribute('aria-expanded', 'true');
  43 |
  44 |       // Click to close
  45 |       await burgerBtn.click();
  46 |       await expect(mainNav).toBeHidden();
  47 |       await expect(burgerBtn).toHaveAttribute('aria-expanded', 'false');
  48 |     });
  49 |     
  50 |     test('nav items should stack vertically when visible', async ({ page }) => {
  51 |       const burgerBtn = page.locator('#burgerBtn');
  52 |       const mainNav = page.locator('#mainNav');
  53 |       await burgerBtn.click(); // Open the nav
  54 |       await expect(mainNav).toHaveClass(/flex-col/);
  55 |     });
  56 |   });
  57 |
  58 |   test.describe('Desktop Viewport (1280x720)', () => {
  59 |     test.use({ viewport: { width: 1280, height: 720 } });
  60 |
  61 |     test('burger button should be hidden', async ({ page }) => {
  62 |       await expect(page.locator('#burgerBtn')).toBeHidden();
  63 |     });
  64 |
  65 |     test('nav menu should be visible and flex-row by default', async ({ page }) => {
  66 |       const mainNav = page.locator('#mainNav');
  67 |       await expect(mainNav).toBeVisible();
  68 |       await expect(mainNav).toHaveClass(/sm:flex-row/);
  69 |       await expect(mainNav).toHaveClass(/flex/); // It should have base flex
  70 |     });
  71 |   });
  72 |   
  73 |   test('active link highlighting on hash change', async ({ page }) => {
  74 |     const scoreboardLink = page.locator('#mainNav a[href="#scoreboard"]');
  75 |     const standingsLink = page.locator('#mainNav a[href="#standings"]');
  76 |     const transactionsLink = page.locator('#mainNav a[href="#transactions"]');
  77 |
  78 |     const accentColor = 'rgb(50, 227, 192)'; // #32e3c0
  79 |     const textColor = 'rgb(227, 231, 238)'; // #e3e7ee
  80 |
  81 |     // Check initial state (no hash, scoreboard is first, should not be accent)
  82 |     await expect(scoreboardLink).toHaveCSS('color', textColor);
  83 |
  84 |     // Navigate by hash to #standings
  85 |     await page.goto(`${LOCAL_HTML_FILE}#standings`);
  86 |     // Force a direct call to setActiveLink for more deterministic testing after navigation
  87 |     await page.evaluate(() => window.testingHooks.setActiveLink());
  88 |     await expect(standingsLink).toHaveCSS('color', accentColor);
  89 |     await expect(scoreboardLink).toHaveCSS('color', textColor);
  90 |
  91 |     // Change hash again to #transactions
  92 |     await page.evaluate(() => { window.location.hash = '#transactions'; });
  93 |     // Wait for the hashchange event to be processed and link to be updated by the script
  94 |     await page.waitForFunction(() => document.querySelector('a[href="#transactions"]').style.color === 'rgb(50, 227, 192)' || getComputedStyle(document.querySelector('a[href="#transactions"]')).color === 'rgb(50, 227, 192)');
  95 |     
  96 |     await expect(transactionsLink).toHaveCSS('color', accentColor);
  97 |     await expect(standingsLink).toHaveCSS('color', textColor);
  98 |   });
  99 | }); 
```