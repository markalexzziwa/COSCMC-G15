import { useEffect, useState } from 'react';
import { FarmStatsCard } from '@/components/farm-stats-card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Sample data for the charts
const harvestData = [
  { month: 'Jan', freshFruitBunches: 1200, crudePalmOil: 900 },
  { month: 'Feb', freshFruitBunches: 1900, crudePalmOil: 1200 },
  { month: 'Mar', freshFruitBunches: 1500, crudePalmOil: 1000 },
  { month: 'Apr', freshFruitBunches: 1800, crudePalmOil: 1100 },
  { month: 'May', freshFruitBunches: 2100, crudePalmOil: 1400 },
  { month: 'Jun', freshFruitBunches: 2200, crudePalmOil: 1500 },
];

const oilYieldData = [
  { month: 'Jan', extractionRate: 78 },
  { month: 'Feb', extractionRate: 82 },
  { month: 'Mar', extractionRate: 85 },
  { month: 'Apr', extractionRate: 88 },
  { month: 'May', extractionRate: 90 },
  { month: 'Jun', extractionRate: 92 },
];

// Remove all code related to HarvestDetailsTable, Farm Specifications, and Farm Calendar cards/components, including their state, handlers, and conditional rendering.

function EquipmentTable() {
  const initialEquipment = [
    { type: 'Tractor', number: '' },
    { type: 'Transportation Truck', number: '' },
  ];
  const [editMode, setEditMode] = useState(false);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [tempEquipment, setTempEquipment] = useState(initialEquipment);

  const handleEdit = () => {
    setTempEquipment(equipment);
    setEditMode(true);
  };
  const handleSave = () => {
    setEquipment(tempEquipment);
    setEditMode(false);
  };
  const handleCancel = () => {
    setTempEquipment(equipment);
    setEditMode(false);
  };
  const handleChange = (idx: number, value: string) => {
    setTempEquipment(prev => prev.map((row, i) => i === idx ? { ...row, number: value } : row));
  };
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-black">Farm Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          {!editMode ? (
            <button onClick={handleEdit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Edit</button>
          ) : (
            <>
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mr-2">Save</button>
              <button onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition">Cancel</button>
            </>
          )}
        </div>
        <table className="min-w-full border text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Equipment Type</th>
              <th className="py-2 px-4 border-b text-left">Number</th>
            </tr>
          </thead>
          <tbody>
            {(editMode ? tempEquipment : equipment).map((row, idx) => (
              <tr key={row.type} className="border-b">
                <td className="py-2 px-4 font-medium">{row.type}</td>
                <td className="py-2 px-4">
                  {editMode ? (
                    <input
                      type="number"
                      value={tempEquipment[idx].number}
                      onChange={e => handleChange(idx, e.target.value)}
                      className="border rounded p-1 w-24"
                    />
                  ) : (
                    <span>{row.number || <span className="text-gray-400">(not set)</span>}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function TreeAreaPieChart() {
  const initialData = [
    { name: 'Mature Trees', value: 65 },
    { name: 'Young Trees', value: 20 },
    { name: 'New Plantings', value: 15 },
  ];
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState(initialData);
  const [tempData, setTempData] = useState(initialData);
  const handleEdit = () => {
    setTempData(data);
    setEditMode(true);
  };
  const handleSave = () => {
    setData(tempData);
    setEditMode(false);
  };
  const handleCancel = () => {
    setTempData(data);
    setEditMode(false);
  };
  const handleChange = (idx: number, value: string) => {
    setTempData(prev => prev.map((row, i) => i === idx ? { ...row, value: Number(value) } : row));
  };
  const COLORS = ['#4CAF50', '#FFC107', '#9C27B0'];
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-black">Tree Area by Growth Stage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          {!editMode ? (
            <button onClick={handleEdit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Edit</button>
          ) : (
            <>
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mr-2">Save</button>
              <button onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition">Cancel</button>
            </>
          )}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <PieChart width={300} height={300}>
              <Pie
                data={editMode ? tempData : data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
              >
                {(editMode ? tempData : data).map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="w-full md:w-1/2">
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Growth Stage</th>
                  <th className="py-2 px-4 border-b text-left">Area (%)</th>
                </tr>
              </thead>
              <tbody>
                {(editMode ? tempData : data).map((row, idx) => (
                  <tr key={row.name} className="border-b">
                    <td className="py-2 px-4 font-medium">{row.name}</td>
                    <td className="py-2 px-4">
                      {editMode ? (
                        <input
                          type="number"
                          value={tempData[idx].value}
                          onChange={e => handleChange(idx, e.target.value)}
                          className="border rounded p-1 w-24"
                        />
                      ) : (
                        <span>{row.value}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FarmerDashboard() {
  const [harvestDataForm, setHarvestDataForm] = useState({
    farmName: '',
    harvestDate: '',
    weather: '',
    totalHarvestedArea: '',
    palmBatches: '',
    coconutBatches: '',
    harvestMethod: '',
    machines: '',
    transportMethod: '',
    timeSpent: '',
    numberOfWorkers: '',
    improvementSuggestions: '',
    generalComment: '',
  });

  // Load saved data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('harvestDataForm');
      if (saved) {
        setHarvestDataForm(JSON.parse(saved));
      }
    }
  }, []);

  // Save handler
  const handleSaveHarvestData = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('harvestDataForm', JSON.stringify(harvestDataForm));
    }
  };

  // Add state for farmSpecsForm: { farmSize: string, location: string, ownerName: string, soilType: string }
  const [farmSpecsForm, setFarmSpecsForm] = useState({
    farmSize: '',
    location: '',
    ownerName: '',
    soilType: '',
    numberOfTractors: '',
    numberOfTrailers: '',
    numberOfPalmOilTrees: '',
    numberOfCoconutTrees: '',
    areaOfPalmOilTrees: '',
    areaOfCoconutTrees: '',
  });
  // Load saved farm specs on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('farmSpecsForm');
      if (saved) {
        setFarmSpecsForm(JSON.parse(saved));
      }
    }
  }, []);
  // Save handler
  const handleSaveFarmSpecs = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmSpecsForm', JSON.stringify(farmSpecsForm));
    }
  };

  // In the 'oip' card, remove the LineChart and replace it with an input field for monthly production (kg), with a Save button. Persist the value in localStorage.
  // Add state for monthlyProduction and load/save from localStorage.
  const [monthlyProduction, setMonthlyProduction] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('monthlyProduction');
      if (saved) setMonthlyProduction(saved);
    }
  }, []);
  const handleSaveMonthlyProduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('monthlyProduction', monthlyProduction);
    }
  };

  // Add state for editableHarvestData, initialized from localStorage or default data
  const defaultHarvestData = [
    { month: 'Jan', freshFruitBunches: 1200, crudePalmOil: 900 },
    { month: 'Feb', freshFruitBunches: 1900, crudePalmOil: 1200 },
    { month: 'Mar', freshFruitBunches: 1500, crudePalmOil: 1000 },
    { month: 'Apr', freshFruitBunches: 1800, crudePalmOil: 1100 },
    { month: 'May', freshFruitBunches: 2100, crudePalmOil: 1400 },
    { month: 'Jun', freshFruitBunches: 2200, crudePalmOil: 1500 },
  ];
  const [editableHarvestData, setEditableHarvestData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('editableHarvestData');
      if (saved) return JSON.parse(saved);
    }
    return defaultHarvestData;
  });
  // Update handleHarvestDataChange and the form map to use explicit types
  const handleHarvestDataChange = (idx: number, field: string, value: string) => {
    setEditableHarvestData((prev: any) => prev.map((row: any, i: any) => i === idx ? { ...row, [field]: field === 'month' ? value : Number(value) } : row));
  };
  const handleSaveEditableHarvestData = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('editableHarvestData', JSON.stringify(editableHarvestData));
    }
  };

  // Add state for selectedMonthIdx
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);

  // Both avgCPO and avgCoconutOil should be calculated from the last six months of editableHarvestData, using the correct keys.
  const lastSix = editableHarvestData.slice(-6);
  const avgCPO = lastSix.length > 0 ? Math.round(lastSix.reduce((sum: number, row: any) => sum + (row.crudePalmOil || 0), 0) / lastSix.length) : 0;
  const avgCoconutOil = lastSix.length > 0 ? Math.round(lastSix.reduce((sum: number, row: any) => sum + (row.coconutOil || 0), 0) / lastSix.length) : 0;

  // Add state for inventoryOrders in the farmer dashboard
  const [inventoryOrders, setInventoryOrders] = useState<any[]>([]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedInventoryOrders = localStorage.getItem('inventoryOrders');
      if (savedInventoryOrders) setInventoryOrders(JSON.parse(savedInventoryOrders));
    }
  }, []);

  // Calculate number of inventory raw material orders to be delivered today
  const today = new Date().toISOString().split('T')[0];
  const ordersForToday = inventoryOrders.filter(order => order.deliveryDate === today);
  const ordersForTodayCount = ordersForToday.length;

  return (
    <AppLayout>
      <Head title="Palm Oil Farmer Dashboard" />

        <div className="py-12 bg-blue-50">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Overview Cards */}
              <div className="h-full">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-emerald-100 h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-green-800">Today's Raw Material<br/>needed Deliveries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{ordersForTodayCount}</div>
                    <p className="text-sm text-gray-500 mt-2">Inventory raw material orders to be delivered today</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="h-full">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-amber-800">Average Monthly Palm Oil Production</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="text-3xl font-bold text-amber-600">{avgCPO} litres</div>
                    <p className="text-sm text-gray-500 mt-2">Average monthly production (litres)</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="h-full">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-indigo-50 h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-purple-800">Average Monthly Coconut Oil</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="text-3xl font-bold text-purple-600">{avgCoconutOil} litres</div>
                    <p className="text-sm text-gray-500 mt-2">Average monthly production (litres)</p>
                  </CardContent>
                </Card>
              </div>

              {/* Harvest Volume Chart */}
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Monthly Production (litres)</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={editableHarvestData.slice(-6)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis label={{ value: 'Monthly Production (litres)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="coconutOil" fill="#4CAF50" name="Coconut Oil" />
                        <Bar dataKey="crudePalmOil" fill="#2196F3" name="Crude Palm Oil" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Oil Yield Trend */}
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Edit Monthly Oil Production</CardTitle>
                    <p className="text-gray-600">Update the monthly production values for Coconut Oil and Crude Palm Oil below.</p>
                  </CardHeader>
                  <CardContent className="h-64">
                    <form onSubmit={handleSaveEditableHarvestData} className="space-y-4 w-full max-w-md mx-auto">
                      <div className="mb-4">
                        <label className="font-medium text-gray-700 mr-2">Select Month:</label>
                        <select
                          className="border rounded p-2"
                          value={selectedMonthIdx}
                          onChange={e => setSelectedMonthIdx(Number(e.target.value))}
                        >
                          {editableHarvestData.map((row: any, idx: number) => (
                            <option key={idx} value={idx}>{row.month}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center w-full justify-between">
                        <label className="font-medium text-gray-700 w-auto text-left">Coconut Oil (litres)</label>
                        <input type="number" className="border rounded p-2 w-40 text-right" value={editableHarvestData[selectedMonthIdx].coconutOil} onChange={e => handleHarvestDataChange(selectedMonthIdx, 'coconutOil', e.target.value)} placeholder="Litres" />
                      </div>
                      <div className="flex items-center w-full justify-between">
                        <label className="font-medium text-gray-700 w-auto text-left">Crude Palm Oil (litres)</label>
                        <input type="number" className="border rounded p-2 w-40 text-right" value={editableHarvestData[selectedMonthIdx].crudePalmOil} onChange={e => handleHarvestDataChange(selectedMonthIdx, 'crudePalmOil', e.target.value)} placeholder="Litres" />
                      </div>
                      <div className="flex justify-end mt-6">
                        <button type="submit" className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-2 rounded-lg shadow hover:from-blue-600 hover:to-green-600 transition font-semibold text-lg">Save</button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Action Cards */}
              <div>
                <Card 
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 h-full flex flex-col justify-center cursor-pointer hover:shadow-xl transition"
                >
                  <CardHeader>
                  <CardTitle className="text-xl font-bold text-blue-800">Harvest Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                  <p className="text-gray-600">View and manage detailed harvest records, check below 👇</p>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card 
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 h-full flex flex-col justify-center cursor-pointer hover:shadow-xl transition"
                >
                  <CardHeader>
                  <CardTitle className="text-xl font-bold text-purple-800">Farm Specs</CardTitle>
                  </CardHeader>
                  <CardContent>
                  <p className="text-gray-600">View and manage farm specifications, check below 👇</p>
                  </CardContent>
                </Card>
              </div>
            <div className="col-span-full w-full">
              <Card className="w-full">
                  <CardHeader>
                  <CardTitle className="text-xl font-bold text-blue-900">Harvest Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                  <form className="space-y-4 w-full max-w-2xl mx-auto" onSubmit={handleSaveHarvestData}>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Farm Name</label>
                      <input
                        type="text"
                        className="border rounded p-2 w-auto flex-1 ml-4 text-right"
                        value={harvestDataForm.farmName}
                        onChange={e => setHarvestDataForm(f => ({ ...f, farmName: e.target.value }))}
                        placeholder="Enter farm name"
                      />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Harvest Date</label>
                      <input
                        type="date"
                        className="border rounded p-2 w-auto flex-1 ml-4 text-right"
                        value={harvestDataForm.harvestDate}
                        onChange={e => setHarvestDataForm(f => ({ ...f, harvestDate: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Weather at Harvest</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.weather} onChange={e => setHarvestDataForm(f => ({ ...f, weather: e.target.value }))} placeholder="e.g. Sunny, Rainy" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Total Harvested Area</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.totalHarvestedArea} onChange={e => setHarvestDataForm(f => ({ ...f, totalHarvestedArea: e.target.value }))} placeholder="e.g. 5 acres" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Number of Batches Harvested (Palm Oil)</label>
                      <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.palmBatches} onChange={e => setHarvestDataForm(f => ({ ...f, palmBatches: e.target.value }))} placeholder="e.g. 10" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Number of Batches Harvested (Coconut)</label>
                      <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.coconutBatches} onChange={e => setHarvestDataForm(f => ({ ...f, coconutBatches: e.target.value }))} placeholder="e.g. 8" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Harvest Method</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.harvestMethod} onChange={e => setHarvestDataForm(f => ({ ...f, harvestMethod: e.target.value }))} placeholder="e.g. Manual, Mechanical" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Machines (if any)</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.machines} onChange={e => setHarvestDataForm(f => ({ ...f, machines: e.target.value }))} placeholder="e.g. Tractor, Harvester" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Transport Method</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.transportMethod} onChange={e => setHarvestDataForm(f => ({ ...f, transportMethod: e.target.value }))} placeholder="e.g. Truck, Cart" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Time Spent</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.timeSpent} onChange={e => setHarvestDataForm(f => ({ ...f, timeSpent: e.target.value }))} placeholder="e.g. 4 hours" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Number of Workers</label>
                      <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.numberOfWorkers} onChange={e => setHarvestDataForm(f => ({ ...f, numberOfWorkers: e.target.value }))} placeholder="e.g. 5" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Improvement Suggestions</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.improvementSuggestions} onChange={e => setHarvestDataForm(f => ({ ...f, improvementSuggestions: e.target.value }))} placeholder="Your suggestions..." />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Harvest General Comment</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.generalComment} onChange={e => setHarvestDataForm(f => ({ ...f, generalComment: e.target.value }))} placeholder="Any comments..." />
                    </div>
                    <div className="flex justify-end mt-6">
                      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Save</button>
                    </div>
                  </form>
                  </CardContent>
                </Card>
              </div>
            <div className="col-span-full w-full">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-green-900">Farm Specs</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4 w-full max-w-2xl mx-auto" onSubmit={handleSaveFarmSpecs}>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Farm Size</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.farmSize} onChange={e => setFarmSpecsForm(f => ({ ...f, farmSize: e.target.value }))} placeholder="e.g. 10 acres" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Location</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.location} onChange={e => setFarmSpecsForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Kalangala" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Owner Name</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.ownerName} onChange={e => setFarmSpecsForm(f => ({ ...f, ownerName: e.target.value }))} placeholder="e.g. John Doe" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Soil Type</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.soilType} onChange={e => setFarmSpecsForm(f => ({ ...f, soilType: e.target.value }))} placeholder="e.g. Loamy" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Number of Tractors</label>
                      <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.numberOfTractors} onChange={e => setFarmSpecsForm(f => ({ ...f, numberOfTractors: e.target.value }))} placeholder="e.g. 2" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Number of Trailers</label>
                      <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.numberOfTrailers} onChange={e => setFarmSpecsForm(f => ({ ...f, numberOfTrailers: e.target.value }))} placeholder="e.g. 1" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Number of Palm Oil Trees</label>
                      <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.numberOfPalmOilTrees} onChange={e => setFarmSpecsForm(f => ({ ...f, numberOfPalmOilTrees: e.target.value }))} placeholder="e.g. 1000" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Number of Coconut Trees</label>
                      <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.numberOfCoconutTrees} onChange={e => setFarmSpecsForm(f => ({ ...f, numberOfCoconutTrees: e.target.value }))} placeholder="e.g. 500" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Area of Palm Oil Trees</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.areaOfPalmOilTrees} onChange={e => setFarmSpecsForm(f => ({ ...f, areaOfPalmOilTrees: e.target.value }))} placeholder="e.g. 5 acres" />
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <label className="font-medium text-gray-700 w-auto text-left">Area of Coconut Trees</label>
                      <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.areaOfCoconutTrees} onChange={e => setFarmSpecsForm(f => ({ ...f, areaOfCoconutTrees: e.target.value }))} placeholder="e.g. 3 acres" />
                    </div>
                    <div className="flex justify-end mt-6">
                      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Save</button>
              </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Render the Inventory Raw Material Order card below the main dashboard grid */}
      <div className="col-span-full w-full mt-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Inventory Raw Material Order</CardTitle>
            <CardDescription>Orders placed for raw materials from farms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No farm orders placed yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {inventoryOrders
                    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((order: any) => (
                      <div key={order.id} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-800">
                              Farm Order #{order.id.slice(-6)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(order.timestamp).toLocaleDateString()} at {new Date(order.timestamp).toLocaleTimeString()}
                            </p>
                            {order.deliveryDate && (
                              <p className="text-sm text-blue-600">
                                Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Palm Oil:</span>
                            <span className="ml-2 text-blue-600 font-semibold">
                              {order.palmOilQuantity}L
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Coconut Oil:</span>
                            <span className="ml-2 text-blue-600 font-semibold">
                              {order.coconutOilQuantity}L
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
        </div>
      )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}