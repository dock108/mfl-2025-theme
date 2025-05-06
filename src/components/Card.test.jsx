const React = require('react');
const { render, screen } = require('@testing-library/react');
const Card = require('./Card.jsx');

describe('Card', () => {
  test('renders children and default classes', () => {
    const { container } = render(<Card>Test Content</Card>);
    
    // Get the card element directly from the container
    const cardElement = container.querySelector('div');
    expect(cardElement).toBeInTheDocument();
    
    // Debug output
    console.log('Card element classes:', cardElement.className);
    
    expect(cardElement).toHaveClass('card');
    expect(cardElement).toHaveClass('glow-hover');
    expect(cardElement).toHaveClass('p-5');
  });

  test('applies additional className prop', () => {
    const { container } = render(<Card className="extra-class">Test Content</Card>);
    
    // Get the card element directly from the container
    const cardElement = container.querySelector('div');
    
    // Debug output
    console.log('Card element with extra class:', cardElement.className);
    
    expect(cardElement).toHaveClass('card');
    expect(cardElement).toHaveClass('glow-hover');
    expect(cardElement).toHaveClass('p-5');
    expect(cardElement).toHaveClass('extra-class');
  });
}); 