const React = require('react');

/**
 * Button component: A primary CTA button.
 * Uses the '.btn-primary' class and handles disabled state.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Content to be rendered inside the button (e.g., text).
 * @param {function} [props.onClick] - Click handler.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {string} [props.type='button'] - Button type (button, submit, reset).
 */
function Button({ children, onClick, disabled = false, className = '', type = 'button' }) {
  const buttonClasses = `btn-primary ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

module.exports = Button; 