# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Git, MIT License, and .gitignore.
- Build stack: Tailwind CLI, PostCSS + Autoprefixer, ESLint + Prettier, Jest, Playwright, Storybook.
- Basic scripts in `package.json` for development, build, lint, test, e2e, and Storybook.
- GitHub Actions workflow for CI.
- Initial `README.md` and `CHANGELOG.md`.
- Placeholder CSS and JavaScript for live deployment.
- GitHub Pages configuration for hosting theme assets.
- Embed code snippet for league commissioners.
- Added HTML skeleton (`layout.html`) with basic structure.
- Added global Tailwind theme configuration (colors, fonts) and utility classes (.card, .btn-primary, etc.).
- Implemented responsive header navigation with burger menu and active link highlighting.
- Added base component set (Card, Button, Badge, ProbBar) with stories and tests.
- Created data sourcing strategy document (`docs/data-strategy.md`), MFL API endpoint reference (`docs/endpoints.md`), and example configuration (`src/config.example.js`).
- Implemented serverless data caching with Netlify Functions (`netlify/functions/fetch-mfl.js`) and a GitHub Actions fallback (`.github/workflows/cache.yml`, `scripts/fetch-mfl-data.js`).
- Added a client-side fetch wrapper (`src/lib/mflApi.js`) to consume cached data, with corresponding Jest and Playwright tests.
- Updated `src/config.example.js` with `CACHE_BASE_URL`.

### Changed
- Build output directory switched from `/dist`