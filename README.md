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
4. The `deploy.yml` workflow will handle deploying the `dist` directory

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

## Folder Structure

```
.github/
  workflows/
    ci.yml         # GitHub Actions CI configuration
dist/
  main.css        # Compiled CSS for production
  main.js         # JavaScript for production
node_modules/
                  # Project dependencies
snippets/
  header.hpm.html # Ready-to-use HTML for MFL Header HPM
src/
  components/       # React components
  styles/
    index.css     # Main Tailwind CSS input file
    placeholder.css # Minimal CSS for initial deployment
  placeholder.js    # Minimal JS for initial deployment
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