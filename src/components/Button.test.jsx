const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const Button = require('./Button.jsx');

describe('Button', () => {
  test('renders with default props and children', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /Click Me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('btn-primary');
    expect(buttonElement).not.toBeDisabled();
    expect(buttonElement).toHaveAttribute('type', 'button');
  });

  test('applies additional className', () => {
    render(<Button className="extra-button-class">Submit</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary', 'extra-button-class');
  });

  test('handles onClick event', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Test</Button>);
    fireEvent.click(screen.getByRole('button', { name: /Click Test/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders as disabled with correct classes', () => {
    render(<Button disabled>Disabled</Button>);
    const buttonElement = screen.getByRole('button', { name: /Disabled/i });
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  test('renders with specified type', () => {
    render(<Button type="submit">Submit Type</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
}); 