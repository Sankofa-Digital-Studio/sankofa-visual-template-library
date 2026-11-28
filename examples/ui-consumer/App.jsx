import { useState } from 'react';
import { Button, Card, OperationalMetricStrip, ProgressBar } from '@sankofa/ui';
import '@sankofa/ui/styles.css';

export default function App() {
  const [reviewed, setReviewed] = useState(2);

  return (
    <Card title="Daily dispatch review">
      <OperationalMetricStrip metrics={[{ id: 'dispatches', label: 'Dispatches reviewed', value: reviewed }]} />
      <ProgressBar label="Daily dispatch review" value={reviewed} max={5} showPercent />
      <Button disabled={reviewed >= 5} onClick={() => setReviewed(reviewed + 1)}>
        Confirm next review
      </Button>
    </Card>
  );
}
