// Simpler approach: Define functions globally for access, then wrap calls in DOMContentLoaded.
function MFL_setActiveLink() {
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
      // Corrected aria-expanded logic: toggle current state string to its opposite boolean, then back to string.
      let currentExpandedState = burgerBtn.getAttribute('aria-expanded') === 'true';
      burgerBtn.setAttribute('aria-expanded', !currentExpandedState);
      mainNav.classList.toggle('hidden');
      mainNav.classList.toggle('flex');
    });
  }

  // Initial and on-change calls for setActiveLink
  if (document.getElementById('mainNav')) { // Check if mainNav exists in current DOM
      MFL_setActiveLink();
      window.addEventListener('hashchange', MFL_setActiveLink);
  }
});

console.log('MFL theme main.js loaded');

// Expose for testing if in test environment (e.g., JSDOM is present)
if (typeof window !== 'undefined') { 
    window.testingHooks = {
        setActiveLink: MFL_setActiveLink // Expose the global version
    };
} 