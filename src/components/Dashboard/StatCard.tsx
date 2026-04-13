import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  status?: 'good' | 'warning' | 'danger' | 'neutral';
}

export function StatCard({ title, value, subtitle, icon: Icon, status = 'neutral' }: StatCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'var(--secondary)';
      case 'warning': return 'var(--warning)';
      case 'danger': return 'var(--accent)';
      default: return 'var(--primary)';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: `4px solid ${getStatusColor()}` }}>
      <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }}>
        <Icon color={getStatusColor()} size={28} />
      </div>
      <div>
        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
          {title}
        </h3>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
