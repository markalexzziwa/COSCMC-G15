import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function MarketPrices() {
  return (
    <AppLayout>
      <Head title="Market Prices" />
      <div className="py-12 bg-blue-50">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Current Palm Oil Market Prices</h1>
          <div className="bg-white rounded shadow p-6">
            <p className="text-xl">Crude Palm Oil: <span className="font-bold text-green-700">₦350,000/ton</span></p>
            <p className="text-xl mt-4">Fresh Fruit Bunches: <span className="font-bold text-green-700">₦45,000/ton</span></p>
            <p className="text-gray-500 mt-6">*Prices are indicative and may vary by region.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 