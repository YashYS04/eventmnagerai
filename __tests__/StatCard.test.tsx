import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../src/components/Dashboard/StatCard';
import { Users } from 'lucide-react';

describe('StatCard', () => {
  it('renders title and value correctly', () => {
    render(<StatCard title="Live Seating" value="75%" icon={Users} status="good" />);
    expect(screen.getByText('Live Seating')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders subtitle if provided', () => {
    render(<StatCard title="Food Court" value="15m" subtitle="Busy" icon={Users} />);
    expect(screen.getByText('Busy')).toBeInTheDocument();
  });
});
