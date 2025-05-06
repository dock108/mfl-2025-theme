const React = require('react');

/**
 * Badge component: A small label pill, often for status or short info.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Content of the badge.
 * @param {string} [props.variant='default'] - 'default' or 'accent'.
 * @param {string} [props.className] - Additional CSS classes.
 */
function Badge({ children, variant = 'default', className = '' }) {
  let variantClasses = 'badge'; // .badge is the default style from global CSS

  if (variant === 'accent') {
    // .badge uses bg-alt and text-accent by default.
    // For an 'accent' variant, let's assume we want bg-accent and text-bg (or text-alt for contrast)
    variantClasses = `bg-accent text-bg text-xs font-semibold px-2.5 py-0.5 rounded-full ${className}`.trim();
  } else {
    // Default variant uses the .badge class directly, allowing for className overrides/additions
    variantClasses = `badge ${className}`.trim();
  }

  return (
    <span className={variantClasses}>
      {children}
    </span>
  );
}

module.exports = Badge; 