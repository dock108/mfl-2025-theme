const React = require('react');
// const ReactDOM = require('react-dom'); // Old way
const { createRoot } = require('react-dom/client'); // New way for React 18
const Scoreboard = require('./modules/Scoreboard.jsx'); // Adjust path as needed

// Simpler approach: Define functions globally for access, then wrap calls in DOMContentLoaded.
function mflSetActivLink() {
  const mainNav = document.getElementById('mainNav'); // Re-query mainNav here
  const currentHash = window.location.hash;
  const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];
  let activeLinkFound = false;

  navLinks.forEach(link => {
    link.classList.remove('text-accent');
    if (!link.classList.contains('text-text')) {
      link.classList.add('text-text');
    }
    if (link.getAttribute('href') === currentHash) {
      link.classList.add('text-accent');
      link.classList.remove('text-text');
      activeLinkFound = true;
    }
  });
  return activeLinkFound ? document.querySelector(`a[href="${currentHash}"]`) : null;
}

document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burgerBtn');
  const mainNav = document.getElementById('mainNav'); // mainNav for burger logic

  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', () => {
      const isExpanded = burgerBtn.getAttribute('aria-expanded') === 'true';
      mainNav.classList.toggle('hidden');
      mainNav.classList.toggle('flex'); // Or your specific display class for mobile nav
      burgerBtn.setAttribute('aria-expanded', String(!isExpanded));
    });
  }

  // Initial and on-change calls for setActiveLink
  if (document.getElementById('mainNav')) { // Check if mainNav exists in current DOM
      mflSetActivLink();
      window.addEventListener('hashchange', mflSetActivLink);
  }

  // Render Scoreboard
  const scoreboardContainer = document.getElementById('scoreboard');
  if (scoreboardContainer) {
    console.log('Rendering Scoreboard module with createRoot...');
    const root = createRoot(scoreboardContainer);
    root.render(React.createElement(Scoreboard));
  } else {
    console.warn('#scoreboard container not found in layout.html. Scoreboard will not be rendered.');
  }

  // Any other React modules can be rendered here in their respective containers
});

console.log('MFL theme main.js loaded - updated with React 18 createRoot and scoreboard.');

// Expose for testing if in test environment (e.g., JSDOM is present)
if (typeof window !== 'undefined') { 
    window.testingHooks = {
        setActiveLink: mflSetActivLink // Expose the global version
    };
} 