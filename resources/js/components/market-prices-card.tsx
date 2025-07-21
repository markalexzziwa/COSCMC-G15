import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export default function MarketPricesCard() {
  return (
    <Card className="bg-white rounded shadow p-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-green-800">Current Palm Oil Market Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl">Crude Palm Oil: <span className="font-bold text-green-700">₦350,000/ton</span></p>
        <p className="text-xl mt-4">Fresh Fruit Bunches: <span className="font-bold text-green-700">₦45,000/ton</span></p>
        <p className="text-gray-500 mt-6">*Prices are indicative and may vary by region.</p>
      </CardContent>
    </Card>
  );
} 