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
    // Check initial state (no hash)
    const scoreboardLink = page.locator('#mainNav a[href="#scoreboard"]');
    await expect(scoreboardLink).toHaveClass(/text-text/);

    // Navigate by hash
    await page.goto(`${LOCAL_HTML_FILE}#standings`);
    const standingsLink = page.locator('#mainNav a[href="#standings"]');
    
    // Allow time for JS to apply class if needed, though direct navigation should be fast
    await expect(standingsLink).toHaveClass(/text-accent/);
    await expect(scoreboardLink).not.toHaveClass(/text-accent/);
    await expect(scoreboardLink).toHaveClass(/text-text/);

    // Change hash again
    await page.evaluate(() => window.location.hash = '#transactions');
    // Use waitForFunction for event-driven class change if direct check is flaky
    await page.waitForFunction(() => document.querySelector('a[href="#transactions"]').classList.contains('text-accent'));

    const transactionsLink = page.locator('#mainNav a[href="#transactions"]');
    await expect(transactionsLink).toHaveClass(/text-accent/);
    await expect(standingsLink).not.toHaveClass(/text-accent/);
  });
}); 