'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: { legend: { labels: { color: '#fff' } } },
  scales: {
    x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.08)' } },
    y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.08)' } }
  }
};

export default function ChartSection() {
  const xgData = {
    labels: ['Arsenal', 'Liverpool', 'Man City', 'Tottenham'],
    datasets: [
      { label: 'xG For', data: [1.9, 1.7, 2.3, 1.6], backgroundColor: '#00FF9C' },
      { label: 'xG Against', data: [0.9, 1.1, 0.8, 1.4], backgroundColor: '#334155' }
    ]
  };

  const attackEfficiency = {
    labels: ['MD20', 'MD21', 'MD22', 'MD23', 'MD24'],
    datasets: [{ label: 'Attack Efficiency', data: [0.28, 0.31, 0.36, 0.34, 0.39], borderColor: '#00FF9C' }]
  };

  return (
    <section className="grid lg:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="font-heading text-xl font-bold mb-4">xG Comparison</h3>
        <Bar options={options} data={xgData} />
      </div>
      <div className="card">
        <h3 className="font-heading text-xl font-bold mb-4">Team Attacking Efficiency</h3>
        <Line options={options} data={attackEfficiency} />
      </div>
    </section>
  );
}
