// const { jest } = require('@jest/globals'); // CommonJS import - try removing if jest is global

// Mock the config file
const MOCKED_CACHE_BASE_URL = 'https://example.com/data';
const MOCKED_REFRESH_INTERVALS = {
  scores: 100,
  standings: 200,
  transactions: 150,
  finances: 250,
};

jest.mock('../config.js', () => ({
  __esModule: true, // Still good practice for mixed modules, though mflApi.js is ESM
  MFL_LEAGUE_ID: '12345',
  CACHE_BASE_URL: MOCKED_CACHE_BASE_URL,
  REFRESH_INTERVALS: MOCKED_REFRESH_INTERVALS,
}), { virtual: true }); // virtual: true is important for mocking files that might not exist

// Mock global fetch
global.fetch = jest.fn();

// mflApi will be required in beforeEach after resetting modules
let mflApi;

describe('MFL API Client Wrapper', () => {
  beforeEach(() => {
    jest.resetModules(); // Reset modules to clear cache in mflApi.js
    mflApi = require('./mflApi'); // Re-require after reset
    fetch.mockClear();
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getStandings should fetch data and cache it', async () => {
    const mockStandingsData = { league: { name: 'Test League Standings' } };
    fetch.mockResolvedValueOnce({ 
      ok: true,
      json: () => Promise.resolve(mockStandingsData),
    });

    const data1 = await mflApi.getStandings();
    expect(fetch).toHaveBeenCalledTimes(1);
    const fetchUrl1 = fetch.mock.calls[0][0];
    expect(fetchUrl1.startsWith(`${MOCKED_CACHE_BASE_URL}/standings.json?t=`)).toBe(true);
    expect(data1).toEqual(mockStandingsData);

    const data2 = await mflApi.getStandings();
    expect(fetch).toHaveBeenCalledTimes(1); 
    expect(data2).toEqual(mockStandingsData);
  });

  test('getScores should fetch data and respect refresh interval', async () => {
    jest.useFakeTimers();
    const mockScoresData1 = { scores: [{ gameId: '101', score: '10-7' }] };
    const mockScoresData2 = { scores: [{ gameId: '101', score: '14-7' }] };

    fetch.mockResolvedValueOnce({ 
      ok: true,
      json: () => Promise.resolve(mockScoresData1),
    });

    const data1 = await mflApi.getScores();
    expect(fetch).toHaveBeenCalledTimes(1);
    const fetchUrlScores1 = fetch.mock.calls[0][0];
    expect(fetchUrlScores1.startsWith(`${MOCKED_CACHE_BASE_URL}/scores.json?t=`)).toBe(true);
    expect(data1).toEqual(mockScoresData1);

    const data2 = await mflApi.getScores();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(data2).toEqual(mockScoresData1);

    jest.advanceTimersByTime(MOCKED_REFRESH_INTERVALS.scores + 1);

    fetch.mockResolvedValueOnce({ 
      ok: true,
      json: () => Promise.resolve(mockScoresData2),
    });

    const data3 = await mflApi.getScores();
    expect(fetch).toHaveBeenCalledTimes(2);
    const fetchUrlScores2 = fetch.mock.calls[1][0];
    expect(fetchUrlScores2.startsWith(`${MOCKED_CACHE_BASE_URL}/scores.json?t=`)).toBe(true);
    expect(data3).toEqual(mockScoresData2);

    jest.useRealTimers();
  });

  test('getTransactions should handle fetch errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(mflApi.getTransactions()).rejects.toThrow('Network Error');
    expect(fetch).toHaveBeenCalledTimes(1);
    const fetchUrlTrans = fetch.mock.calls[0][0];
    expect(fetchUrlTrans.startsWith(`${MOCKED_CACHE_BASE_URL}/transactions.json?t=`)).toBe(true);
  });

  test('getFinances should handle non-ok responses', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not Found' }),
    });

    await expect(mflApi.getFinances()).rejects.toThrow('Failed to fetch finances data. Status: 404');
    expect(fetch).toHaveBeenCalledTimes(1);
    const fetchUrlFin = fetch.mock.calls[0][0];
    expect(fetchUrlFin.startsWith(`${MOCKED_CACHE_BASE_URL}/finances.json?t=`)).toBe(true);
  });

  // eslint-disable-next-line no-promise-executor-return
  test.skip('Concurrent requests for the same resource should use the same promise', async () => {
    const mockData = { info: 'shared data' };
    
    // This setup ensures fetch is only called once if the promise is cached and reused
    fetch.mockImplementationOnce(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) })
    );

    const promise1 = mflApi.getStandings();
    const promise2 = mflApi.getStandings();

    const [data1, data2] = await Promise.all([promise1, promise2]);

    expect(fetch).toHaveBeenCalledTimes(1); // Check that fetch was called only once
    expect(data1).toEqual(mockData);
    expect(data2).toEqual(mockData);
    expect(data1).toBe(data2); // Check they are the same object from the resolved promise
  });
}); 