'use client';

import React from 'react';
import { useStadiumData } from '@/hooks/useStadiumData';
import { StatCard } from '@/components/Dashboard/StatCard';
import { SmartAssistant } from '@/components/Assistant/SmartAssistant';
import { Users, Utensils, DoorOpen, ShieldAlert, Ticket, Droplets, Clock, CalendarDays } from 'lucide-react';

export default function StadiumDashboard() {
  const data = useStadiumData();

  // Find the shortest gate wait time
  const gates = Object.entries(data.entryGates);
  const shortestGate = gates.reduce((prev, curr) => (prev[1].waitTimeMinutes < curr[1].waitTimeMinutes ? prev : curr));

  return (
    <>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Event Sync AI</h1>
          <p style={{ color: 'var(--text-muted)' }}>Proactive intelligence & live event coordination</p>
        </div>
        <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock size={20} color="var(--secondary)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
            <strong>{data.timing.status}</strong> ({data.timing.openingTime} - {data.timing.closingTime})
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard 
          title="Live Seating" 
          value={`${((data.seats.filled / data.seats.total) * 100).toFixed(1)}%`} 
          subtitle={`${data.seats.filled.toLocaleString()} / ${data.seats.total.toLocaleString()} Filled`}
          icon={Users}
          status="good"
        />
        <StatCard 
          title="Ticket Collection" 
          value={data.tickets.scanned.toLocaleString()} 
          subtitle={`${data.tickets.remaining.toLocaleString()} remaining`}
          icon={Ticket}
          status="neutral"
        />
        <StatCard 
          title="Food Court" 
          value={`${data.foodCourt.waitTimeMinutes}m Wait`} 
          subtitle={data.foodCourt.isOpen ? `${data.foodCourt.activeStations} buffets active` : 'Closed'}
          icon={Utensils}
          status={data.foodCourt.waitTimeMinutes > 20 ? 'danger' : data.foodCourt.waitTimeMinutes > 10 ? 'warning' : 'good'}
        />
        <StatCard 
          title="Security" 
          value={`Threat: ${data.security.threatLevel}`} 
          subtitle={`${data.security.activeGuards} guards active`}
          icon={ShieldAlert}
          status={data.security.threatLevel === 'High' ? 'danger' : 'good'}
        />
        <StatCard 
          title="Fastest Gate" 
          value={shortestGate[0]} 
          subtitle={`${shortestGate[1].waitTimeMinutes} mins wait`}
          icon={DoorOpen}
          status="good"
        />
        <StatCard 
          title="Washrooms" 
          value="Monitored" 
          subtitle={`${Object.entries(data.washrooms).filter(w => w[1].requiresMaintenance).length} need maintenance`}
          icon={Droplets}
          status={Object.entries(data.washrooms).some(w => w[1].requiresMaintenance) ? 'warning' : 'good'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <section>
          <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Interactive AI Concierge
          </h2>
          <SmartAssistant stadiumContext={data} />
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarDays size={24} color="var(--primary)" />
            Event Schedule
          </h2>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.activeEvents.map((evt) => (
              <div key={evt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{evt.name}</h3>
                    <span style={{ 
                      fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '1rem', textTransform: 'uppercase',
                      background: evt.status === 'Live' ? 'var(--accent)' : 'var(--surface-hover)',
                      color: evt.status === 'Live' ? '#fff' : 'var(--text-muted)'
                    }}>
                      {evt.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {evt.type} • {evt.date} @ {evt.time}
                  </div>
                </div>
                {evt.status === 'Live' && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{evt.attendeesCount.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attendees</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
