const React = require('react');
const { render, screen, act } = require('@testing-library/react');
const Scoreboard = require('./Scoreboard.jsx');

// --- Mocks ---
jest.mock('../lib/mflApi', () => ({
  getScores: jest.fn(),
}));

// Mock config.js if it's directly imported by Scoreboard.jsx for REFRESH_INTERVALS
jest.mock('../config.js', () => ({
  REFRESH_INTERVALS: {
    scores: 30000, // Use a known value for tests
  },
}), { virtual: true });

jest.mock('../lib/vegas', () => ({
  calculateVegasLine: jest.fn((scoreA, _scoreB) => {
    if (scoreA === 21.50) return { line: 'Vikings Line', winProbA: 0.65, winProbB: 0.35 };
    if (scoreA === 7.00) return { line: 'Bears Line', winProbA: 0.40, winProbB: 0.60 };
    return {
      line: 'Default Mock Line -0.5',
      winProbA: 0.55,
      winProbB: 0.45,
      favoredTeam: 'A',
      spread: 0.5,
    };
  }),
}));

// Mock Card component
jest.mock('../components/Card.jsx', () => {
  const MockCard = ({ children, className }) => (
    <div data-testid="card" className={className}>{children}</div>
  );
  return MockCard;
});

// Mock ProbBar component
jest.mock('../components/ProbBar.jsx', () => {
  const MockProbBar = ({ percentage, className }) => (
    <div data-testid="prob-bar" data-percentage={percentage} className={className}>ProbBar</div>
  );
  return MockProbBar;
});

const { getScores } = require('../lib/mflApi');
const { calculateVegasLine } = require('../lib/vegas');

const mockFranchiseData = {
  '0001': { id: '0001', name: 'Vikings', icon: 'vikings.png' },
  '0002': { id: '0002', name: 'Packers', icon: 'packers.png' },
  '0003': { id: '0003', name: 'Bears', icon: 'bears.png' },
  '0004': { id: '0004', name: 'Lions', icon: 'lions.png' },
};

const mockScoresPayload = {
  liveScoring: {
    matchup: [
      {
        franchise: [
          { id: '0001', score: '21.50', playersCurrentlyPlaying: '1', gameSecondsRemaining: '1800' },
          { id: '0002', score: '14.00', playersCurrentlyPlaying: '0', gameSecondsRemaining: '1800' },
        ],
      },
      {
        franchise: [
          { id: '0003', score: '7.00', playersCurrentlyPlaying: '0', gameSecondsRemaining: '3600' },
          { id: '0004', score: '10.25', playersCurrentlyPlaying: '1', gameSecondsRemaining: '900' },
        ],
      },
    ],
  },
  league: {
    franchises: {
      franchise: Object.values(mockFranchiseData),
    },
  },
  version: "1.0",
  encoding: "utf-8",
};

describe('Scoreboard Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    getScores.mockClear();
    calculateVegasLine.mockClear();
    // Provide a default successful mock implementation for getScores
    getScores.mockResolvedValue(mockScoresPayload);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('renders loading state initially', () => {
    getScores.mockImplementationOnce(() => new Promise(() => {})); // unresolved promise
    render(<Scoreboard />);
    expect(screen.getByText(/Loading scores.../i)).toBeInTheDocument();
  });

  test('renders error state if fetching scores fails', async () => {
    getScores.mockRejectedValueOnce(new Error('API Error'));
    render(<Scoreboard />);
    await act(async () => {
      await Promise.resolve(); // Wait for promises to resolve
      jest.runOnlyPendingTimers(); // Resolve initial fetch call
    });
    expect(screen.getByText(/Error loading scores: API Error/i)).toBeInTheDocument();
  });

  test('renders error message if data is missing expected structure', async () => {
    // Clear the default mock first
    getScores.mockReset();
    // Then set a specific implementation for this test - return an incomplete response
    getScores.mockResolvedValueOnce({ liveScoring: { matchup: [] } });
    
    render(<Scoreboard />);
    await act(async () => {
      await Promise.resolve(); // Wait for promises to resolve
      jest.runOnlyPendingTimers();
    });
    
    expect(screen.getByText('Error loading scores: No data returned from API.')).toBeInTheDocument();
  });

  test('fetches scores on mount and renders matchups', async () => {
    render(<Scoreboard />);
    await act(async () => {
      await Promise.resolve(); // Wait for promises to resolve
      jest.advanceTimersByTime(100); // Just run enough to trigger initial fetch
    });
    expect(getScores).toHaveBeenCalledTimes(1);
    expect(screen.getAllByTestId('card').length).toBe(mockScoresPayload.liveScoring.matchup.length);
    expect(screen.getByText('Vikings')).toBeInTheDocument();
    expect(screen.getByText('21.50')).toBeInTheDocument();
    expect(screen.getByText('Packers')).toBeInTheDocument();
    expect(screen.getByText('14.00')).toBeInTheDocument();
    expect(calculateVegasLine).toHaveBeenCalledTimes(mockScoresPayload.liveScoring.matchup.length);
  });

  test('calls calculateVegasLine with correct scores and names', async () => {
    render(<Scoreboard />);
    await act(async () => {
      await Promise.resolve(); // Wait for promises to resolve
      jest.advanceTimersByTime(100);
    });
    expect(calculateVegasLine).toHaveBeenCalledWith(21.50, 14.00, 'Vikings', 'Packers');
    expect(calculateVegasLine).toHaveBeenCalledWith(7.00, 10.25, 'Bears', 'Lions');
  });

  test('renders ProbBar with correct win probability for Team A', async () => {
    render(<Scoreboard />);
    await act(async () => {
      await Promise.resolve(); // Wait for promises to resolve
      jest.advanceTimersByTime(100);
    });

    const probBars = screen.getAllByTestId('prob-bar');
    // Based on the mock for calculateVegasLine where scoreA for Vikings is 21.50 (winProbA: 0.65)
    expect(probBars[0]).toHaveAttribute('data-percentage', '65'); 
    // Based on the mock for calculateVegasLine where scoreA for Bears is 7.00 (winProbA: 0.40)
    expect(probBars[1]).toHaveAttribute('data-percentage', '40');
  });

  test('refetches scores periodically based on REFRESH_INTERVALS.scores', async () => {
    render(<Scoreboard />);
    await act(async () => {
      await Promise.resolve(); // Wait for promises to resolve
      jest.advanceTimersByTime(100); // Initial fetch
    });
    expect(getScores).toHaveBeenCalledTimes(1);

    await act(async () => {
      await Promise.resolve(); // Wait for promises to resolve
      jest.advanceTimersByTime(30000); // REFRESH_INTERVALS.scores from mock
    });
    expect(getScores).toHaveBeenCalledTimes(2);
  });
}); 