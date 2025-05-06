const React = require('react');
const { render, screen } = require('@testing-library/react');
const ProbBar = require('./ProbBar.jsx');

describe('ProbBar', () => {
  test('renders with correct default classes and ARIA attributes', () => {
    const { container } = render(<ProbBar percentage={50} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.parentElement).toHaveClass('deg-bar', 'w-full');
    expect(progressBar).toHaveClass('h-full', 'bg-accent', 'rounded-[3px]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  test('sets correct width based on percentage prop', () => {
    const { rerender, container } = render(<ProbBar percentage={25} />);
    let progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle('width: 25%');

    rerender(<ProbBar percentage={75} />);
    progressBar = container.querySelector('[role="progressbar"]'); // Re-fetch after rerender
    expect(progressBar).toHaveStyle('width: 75%');
  });

  test('clamps percentage between 0 and 100', () => {
    // Render components in separate containers
    const { container: container1 } = render(<ProbBar percentage={150} />);
    let progressBar = container1.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle('width: 100%');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');

    const { container: container2 } = render(<ProbBar percentage={-50} />);
    progressBar = container2.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle('width: 0%');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  test('applies additional classNames', () => {
    const { container } = render(
      <ProbBar
        percentage={50}
        className="outer-extra"
        barClassName="inner-extra"
      />
    );
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar.parentElement).toHaveClass('outer-extra');
    expect(progressBar).toHaveClass('inner-extra');
  });

  test('renders sr-only text for accessibility', () => {
    const { container } = render(<ProbBar percentage={67} />);
    expect(container.querySelector('.sr-only')).toHaveTextContent('67%');
  });

  // Snapshot test for basic structure and width calculation
  test('matches snapshot for given percentage', () => {
    const { container } = render(<ProbBar percentage={58} />);
    // The container includes the JSDOM wrapper, so we might want to select the first child
    expect(container.firstChild).toMatchSnapshot();
  });
}); 