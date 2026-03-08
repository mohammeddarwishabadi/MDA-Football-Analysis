import PageIntro from '@/components/PageIntro';
import ChartSection from '@/components/ChartSection';

export default function DataVizPage() {
  return (
    <div className="space-y-6">
      <PageIntro title="Data Visualization" subtitle="Interactive analytics: xG, attacking efficiency, shot and passing trends" />
      <ChartSection />
      <div className="card text-muted">Shot maps and passing network modules can be uploaded from the admin panel as custom chart assets.</div>
    </div>
  );
}
