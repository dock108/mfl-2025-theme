const React = require('react');
const { render, screen } = require('@testing-library/react');
const ProbBar = require('./ProbBar.jsx');

describe('ProbBar', () => {
  test('renders with correct default classes and ARIA attributes', () => {
    render(<ProbBar percentage={50} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.parentElement).toHaveClass('deg-bar', 'w-full');
    expect(progressBar).toHaveClass('h-full', 'bg-accent', 'rounded-[3px]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  test('sets correct width based on percentage prop', () => {
    const { rerender } = render(<ProbBar percentage={25} />);
    let progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 25%');

    rerender(<ProbBar percentage={75} />);
    progressBar = screen.getByRole('progressbar'); // Re-fetch after rerender
    expect(progressBar).toHaveStyle('width: 75%');
  });

  test('clamps percentage between 0 and 100', () => {
    render(<ProbBar percentage={150} />);
    let progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 100%');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');

    render(<ProbBar percentage={-50} />); // New render to reset component state
    progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 0%');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  test('applies additional classNames', () => {
    render(
      <ProbBar
        percentage={50}
        className="outer-extra"
        barClassName="inner-extra"
      />
    );
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.parentElement).toHaveClass('outer-extra');
    expect(progressBar).toHaveClass('inner-extra');
  });

  test('renders sr-only text for accessibility', () => {
    render(<ProbBar percentage={67} />);
    expect(screen.getByText('67%')).toHaveClass('sr-only');
  });

  // Snapshot test for basic structure and width calculation
  test('matches snapshot for given percentage', () => {
    const { container } = render(<ProbBar percentage={58} />);
    // The container includes the JSDOM wrapper, so we might want to select the first child
    expect(container.firstChild).toMatchSnapshot();
  });
}); 