const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Layout HTML (dist/index.html)', () => {
  let dom;
  let document;

  beforeAll(() => {
    // Run the build script to ensure dist/index.html is up-to-date
    // This is a bit unconventional for a unit test but necessary here
    // to test the output of the build process.
    const { execSync } = require('child_process');
    try {
      execSync('npm run build');
    } catch (error) {
      // If build fails, log it, but tests might still run on existing file
      console.error('Error running npm run build for layout test:', error.stdout.toString());
    }

    const htmlPath = path.resolve(__dirname, '../dist/index.html');
    let htmlContent;
    try {
      htmlContent = fs.readFileSync(htmlPath, 'utf8');
    } catch (error) {
      // Handle case where file doesn't exist after build attempt
      console.error(`Could not read dist/index.html. Ensure 'npm run build' runs successfully and creates this file. Error: ${error.message}`);
      // Create a minimal HTML structure to prevent JSDOM from failing if the file is missing, allowing other tests to proceed.
      htmlContent = '<html><body></body></html>'; 
    }
    dom = new JSDOM(htmlContent);
    document = dom.window.document;
  });

  test('should contain the main structural div IDs', () => {
    const ids = ['scoreboard', 'standings', 'transactions', 'waivers', 'cta'];
    ids.forEach(id => {
      const element = document.getElementById(id);
      // Check if element exists. JSDOM returns null if not found.
      expect(element).not.toBeNull(); 
    });
  });

  test('should link to main.css and main.js', () => {
    const cssLink = document.querySelector('link[href="../dist/main.css"]');
    expect(cssLink).not.toBeNull();

    const jsScript = document.querySelector('script[src="../dist/main.js"]');
    expect(jsScript).not.toBeNull();
    expect(jsScript.defer).toBe(true);
  });
}); 