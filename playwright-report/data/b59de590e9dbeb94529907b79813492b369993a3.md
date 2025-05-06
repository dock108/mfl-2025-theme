# Test info

- Name: Responsive Navigation >> active link highlighting on hash change
- Location: /Users/michaelfuscoletti/Desktop/mfl/tests/e2e/navigation.spec.js:73:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).not.toHaveClass(expected)

Locator: locator('#mainNav a[href="#scoreboard"]')
Expected pattern: not /text-accent/
Received string: "text-text hover:text-accent p-2"
Call log:
  - expect.not.toHaveClass with timeout 5000ms
  - waiting for locator('#mainNav a[href="#scoreboard"]')
    8 × locator resolved to <a href="#scoreboard" class="text-text hover:text-accent p-2">Scoreboard</a>
      - unexpected value "text-text hover:text-accent p-2"

    at /Users/michaelfuscoletti/Desktop/mfl/tests/e2e/navigation.spec.js:84:38
```

# Page snapshot

```yaml
- banner:
  - text: "[Logo]"
  - navigation:
    - list:
      - listitem:
        - link "Scoreboard":
          - /url: "#scoreboard"
      - listitem:
        - link "Standings":
          - /url: "#standings"
      - listitem:
        - link "Transactions":
          - /url: "#transactions"
      - listitem:
        - link "Waivers":
          - /url: "#waivers"
      - listitem:
        - link "CTA Section":
          - /url: "#cta"
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
   5 | const LOCAL_HTML_FILE = 'file://' + require('path').resolve(__dirname, '../../dist/index.html');
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
  40 |       await expect(mainNav).toBeVisible();
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
  74 |     // Check initial state (no hash)
  75 |     const scoreboardLink = page.locator('#mainNav a[href="#scoreboard"]');
  76 |     await expect(scoreboardLink).toHaveClass(/text-text/);
  77 |
  78 |     // Navigate by hash
  79 |     await page.goto(`${LOCAL_HTML_FILE}#standings`);
  80 |     const standingsLink = page.locator('#mainNav a[href="#standings"]');
  81 |     
  82 |     // Allow time for JS to apply class if needed, though direct navigation should be fast
  83 |     await expect(standingsLink).toHaveClass(/text-accent/);
> 84 |     await expect(scoreboardLink).not.toHaveClass(/text-accent/);
     |                                      ^ Error: Timed out 5000ms waiting for expect(locator).not.toHaveClass(expected)
  85 |     await expect(scoreboardLink).toHaveClass(/text-text/);
  86 |
  87 |     // Change hash again
  88 |     await page.evaluate(() => window.location.hash = '#transactions');
  89 |     // Use waitForFunction for event-driven class change if direct check is flaky
  90 |     await page.waitForFunction(() => document.querySelector('a[href="#transactions"]').classList.contains('text-accent'));
  91 |
  92 |     const transactionsLink = page.locator('#mainNav a[href="#transactions"]');
  93 |     await expect(transactionsLink).toHaveClass(/text-accent/);
  94 |     await expect(standingsLink).not.toHaveClass(/text-accent/);
  95 |   });
  96 | }); 
```