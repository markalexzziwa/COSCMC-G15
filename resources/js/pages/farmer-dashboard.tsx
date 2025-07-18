import { useState, useEffect } from 'react';
import { FarmStatsCard } from '@/components/farm-stats-card';
import { HarvestSummaryCard } from '@/components/harvest-summary-card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  Cell,
  AreaChart,
  Area
} from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface FarmActivity {
  id: string;
  date: string;
  description: string;
}

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

const inventoryData = [
  { day: 'Mon', stock: 1200, demand: 1000 },
  { day: 'Tue', stock: 900, demand: 1100 },
  { day: 'Wed', stock: 800, demand: 1200 },
  { day: 'Thu', stock: 1100, demand: 1000 },
  { day: 'Fri', stock: 1300, demand: 900 },
  { day: 'Sat', stock: 1500, demand: 800 },
];

export default function FarmerDashboard() {
  const [showHarvests, setShowHarvests] = useState(false);
  const [showFarmSpec, setShowFarmSpec] = useState(false);
  const [message, setMessage] = useState('');
  // Editable values state
  const [freshFruitBunches, setFreshFruitBunches] = useState(2200);
  const [extractionRate, setExtractionRate] = useState(92);
  const [cpoProduction, setCpoProduction] = useState(1500);
  const [editMode, setEditMode] = useState(false);
  const [tempValues, setTempValues] = useState({
    freshFruitBunches: 2200,
    extractionRate: 92,
    cpoProduction: 1500,
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());
  const [farmActivities, setFarmActivities] = useState<FarmActivity[]>(
    JSON.parse(localStorage.getItem('farmActivities') || '[]')
  );
  const [newActivityText, setNewActivityText] = useState('');

  // Save activities to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('farmActivities', JSON.stringify(farmActivities));
  }, [farmActivities]);

  const handleSendMessage = () => {
    // In a real app, this would send to backend
    alert(`Message sent to inventory manager: ${message}`);
    setMessage('');
  };

  const handleEdit = () => {
    setTempValues({
      freshFruitBunches,
      extractionRate,
      cpoProduction,
    });
    setEditMode(true);
  };

  const handleSave = () => {
    setFreshFruitBunches(Number(tempValues.freshFruitBunches));
    setExtractionRate(Number(tempValues.extractionRate));
    setCpoProduction(Number(tempValues.cpoProduction));
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  return (
    <AppLayout>
      <Head title="Palm Oil Farmer Dashboard" />

      {showHarvests ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-white min-h-screen">
          <div className="flex items-center p-4 border-b">
            <button onClick={() => setShowHarvests(false)} className="text-2xl text-gray-700 hover:text-black mr-4">
              ←
            </button>
            <h2 className="text-2xl font-bold text-center flex-1">Harvest Details</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-6xl mx-auto">
              <HarvestSummaryCard />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Monthly Production</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={harvestData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="freshFruitBunches" fill="#4CAF50" name="Fresh Fruit Bunches" />
                        <Bar dataKey="crudePalmOil" fill="#FFC107" name="Crude Palm Oil" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Extraction Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={oilYieldData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[70, 100]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="extractionRate" 
                          stroke="#2196F3" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      ) : showFarmSpec ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-white min-h-screen">
          <div className="flex items-center p-4 border-b">
            <button onClick={() => setShowFarmSpec(false)} className="text-2xl text-gray-700 hover:text-black mr-4">
              ←
            </button>
            <h2 className="text-2xl font-bold text-center flex-1">Farm Specifications</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-6xl mx-auto">
              <FarmStatsCard />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Plantation Area</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Mature Trees', value: 65 },
                            { name: 'Young Trees', value: 20 },
                            { name: 'New Plantings', value: 15 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                        >
                          <Cell fill="#4CAF50" />
                          <Cell fill="#FFC107" />
                          <Cell fill="#9C27B0" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Production Forecast</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jul', forecast: 2300, target: 2400 },
                          { month: 'Aug', forecast: 2500, target: 2500 },
                          { month: 'Sep', forecast: 2700, target: 2600 },
                          { month: 'Oct', forecast: 2900, target: 2700 },
                          { month: 'Nov', forecast: 3100, target: 2800 },
                          { month: 'Dec', forecast: 3400, target: 3000 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="forecast" stroke="#FF5722" strokeWidth={2} name="Forecast" />
                        <Line type="monotone" dataKey="target" stroke="#607D8B" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      ) : showCalendar ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-white min-h-screen">
          <div className="flex items-center p-4 border-b">
            <button onClick={() => setShowCalendar(false)} className="text-2xl text-gray-700 hover:text-black mr-4">
              ←
            </button>
            <h2 className="text-2xl font-bold text-center flex-1">Farm Calendar</h2>
          </div>
          <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
            <div className="max-w-4xl w-full">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold mb-4">Select a Date</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar 
                    onChange={(value) => {
                      if (value instanceof Date) {
                        setDate(value);
                      }
                    }}
                    value={date}
                  />
                </CardContent>
              </Card>

              <Card className="mt-8 p-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold mb-4">Activities for {date.toDateString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  {farmActivities.filter(activity => activity.date === date.toDateString()).length > 0 ? (
                    <ul className="space-y-2 mb-4">
                      {farmActivities.filter(activity => activity.date === date.toDateString()).map(activity => (
                        <li key={activity.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span>{activity.description}</span>
                          <button 
                            onClick={() => setFarmActivities(prev => prev.filter(a => a.id !== activity.id))}
                            className="text-red-500 hover:text-red-700 ml-4"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 mb-4">No activities scheduled for this date.</p>
                  )}
                  <div className="flex items-center space-x-2 mt-4">
                    <input
                      type="text"
                      value={newActivityText}
                      onChange={(e) => setNewActivityText(e.target.value)}
                      placeholder="Add new activity..."
                      className="flex-1 p-2 border rounded"
                    />
                    <button 
                      onClick={() => {
                        if (newActivityText.trim()) {
                          setFarmActivities(prev => [
                            ...prev,
                            {
                              id: Date.now().toString(),
                              date: date.toDateString(),
                              description: newActivityText.trim(),
                            },
                          ]);
                          setNewActivityText('');
                        }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Add Activity
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 bg-blue-50">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex justify-end mb-4">
              {!editMode ? (
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Edit Values
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Overview Cards */}
              <div className="h-full">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-emerald-100 h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-green-800">Fresh Fruit Bunches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!editMode ? (
                      <div className="text-3xl font-bold text-green-600">{freshFruitBunches.toLocaleString()} kg</div>
                    ) : (
                      <input
                        type="number"
                        value={tempValues.freshFruitBunches}
                        onChange={e => setTempValues(v => ({ ...v, freshFruitBunches: Number(e.target.value) }))}
                        className="text-3xl font-bold text-green-600 bg-white border-b border-green-300 focus:outline-none w-32 mb-2"
                      />
                    )}
                    <p className="text-sm text-gray-500 mt-2">+15% from last month</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="h-full">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-amber-800">Extraction Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!editMode ? (
                      <div className="text-3xl font-bold text-amber-600">{extractionRate}%</div>
                    ) : (
                      <input
                        type="number"
                        value={tempValues.extractionRate}
                        onChange={e => setTempValues(v => ({ ...v, extractionRate: Number(e.target.value) }))}
                        className="text-3xl font-bold text-amber-600 bg-white border-b border-amber-300 focus:outline-none w-20 mb-2"
                        min={0}
                        max={100}
                      />
                    )}
                    <p className="text-sm text-gray-500 mt-2">+5% from last season</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="h-full">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-indigo-50 h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-purple-800">CPO Production</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!editMode ? (
                      <div className="text-3xl font-bold text-purple-600">{cpoProduction.toLocaleString()} kg</div>
                    ) : (
                      <input
                        type="number"
                        value={tempValues.cpoProduction}
                        onChange={e => setTempValues(v => ({ ...v, cpoProduction: Number(e.target.value) }))}
                        className="text-3xl font-bold text-purple-600 bg-white border-b border-purple-300 focus:outline-none w-32 mb-2"
                      />
                    )}
                    <p className="text-sm text-gray-500 mt-2">+18% from last quarter</p>
                  </CardContent>
                </Card>
              </div>

              {/* Harvest Volume Chart */}
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Monthly Production (kg)</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={harvestData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="freshFruitBunches" fill="#4CAF50" name="Fresh Fruit Bunches" />
                        <Bar dataKey="crudePalmOil" fill="#FFC107" name="Crude Palm Oil" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Inventory Communication Card */}
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Inventory Status</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64 flex flex-col">
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={inventoryData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="stock" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.2} name="Stock" />
                          <Area type="monotone" dataKey="demand" stroke="#FF5722" fill="#FF5722" fillOpacity={0.2} name="Demand" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Message inventory manager..."
                          className="flex-1 p-2 border rounded"
                        />
                        <button 
                          onClick={handleSendMessage}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Oil Yield Trend */}
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Extraction Rate Trend (%)</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={oilYieldData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[70, 100]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="extractionRate" 
                          stroke="#2196F3" 
                          strokeWidth={2} 
                          name="Extraction Rate"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Action Cards */}
              <div>
                <Card 
                  onClick={() => setShowHarvests(true)} 
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 h-full flex flex-col justify-center cursor-pointer hover:shadow-xl transition"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-blue-800">Harvest Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">View detailed harvest records and analytics</p>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card 
                  onClick={() => setShowFarmSpec(true)} 
                  className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-lg p-6 h-full flex flex-col justify-center cursor-pointer hover:shadow-xl transition"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-green-800">Farm Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">View your farm details and specifications</p>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card 
                  onClick={() => {
                    setShowCalendar(true);
                  }}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 h-full flex flex-col justify-center cursor-pointer hover:shadow-xl transition"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-purple-800">Farm Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">View and manage farm activities</p>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card 
                  onClick={() => window.location.href = '/analytics'} 
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 h-full flex flex-col justify-center cursor-pointer hover:shadow-xl transition"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-purple-800">Market Prices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Check current palm oil market prices</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}