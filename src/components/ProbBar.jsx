const React = require('react');

/**
 * ProbBar component: A horizontal bar showing a probability or percentage.
 * @param {object} props - Component props.
 * @param {number} props.percentage - The percentage value (0-100) to display.
 * @param {string} [props.className] - Additional CSS classes for the outer bar container.
 * @param {string} [props.barClassName] - Additional CSS classes for the inner probability bar.
 */
function ProbBar({ percentage, className = '', barClassName = '' }) {
  const validPercentage = Math.max(0, Math.min(100, percentage)); // Clamp between 0 and 100

  const outerClasses = `deg-bar w-full ${className}`.trim();
  // Inner bar uses the accent color by default
  const innerClasses = `h-full bg-accent rounded-[3px] ${barClassName}`.trim(); 
  // rounded-[3px] to be slightly less than deg-bar's 4px for a nice fit

  return (
    <div className={outerClasses} title={`${validPercentage.toFixed(0)}%`}>
      <div
        className={innerClasses}
        style={{ width: `${validPercentage}%` }}
        aria-valuenow={validPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
        role="progressbar"
      >
        <span className="sr-only">{validPercentage.toFixed(0)}%</span>
      </div>
    </div>
  );
}

module.exports = ProbBar; 