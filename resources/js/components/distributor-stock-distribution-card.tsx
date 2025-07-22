import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#eab308', '#10b981', '#3b82f6'];

export interface DistributorStock {
  cookingOil: number;
  shampoo: number;
  margarine: number;
}

export default function DistributorStockDistributionCard({ stock }: { stock: DistributorStock }) {
  const data = [
    { name: 'Cooking Oil', value: stock.cookingOil },
    { name: 'Shampoo', value: stock.shampoo },
    { name: 'Soft Margarine', value: stock.margarine },
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Current Stock Distribution</h3>
        <p className="mt-1 text-sm text-gray-500">Breakdown of current stock for each product</p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 