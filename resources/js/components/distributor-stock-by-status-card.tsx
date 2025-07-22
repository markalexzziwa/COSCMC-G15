import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import type { DistributorStock } from './distributor-stock-distribution-card';

export default function DistributorStockByStatusCard({ stock }: { stock: DistributorStock }) {
  // Define thresholds
  const thresholds = {
    cookingOil: 400,
    shampoo: 400,
    margarine: 400,
  };
  // Determine status for each product
  const statusCounts = { 'In Stock': 0, 'Low Stock': 0, 'Out of Stock': 0 };
  const products = [
    { name: 'Cooking Oil', value: stock.cookingOil, threshold: thresholds.cookingOil },
    { name: 'Shampoo', value: stock.shampoo, threshold: thresholds.shampoo },
    { name: 'Soft Margarine', value: stock.margarine, threshold: thresholds.margarine },
  ];
  products.forEach(p => {
    if (p.value === 0) statusCounts['Out of Stock']++;
    else if (p.value <= p.threshold) statusCounts['Low Stock']++;
    else statusCounts['In Stock']++;
  });
  const data = [
    { status: 'In Stock', count: statusCounts['In Stock'] },
    { status: 'Low Stock', count: statusCounts['Low Stock'] },
    { status: 'Out of Stock', count: statusCounts['Out of Stock'] },
  ];
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Stock by Status</h3>
        <p className="mt-1 text-sm text-gray-500">Number of products in each stock status</p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 