// Netlify Scheduled Functions: https://docs.netlify.com/functions/scheduled-functions/
// Example Cron schedules for different data types:
// Scores (e.g., every minute during typical game windows):
//   - cron: "*/1 17-23 * * SUN"  (Every minute from 5 PM to 11 PM UTC on Sundays)
//   - cron: "*/1 0-5 * * MON"    (Every minute from 12 AM to 5 AM UTC on Mondays - for late Sunday games)
//   - cron: "*/1 20-23 * * MON"  (Every minute from 8 PM to 11 PM UTC on Mondays - for MNF)
// Transactions (e.g., every 10 minutes):
//   - cron: "*/10 * * * *"
// Standings & Finances (e.g., every hour):
//   - cron: "0 * * * *"
//
// To set these up in Netlify, you would typically define them in your netlify.toml
// or through the Netlify UI if it supports multiple schedules per function or requires separate functions.
// For this single function, we'll assume a more frequent combined schedule for simplicity in this example,
// and the actual granularity would be set in netlify.toml for production using multiple function definitions if needed.
// For this example, the user mentioned: "Scheduled every 30 s (live-score window), 10 min (transactions), 1 hr (standings / finances)"
// We will use a single illustrative schedule here; multiple schedules for different data update frequencies would typically be managed in netlify.toml by deploying the same function multiple times with different names and schedules or separate specialized functions.
// Default illustrative schedule (e.g., every 5 minutes for combined fetching - adjust in netlify.toml):
//   - cron: "*/5 * * * *"

import fetch from "node-fetch";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const year = new Date().getFullYear();
const mflLeagueId = process.env.MFL_LEAGUE_ID || "48963"; // Default if not set in Netlify env
const base = `https://api.myfantasyleague.com/${year}/export?L=${mflLeagueId}&JSON=1&`;

// Output directory within the build environment of the Netlify function.
// This path needs to resolve to where `docs/data/` will be in the deployed site structure.
// Netlify builds typically run from the root of the repo.
const outputDir = path.resolve(process.cwd(), 'docs/data');

// Define the data feeds and their corresponding MFL API parameters
const feeds = {
  scores: "TYPE=liveScoring&W=SCHEDULE_IN_PROGRESS", // Placeholder for current week
  standings: "TYPE=leagueStandings",
  transactions: "TYPE=transactions&COUNT=50", // Get recent 50 transactions
  finances: "TYPE=accounting",
  // Add other endpoints as needed from docs/endpoints.md
  // e.g., playerScores, weeklyResults for a specific week, etc.
};

export const handler = async (event, context) => {
  console.log("Netlify function: Fetching MFL data...");
  console.log(`Using League ID: ${mflLeagueId}`);

  // Determine current week for liveScoring dynamically or pass via event if scheduled per week
  // For a generic cron, SCHEDULE_IN_PROGRESS usually works for live scoring if games are on.
  // Or, fetch league schedule first to find the current week.
  // For simplicity, keeping SCHEDULE_IN_PROGRESS which MFL often interprets as current live games.

  try {
    // Ensure the output directory exists. 
    // In Netlify, the `docs` dir should exist as it's the publish dir.
    // If running locally via `netlify dev`, this might be needed.
    await mkdir(outputDir, { recursive: true });

    await Promise.all(
      Object.entries(feeds).map(async ([name, query]) => {
        const url = base + query;
        console.log(`Fetching ${name} from ${url}`);
        try {
          const res = await fetch(url);
          if (!res.ok) {
            console.error(`Netlify: Failed to fetch ${name}: ${res.status} ${res.statusText}`);
            const errorBody = await res.text();
            console.error(`Netlify: Response body for ${name}: ${errorBody}`);
            return; 
          }
          const json = await res.json();
          const outputPath = path.join(outputDir, `${name}.json`);
          await writeFile(outputPath, JSON.stringify(json, null, 2));
          console.log(`Netlify: Successfully wrote ${name} to ${outputPath}`);
        } catch (fetchError) {
          console.error(`Netlify: Error fetching or processing ${name}:`, fetchError);
        }
      }),
    );
    return { statusCode: 200, body: "Netlify: MFL data fetched and written successfully." };
  } catch (error) {
    console.error("Netlify: Critical error in MFL fetch handler:", error);
    return { statusCode: 500, body: `Netlify: Error fetching MFL data: ${error.message}` };
  }
}; 