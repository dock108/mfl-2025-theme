const { test, expect } = require('@playwright/test');

const githubUser = 'dock108'; // From previous context
const repoName = 'mfl-2025-theme';
const scoresCacheUrlPattern = `https://${githubUser}.github.io/${repoName}/data/scores.json?t=*`;

const mockFranchiseData = {
  '0001': { id: '0001', name: 'Crusaders', icon: 'icon1.png' },
  '0002': { id: '0002', name: 'Dragons', icon: 'icon2.png' },
};

const initialMockScores = {
  liveScoring: {
    matchup: [
      {
        franchise: [
          { id: '0001', score: '10.00', playersCurrentlyPlaying: '1', gameSecondsRemaining: '1800' },
          { id: '0002', score: '7.00', playersCurrentlyPlaying: '1', gameSecondsRemaining: '1800' },
        ],
      },
    ],
  },
  league: {
    franchises: { franchise: Object.values(mockFranchiseData) },
  },
};

const updatedMockScores = {
  liveScoring: {
    matchup: [
      {
        franchise: [
          { id: '0001', score: '17.50', playersCurrentlyPlaying: '1', gameSecondsRemaining: '900' }, // Score updated
          { id: '0002', score: '7.00', playersCurrentlyPlaying: '0', gameSecondsRemaining: '900' },
        ],
      },
    ],
  },
  league: {
    franchises: { franchise: Object.values(mockFranchiseData) },
  },
};

test.describe('Live Scoreboard Module', () => {
  let initialScoresFulfilled = false;

  test.beforeEach(async ({ page }) => {
    initialScoresFulfilled = false;
    // Intercept network request for scores.json
    await page.route(scoresCacheUrlPattern, (route, request) => {
      console.log(`Mocking ${request.url()}`);
      if (!initialScoresFulfilled) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(initialMockScores),
        });
        initialScoresFulfilled = true;
      } else {
        // Subsequent fetches get updated scores
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(updatedMockScores),
        });
      }
    });
  });

  test('should load scoreboard, display initial scores, and update after an interval', async ({ page }) => {
    const projectRoot = process.cwd();
    const indexPath = `file://${projectRoot}/docs/index.html`;
    await page.goto(indexPath, { waitUntil: 'domcontentloaded' });

    // Wait for the scoreboard container and initial content to be rendered by React
    await expect(page.locator('#scoreboard .scoreboard-card')).toHaveCount(1, { timeout: 10000 });

    // Check for initial team names and scores
    await expect(page.getByText('Crusaders')).toBeVisible();
    await expect(page.getByText('10.00')).toBeVisible();
    await expect(page.getByText('Dragons')).toBeVisible();
    await expect(page.getByText('7.00')).toBeVisible();

    // Check initial ProbBar based on mocked vegas.js (or actual if not mocked in this E2E context)
    // For E2E, we mainly test if data flows. Exact prob-bar value depends on vegas.js output.
    // Let's assume ProbBar has a data-percentage attribute from its own rendering.
    // We expect the component to use calculateVegasLine(10, 7) initially.
    // winProbA for 10 vs 7 (diff 3) is 1 / (1 + exp(-0.142 * 3)) approx 0.598 => 59 or 60%
    // The default mock for vegas.js in Scoreboard.test.jsx returns 0.55 if not overridden.
    // In E2E, the actual vegas.js is used. So, 59.8 -> expect 60 if rounded or 59.
    // Scoreboard.jsx does winProbA * 100. ProbBar likely takes this directly.
    // Let's look for the ProbBar for the first matchup.
    const firstProbBar = page.locator('#scoreboard .scoreboard-card').first().locator('[data-testid="prob-bar"]');
    // This testid is from the Jest mock of ProbBar. The actual component might not have it.
    // Let's assume the actual ProbBar component sets a style or attribute we can check.
    // For now, I will check for the presence of the ProbBar via a more generic selector if possible,
    // or rely on text elements for vegas line if ProbBar visual check is too complex here.
    await expect(page.getByText(/Crusaders -1.5/i)).toBeVisible(); // From calculateVegasLine(10, 7)

    // Wait for the refresh interval (mocked REFRESH_INTERVALS.scores is 30s for Scoreboard)
    // Playwright's page.waitForTimeout is a hard wait. If possible, advance time via a test hook if available.
    // For E2E, we often have to rely on real timeout if we can't control JS timers easily.
    // The Scoreboard component itself uses setInterval.
    // We will wait for a duration slightly longer than the refresh interval.
    // The REFRESH_INTERVALS.scores is 30000 in the component.
    console.log('Waiting for score update interval...');
    await page.waitForTimeout(31000); // Wait for longer than the 30s refresh

    // Check for updated score for Team A (Crusaders)
    console.log('Checking for updated score...');
    await expect(page.getByText('17.50')).toBeVisible({ timeout: 5000 });
    // Team B score should remain the same based on updatedMockScores
    await expect(page.getByText('7.00')).toBeVisible();

    // Check for updated Vegas line, e.g. calculateVegasLine(17.5, 7)
    // diff = 10.5. spread = 5.25 -> 5.0 or 5.5. Let's use regex.
    await expect(page.getByText(/Crusaders -5.0|Crusaders -5.5/i)).toBeVisible();
  });
}); 