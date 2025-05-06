// eslint-disable-next-line import/no-unresolved, import/extensions
const { CACHE_BASE_URL, REFRESH_INTERVALS, MFL_LEAGUE_ID } = require('../config.js');

// In-memory cache for fetched data
const cache = {
  scores: { ts: 0, data: null, promise: null },
  standings: { ts: 0, data: null, promise: null },
  transactions: { ts: 0, data: null, promise: null },
  finances: { ts: 0, data: null, promise: null },
};

/**
 * Generic function to fetch a specific data type from the cache or network.
 * Handles caching, refresh intervals, and concurrent requests.
 * @param {string} type - The type of data to fetch (e.g., 'standings', 'scores').
 * @returns {Promise<object>} A promise that resolves with the fetched data.
 */
async function getCachedData(type) {
  const cacheEntry = cache[type];
  const refreshInterval = REFRESH_INTERVALS[type] || 3600000; // Default to 1 hour if not specified

  if (cacheEntry.promise && (Date.now() - cacheEntry.ts < refreshInterval)) {
    // If a request is in flight and cache is not stale, return the existing promise
    return cacheEntry.promise;
  }

  if (cacheEntry.data && (Date.now() - cacheEntry.ts < refreshInterval)) {
    // If cache is valid, return data
    return Promise.resolve(cacheEntry.data);
  }

  // If cache is stale or no data, or no promise in flight for fresh data, fetch new data
  // Store the promise to prevent multiple fetches for the same resource concurrently
  cacheEntry.promise = fetch(`${CACHE_BASE_URL}/${type}.json?t=${Date.now()}`) // Add timestamp to try and bypass browser cache if necessary
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} data. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      cacheEntry.data = data;
      cacheEntry.ts = Date.now();
      cacheEntry.promise = null; // Clear the promise once data is resolved
      return data;
    })
    .catch(error => {
      console.error(`Error fetching ${type}:`, error);
      cacheEntry.promise = null; // Clear promise on error too
      // Optionally, return stale data if available and error occurs
      // if (cacheEntry.data) return cacheEntry.data;
      throw error; // Re-throw to allow caller to handle
    });

  return cacheEntry.promise;
}

// --- Public API --- 

const getLeagueId = () => MFL_LEAGUE_ID; // Export league ID if needed by UI components

const getStandings = async () => getCachedData('standings');

const getScores = async () => getCachedData('scores');

const getTransactions = async () => getCachedData('transactions');

const getFinances = async () => getCachedData('finances');

// Example of how to use it (optional, for testing or demonstration):
/*
async function testFetch() {
  try {
    console.log('Fetching standings...');
    const standings = await getStandings();
    console.log('Standings:', standings);

    console.log('Fetching scores...');
    const scores = await getScores();
    console.log('Scores:', scores);

    // Test caching
    console.log('Fetching standings again (should be cached)...');
    const standingsCached = await getStandings();
    console.log('Standings (cached):', standingsCached);

  } catch (error) {
    console.error('Test fetch failed:', error);
  }
}

// testFetch();
*/ 

module.exports = {
  getLeagueId,
  getStandings,
  getScores,
  getTransactions,
  getFinances,
}; 