const { JSDOM } = require('jsdom');
const fs = require('fs'); // To load main.js content
const path = require('path');

// HTML content for the JSDOM instance
const testHtml = `
  <!DOCTYPE html>
  <html>
  <head><title>Test</title></head>
  <body>
    <nav id="mainNav">
      <a href="#scoreboard" class="text-text">Scoreboard</a>
      <a href="#standings" class="text-text">Standings</a>
      <a href="#transactions" class="text-text">Transactions</a>
    </nav>
  </body>
  </html>
`;

// Read the main.js file content
const mainJsPath = path.resolve(__dirname, './main.js');
const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');

describe('setActiveLink', () => {
  let window;
  let document;
  let setActiveLinkFn;

  beforeEach(() => {
    const dom = new JSDOM(testHtml, {
      runScripts: 'dangerously', // Allow script execution
      pretendToBeVisual: true, // Helps with layout-dependent APIs
    });
    window = dom.window;
    document = window.document;

    // Inject main.js content into a script tag
    const scriptEl = document.createElement('script');
    scriptEl.textContent = mainJsContent;
    document.body.appendChild(scriptEl);

    // Manually trigger DOMContentLoaded to ensure event listeners in main.js run
    document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true, cancelable: true }));

    // Access the function from window.testingHooks (as set by main.js)
    if (window.testingHooks && typeof window.testingHooks.setActiveLink === 'function') {
      setActiveLinkFn = window.testingHooks.setActiveLink;
    } else {
      throw new Error('MFL_setActiveLink function not found. Check main.js and test setup.');
    }
    
    // Reset hash for each test
    window.location.hash = '';
    // Reset classes (MFL_setActiveLink adds text-text if text-accent is removed)
    document.querySelectorAll('#mainNav a').forEach(link => {
        link.classList.remove('text-accent');
        link.classList.add('text-text');
    });
  });

  test('should add text-accent to the link matching window.location.hash', () => {
    window.location.hash = '#standings';
    const activeLink = setActiveLinkFn(); // This uses the window/document from the JSDOM instance
    const standingsLink = document.querySelector('a[href="#standings"]');
    
    expect(activeLink).toBe(standingsLink);
    expect(standingsLink.classList.contains('text-accent')).toBe(true);
    expect(standingsLink.classList.contains('text-text')).toBe(false);

    const scoreboardLink = document.querySelector('a[href="#scoreboard"]');
    expect(scoreboardLink.classList.contains('text-accent')).toBe(false);
  });

  test('should return null if no link matches the hash', () => {
    window.location.hash = '#nonexistent';
    const activeLink = setActiveLinkFn();
    expect(activeLink).toBeNull();
    document.querySelectorAll('#mainNav a').forEach(link => {
      expect(link.classList.contains('text-accent')).toBe(false);
    });
  });

  test('should remove text-accent from previously active link', () => {
    window.location.hash = '#scoreboard';
    setActiveLinkFn();
    const scoreboardLink = document.querySelector('a[href="#scoreboard"]');
    expect(scoreboardLink.classList.contains('text-accent')).toBe(true);

    window.location.hash = '#transactions';
    setActiveLinkFn();
    const transactionsLink = document.querySelector('a[href="#transactions"]');
    expect(transactionsLink.classList.contains('text-accent')).toBe(true);
    expect(scoreboardLink.classList.contains('text-accent')).toBe(false);
    expect(scoreboardLink.classList.contains('text-text')).toBe(true);
  });
}); 