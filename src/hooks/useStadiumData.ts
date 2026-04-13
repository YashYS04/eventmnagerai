import { useState, useEffect } from 'react';

export interface StadiumData {
  seats: { total: number; filled: number; vacant: number };
  foodCourt: { isOpen: boolean; waitTimeMinutes: number; activeStations: number };
  entryGates: { [key: string]: { waitTimeMinutes: number; open: boolean } };
  security: { threatLevel: 'Low' | 'Medium' | 'High'; activeGuards: number };
  tickets: { scanned: number; remaining: number };
  washrooms: { [key: string]: { cleanLevel: number; requiresMaintenance: boolean } };
  timing: { openingTime: string; closingTime: string; status: 'Open' | 'Closed' | 'Preparing' };
  activeEvents: Array<{ id: number; name: string; type: string; date: string; time: string; status: string; attendeesCount: number }>;
}

export function useStadiumData() {
  const [data, setData] = useState<StadiumData>({
    seats: { total: 50000, filled: 12000, vacant: 38000 },
    foodCourt: { isOpen: true, waitTimeMinutes: 15, activeStations: 8 },
    entryGates: {
      'Gate A': { waitTimeMinutes: 5, open: true },
      'Gate B': { waitTimeMinutes: 25, open: true },
      'Gate C': { waitTimeMinutes: 2, open: true },
    },
    security: { threatLevel: 'Low', activeGuards: 120 },
    tickets: { scanned: 12000, remaining: 38000 },
    washrooms: {
      'North Block': { cleanLevel: 90, requiresMaintenance: false },
      'South Block': { cleanLevel: 45, requiresMaintenance: true },
      'VIP Section': { cleanLevel: 100, requiresMaintenance: false },
    },
    timing: { openingTime: '16:00', closingTime: '23:30', status: 'Open' },
    activeEvents: [
      { id: 1, name: 'T20 Cricket Finals', type: 'Sports', date: new Date().toISOString().split('T')[0], time: '18:00', status: 'Live', attendeesCount: 12000 },
      { id: 2, name: 'Global Tech Awards Ceremony', type: 'Ceremony', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '19:30', status: 'Upcoming', attendeesCount: 0 },
      { id: 3, name: 'National Political Rally', type: 'Political', date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], time: '14:00', status: 'Scheduled', attendeesCount: 0 },
      { id: 4, name: 'The Weeknd - Stadium Tour', type: 'Concert', date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], time: '20:00', status: 'Scheduled', attendeesCount: 0 }
    ]
  });

  // Simulate real-time dynamic updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newScanned = prev.tickets.scanned + Math.floor(Math.random() * 50);
        const newFilledSeats = prev.seats.filled + Math.floor(Math.random() * 45);
        return {
          ...prev,
          seats: { ...prev.seats, filled: newFilledSeats, vacant: prev.seats.total - newFilledSeats },
          tickets: { ...prev.tickets, scanned: newScanned, remaining: prev.seats.total - newScanned },
          foodCourt: {
            ...prev.foodCourt,
            waitTimeMinutes: Math.max(0, prev.foodCourt.waitTimeMinutes + Math.floor(Math.random() * 5) - 2),
          },
          entryGates: {
            'Gate A': { ...prev.entryGates['Gate A'], waitTimeMinutes: Math.max(0, prev.entryGates['Gate A'].waitTimeMinutes + Math.floor(Math.random() * 3) - 1) },
            'Gate B': { ...prev.entryGates['Gate B'], waitTimeMinutes: Math.max(0, prev.entryGates['Gate B'].waitTimeMinutes + Math.floor(Math.random() * 5) - 2) },
            'Gate C': { ...prev.entryGates['Gate C'], waitTimeMinutes: Math.max(0, prev.entryGates['Gate C'].waitTimeMinutes + Math.floor(Math.random() * 2) - 1) },
          },
          activeEvents: prev.activeEvents.map(evt => 
            evt.status === 'Live' ? { ...evt, attendeesCount: newFilledSeats } : evt
          )
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return data;
}
