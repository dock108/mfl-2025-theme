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

## Component Library

Reusable UI components are located in `src/components/` and are showcased in Storybook.

### Card (`Card.jsx`)
A wrapper component for content sections.
- Applies `.card`, `.glow-hover`, and `.p-5` classes.
- Usage: `<Card>Your content here</Card>`

### Button (`Button.jsx`)
A primary call-to-action button.
- Uses the `.btn-primary` global style.
- Supports `disabled` state and other standard button props.
- Usage: `<Button onClick={handleClick} disabled={false}>Click Me</Button>`

### Badge (`Badge.jsx`)
For small labels or status indicators.
- Default style uses the global `.badge` class.
- `variant="accent"` provides an alternative style with accent background.
- Usage: `<Badge variant="accent">New</Badge>`

### ProbBar (`ProbBar.jsx`)
A horizontal bar to display a percentage or probability.
- Takes a `percentage` prop (0-100).
- Uses `.deg-bar` for the background and an accent-colored inner bar.
- Usage: `<ProbBar percentage={75} />`

## Folder Structure

```
.github/
  workflows/
    ci.yml         # GitHub Actions CI configuration
    deploy.yml     # GitHub Actions deployment to Pages configuration
docs/             # Build output directory for GitHub Pages
  index.html      # Main HTML layout for preview
  main.css        # Compiled CSS for production
  main.js         # JavaScript for production
node_modules/
                  # Project dependencies
snippets/
  header.hpm.html # Ready-to-use HTML for MFL Header HPM
src/
  components/
    Badge.jsx
    Badge.stories.jsx
    Badge.test.jsx
    Button.jsx
    Button.stories.jsx
    Button.test.jsx
    Card.jsx
    Card.stories.jsx
    Card.test.jsx
    HelloCard.jsx             # Existing dummy component
    HelloCard.stories.jsx     # Existing dummy component story
    HelloCard.test.jsx        # Existing dummy component test
    ProbBar.jsx
    ProbBar.stories.jsx
    ProbBar.test.jsx
    ResponsiveNav.stories.js  # Story for header nav (might be refactored or part of layout stories)
  global-styles.test.js # Test for global CSS utilities
  layout.html       # Main HTML skeleton
  layout.stories.js # Storybook story for the layout shell
  layout.test.js    # Jest test for the layout HTML
  main.js           # Main JavaScript file (burger menu, active links)
  main.test.js      # Jest tests for main.js
  styles/
    index.css     # Main Tailwind CSS input file
.eslintrc.js        # ESLint configuration
.gitignore          # Git ignore rules
.prettierrc.js      # Prettier configuration
CHANGELOG.md        # Project changelog
LICENSE             # MIT License
package-lock.json   # NPM lock file
package.json        # Project metadata and dependencies
postcss.config.js   # PostCSS configuration
README.md           # This file
tailwind.config.js  # Tailwind CSS configuration
``` 