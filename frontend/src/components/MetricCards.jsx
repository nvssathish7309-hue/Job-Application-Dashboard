import React from 'react';
import { Users, UserCheck, Calendar, Trophy, UserX } from 'lucide-react';

export default function MetricCards({ candidates, activeFilter, onSelectFilter }) {
  const total = candidates.length;
  const shortlisted = candidates.filter(c => c.status === 'Shortlisted').length;
  const interview = candidates.filter(c => c.status === 'Interview Scheduled').length;
  const selected = candidates.filter(c => c.status === 'Selected').length;
  const rejected = candidates.filter(c => c.status === 'Rejected').length;

  const cards = [
    {
      id: 'All',
      label: 'TOTAL CANDIDATES',
      count: total,
      icon: Users,
      color: 'indigo',
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-600',
      activeRing: 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/40'
    },
    {
      id: 'Shortlisted',
      label: 'SHORTLISTED',
      count: shortlisted,
      icon: UserCheck,
      color: 'blue',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-600',
      activeRing: 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/40'
    },
    {
      id: 'Interview Scheduled',
      label: 'INTERVIEW SCHEDULED',
      count: interview,
      icon: Calendar,
      color: 'amber',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-600',
      activeRing: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/40'
    },
    {
      id: 'Selected',
      label: 'SELECTED',
      count: selected,
      icon: Trophy,
      color: 'emerald',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-600',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/40'
    },
    {
      id: 'Rejected',
      label: 'REJECTED',
      count: rejected,
      icon: UserX,
      color: 'rose',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-600',
      activeRing: 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/40'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onSelectFilter(card.id)}
            className={`relative p-5 rounded-2xl border transition-all text-left group hover:shadow-lg ${
              isActive 
                ? card.activeRing 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl ${card.badgeBg} ${card.badgeText} transition-transform group-hover:scale-110`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.count}
              </span>
              {isActive && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                  Active
                </span>
              )}
            </div>

            <div className="mt-2 w-full bg-slate-100 rounded-full h-1 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  card.id === 'All' ? 'bg-indigo-500' :
                  card.id === 'Shortlisted' ? 'bg-blue-500' :
                  card.id === 'Interview Scheduled' ? 'bg-amber-500' :
                  card.id === 'Selected' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${total > 0 ? (card.count / total) * 100 : 0}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
