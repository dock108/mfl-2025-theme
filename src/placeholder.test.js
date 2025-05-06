describe('placeholder.js', () => {
  test('logs to console', () => {
    // Store original console.log
    const originalConsoleLog = console.log;
    
    // Create a mock function for console.log
    console.log = jest.fn();
    
    // Import the module which should call console.log
    require('./placeholder.js');
    
    // Check if console.log was called with the expected message
    expect(console.log).toHaveBeenCalledWith('MFL theme placeholder loaded');
    
    // Restore original console.log
    console.log = originalConsoleLog;
  });
}); 