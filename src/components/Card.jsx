const React = require('react');

/**
 * Card component: A simple wrapper with card styling.
 * Applies '.card', '.glow-hover', and '.p-5' classes.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Content to be rendered inside the card.
 * @param {string} [props.className] - Additional CSS classes to apply to the card.
 */
function Card({ children, className = '' }) {
  // The base .card class is defined in src/styles/index.css
  // We add glow-hover and ensure p-5 as per requirements.
  // The global .card class has p-4, so we might need to decide if this overrides or combines.
  // For now, assuming this Card component defines its own padding preference if different.
  const cardClasses = `card glow-hover p-5 ${className}`.trim();

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
}

module.exports = Card; 