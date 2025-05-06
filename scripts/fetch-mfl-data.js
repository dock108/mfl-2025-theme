import fetch from 'node-fetch';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

// Attempt to import MFL_LEAGUE_ID from a config file if this script is run directly.
// This is a bit of a heuristic. For GitHub Actions, environment variables are preferred.
let leagueId;
try {
  const config = await import('../src/config.js');
  leagueId = config.MFL_LEAGUE_ID;
} catch (e) {
  // Fallback if src/config.js doesn't exist or MFL_LEAGUE_ID is not there
  try {
    const configExample = await import('../src/config.example.js');
    leagueId = configExample.MFL_LEAGUE_ID;
  } catch (e2) {
    console.warn('Could not load MFL_LEAGUE_ID from config.js or config.example.js');
  }
}

const mflLeagueId = process.env.MFL_LEAGUE_ID || leagueId || "48963"; // Default if not found
const year = new Date().getFullYear();
const base = `https://api.myfantasyleague.com/${year}/export?L=${mflLeagueId}&JSON=1&`;
const outputDir = path.resolve(__dirname, '../docs/data');

const feeds = {
  scores: "TYPE=liveScoring&W=SCHEDULE_IN_PROGRESS",
  standings: "TYPE=leagueStandings",
  transactions: "TYPE=transactions&COUNT=50",
  finances: "TYPE=accounting",
};

async function fetchAndSaveMFLData() {
  console.log(`Starting MFL data fetch for League ID: ${mflLeagueId}`);
  try {
    await mkdir(outputDir, { recursive: true });

    await Promise.all(
      Object.entries(feeds).map(async ([name, query]) => {
        const url = base + query;
        console.log(`Fetching ${name} from ${url}`);
        try {
          const res = await fetch(url);
          if (!res.ok) {
            console.error(`Failed to fetch ${name}: ${res.status} ${res.statusText}`);
            const errorBody = await res.text();
            console.error(`Response body for ${name}: ${errorBody}`);
            return; // Skip writing this file
          }
          const json = await res.json();
          const outputPath = path.join(outputDir, `${name}.json`);
          await writeFile(outputPath, JSON.stringify(json, null, 2));
          console.log(`Successfully wrote ${name} to ${outputPath}`);
        } catch (fetchError) {
          console.error(`Error fetching or processing ${name}:`, fetchError);
        }
      })
    );
    console.log("MFL data fetch completed.");
  } catch (error) {
    console.error("Critical error in fetchAndSaveMFLData:", error);
    process.exitCode = 1; // Indicate failure to the calling process
  }
}

// If the script is run directly (e.g., by GitHub Actions), execute the function.
// This check prevents it from running automatically if imported elsewhere (though not planned for this script).
if (require.main === module) {
  fetchAndSaveMFLData();
}

// Export for potential use in other scripts, though the Netlify function will use its own similar logic.
export default fetchAndSaveMFLData; 