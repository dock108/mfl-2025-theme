const React = require('react');
const Scoreboard = require('./Scoreboard.jsx');
const { MFL_LEAGUE_ID, REFRESH_INTERVALS } = require('../config.example');

// Mock the mflApi.getScores for Storybook an get REFRESH_INTERVALS from config.example.js
let storybookScoresData = {}; // Will be set by args

// Mock mflApi for Storybook context
jest.mock('../lib/mflApi', () => ({
  getScores: jest.fn(async () => {
    console.log('Storybook: Mock getScores called, returning:', storybookScoresData);
    if (storybookScoresData && Object.keys(storybookScoresData).length > 0) {
      return Promise.resolve(storybookScoresData);
    }
    // Return a default empty state if no data from args
    return Promise.resolve({
      liveScoring: { matchup: [] },
      league: { franchises: { franchise: [] } },
    });
  }),
}));

// Mock config.js for REFRESH_INTERVALS (as Scoreboard imports it)
jest.mock('../config.js', () => ({
  MFL_LEAGUE_ID: MFL_LEAGUE_ID || 'STORYBOOK_LEAGUE',
  REFRESH_INTERVALS: {
    scores: REFRESH_INTERVALS.scores || 30000,
  },
}), { virtual: true });

const mockFranchise = (id, name, score, playersCurrentlyPlaying = '0', gameSecondsRemaining = '0', icon = null) => ({
  id,
  score: String(score.toFixed(2)),
  playersCurrentlyPlaying,
  gameSecondsRemaining,
  icon: icon || `https://via.placeholder.com/32/${id.slice(-2)}/ffffff?text=${name.substring(0,1)}`,
});

const defaultArgs = {
  leagueId: MFL_LEAGUE_ID || '12345',
  matchups: [
    {
      team1Name: 'Dragons', team1Id: '0001', team1Score: 105.75, team1Icon: '',
      team2Name: 'Crusaders', team2Id: '0002', team2Score: 98.50, team2Icon: '',
      team1PlayersPlaying: '1', team1GameSecondsRemaining: '1200',
      team2PlayersPlaying: '0', team2GameSecondsRemaining: '1200',
    },
    {
      team1Name: 'Titans', team1Id: '0003', team1Score: 77.00, team1Icon: '',
      team2Name: 'Gladiators', team2Id: '0004', team2Score: 82.20, team2Icon: '',
      team1PlayersPlaying: '0', team1GameSecondsRemaining: '0', // Final
      team2PlayersPlaying: '0', team2GameSecondsRemaining: '0', // Final
    },
  ],
};

// Function to transform args into the scoresData structure expected by Scoreboard
const transformArgsToScoresData = (args) => {
  const franchiseDetails = [];
  const liveMatchups = args.matchups.map(m => {
    franchiseDetails.push({ id: m.team1Id, name: m.team1Name, icon: m.team1Icon });
    franchiseDetails.push({ id: m.team2Id, name: m.team2Name, icon: m.team2Icon });
    return {
      franchise: [
        mockFranchise(m.team1Id, m.team1Name, m.team1Score, m.team1PlayersPlaying, m.team1GameSecondsRemaining, m.team1Icon),
        mockFranchise(m.team2Id, m.team2Name, m.team2Score, m.team2PlayersPlaying, m.team2GameSecondsRemaining, m.team2Icon),
      ],
    };
  });

  // Deduplicate franchiseDetails (though simple push might lead to duplicates if IDs are reused in args)
  const uniqueFranchiseDetails = Array.from(new Set(franchiseDetails.map(f => f.id)))
    .map(id => franchiseDetails.find(f => f.id === id));

  return {
    liveScoring: { matchup: liveMatchups },
    league: {
      id: args.leagueId,
      franchises: { franchise: uniqueFranchiseDetails },
    },
  };
};

export default {
  title: 'Modules/Scoreboard',
  component: Scoreboard,
  argTypes: {
    leagueId: { control: 'text', name: 'MFL League ID (Display Only)' },
    // We'll use a more complex control for matchups or rely on changing individual scores
    // For simplicity, let's allow tweaking one matchup's scores directly
    matchup1_team1Score: { control: { type: 'number', step: 0.05 }, name: 'Matchup 1 - Team 1 Score' },
    matchup1_team2Score: { control: { type: 'number', step: 0.05 }, name: 'Matchup 1 - Team 2 Score' },
    matchup2_team1Score: { control: { type: 'number', step: 0.05 }, name: 'Matchup 2 - Team 1 Score' },
    matchup2_team2Score: { control: { type: 'number', step: 0.05 }, name: 'Matchup 2 - Team 2 Score' },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#22252b' }], // Theme background
    },
    // To show jest mocks in action panel
    jest: ['../lib/mflApi', '../config.js'] 
  },
};

const Template = (args) => {
  // Update the storybookScoresData based on current args
  // This creates a new structure each time args change to trigger re-render via mocked getScores
  const currentMatchups = [...defaultArgs.matchups]; // Start with default structure
  if (args.matchup1_team1Score !== undefined) currentMatchups[0].team1Score = args.matchup1_team1Score;
  if (args.matchup1_team2Score !== undefined) currentMatchups[0].team2Score = args.matchup1_team2Score;
  if (args.matchup2_team1Score !== undefined && currentMatchups[1]) currentMatchups[1].team1Score = args.matchup2_team1Score;
  if (args.matchup2_team2Score !== undefined && currentMatchups[1]) currentMatchups[1].team2Score = args.matchup2_team2Score;
  
  storybookScoresData = transformArgsToScoresData({ ...defaultArgs, matchups: currentMatchups, leagueId: args.leagueId });

  // Key the component on stringified data to force remount when data fundamentally changes
  // This ensures useEffect in Scoreboard re-runs with new initial data from the mocked getScores
  return <Scoreboard key={JSON.stringify(storybookScoresData)} />;
};

export const LiveDemo = Template.bind({});
LiveDemo.args = {
  leagueId: defaultArgs.leagueId,
  matchup1_team1Score: defaultArgs.matchups[0].team1Score,
  matchup1_team2Score: defaultArgs.matchups[0].team2Score,
  matchup2_team1Score: defaultArgs.matchups[1].team1Score,
  matchup2_team2Score: defaultArgs.matchups[1].team2Score,
};
LiveDemo.storyName = "Live Scoreboard Demo";

export const EmptyState = Template.bind({});
EmptyState.args = {
  leagueId: defaultArgs.leagueId,
  matchups: [], // This will result in empty liveScoring.matchup
};
EmptyState.decorators = [
  (Story) => {
    storybookScoresData = transformArgsToScoresData({ matchups: [] });
    return <Story />;
  }
];

export const LoadingState = Template.bind({});
LoadingState.decorators = [
  (Story) => {
    // Temporarily override mock to simulate loading
    const mflApiMock = jest.requireActual('../lib/mflApi'); // Use jest.requireActual for the non-mocked version initially
    jest.spyOn(mflApiMock, 'getScores').mockImplementationOnce(() => new Promise(() => {})); // Spy and mock
    
    const storyRender = <Story />;
    // jest.restoreAllMocks(); // Restore after render if necessary, or rely on Storybook's own cleanup
    return storyRender;
  }
];

// To truly test error state, getScores would need to be rejectable from args, which is complex.
// For now, assume error state tested via unit tests primarily. 