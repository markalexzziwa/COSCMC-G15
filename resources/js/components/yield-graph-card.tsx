import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';

// Example data, replace with real harvest data as needed
const data = {
  labels: ['2024-07-01', '2024-07-02', '2024-07-03', '2024-07-04', '2024-07-05', '2024-07-06', '2024-07-07'],
  datasets: [
    {
      label: 'Harvest (kg)',
      data: [400, 300, 200, 278, 189, 239, 349],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderRadius: 6,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: '#000' },
    },
    x: {
      ticks: { color: '#000' },
    },
  },
};

export function YieldGraphCard() {
  return (
    <Card className="bg-white/80 rounded-xl shadow-lg p-6 backdrop-blur-md h-full flex flex-col justify-center">
      <CardHeader>
        <CardTitle className="text-xl font-bold mb-4">Yield Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
