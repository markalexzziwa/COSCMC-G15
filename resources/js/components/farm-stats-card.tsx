import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface FarmStat {
  name: string;
  value: string;
}

interface FarmStatsCardProps {
  stats: FarmStat[];
  editMode?: boolean;
  onChange?: (newStats: FarmStat[]) => void;
}

export function FarmStatsCard({ stats, editMode = false, onChange }: FarmStatsCardProps) {
  const handleValueChange = (idx: number, value: string) => {
    if (!onChange) return;
    const updated = stats.map((stat, i) => i === idx ? { ...stat, value } : stat);
    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-black">Farm Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {stats.map((stat, idx) => (
            <li key={stat.name} className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              {editMode ? (
                <input
                  type="text"
                  value={stat.value}
                  onChange={e => handleValueChange(idx, e.target.value)}
                  className="border rounded p-1 w-32 text-lg font-semibold"
                />
              ) : (
                <p className="text-lg font-semibold">{stat.value}</p>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 