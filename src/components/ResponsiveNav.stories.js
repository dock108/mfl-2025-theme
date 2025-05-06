const React = require('react');
const fs = require('fs');
const path = require('path');

let layoutHtml = '';
try {
  layoutHtml = fs.readFileSync(path.resolve(__dirname, '../src/layout.html'), 'utf8');
} catch (e) {
  layoutHtml = '<p>Error loading layout.html.</p>';
  console.error("Failed to load layout.html for Header story:", e);
}

// Extract just the header from the layoutHtml
const headerMatch = layoutHtml.match(/<header[\s\S]*?<\/header>/i);
const headerHtml = headerMatch ? headerMatch[0] : '<p>Could not extract header.</p>';

// Component to render the header HTML and include main.js for interactivity
function ResponsiveHeader() {
  React.useEffect(() => {
    // Manually execute the relevant parts of main.js for the Storybook context
    // This is a simplified approach. A better way might be to have main.js functions
    // be callable and idempotent if run multiple times, or use a proper module system.
    
    const burgerBtn = document.getElementById('burgerBtn');
    const mainNav = document.getElementById('mainNav');

    const burgerClickHandler = () => {
      if (mainNav && burgerBtn) {
        const currentExpandedState = burgerBtn.getAttribute('aria-expanded') === 'true';
        burgerBtn.setAttribute('aria-expanded', !currentExpandedState);
        mainNav.classList.toggle('hidden');
        mainNav.classList.toggle('flex');
      }
    };

    if (burgerBtn && mainNav) {
      // Remove existing listener if any to prevent multiple attachments on HMR
      // This is a naive way; a more robust solution would be needed for complex scenarios
      // For this simple case, it might be okay, or ensure main.js itself is idempotent.
      burgerBtn.removeEventListener('click', burgerBtn.storyClickHandler);
      burgerBtn.addEventListener('click', burgerClickHandler);
      burgerBtn.storyClickHandler = burgerClickHandler; // Store to remove later
    }

    // Active link logic might be complex to replicate perfectly here without full page context
    // For Storybook, usually focus on component states rather than full app logic.
    // If MFL_setActiveLink is global (as per our main.js for testing), we can call it.
    if (typeof window.MFL_setActiveLink === 'function') {
        // window.MFL_setActiveLink(); // Be cautious with this in Storybook if hash changes aren't natural
    }

    return () => {
      if (burgerBtn && burgerBtn.storyClickHandler) {
        burgerBtn.removeEventListener('click', burgerBtn.storyClickHandler);
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return <div dangerouslySetInnerHTML={{ __html: headerHtml }} />;
}

module.exports = {
  title: 'Navigation/Header Responsive Nav',
  component: ResponsiveHeader,
  parameters: {
    // layout: 'fullscreen', // Optional: view in full screen
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile (375px)',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        desktop: {
          name: 'Desktop (1280px)',
          styles: {
            width: '1280px',
            height: '720px',
          },
        },
      },
      defaultViewport: 'desktop',
    },
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#22252b' }], // Match theme bg
    },
  },
  // argTypes for viewport control if needed, though parameters.viewport is often enough
}; 