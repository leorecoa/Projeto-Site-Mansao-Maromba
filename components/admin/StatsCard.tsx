import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string; // e.g., 'text-green-400'
}

export default function StatsCard({ title, value, icon: Icon, color }: Props) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-white/10 flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-zinc-800`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
