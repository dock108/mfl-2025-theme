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

## Folder Structure

```
.github/
  workflows/
    ci.yml         # GitHub Actions CI configuration
dist/
                  # Compiled CSS output
node_modules/
                  # Project dependencies
src/
  components/       # React components
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