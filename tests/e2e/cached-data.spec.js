const { test, expect } = require('@playwright/test');

// Mock data for each endpoint
const mockData = {
  standings: { league: { name: 'Mocked League Standings' }, franchise: [] },
  scores: { liveScoring: { matchup: [] }, league: {id: "12345"} }, // Ensure it has a structure mflApi might expect
  transactions: { transactions: { transaction: [] } },
  finances: { accounting: { franchise: [] } },
};

// Base URL for the cached data, matching what mflApi.js will try to fetch
// This should align with CACHE_BASE_URL from config.js
const githubUser = 'dock108'; // Assuming this is the GitHub username from previous context
const repoName = 'mfl-2025-theme';
const cacheBaseUrlPattern = `https://${githubUser}.github.io/${repoName}/data/`;

test.describe('Page with Cached MFL Data', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept network requests for the JSON data files
    await page.route(`${cacheBaseUrlPattern}standings.json?t=*`, route => {
      console.log(`Mocking ${route.request().url()}`);
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.standings),
      });
    });
    await page.route(`${cacheBaseUrlPattern}scores.json?t=*`, route => {
      console.log(`Mocking ${route.request().url()}`);
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.scores),
      });
    });
    await page.route(`${cacheBaseUrlPattern}transactions.json?t=*`, route => {
      console.log(`Mocking ${route.request().url()}`);
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.transactions),
      });
    });
    await page.route(`${cacheBaseUrlPattern}finances.json?t=*`, route => {
      console.log(`Mocking ${route.request().url()}`);
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.finances),
      });
    });
  });

  test('should load index.html and successfully fetch mocked data', async ({ page }) => {
    // Keep track of console messages to ensure our API wrapper is called
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));

    // Navigate to the local preview of index.html
    // Assuming `docs/index.html` is served from the root of the test server (Playwright default)
    // If your Playwright baseURL is set, adjust accordingly.
    // For a file path, it needs to be absolute or relative to playwright's execution context.
    // The most reliable way is often to serve the `docs` directory and navigate to http://localhost:PORT/index.html
    // For now, we'll attempt a relative file path, but this might need adjustment based on test runner setup.
    // Using a common pattern for Playwright: serve the docs directory.
    // This example assumes `playwright.config.js` has `webServer` configured to serve `docs`.
    // If not, direct file navigation would be `await page.goto('file:///path/to/your/project/docs/index.html');`
    
    // For the test to run in CI where a server might not be explicitly started for `docs`,
    // we will attempt to load the file directly. This may have limitations (e.g. API calls via file:// protocol).
    // const filePath = `file://${require('path').resolve(__dirname, '../../docs/index.html')}`;
    // For now, let's assume the test server is configured or use a placeholder URL if testing actual fetch calls.
    // Since we are mocking, the base URL of the page itself is less critical than the mocked URLs.

    // Let's try to load `docs/index.html` relative to the project root.
    // Playwright's `page.goto()` can accept `file://` paths.
    const projectRoot = process.cwd(); // Gets the root of where playwright is run
    const indexPath = `file://${projectRoot}/docs/index.html`;

    const response = await page.goto(indexPath, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200); // Check if the page itself loaded

    // Add a slight delay to allow async operations in mflApi.js to attempt fetches
    await page.waitForTimeout(500);

    // Verify that our mock routes were hit (by checking console logs from the route handlers)
    // This is an indirect way to check if fetch was called for these URLs.
    // A more direct way would be to instrument mflApi.js or check for content rendered from this data.
    const loggedUrls = consoleMessages.filter(msg => msg.startsWith('Mocking'));
    expect(loggedUrls.some(log => log.includes('standings.json'))).toBeTruthy();
    expect(loggedUrls.some(log => log.includes('scores.json'))).toBeTruthy();
    // Add checks for transactions and finances if they are called on page load

    // Example: Check if some content derived from mockData.standings is present
    // This depends on your actual index.html consuming and rendering the data.
    // For now, this test primarily ensures the network mocking works and the page loads.
    // e.g., await expect(page.locator('body')).toContainText('Mocked League Standings');
  });
}); 