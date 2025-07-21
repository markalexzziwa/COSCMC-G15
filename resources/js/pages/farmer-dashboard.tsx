import { useState } from 'react';
import { FarmStatsCard } from '@/components/farm-stats-card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
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

// Replace HarvestDetailsCard with an editable table-like form for harvest details
function HarvestDetailsTable() {
  const initialSections = [
    {
      heading: 'Basic Farm Information',
      fields: [
        { label: 'Farm name/location', value: '' },
        { label: 'Harvest date(s)', value: '' },
        { label: 'Field/block identification', value: '' },
        { label: 'Weather conditions during harvest', value: '' },
      ],
    },
    {
      heading: 'Harvesting Data',
      fields: [
        { label: 'Total harvested area', value: '' },
        { label: 'Number of bunches harvested', value: '' },
        { label: 'Average bunch weight (kg)', value: '' },
        { label: 'Total FFB yield', value: '' },
        { label: 'Harvesting method', value: '' },
        { label: 'Harvesting team details', value: '' },
      ],
    },
    {
      heading: 'Fruit Quality & Ripeness Assessment',
      fields: [
        { label: 'Ripeness level', value: '' },
        { label: 'Fruit quality grading', value: '' },
        { label: 'Oil content estimation', value: '' },
        { label: 'Presence of pests/diseases', value: '' },
      ],
    },
    {
      heading: 'Post-Harvest Handling',
      fields: [
        { label: 'Transportation method', value: '' },
        { label: 'Time from harvest to processing', value: '' },
        { label: 'Storage conditions', value: '' },
        { label: 'Losses recorded', value: '' },
      ],
    },
    {
      heading: 'Labor & Cost Details',
      fields: [
        { label: 'Labor hours spent', value: '' },
        { label: 'Harvesting cost per ton', value: '' },
        { label: 'Equipment used & maintenance notes', value: '' },
      ],
    },
    {
      heading: 'Observations & Challenges',
      fields: [
        { label: 'Issues faced', value: '' },
        { label: 'Unusual findings', value: '' },
        { label: 'Suggestions for improvement', value: '' },
      ],
    },
    {
      heading: 'Yield Comparison & Trends',
      fields: [
        { label: 'Comparison with previous harvests', value: '' },
        { label: 'Long-term trends', value: '' },
      ],
    },
    {
      heading: 'Additional Notes',
      fields: [
        { label: 'Special treatments applied', value: '' },
        { label: 'Compliance with sustainability/certification standards', value: '' },
      ],
    },
  ];
  const [editMode, setEditMode] = useState(false);
  const [sections, setSections] = useState(initialSections);
  const [tempSections, setTempSections] = useState(initialSections);

  const handleEdit = () => {
    setTempSections(sections);
    setEditMode(true);
  };
  const handleSave = () => {
    setSections(tempSections);
    setEditMode(false);
  };
  const handleCancel = () => {
    setTempSections(sections);
    setEditMode(false);
  };

  const handleFieldChange = (sectionIdx: number, fieldIdx: number, value: string) => {
    setTempSections(prev => prev.map((section, sIdx) =>
      sIdx === sectionIdx
        ? { ...section, fields: section.fields.map((f, fIdx) => fIdx === fieldIdx ? { ...f, value } : f) }
        : section
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-black">Harvest Details</CardTitle>
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
        <div className="space-y-8">
          {sections.map((section, sectionIdx) => (
            <table key={section.heading} className="min-w-full border text-sm bg-white">
              <thead>
                <tr>
                  <th colSpan={2} className="bg-gray-100 text-left py-2 px-4 text-base font-semibold border-b">{section.heading}</th>
                </tr>
              </thead>
              <tbody>
                {(editMode ? tempSections : sections)[sectionIdx].fields.map((field, fieldIdx) => (
                  <tr key={field.label} className="border-b">
                    <td className="py-2 px-4 w-1/3 font-medium">{field.label}</td>
                    <td className="py-2 px-4">
                      {editMode ? (
                        <input
                          type="text"
                          value={tempSections[sectionIdx].fields[fieldIdx].value}
                          onChange={e => handleFieldChange(sectionIdx, fieldIdx, e.target.value)}
                          className="border rounded p-1 w-full"
                        />
                      ) : (
                        <span>{field.value || <span className="text-gray-400">(not set)</span>}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

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

function MarketPricesSummary() {
  // Example price trend data for the graph
  const priceTrendData = [
    { year: '2023', FFB: 700, CPO: 1.5 },
    { year: '2024', FFB: 831, CPO: 1.2 },
    { year: '2025', FFB: 1023, CPO: 1.0 },
  ];
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-green-900 tracking-wide mb-2">Palm Oil Market Prices (Uganda)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <div className="flex-1 flex flex-col justify-center">
            <table className="w-full border text-base mb-6 bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="py-3 px-6 border-b text-left font-bold text-lg">Product</th>
                  <th className="py-3 px-6 border-b text-left font-bold text-lg">Price (UGX/kg)</th>
                  <th className="py-3 px-6 border-b text-left font-bold text-lg">Price (USD/kg)</th>
                  <th className="py-3 px-6 border-b text-left font-bold text-lg">Location/Source</th>
                  <th className="py-3 px-6 border-b text-left font-bold text-lg">Date/Period</th>
                </tr>
              </thead>
              <tbody className="text-lg">
                <tr className="bg-green-50 font-semibold">
                  <td>FFB (farmgate)</td><td className="text-green-800 font-bold">1023</td><td>~0.27</td><td>Kalangala (NOPP)</td><td>Mar 2025</td>
                </tr>
                <tr><td>FFB (farmgate, prev.)</td><td>700–831</td><td></td><td>Uganda</td><td>Dec prev. year</td></tr>
                <tr><td>Palm nuts/kernels</td><td>7,293–11,412</td><td></td><td>Kampala/Jinja (retail)</td><td>Recent</td></tr>
                <tr><td>Crude Palm Oil (import)</td><td>—</td><td>0.28–1.87 (2024)</td><td>Uganda (import)</td><td>2024</td></tr>
                <tr><td>Crude Palm Oil (import)</td><td>—</td><td>0.28–10.80 (2023)</td><td>Uganda (import)</td><td>2023</td></tr>
              </tbody>
            </table>
          </div>
          <div className="flex-1 min-w-[350px] flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={priceTrendData} margin={{ top: 20, right: 40, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 16 }} />
                <YAxis yAxisId="left" label={{ value: 'FFB (UGX/kg)', angle: -90, position: 'insideLeft', fontSize: 14 }} tick={{ fontSize: 16 }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'CPO (USD/kg)', angle: 90, position: 'insideRight', fontSize: 14 }} tick={{ fontSize: 16 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 16 }} />
                <Line yAxisId="left" type="monotone" dataKey="FFB" stroke="#4CAF50" strokeWidth={3} name="FFB (UGX/kg)" dot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="CPO" stroke="#2196F3" strokeWidth={3} name="CPO (USD/kg)" dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="text-xs text-gray-700 mt-6">
          <b>Notes:</b> Prices vary by location, market conditions, and supply chain. Retail prices are much higher than farmgate prices. Crude palm oil import prices have stabilized in recent years. Data sources: National Oil Palm Project, Selina Wamucii, Tridge, The Independent Uganda.
        </div>
      </CardContent>
    </Card>
  );
}

export default function FarmerDashboard() {
  const [showFarmSpec, setShowFarmSpec] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Add state for farmStats
  const [farmStats, setFarmStats] = useState([
    { name: 'Total Farm Area', value: '15 Hectares' },
    { name: 'Number of Palm Trees', value: '2,350' },
    { name: 'Last Harvest Yield', value: '4.8 Tons' },
    { name: 'Growth Stage', value: 'Flowering' },
  ]);
  const [farmStatsTemp, setFarmStatsTemp] = useState(farmStats);

  // Add back showHarvests state
  const [showHarvests, setShowHarvests] = useState(false);

  // Add back calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());
  const [farmActivities, setFarmActivities] = useState<{ id: string; date: string; description: string }[]>(
    JSON.parse(localStorage.getItem('farmActivities') || '[]')
  );
  const [newActivityText, setNewActivityText] = useState('');

  const handleEdit = () => {
    setFarmStatsTemp(farmStats);
    setEditMode(true);
  };
  const handleSave = () => {
    setFarmStats(farmStatsTemp);
    setEditMode(false);
  };
  const handleCancel = () => {
    setFarmStatsTemp(farmStats);
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
              <HarvestDetailsTable />
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
              <FarmStatsCard stats={farmStatsTemp} editMode={editMode} onChange={setFarmStatsTemp} />
              <EquipmentTable />
              <TreeAreaPieChart />
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
                      <div className="text-3xl font-bold text-green-600">2,200 kg</div>
                    ) : (
                      <input
                        type="number"
                        value={farmStatsTemp[0].value.replace(' kg', '')}
                        onChange={e => setFarmStatsTemp(prev => prev.map(stat => stat.name === 'Fresh Fruit Bunches' ? { ...stat, value: `${Number(e.target.value)} kg` } : stat))}
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
                      <div className="text-3xl font-bold text-amber-600">92%</div>
                    ) : (
                      <input
                        type="number"
                        value={farmStatsTemp[1].value.replace('%', '')}
                        onChange={e => setFarmStatsTemp(prev => prev.map(stat => stat.name === 'Extraction Rate' ? { ...stat, value: `${Number(e.target.value)}%` } : stat))}
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
                      <div className="text-3xl font-bold text-purple-600">1,500 kg</div>
                    ) : (
                      <input
                        type="number"
                        value={farmStatsTemp[2].value.replace(' kg', '')}
                        onChange={e => setFarmStatsTemp(prev => prev.map(stat => stat.name === 'CPO Production' ? { ...stat, value: `${Number(e.target.value)} kg` } : stat))}
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
                  onClick={() => setShowCalendar(true)}
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
              
              {/* Market Prices Card */}
              <div className="mt-8">
                <MarketPricesSummary />
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}