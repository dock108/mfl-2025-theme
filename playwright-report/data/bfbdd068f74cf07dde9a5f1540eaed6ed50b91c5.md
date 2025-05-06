# Test info

- Name: Page with Cached MFL Data >> should load index.html and successfully fetch mocked data
- Location: /Users/michaelfuscoletti/Desktop/mfl/tests/e2e/cached-data.spec.js:54:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 0
    at /Users/michaelfuscoletti/Desktop/mfl/tests/e2e/cached-data.spec.js:81:32
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
   3 | // Mock data for each endpoint
   4 | const mockData = {
   5 |   standings: { league: { name: 'Mocked League Standings' }, franchise: [] },
   6 |   scores: { liveScoring: { matchup: [] }, league: {id: "12345"} }, // Ensure it has a structure mflApi might expect
   7 |   transactions: { transactions: { transaction: [] } },
   8 |   finances: { accounting: { franchise: [] } },
   9 | };
  10 |
  11 | // Base URL for the cached data, matching what mflApi.js will try to fetch
  12 | // This should align with CACHE_BASE_URL from config.js
  13 | const githubUser = 'dock108'; // Assuming this is the GitHub username from previous context
  14 | const repoName = 'mfl-2025-theme';
  15 | const cacheBaseUrlPattern = `https://${githubUser}.github.io/${repoName}/data/`;
  16 |
  17 | test.describe('Page with Cached MFL Data', () => {
  18 |   test.beforeEach(async ({ page }) => {
  19 |     // Intercept network requests for the JSON data files
  20 |     await page.route(`${cacheBaseUrlPattern}standings.json?t=*`, route => {
  21 |       console.log(`Mocking ${route.request().url()}`);
  22 |       route.fulfill({
  23 |         status: 200,
  24 |         contentType: 'application/json',
  25 |         body: JSON.stringify(mockData.standings),
  26 |       });
  27 |     });
  28 |     await page.route(`${cacheBaseUrlPattern}scores.json?t=*`, route => {
  29 |       console.log(`Mocking ${route.request().url()}`);
  30 |       route.fulfill({
  31 |         status: 200,
  32 |         contentType: 'application/json',
  33 |         body: JSON.stringify(mockData.scores),
  34 |       });
  35 |     });
  36 |     await page.route(`${cacheBaseUrlPattern}transactions.json?t=*`, route => {
  37 |       console.log(`Mocking ${route.request().url()}`);
  38 |       route.fulfill({
  39 |         status: 200,
  40 |         contentType: 'application/json',
  41 |         body: JSON.stringify(mockData.transactions),
  42 |       });
  43 |     });
  44 |     await page.route(`${cacheBaseUrlPattern}finances.json?t=*`, route => {
  45 |       console.log(`Mocking ${route.request().url()}`);
  46 |       route.fulfill({
  47 |         status: 200,
  48 |         contentType: 'application/json',
  49 |         body: JSON.stringify(mockData.finances),
  50 |       });
  51 |     });
  52 |   });
  53 |
  54 |   test('should load index.html and successfully fetch mocked data', async ({ page }) => {
  55 |     // Keep track of console messages to ensure our API wrapper is called
  56 |     const consoleMessages = [];
  57 |     page.on('console', msg => consoleMessages.push(msg.text()));
  58 |
  59 |     // Navigate to the local preview of index.html
  60 |     // Assuming `docs/index.html` is served from the root of the test server (Playwright default)
  61 |     // If your Playwright baseURL is set, adjust accordingly.
  62 |     // For a file path, it needs to be absolute or relative to playwright's execution context.
  63 |     // The most reliable way is often to serve the `docs` directory and navigate to http://localhost:PORT/index.html
  64 |     // For now, we'll attempt a relative file path, but this might need adjustment based on test runner setup.
  65 |     // Using a common pattern for Playwright: serve the docs directory.
  66 |     // This example assumes `playwright.config.js` has `webServer` configured to serve `docs`.
  67 |     // If not, direct file navigation would be `await page.goto('file:///path/to/your/project/docs/index.html');`
  68 |     
  69 |     // For the test to run in CI where a server might not be explicitly started for `docs`,
  70 |     // we will attempt to load the file directly. This may have limitations (e.g. API calls via file:// protocol).
  71 |     // const filePath = `file://${require('path').resolve(__dirname, '../../docs/index.html')}`;
  72 |     // For now, let's assume the test server is configured or use a placeholder URL if testing actual fetch calls.
  73 |     // Since we are mocking, the base URL of the page itself is less critical than the mocked URLs.
  74 |
  75 |     // Let's try to load `docs/index.html` relative to the project root.
  76 |     // Playwright's `page.goto()` can accept `file://` paths.
  77 |     const projectRoot = process.cwd(); // Gets the root of where playwright is run
  78 |     const indexPath = `file://${projectRoot}/docs/index.html`;
  79 |
  80 |     const response = await page.goto(indexPath, { waitUntil: 'networkidle' });
> 81 |     expect(response?.status()).toBe(200); // Check if the page itself loaded
     |                                ^ Error: expect(received).toBe(expected) // Object.is equality
  82 |
  83 |     // Add a slight delay to allow async operations in mflApi.js to attempt fetches
  84 |     await page.waitForTimeout(500);
  85 |
  86 |     // Verify that our mock routes were hit (by checking console logs from the route handlers)
  87 |     // This is an indirect way to check if fetch was called for these URLs.
  88 |     // A more direct way would be to instrument mflApi.js or check for content rendered from this data.
  89 |     const loggedUrls = consoleMessages.filter(msg => msg.startsWith('Mocking'));
  90 |     expect(loggedUrls.some(log => log.includes('standings.json'))).toBeTruthy();
  91 |     expect(loggedUrls.some(log => log.includes('scores.json'))).toBeTruthy();
  92 |     // Add checks for transactions and finances if they are called on page load
  93 |
  94 |     // Example: Check if some content derived from mockData.standings is present
  95 |     // This depends on your actual index.html consuming and rendering the data.
  96 |     // For now, this test primarily ensures the network mocking works and the page loads.
  97 |     // e.g., await expect(page.locator('body')).toContainText('Mocked League Standings');
  98 |   });
  99 | }); 
```