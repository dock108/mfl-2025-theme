export const MFL_LEAGUE_ID = "12345"; // Replace with your MFL League ID

// Refresh intervals in milliseconds (ms)
export const REFRESH_INTERVALS = {
  scores: 30000,        // 30 seconds (for live scoring during games)
  standings: 3600000,   // 1 hour (60 minutes * 60 seconds * 1000 ms)
  transactions: 600000, // 10 minutes (10 minutes * 60 seconds * 1000 ms)
  // Add other data types as needed, e.g., finances
  finances: 7200000, // 2 hours
};

export const CACHE_BASE_URL = "https://dock108.github.io/mfl-2025-theme/data"; 