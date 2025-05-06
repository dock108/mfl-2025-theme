/**
 * Calculates a fake Vegas line and win probability based on score differential.
 * Win probability uses a logistic function tuned so that a 7-point difference
 * yields approximately 73% win probability for the leading team.
 * Line is half the point difference, rounded to the nearest 0.5.
 *
 * @param {number} scoreA - Score for Team A.
 * @param {number} scoreB - Score for Team B.
 * @param {string} nameA - Name of Team A (optional, for line string).
 * @param {string} nameB - Name of Team B (optional, for line string).
 * @returns {{line: string, winProbA: number, winProbB: number, favoredTeam: string | null, spread: number }}
 *          line: Formatted string like "Team A -3.5" or "Even".
 *          winProbA: Win probability for Team A (0.0 to 1.0).
 *          winProbB: Win probability for Team B (0.0 to 1.0).
 *          favoredTeam: 'A' or 'B' indicating the favored team, or null if even.
 *          spread: The absolute spread value (e.g., 3.5).
 */
function calculateVegasLine(scoreA, scoreB, nameA = 'Team A', nameB = 'Team B') {
  const diff = scoreA - scoreB;
  const k = 0.142; // Logistic growth rate constant

  const winProbA = 1 / (1 + Math.exp(-k * diff));
  const winProbB = 1 - winProbA;

  let line;
  let favoredTeam = null;
  let spread = 0;

  if (diff === 0) {
    line = 'Even';
  } else {
    // Calculate spread, round to nearest 0.5
    const rawSpread = Math.abs(diff / 2);
    spread = Math.round(rawSpread * 2) / 2;

    if (diff > 0) {
      // Team A is favored
      favoredTeam = 'A';
      line = `${nameA} -${spread.toFixed(1)}`;
    } else {
      // Team B is favored
      favoredTeam = 'B';
      line = `${nameB} -${spread.toFixed(1)}`;
    }
  }

  return {
    line,
    winProbA,
    winProbB,
    favoredTeam,
    spread,
  };
}

module.exports = { calculateVegasLine }; 