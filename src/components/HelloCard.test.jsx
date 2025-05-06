import React from 'react';
import { render, screen } from '@testing-library/react';
import HelloCard from './HelloCard';

describe('HelloCard', () => {
  test('renders hello message', () => {
    render(<HelloCard />);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('This is a Tailwind CSS card.')).toBeInTheDocument();
  });
}); 