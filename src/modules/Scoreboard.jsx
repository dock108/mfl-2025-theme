const React = require('react');

const { useState, useEffect, useCallback } = React;
const { getScores } = require('../lib/mflApi');
// eslint-disable-next-line import/no-unresolved, import/extensions
const { REFRESH_INTERVALS } = require('../config.js');
const Card = require('../components/Card.jsx');
const ProbBar = require('../components/ProbBar.jsx');
const { calculateVegasLine } = require('../lib/vegas');

const defaultLogo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYWM4ZDQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMnYyMCIvPjxwYXRoIGQ9Ik0xNyA1SDkuN2E0LjcgNC43IDAgMCAwLTEuMSAxLjRsLTMuNyA1LjFhMS4zIDEuMyAwIDAgMCAwIDEuNWwzLjcgNS4xYy40LjUgLjcuNyAxLjEgMS40SDExTTIzIDEyaC0zTTUgMTJINCIvPjwvc3ZnPg=='; // Simple placeholder NFL-like logo

function Scoreboard() {
  const [scoresData, setScoresData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScores = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getScores();
      // Ensure data and necessary nested structures exist
      if (data && data.liveScoring && data.liveScoring.matchup && data.league && data.league.franchises) {
        setScoresData(data);
      } else {
        console.warn('Scoreboard: Fetched data is missing expected structure.', data);
        // Keep existing data or set to a state indicating partial data, if preferred
        // For now, if structure is wrong, we might show an error or empty state implicitly
        if (!data) setError('No data returned from API.');
        else setError('Data format error.'); 
      }
    } catch (err) {
      console.error("Failed to fetch scores:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();
    const intervalId = setInterval(fetchScores, REFRESH_INTERVALS.scores || 30000);
    return () => clearInterval(intervalId);
  }, [fetchScores]);

  if (loading && !scoresData) return <p className="text-center p-4">Loading scores...</p>;
  if (error) return <p className="text-center text-red-500 p-4">Error loading scores: {error}</p>;
  if (!scoresData || !scoresData.liveScoring || !scoresData.liveScoring.matchup || scoresData.liveScoring.matchup.length === 0) {
    return <p className="text-center p-4">No matchups available or live scoring data is not in the expected format.</p>;
  }

  const matchups = scoresData.liveScoring.matchup;
  const franchises = scoresData.league.franchises.franchise.reduce((acc, f) => {
    acc[f.id] = f;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
      {matchups.map((matchup, index) => {
        const team1 = matchup.franchise[0];
        const team2 = matchup.franchise[1];

        const franchise1 = franchises[team1.id] || { name: `Team ${team1.id}`, icon: defaultLogo };
        const franchise2 = franchises[team2.id] || { name: `Team ${team2.id}`, icon: defaultLogo };

        const score1 = parseFloat(team1.score || 0);
        const score2 = parseFloat(team2.score || 0);

        const { line, winProbA } = calculateVegasLine(score1, score2, franchise1.name, franchise2.name);
        // gameSecondsRemaining: "0" means final, >0 means in progress.
        // MFL API: "0" if final, "3600" if not started, between 0-3600 if in progress
        // For simplicity, we'll treat "0" as final and anything else as "Live" or "Upcoming".
        // A more detailed status would require parsing gameSecondsRemaining and potentially current NFL week/schedule.
        const isFinal = team1.gameSecondsRemaining === "0" && team2.gameSecondsRemaining === "0";
        const inProgress = team1.playersCurrentlyPlaying === "1" || team2.playersCurrentlyPlaying === "1";
        let gameStatus = "Upcoming";
        if (isFinal) gameStatus = "Final";
        else if (inProgress || (team1.gameSecondsRemaining < "3600" && team1.gameSecondsRemaining !== "0")) gameStatus = "Live";

        return (
          <Card key={team1.id || index} className="scoreboard-card hover:shadow-accent transition-all duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <img src={franchise1.icon || defaultLogo} alt={`${franchise1.name} logo`} className="w-8 h-8 mr-2 rounded-full bg-alt object-contain" />
                <span className="font-semibold text-sm">{franchise1.name}</span>
              </div>
              <span className="font-bold text-xl transition-all duration-300 ease-in-out">{score1.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <img src={franchise2.icon || defaultLogo} alt={`${franchise2.name} logo`} className="w-8 h-8 mr-2 rounded-full bg-alt object-contain" />
                <span className="font-semibold text-sm">{franchise2.name}</span>
              </div>
              <span className="font-bold text-xl transition-all duration-300 ease-in-out">{score2.toFixed(2)}</span>
            </div>
            
            <ProbBar percentage={winProbA * 100} className="my-3 h-2.5" />
            
            <div className="text-xs text-gray-400 text-center mb-2">{line}</div>
            <div className="flex justify-between items-center text-xs">
              <span className={`font-semibold ${isFinal ? 'text-gray-500' : 'text-accent'}`}>{gameStatus}</span>
              {/* Placeholder for Game Detail link */}
              <a href="#" className="text-accent hover:underline">Game Detail</a>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

module.exports = Scoreboard; 