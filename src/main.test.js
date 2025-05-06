const fs = require('fs');
const path = require('path');
const { JSDOM, ResourceLoader } = require('jsdom');

// Custom resource loader to prevent network requests for CSS/JS in JSDOM
class NoOpResourceLoader extends ResourceLoader {
  // eslint-disable-next-line class-methods-use-this
  fetch(url, _options) { // _options to address no-unused-vars
    // Log and ignore or return minimal valid content
    // console.log(`JSDOM ResourceLoader: Ignoring ${url}`);
    if (url.endsWith('.css')) {
      return Promise.resolve(Buffer.from('')); // Empty CSS
    }
    if (url.endsWith('.js')) {
      // For main.js, we inject it manually, so this shouldn't be hit for that specific file
      // if it's referenced by a script tag in index.html that we *don't* want to run.
      return Promise.resolve(Buffer.from('// JSDOM NoOp JS'));
    }
    return null; // Let other requests fail or be handled by default (shouldn't be any for this test)
  }
}

// Function to simulate setting up the DOM and script for main.js tests
function setupDOMWithScript() {
  const htmlPath = path.resolve(__dirname, '../docs/index.html');
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`HTML file not found for test setup: ${htmlPath}. Ensure docs/index.html is built.`);
  }
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const dom = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    resources: new NoOpResourceLoader(), // Use custom resource loader
    url: 'http://localhost/index.html' // Important for hash changes
  });

  // Set globals AFTER JSDOM instance is created and has a window
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.HTMLElement = dom.window.HTMLElement;
  global.Event = dom.window.Event;
  global.CustomEvent = dom.window.CustomEvent; // If main.js uses CustomEvent

  // Modify main.js content to remove/comment React parts for this test
  const mainJsPath = path.resolve(__dirname, 'main.js');
  if (!fs.existsSync(mainJsPath)) {
    throw new Error(`main.js not found for test setup: ${mainJsPath}`);
  }
  let mainJsContent = fs.readFileSync(mainJsPath, 'utf8');

  // Comment out React-specific requires and rendering logic
  mainJsContent = mainJsContent
    .replace(/^const React = require\('react'\);/m, '// const React = require(\'react\');')
    .replace(/^const \{ createRoot \} = require\('react-dom\/client'\);/m, '// const { createRoot } = require(\'react-dom/client\');')
    .replace(/^const Scoreboard = require\('\.\/modules\/Scoreboard\.jsx'\);/m, '// const Scoreboard = require(\'./modules/Scoreboard.jsx\');')
    .replace(/if \(scoreboardContainer\) \{[\s\S]*?const root = createRoot[\s\S]*?root\.render[\s\S]*?\}\s*else\s*\{[\s\S]*?\}/m, '// React rendering of Scoreboard removed for main.test.js')
    .replace(/^console\.log\("MFL theme main\.js loaded - updated .*"\);/m, '// Initial console log commented out for test');
    // Ensure the burger menu logic inside DOMContentLoaded is also preserved or correctly handled if not tested here.
    // The original main.js had burger setup and mflSetActivLink inside DOMContentLoaded.

  const scriptEl = dom.window.document.createElement('script');
  scriptEl.textContent = mainJsContent;
  dom.window.document.body.appendChild(scriptEl);

  // Manually trigger DOMContentLoaded if main.js relies on it for setup
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true, cancelable: true }));
  
  return dom.window; // Return window for direct access to testingHooks
}

describe('setActiveLink', () => {
  let testWindow;
  let setActiveLinkFn;

  beforeEach(() => {
    testWindow = setupDOMWithScript();
    
    if (testWindow.testingHooks && typeof testWindow.testingHooks.mflSetActivLink === 'function') {
      setActiveLinkFn = testWindow.testingHooks.mflSetActivLink;
    } else {
      // Fallback or log if main.js structure changed where testingHooks are defined
      // This might happen if DOMContentLoaded in main.js hasn't fully run or testingHooks isn't exposed as expected
      console.warn('testingHooks.mflSetActivLink not found directly after setupDOMWithScript. This might indicate an issue or change in main.js structure.');
      // Attempt to find it if it's globally defined in JSDOM context due to script execution
      if (typeof testWindow.mflSetActivLink === 'function') {
         console.warn('Found mflSetActivLink globally, using that.');
         setActiveLinkFn = testWindow.mflSetActivLink;
      } else if (testWindow.testingHooks) {
        console.warn('testingHooks found, but mflSetActivLink is not on it. Available hooks:', Object.keys(testWindow.testingHooks));
        throw new Error('mflSetActivLink function not found on testingHooks.');
      } else {
        throw new Error('mflSetActivLink function not found. testingHooks is undefined.');
      }
    }
    
    testWindow.location.hash = '';
    Array.from(testWindow.document.querySelectorAll('#mainNav a')).forEach(link => {
      link.classList.remove('text-accent');
      link.classList.add('text-text');
    });
  });

  test('should add text-accent to the link matching window.location.hash', () => {
    testWindow.location.hash = '#standings';
    const activeLink = setActiveLinkFn();
    const standingsLink = testWindow.document.querySelector('a[href="#standings"]');
    
    expect(activeLink).toBe(standingsLink);
    expect(standingsLink.classList.contains('text-accent')).toBe(true);
    expect(standingsLink.classList.contains('text-text')).toBe(false);

    const scoreboardLink = testWindow.document.querySelector('a[href="#scoreboard"]');
    expect(scoreboardLink.classList.contains('text-accent')).toBe(false);
  });

  test('should return null if no link matches the hash', () => {
    testWindow.location.hash = '#nonexistent';
    const activeLink = setActiveLinkFn();
    expect(activeLink).toBeNull();
    Array.from(testWindow.document.querySelectorAll('#mainNav a')).forEach(link => {
      expect(link.classList.contains('text-accent')).toBe(false);
    });
  });

  test('should remove text-accent from previously active link', () => {
    testWindow.location.hash = '#scoreboard';
    setActiveLinkFn();
    const scoreboardLink = testWindow.document.querySelector('a[href="#scoreboard"]');
    expect(scoreboardLink.classList.contains('text-accent')).toBe(true);

    testWindow.location.hash = '#transactions';
    setActiveLinkFn();
    const transactionsLink = testWindow.document.querySelector('a[href="#transactions"]');
    expect(transactionsLink.classList.contains('text-accent')).toBe(true);
    expect(scoreboardLink.classList.contains('text-accent')).toBe(false);
  });
}); 