const { test, expect } = require('@playwright/test');

// Path to the local HTML file. Adjust if your server setup is different.
// This assumes you run tests from the project root.
const LOCAL_HTML_FILE = 'file://' + require('path').resolve(__dirname, '../../dist/index.html');

test.describe('Responsive Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Build the project to ensure dist/index.html is up-to-date
    // Note: In a real CI setup, the build step would typically be separate.
    const execSync = require('child_process').execSync;
    try {
      execSync('npm run build', { stdio: 'pipe' });
    } catch (e) {
      console.error("Build failed before Playwright test:", e.toString());
      throw e; // Fail test if build fails
    }
    await page.goto(LOCAL_HTML_FILE);
  });

  test.describe('Mobile Viewport (375x667)', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('burger button should be visible and nav menu hidden initially', async ({ page }) => {
      await expect(page.locator('#burgerBtn')).toBeVisible();
      await expect(page.locator('#mainNav')).toBeHidden();
      await expect(page.locator('#burgerBtn')).toHaveAttribute('aria-expanded', 'false');
    });

    test('clicking burger button toggles nav menu visibility and aria-expanded', async ({ page }) => {
      const burgerBtn = page.locator('#burgerBtn');
      const mainNav = page.locator('#mainNav');

      // Initial state (as per previous test, but good to re-verify in context)
      await expect(mainNav).toBeHidden();
      await expect(burgerBtn).toHaveAttribute('aria-expanded', 'false');

      // Click to open
      await burgerBtn.click();
      await expect(mainNav).toBeVisible();
      await expect(mainNav).toHaveClass(/flex/); // Check for flex class
      await expect(burgerBtn).toHaveAttribute('aria-expanded', 'true');

      // Click to close
      await burgerBtn.click();
      await expect(mainNav).toBeHidden();
      await expect(burgerBtn).toHaveAttribute('aria-expanded', 'false');
    });
    
    test('nav items should stack vertically when visible', async ({ page }) => {
      const burgerBtn = page.locator('#burgerBtn');
      const mainNav = page.locator('#mainNav');
      await burgerBtn.click(); // Open the nav
      await expect(mainNav).toHaveClass(/flex-col/);
    });
  });

  test.describe('Desktop Viewport (1280x720)', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('burger button should be hidden', async ({ page }) => {
      await expect(page.locator('#burgerBtn')).toBeHidden();
    });

    test('nav menu should be visible and flex-row by default', async ({ page }) => {
      const mainNav = page.locator('#mainNav');
      await expect(mainNav).toBeVisible();
      await expect(mainNav).toHaveClass(/sm:flex-row/);
      await expect(mainNav).toHaveClass(/flex/); // It should have base flex
    });
  });
  
  test('active link highlighting on hash change', async ({ page }) => {
    const scoreboardLink = page.locator('#mainNav a[href="#scoreboard"]');
    const standingsLink = page.locator('#mainNav a[href="#standings"]');
    const transactionsLink = page.locator('#mainNav a[href="#transactions"]');

    const accentColor = 'rgb(50, 227, 192)'; // #32e3c0
    const textColor = 'rgb(227, 231, 238)'; // #e3e7ee

    // Check initial state (no hash, scoreboard is first, should not be accent)
    await expect(scoreboardLink).toHaveCSS('color', textColor);

    // Navigate by hash to #standings
    await page.goto(`${LOCAL_HTML_FILE}#standings`);
    // Force a direct call to setActiveLink for more deterministic testing after navigation
    await page.evaluate(() => window.testingHooks.setActiveLink());
    await expect(standingsLink).toHaveCSS('color', accentColor);
    await expect(scoreboardLink).toHaveCSS('color', textColor);

    // Change hash again to #transactions
    await page.evaluate(() => { window.location.hash = '#transactions'; });
    // Wait for the hashchange event to be processed and link to be updated by the script
    await page.waitForFunction(() => document.querySelector('a[href="#transactions"]').style.color === 'rgb(50, 227, 192)' || getComputedStyle(document.querySelector('a[href="#transactions"]')).color === 'rgb(50, 227, 192)');
    
    await expect(transactionsLink).toHaveCSS('color', accentColor);
    await expect(standingsLink).toHaveCSS('color', textColor);
  });
}); 