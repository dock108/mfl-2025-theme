# mfl-2025-theme

Monorepo for the MFL 2025 theme.

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mfl-2025-theme
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Previewing the Layout

After running `npm run build`, you can preview the basic HTML layout by opening `docs/index.html` in your web browser.

## Scripts

| Script            | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| `npm run dev`       | Starts Tailwind CSS in watch mode.                                          |
| `npm run build`     | Builds and minifies CSS for production.                                     |
| `npm run lint`      | Lints JavaScript and TypeScript files.                                      |
| `npm run test`      | Runs Jest unit tests.                                                       |
| `npm run e2e`       | Runs Playwright end-to-end tests.                                           |
| `npm run storybook` | Starts Storybook for component development.                                 |

## Live Theme Assets

The theme assets are served from GitHub Pages at the following URLs:

- CSS: `https://dock108.github.io/mfl-2025-theme/main.css`
- JavaScript: `https://dock108.github.io/mfl-2025-theme/main.js`

### Enabling GitHub Pages for this Repository

1. Go to the repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Build and deployment", set:
   - Source: "GitHub Actions"
4. The `deploy.yml` workflow will handle deploying the `docs` directory

## For League Commissioners

### Installing the Theme

1. Log in to your MFL league as a commissioner
2. Go to "Setup" > "Customize" > "HTML Page Modules"
3. Find the "Header" module in the list and click "Edit"
4. Paste the following code into the module:

```html
<link rel="stylesheet" href="https://dock108.github.io/mfl-2025-theme/main.css">
<script src="https://dock108.github.io/mfl-2025-theme/main.js" defer></script>
```

5. Click "Update Module" to save your changes

### Setting League Skin to None

1. Go to "Setup" > "Customize" > "Site Appearance"
2. In the "MFL Skin" dropdown menu, select "None"
3. Click "Update Settings" to save your changes

This will remove the default MFL styling and allow our custom theme to take effect.

## Theme Configuration (Tailwind CSS)

The theme's visual appearance is primarily controlled by `tailwind.config.js` and `src/styles/index.css`.

### Color Palette

The core color palette defined in `tailwind.config.js` is:

- `bg`: `#22252b` (Main background)
- `card`: `#2d3038` (Card/container background)
- `alt`: `#2a2d35` (Alternative background or subtle elements)
- `accent`: `#32e3c0` (Primary accent color)
- `text`: `#e3e7ee` (Main text color)

These can be used with Tailwind's utility classes, e.g., `bg-bg`, `text-accent`, `border-card`.

### Typography

- Default font: Inter (sans-serif stack).
- Applied to the `body` via `@apply font-sans` in `src/styles/index.css`.

### Utility Classes & Components

Several global utility classes and component styles are defined in `src/styles/index.css`:

- `.card`: Applies base styling for card-like containers (`bg-card`, `rounded-xl`, `shadow-sm`, `shadow-alt`, `p-4`).
  Example: `<div class="card">...</div>`
- `.glow-hover`: Adds a subtle glow effect on hover using the `accent` color.
  Can be applied to interactive elements: `<button class="btn-primary glow-hover">...</button>`
- `.deg-bar`: A decorative gradient bar (often used as a visual accent).
  Example: `<div class="deg-bar"></div>`
- `.btn-primary`: Primary button style (`bg-accent`, `text-bg`, padding, rounding, `glow-hover`).
  Example: `<button class="btn-primary">Click Me</button>`
- `.badge`: Small, rounded element for displaying status or short info (`bg-alt`, `text-accent`).
  Example: `<span class="badge">New</span>`
- `.pill`: Pill-shaped element, often for tags or categories (`bg-card`, `text-text`, `border-alt`).
  Example: `<span class="pill">Category</span>`

## Responsive Navigation (Burger Menu)

The header navigation is responsive:
- On small screens (less than `sm` breakpoint defined by Tailwind, typically 640px), a "burger" button (`#burgerBtn`) is shown.
- Clicking the burger button toggles the visibility of the main navigation menu (`#mainNav`).
- The navigation menu stacks vertically on mobile.
- On larger screens (`sm` and up), the burger button is hidden, and the navigation menu is displayed horizontally.

### How it Works
- Logic is handled in `src/main.js`.
- The script listens for clicks on `#burgerBtn`.
- It toggles the `hidden` and `flex` (or other display utility) classes on `#mainNav`.
- `aria-expanded` attribute on `#burgerBtn` is updated to reflect the state of the navigation menu, aiding accessibility.
- Focus styles (`focus:outline-none focus:ring-2 focus:ring-accent`) are applied to the burger button for keyboard navigation.

### Active Link Highlighting
- `src/main.js` also includes a helper function (`MFL_setActiveLink`) that highlights the active navigation link based on the current `window.location.hash`.
- It adds the `text-accent` class to the active link and ensures other links use `text-text`.
- This runs on initial page load and whenever the URL hash changes.

## ⚙️ Configuring your League ID & Refresh Cadences

To connect the theme to your specific MFL league and customize data refresh rates, you'll need to configure it.

1.  **Copy the Example Configuration:**
    Make a copy of `src/config.example.js` and name it `src/config.js`.
    ```bash
    cp src/config.example.js src/config.js
    ```
2.  **Edit `src/config.js`:**
    Open `src/config.js` and replace the placeholder `MFL_LEAGUE_ID` with your actual MFL league ID.
    You can also adjust the `REFRESH_INTERVALS` for how often different types of data should be fetched (values are in milliseconds).

    ```javascript
    export const MFL_LEAGUE_ID = "YOUR_LEAGUE_ID_HERE"; // Replace with your MFL League ID

    export const REFRESH_INTERVALS = {
      scores: 30000,        // 30 seconds
      standings: 3600000,   // 1 hour
      transactions: 600000, // 10 minutes
    };
    ```
