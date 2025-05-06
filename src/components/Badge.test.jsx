const React = require('react');
const { render, screen } = require('@testing-library/react');
const Badge = require('./Badge.jsx');

describe('Badge', () => {
  test('renders with default variant and children', () => {
    render(<Badge>Default Text</Badge>);
    const badgeElement = screen.getByText('Default Text');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('badge'); // Global .badge class
  });

  test('renders with accent variant', () => {
    render(<Badge variant="accent">Accent Text</Badge>);
    const badgeElement = screen.getByText('Accent Text');
    expect(badgeElement).toHaveClass('bg-accent', 'text-bg'); // Classes defined in component for accent
  });

  test('applies additional className', () => {
    render(<Badge className="extra-badge-class">Extra</Badge>);
    expect(screen.getByText('Extra')).toHaveClass('badge', 'extra-badge-class');
  });

  test('applies additional className with accent variant', () => {
    render(<Badge variant="accent" className="extra-badge-class">Accent Extra</Badge>);
    const badgeElement = screen.getByText('Accent Extra');
    expect(badgeElement).toHaveClass('bg-accent', 'text-bg', 'extra-badge-class');
  });
}); 