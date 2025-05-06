const React = require('react');
const { render, screen } = require('@testing-library/react');
const Card = require('./Card.jsx');

describe('Card', () => {
  test('renders children and default classes', () => {
    render(<Card>Test Content</Card>);
    const cardElement = screen.getByText('Test Content').parentElement;
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveClass('card', 'glow-hover', 'p-5');
  });

  test('applies additional className prop', () => {
    render(<Card className="extra-class">Test Content</Card>);
    const cardElement = screen.getByText('Test Content').parentElement;
    expect(cardElement).toHaveClass('card', 'glow-hover', 'p-5', 'extra-class');
  });
}); 