3.  **Important:** Add `src/config.js` to your `.gitignore` file if it's not already there to avoid committing your specific league ID to the repository, especially if the repository is public.

    ```
    # .gitignore
    src/config.js
    ```

This configuration will be used by the data fetching logic (detailed in `docs/data-strategy.md`) to pull information from your league.

## 🚀 Live Data Flow & Setup

This theme uses a serverless caching strategy to fetch and display live MFL data efficiently and reliably.

1.  **Data Fetching (Netlify Function):**
    *   A Netlify serverless function, defined in `netlify/functions/fetch-mfl.js`, runs on a schedule (configurable via cron expressions in `netlify.toml` or the Netlify UI).
    *   This function fetches the latest data (scores, standings, transactions, finances) from the MFL API.
    *   The fetched data is saved as JSON files (e.g., `standings.json`, `scores.json`) into the `docs/data/` directory of your deployed site.
    *   You will need to set the `MFL_LEAGUE_ID` environment variable in your Netlify site settings for this function to target your league.

2.  **Data Hosting (GitHub Pages):**
    *   The `docs/data/` directory, containing the cached JSON files, is part of your site published via GitHub Pages.
    *   This means the cached data is accessible via URLs like `https://<YOUR_USERNAME>.github.io/mfl-2025-theme/data/standings.json`.

3.  **Client-Side Fetching (Fetch Wrapper):**
    *   The theme's front-end uses a JavaScript wrapper `src/lib/mflApi.js`.
    *   This wrapper fetches the JSON data files from the GitHub Pages URL (e.g., `https://<YOUR_USERNAME>.github.io/mfl-2025-theme/data/standings.json`).
    *   It includes in-memory caching to avoid redundant fetches if data hasn't changed or is within its refresh interval (defined in `src/config.js`).

4.  **GitHub Actions Fallback (Cache Workflow):**
    *   A GitHub Actions workflow defined in `.github/workflows/cache.yml` provides a fallback mechanism for caching data.
    *   It runs on pushes to the main branch and on a nightly schedule.
    *   This workflow executes `scripts/fetch-mfl-data.js` (which contains similar logic to the Netlify function) to fetch data and commits any changes directly to the `docs/data/` directory in the repository.
    *   For this workflow to commit changes, it requires a `MFL_LEAGUE_ID` repository secret and uses the default `GITHUB_TOKEN`.
    *   **Important for Forks:** If you fork this repository, ensure you enable GitHub Actions (if not enabled by default) and set the `MFL_LEAGUE_ID` secret in your fork's settings for the cache to be updated.

### Deploying with Netlify (Recommended for Scheduled Functions)

To get the automated, scheduled data fetching via Netlify Functions:

1.  Click the button below to deploy this repository to Netlify:
    [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/dock108/mfl-2025-theme) 
    *(Replace `dock108/mfl-2025-theme` in the URL if your repository URL is different, e.g., after forking)*
2.  Follow the Netlify setup steps.
3.  In your new Netlify site's settings (under Build & deploy > Environment), add an environment variable:
    *   **Key:** `MFL_LEAGUE_ID`
    *   **Value:** Your MFL league ID (e.g., `12345`)
4.  Netlify will automatically build your site from the `docs` directory and deploy the function from `netlify/functions`. The scheduled execution of the function is defined by its cron pattern (see comments in `fetch-mfl.js` and `netlify.toml` for guidance on setting this up if not done automatically via a UI).

## 🟢 Live Scoreboard Module

The theme includes a live scoreboard that replaces MFL's native live scoring interface. It displays matchups with team names, logos (placeholders if not available from MFL), current scores, a win probability bar, and a fake "Vegas" line.

### Features:
-   **Live Updates:** Scores automatically refresh at the interval defined in `src/config.js` (default is every 30 seconds for scores).
-   **Win Probability & Line:** A helper function in `src/lib/vegas.js` calculates:
    -   **Win Probability:** Based on the current score differential using a logistic formula. Tuned so a 7-point lead gives the leading team approximately 73% win probability.
    -   **Vegas Line:** A simplified spread, typically half the point difference, rounded to the nearest 0.5 (e.g., "Team A -3.5").
-   **Responsive Design:** Adapts to different screen sizes (1-column on mobile, 2 on medium screens, 3 on larger screens).
-   **Visual Flair:** Uses the theme's `Card` component and `ProbBar` for a modern look. Score changes and hover effects are animated.

### Screenshot Placeholder

```
+--------------------------------------------------------------------+
|                                                                    |
|  [ Team A Logo ]  Team A Name                 105.75 (Live)        |
|  [ Team B Logo ]  Team B Name                   98.50               |
|  +----------------------------------------+                        |
|  | WWWWWWWWWWWWWWWWWWWWWWWWWWWWP          | (Win Prob: 60%)        |
|  +----------------------------------------+                        |
|                     Team A -3.5                                    |
|  Live                                           [Game Detail Link] |
|                                                                    |
+--------------------------------------------------------------------+
  ( ... more matchup cards ... )
```
*(A real screenshot should be added here once the module is visually complete and deployed.)*

### How it Works:
1.  The `Scoreboard` React component (`src/modules/Scoreboard.jsx`) is rendered into the `#scoreboard` div in the main HTML layout.
2.  It uses the `getScores()` function from `src/lib/mflApi.js` to fetch the latest `scores.json` data from the cached location (e.g., GitHub Pages via Netlify function updates).
3.  For each matchup, it displays team information and uses `calculateVegasLine()` to generate the win probability and line.
4.  CSS in `src/styles/index.css` hides MFL's default live scoring tables.

## Component Library

Reusable UI components are located in `