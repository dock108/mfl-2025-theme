export const MFL_LEAGUE_ID = "12345"; // Replace with your MFL League ID

// Refresh intervals in milliseconds (ms)
export const REFRESH_INTERVALS = {
  scores: 30000,        // 30 seconds (for live scoring during games)
  standings: 3600000,   // 1 hour (60 minutes * 60 seconds * 1000 ms)
  transactions: 600000, // 10 minutes (10 minutes * 60 seconds * 1000 ms)
  // Add other data types as needed, e.g., finances
  // finances: 7200000, // 2 hours
};

export const CACHE_BASE_URL = "https://dock108.github.io/mfl-2025-theme/data"; // Replace 'dock108' with your GitHub username

// It's recommended to create a `src/config.js` file (and add it to .gitignore)
// by copying this example and filling in your actual MFL_LEAGUE_ID.
// The build process or serverless function can then use `src/config.js`.

// Alternatively, these values can be sourced from environment variables
// during a build step or within a serverless function environment.
// Example for serverless/build process:
// export const MFL_LEAGUE_ID = process.env.MFL_LEAGUE_ID || "12345"; 