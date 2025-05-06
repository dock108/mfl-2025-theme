# MFL Data Sourcing Strategy

This document outlines and compares two primary strategies for fetching MyFantasyLeague (MFL) data for the `mfl-2025-theme`. The goal is to provide a clear recommendation for the commissioner.

## Option 1: Real-time Browser Fetch (Client-Side Polling)

In this model, the user's browser directly queries the MFL API endpoints at regular intervals.

-   **Implementation:** JavaScript running in the client's browser uses `fetch` or `XMLHttpRequest` to make GET requests to MFL's export servlets.
-   **Example Base URL:** `https://api.myfantasyleague.com/{YEAR}/export?TYPE={DATA_TYPE}&L={LEAGUE_ID}&JSON=1` (YEAR would be dynamic, e.g., 2025)

### Required Parameters for MFL API:
-   `L`: Your MFL League ID (e.g., `12345`).
-   `JSON=1`: To request data in JSON format.
-   `TYPE`: Specifies the data to fetch (e.g., `leagueStandings`, `liveScoring`, `transactions`, `accounting`).
-   `APIKEY`: May be required for private leagues if the user isn't logged into MFL in the same browser session. This complicates client-side fetching significantly if users aren't always logged in.
-   Other `TYPE`-specific parameters (e.g., `W` for week).

### Pros:
-   **Simplicity (Initial Setup):** No server-side infrastructure to manage beyond the static hosting already in place (GitHub Pages).
-   **Real-time (Potentially):** Data can be fetched very frequently, providing near real-time updates for things like live scoring.
-   **Cost:** Free, as it leverages the user's connection and MFL's existing API.

### Cons:
-   **Rate Limits:** MFL has API rate limits. Many users simultaneously hitting the API frequently could lead to users being rate-limited or, in extreme cases, the API key/league being temporarily blocked. The exact limits are not always clearly published and can change.
-   **CORS:** Cross-Origin Resource Sharing (CORS) headers must be correctly set by MFL's API. While `JSON=1` exports are generally accessible, any issues here would break client-side fetching.
-   **Performance/User Experience:**
    -   Multiple frequent API calls can drain battery on mobile devices.
    -   If MFL API is slow or unresponsive, the theme will appear broken or slow to load data.
    -   No caching layer means redundant calls for data that hasn't changed.
-   **Privacy/API Key Management:** If an `APIKEY` is needed for private leagues, embedding it client-side is a security risk. Requiring users to be logged into MFL in another tab is not a reliable solution.
-   **Scalability:** Directly proportional to the number of users; more users mean linearly more load on the MFL API.

### Suggested Refresh Cadences:
-   **Live Scoring:** Every 30-60 seconds during active game times.
-   **Standings:** Every 1-4 hours.
-   **Transactions:** Every 15-60 minutes.
-   **Finances/Accounting:** Every 1-6 hours.

### Rough Infrastructure Cost:
-   **Essentially Free:** Relies on GitHub Pages for hosting the static theme files and MFL's own API infrastructure.

## Option 2: Serverless Cache (Intermediate Layer)

In this model, a serverless function (e.g., on Netlify, Vercel, Cloudflare Workers) periodically fetches data from MFL, caches it, and serves a single, aggregated JSON blob to the client.

-   **Implementation:**
    -   A scheduled serverless function (cron job) runs at set intervals.
    -   This function fetches data from various MFL endpoints.
    -   The data is processed, combined, and stored as a JSON file in a publicly accessible location (e.g., the serverless provider's storage or back to the GitHub Pages deployment if feasible, though write-back is complex with static sites).
    -   The client-side theme fetches this single JSON blob.

### Required Parameters for MFL API (by Serverless Function):
-   Same as Option 1: `L`, `JSON=1`, `TYPE`, `APIKEY` (securely stored as a serverless environment variable).

### Pros:
-   **Rate Limit Mitigation:** Only the serverless function hits the MFL API, drastically reducing the number of direct hits from users. The serverless function can be more "polite" in its request frequency.
-   **CORS Solved:** The client fetches data from your own domain/CDN, eliminating MFL CORS concerns.
-   **Performance/User Experience:**
    -   Clients fetch a pre-processed, cached JSON blob, leading to faster load times.
    -   Reduces redundant calls for unchanged data.
    -   Less battery drain for users.
-   **Privacy/API Key Management:** `APIKEY` can be securely stored as an environment variable on the serverless platform, not exposed to clients.
-   **Data Aggregation/Transformation:** The serverless function can transform or combine data from multiple MFL endpoints into a more optimized format for the theme.
-   **Scalability:** The serverless function takes the hit, and static JSON can be served efficiently via CDN.

### Cons:
-   **Complexity:** Requires setting up and managing serverless functions and a caching/storage mechanism.
-   **Data Freshness:** Data is only as fresh as the serverless function's last run. There will be a delay compared to direct fetching (e.g., if serverless runs every 5 minutes, data can be up to 5 minutes old). This might be less ideal for hyper-sensitive live scoring.
-   **Cost (Potentially):** Most serverless platforms have generous free tiers that would likely cover this project's needs. However, very high traffic or complex/long-running functions *could* incur costs.

### Suggested Refresh Cadences (for Serverless Function Cron):
-   **Live Scoring Data:** Every 1-5 minutes during active game times (balancing freshness with MFL API load).
-   **Standings:** Every 30-60 minutes.
-   **Transactions:** Every 10-30 minutes.
-   **Finances/Accounting:** Every 30-60 minutes.
*(Client-side can then fetch the cached blob more frequently if desired, but it will only get new data after the serverless function updates it).*

### Rough Infrastructure Cost:
-   **Likely Free:** Netlify, Vercel, and Cloudflare Workers offer free tiers that should be sufficient for typical league traffic and data volumes. Costs would only arise with exceptionally high usage.

## Recommendation:

For robust, scalable, and user-friendly data delivery, **Option 2: Serverless Cache is strongly recommended.**

While Option 1 is simpler to implement initially, the risks associated with MFL rate limits, CORS dependencies, API key exposure for private leagues, and potential performance degradation for users make it less suitable for a polished theme.

A serverless cache provides a buffer against MFL API issues, improves performance, and offers better control over data fetching and security. The slightly increased setup complexity is a worthwhile trade-off for a more reliable and maintainable solution. The "near real-time" aspect of live scoring can still be reasonably achieved by tuning the serverless function's cron job appropriately during game days.

---

**Next Steps:**
-   Commissioner to review and approve the recommended strategy.
-   If Option 2 is chosen, select a serverless platform (e.g., Netlify Functions, Cloudflare Workers).
-   Begin development of the serverless functions to fetch and cache MFL data. 