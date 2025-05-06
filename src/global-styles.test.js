const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Global Styles and Utilities', () => {
  let document;
  let dom;

  beforeAll(() => {
    // Ensure dist/index.html and dist/main.css are available from the build
    const { execSync } = require('child_process');
    try {
      execSync('npm run build');
    } catch (error) {
      console.error('Error running npm run build for styles test:', error.stdout.toString());
    }

    const htmlPath = path.resolve(__dirname, '../docs/index.html');
    const cssPath = path.resolve(__dirname, '../docs/main.css'); // For referencing CSS content
    let htmlContent = '<html><head></head><body></body></html>'; // Default if file not found
    let cssContent = '';

    try {
      htmlContent = fs.readFileSync(htmlPath, 'utf8');
    } catch (error) {
      console.error(`Could not read docs/index.html: ${error.message}`);
    }
    try {
      cssContent = fs.readFileSync(cssPath, 'utf8');
    } catch (error) {
      console.error(`Could not read docs/main.css: ${error.message}`);
    }

    // Create a JSDOM instance
    dom = new JSDOM(htmlContent);
    document = dom.window.document;

    // Inject the CSS for computed style checks
    if (cssContent) {
      const styleEl = document.createElement('style');
      styleEl.textContent = cssContent;
      document.head.appendChild(styleEl);
    }
  });

  test('applies correct styles to .card element', () => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    document.body.appendChild(cardElement);

    const computedStyle = dom.window.getComputedStyle(cardElement);
    // Tailwind converts hex colors to rgb() in the stylesheet
    expect(computedStyle.backgroundColor).toMatch(/^rgb\(45 48 56/); // #2d3038
    expect(computedStyle.borderRadius).toBe('.75rem'); // rounded-xl (adjusted for JSDOM output)
    // Note: shadow-sm and shadow-alt are harder to assert precisely without complex parsing
  });

  test('applies correct styles to .btn-primary element', () => {
    const btnElement = document.createElement('button');
    btnElement.className = 'btn-primary';
    document.body.appendChild(btnElement);

    const computedStyle = dom.window.getComputedStyle(btnElement);
    expect(computedStyle.backgroundColor).toMatch(/^rgb\(50 227 192/); // #32e3c0 (accent)
    expect(computedStyle.color).toMatch(/^rgb\(34 37 43/);           // #22252b (bg)
    expect(computedStyle.borderRadius).toBe('.5rem'); // rounded-lg (adjusted for JSDOM output)
  });
}); 