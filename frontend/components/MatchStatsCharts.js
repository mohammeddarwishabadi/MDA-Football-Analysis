'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MatchStatsCharts({ post }) {
  const teams = post.teams || ['Home', 'Away'];
  const stats = post.stats || {};

  const parsePair = (value) => {
    if (!value || typeof value !== 'string') return [0, 0];
    return value.split('-').map((v) => Number(v.replace('%', '').trim()) || 0);
  };

  const [xg1, xg2] = parsePair(stats.xG || post.xg || '0-0');
  const [s1, s2] = parsePair(stats.shots || post.shots || '0-0');
  const [p1, p2] = parsePair(stats.possession || post.possession || '0-0');

  const data = {
    labels: ['xG', 'Shots', 'Possession'],
    datasets: [
      { label: teams[0], data: [xg1, s1, p1], backgroundColor: '#00FF9C' },
      { label: teams[1], data: [xg2, s2, p2], backgroundColor: '#334155' }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { labels: { color: '#fff' } } },
    scales: {
      x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.08)' } },
      y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.08)' } }
    }
  };

  return (
    <div className="card">
      <h3 className="font-heading text-xl font-bold mb-4">Match Statistics Charts</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
