const { calculateVegasLine } = require('./vegas');

describe('calculateVegasLine', () => {
  test('should return Even line for a 0 point difference', () => {
    const result = calculateVegasLine(10, 10, 'Team A', 'Team B');
    expect(result.line).toBe('Even');
    expect(result.winProbA).toBeCloseTo(0.5);
    expect(result.winProbB).toBeCloseTo(0.5);
    expect(result.favoredTeam).toBeNull();
    expect(result.spread).toBe(0);
  });

  test('should correctly calculate line and winProb when Team A is favored by 7 points', () => {
    const result = calculateVegasLine(27, 20, 'Alpha', 'Beta'); // 7 point diff
    expect(result.line).toBe('Alpha -3.5');
    expect(result.winProbA).toBeCloseTo(0.73, 2); // Approx 73%
    expect(result.winProbB).toBeCloseTo(0.27, 2);
    expect(result.favoredTeam).toBe('A');
    expect(result.spread).toBe(3.5);
  });

  test('should correctly calculate line and winProb when Team B is favored by 7 points', () => {
    const result = calculateVegasLine(20, 27, 'Alpha', 'Beta'); // -7 point diff
    expect(result.line).toBe('Beta -3.5');
    expect(result.winProbA).toBeCloseTo(0.27, 2);
    expect(result.winProbB).toBeCloseTo(0.73, 2);
    expect(result.favoredTeam).toBe('B');
    expect(result.spread).toBe(3.5);
  });

  test('should correctly calculate for a 3 point difference (Team A favored)', () => {
    const result = calculateVegasLine(23, 20, 'Winners', 'Losers'); // +3 diff
    expect(result.line).toBe('Winners -1.5');
    expect(result.winProbA).toBeCloseTo(1 / (1 + Math.exp(-0.142 * 3)), 3); // 0.598
    expect(result.winProbB).toBeCloseTo(1 - (1 / (1 + Math.exp(-0.142 * 3))), 3); // 0.402
    expect(result.favoredTeam).toBe('A');
    expect(result.spread).toBe(1.5);
  });

  test('should correctly calculate for a 10 point difference (Team B favored)', () => {
    const result = calculateVegasLine(10, 20, 'Underdogs', 'Favorites'); // -10 diff
    expect(result.line).toBe('Favorites -5.0');
    expect(result.winProbA).toBeCloseTo(1 / (1 + Math.exp(-0.142 * -10)), 3); // 0.194
    expect(result.winProbB).toBeCloseTo(1 - (1 / (1 + Math.exp(-0.142 * -10))), 3); // 0.806
    expect(result.favoredTeam).toBe('B');
    expect(result.spread).toBe(5.0);
  });

  test('should handle non-integer score differences for line calculation (e.g. 2.5 point spread)', () => {
    // To get a 2.5 point spread, diff must be 5
    const result = calculateVegasLine(25, 20, 'Team X', 'Team Y'); // +5 diff
    expect(result.line).toBe('Team X -2.5');
    expect(result.favoredTeam).toBe('A');
    expect(result.spread).toBe(2.5);
  });

  test('should use default team names if not provided', () => {
    const result = calculateVegasLine(17, 10);
    expect(result.line).toBe('Team A -3.5');
  });
}); 