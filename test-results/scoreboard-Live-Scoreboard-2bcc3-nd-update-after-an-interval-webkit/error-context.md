# Test info

- Name: Live Scoreboard Module >> should load scoreboard, display initial scores, and update after an interval
- Location: /Users/michaelfuscoletti/Desktop/mfl/tests/e2e/scoreboard.spec.js:70:3

# Error details

```
Error: Timed out 10000ms waiting for expect(locator).toHaveCount(expected)

Locator: locator('#scoreboard .scoreboard-card')
Expected: 1
Received: 0
Call log:
  - expect.toHaveCount with timeout 10000ms
  - waiting for locator('#scoreboard .scoreboard-card')
    14 × locator resolved to 0 elements
       - unexpected value "0"

    at /Users/michaelfuscoletti/Desktop/mfl/tests/e2e/scoreboard.spec.js:76:64
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
   3 | const githubUser = 'dock108'; // From previous context
   4 | const repoName = 'mfl-2025-theme';
   5 | const scoresCacheUrlPattern = `https://${githubUser}.github.io/${repoName}/data/scores.json?t=*`;
   6 |
   7 | const mockFranchiseData = {
   8 |   '0001': { id: '0001', name: 'Crusaders', icon: 'icon1.png' },
   9 |   '0002': { id: '0002', name: 'Dragons', icon: 'icon2.png' },
   10 | };
   11 |
   12 | const initialMockScores = {
   13 |   liveScoring: {
   14 |     matchup: [
   15 |       {
   16 |         franchise: [
   17 |           { id: '0001', score: '10.00', playersCurrentlyPlaying: '1', gameSecondsRemaining: '1800' },
   18 |           { id: '0002', score: '7.00', playersCurrentlyPlaying: '1', gameSecondsRemaining: '1800' },
   19 |         ],
   20 |       },
   21 |     ],
   22 |   },
   23 |   league: {
   24 |     franchises: { franchise: Object.values(mockFranchiseData) },
   25 |   },
   26 | };
   27 |
   28 | const updatedMockScores = {
   29 |   liveScoring: {
   30 |     matchup: [
   31 |       {
   32 |         franchise: [
   33 |           { id: '0001', score: '17.50', playersCurrentlyPlaying: '1', gameSecondsRemaining: '900' }, // Score updated
   34 |           { id: '0002', score: '7.00', playersCurrentlyPlaying: '0', gameSecondsRemaining: '900' },
   35 |         ],
   36 |       },
   37 |     ],
   38 |   },
   39 |   league: {
   40 |     franchises: { franchise: Object.values(mockFranchiseData) },
   41 |   },
   42 | };
   43 |
   44 | test.describe('Live Scoreboard Module', () => {
   45 |   let initialScoresFulfilled = false;
   46 |
   47 |   test.beforeEach(async ({ page }) => {
   48 |     initialScoresFulfilled = false;
   49 |     // Intercept network request for scores.json
   50 |     await page.route(scoresCacheUrlPattern, (route, request) => {
   51 |       console.log(`Mocking ${request.url()}`);
   52 |       if (!initialScoresFulfilled) {
   53 |         route.fulfill({
   54 |           status: 200,
   55 |           contentType: 'application/json',
   56 |           body: JSON.stringify(initialMockScores),
   57 |         });
   58 |         initialScoresFulfilled = true;
   59 |       } else {
   60 |         // Subsequent fetches get updated scores
   61 |         route.fulfill({
   62 |           status: 200,
   63 |           contentType: 'application/json',
   64 |           body: JSON.stringify(updatedMockScores),
   65 |         });
   66 |       }
   67 |     });
   68 |   });
   69 |
   70 |   test('should load scoreboard, display initial scores, and update after an interval', async ({ page }) => {
   71 |     const projectRoot = process.cwd();
   72 |     const indexPath = `file://${projectRoot}/docs/index.html`;
   73 |     await page.goto(indexPath, { waitUntil: 'domcontentloaded' });
   74 |
   75 |     // Wait for the scoreboard container and initial content to be rendered by React
>  76 |     await expect(page.locator('#scoreboard .scoreboard-card')).toHaveCount(1, { timeout: 10000 });
      |                                                                ^ Error: Timed out 10000ms waiting for expect(locator).toHaveCount(expected)
   77 |
   78 |     // Check for initial team names and scores
   79 |     await expect(page.getByText('Crusaders')).toBeVisible();
   80 |     await expect(page.getByText('10.00')).toBeVisible();
   81 |     await expect(page.getByText('Dragons')).toBeVisible();
   82 |     await expect(page.getByText('7.00')).toBeVisible();
   83 |
   84 |     // Check initial ProbBar based on mocked vegas.js (or actual if not mocked in this E2E context)
   85 |     // For E2E, we mainly test if data flows. Exact prob-bar value depends on vegas.js output.
   86 |     // Let's assume ProbBar has a data-percentage attribute from its own rendering.
   87 |     // We expect the component to use calculateVegasLine(10, 7) initially.
   88 |     // winProbA for 10 vs 7 (diff 3) is 1 / (1 + exp(-0.142 * 3)) approx 0.598 => 59 or 60%
   89 |     // The default mock for vegas.js in Scoreboard.test.jsx returns 0.55 if not overridden.
   90 |     // In E2E, the actual vegas.js is used. So, 59.8 -> expect 60 if rounded or 59.
   91 |     // Scoreboard.jsx does winProbA * 100. ProbBar likely takes this directly.
   92 |     // Let's look for the ProbBar for the first matchup.
   93 |     const firstProbBar = page.locator('#scoreboard .scoreboard-card').first().locator('[data-testid="prob-bar"]');
   94 |     // This testid is from the Jest mock of ProbBar. The actual component might not have it.
   95 |     // Let's assume the actual ProbBar component sets a style or attribute we can check.
   96 |     // For now, I will check for the presence of the ProbBar via a more generic selector if possible,
   97 |     // or rely on text elements for vegas line if ProbBar visual check is too complex here.
   98 |     await expect(page.getByText(/Crusaders -1.5/i)).toBeVisible(); // From calculateVegasLine(10, 7)
   99 |
  100 |     // Wait for the refresh interval (mocked REFRESH_INTERVALS.scores is 30s for Scoreboard)
  101 |     // Playwright's page.waitForTimeout is a hard wait. If possible, advance time via a test hook if available.
  102 |     // For E2E, we often have to rely on real timeout if we can't control JS timers easily.
  103 |     // The Scoreboard component itself uses setInterval.
  104 |     // We will wait for a duration slightly longer than the refresh interval.
  105 |     // The REFRESH_INTERVALS.scores is 30000 in the component.
  106 |     console.log('Waiting for score update interval...');
  107 |     await page.waitForTimeout(31000); // Wait for longer than the 30s refresh
  108 |
  109 |     // Check for updated score for Team A (Crusaders)
  110 |     console.log('Checking for updated score...');
  111 |     await expect(page.getByText('17.50')).toBeVisible({ timeout: 5000 });
  112 |     // Team B score should remain the same based on updatedMockScores
  113 |     await expect(page.getByText('7.00')).toBeVisible();
  114 |
  115 |     // Check for updated Vegas line, e.g. calculateVegasLine(17.5, 7)
  116 |     // diff = 10.5. spread = 5.25 -> 5.0 or 5.5. Let's use regex.
  117 |     await expect(page.getByText(/Crusaders -5.0|Crusaders -5.5/i)).toBeVisible();
  118 |   });
  119 | }); 
```