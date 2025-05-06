document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burgerBtn');
  const mainNav = document.getElementById('mainNav');

  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', () => {
      const isExpanded = mainNav.classList.toggle('hidden');
      mainNav.classList.toggle('flex'); // Assumes mobile nav should be flex column
      burgerBtn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      // Optional: Change burger icon or aria-label based on state
      // burgerBtn.innerHTML = isExpanded ? '☰' : '✕';
      // burgerBtn.setAttribute('aria-label', isExpanded ? 'Open navigation' : 'Close navigation');
    });
  }

  function setActiveLink() {
    const currentHash = window.location.hash;
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

    let activeLinkFound = false;

    navLinks.forEach(link => {
      link.classList.remove('text-accent');
      // Add back default text color if it was removed by text-accent
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

  // Set active link on initial load and on hash change
  if (mainNav) {
    setActiveLink();
    window.addEventListener('hashchange', setActiveLink);
  }
  
  // Export for testing if needed (though it runs on DOMContentLoaded)
  // This is a bit tricky for CJS if you want to test module functions directly
  // without a browser environment. For now, exposing via window for simple testing.
  if (typeof window !== 'undefined') {
    window.testingHooks = {
        setActiveLink
    };
  }

});

// Fallback console log if this is the only script, replacing placeholder.js logic
console.log('MFL theme main.js loaded'); 