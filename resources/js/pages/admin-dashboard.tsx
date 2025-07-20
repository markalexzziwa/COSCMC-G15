import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Link } from '@inertiajs/react'
import { Home as HomeIcon, FileText, ChevronDown, ThumbsUp, ThumbsDown, Check, Users, Plus } from 'lucide-react'
import { Icon } from '@/components/icon'
import { useForm, router } from '@inertiajs/react';
import axios from 'axios'; // You may need to install axios
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Vendor {
    id: number;
    name: string;
    is_approved: boolean;
}

export default function AdminDashboard({ vendors = [] }: { vendors: Vendor[] }) {
    const [isVisible, setIsVisible] = useState(true)
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState<null | { name: string; url: string }>(null);
    const [showFormData, setShowFormData] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [pdfFiles, setPdfFiles] = useState<{ name: string; url: string; size: number; lastModified: number }[]>([]);
    const [showApplications, setShowApplications] = useState(false);
    const [showVendorStatus, setShowVendorStatus] = useState(false);
    const [acceptedVendors, setAcceptedVendors] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('acceptedVendors');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [rejectedVendors, setRejectedVendors] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('rejectedVendors');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [acceptedVendorDates, setAcceptedVendorDates] = useState<{ [username: string]: string }>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('acceptedVendorDates');
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });
    const [showAssignTaskTable, setShowAssignTaskTable] = useState(false);
    const [showViewTasksTable, setShowViewTasksTable] = useState(false);
    const [taskRows, setTaskRows] = useState([
        { name: '', contact: '', department: '', task: '' }
    ]);
    const [savedTasks, setSavedTasks] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('workforceTasks');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const handleTaskInputChange = (idx: number, field: string, value: string) => {
        setTaskRows(rows => rows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
    };

    const handleSaveTaskRow = () => {
        const row = taskRows[0];
        if (!row.name && !row.contact && !row.department && !row.task) return;
        const updated = [...savedTasks, row];
        setSavedTasks(updated);
        localStorage.setItem('workforceTasks', JSON.stringify(updated));
        setTaskRows([{ name: '', contact: '', department: '', task: '' }]);
    };

    const handleShowAssign = () => {
        setShowAssignTaskTable(true);
        setShowViewTasksTable(false);
    };
    const handleShowView = () => {
        setShowViewTasksTable(true);
        setShowAssignTaskTable(false);
    };

    // Mocked PDF list; replace with API call or prop as needed
    // const pdfFiles = [
    //     { name: 'markalexzziwa.pdf', url: '/javaserver/applicationupload/markalexzziwa.pdf' },
    //     // Add more files as needed
    // ];

    const handleViewClick = async (file: { name: string; url: string }) => {
        setSelectedPdf(file);
        setShowFormData(true);
        setShowVendorStatus(true); // Open modal directly
        const jsonName = file.name.replace(/\.pdf$/i, '.json');
        try {
            const res = await fetch(`/javaserver/applicationupload/${jsonName}`);
            if (res.ok) {
                const data = await res.json();
                setFormData(data);
            } else {
                setFormData(null);
            }
        } catch {
            setFormData(null);
        }
    };

    // Add approve handler
    const handleApprove = async (uploaderId: number) => {
        await axios.post(`/admin/vendors/${uploaderId}/approve`);
        window.location.reload();
    };

    const handleAccept = () => {
        if (selectedPdf) {
            const username = selectedPdf.name.replace(/\.pdf$/i, '');
            setAcceptedVendors((prev) => {
                let updated = prev;
                if (!prev.includes(username)) {
                    updated = [...prev, username];
                }
                // Remove from rejected if present
                setRejectedVendors((rejPrev) => {
                    const rejUpdated = rejPrev.filter((n) => n !== username);
                    localStorage.setItem('rejectedVendors', JSON.stringify(rejUpdated));
                    return rejUpdated;
                });
                localStorage.setItem('acceptedVendors', JSON.stringify(updated));
                // Set visit date
                setAcceptedVendorDates((dates) => {
                    if (dates[username]) return dates;
                    const today = new Date();
                    const daysToAdd = username.length;
                    const visitDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysToAdd);
                    const visitDateStr = visitDate.toISOString().split('T')[0];
                    const newDates = { ...dates, [username]: visitDateStr };
                    localStorage.setItem('acceptedVendorDates', JSON.stringify(newDates));
                    return newDates;
                });
                return updated;
            });
        }
        setShowVendorStatus(false);
    };

    const handleReject = () => {
        if (selectedPdf) {
            const username = selectedPdf.name.replace(/\.pdf$/i, '');
            setRejectedVendors((prev) => {
                let updated = prev;
                if (!prev.includes(username)) {
                    updated = [...prev, username];
                }
                // Remove from accepted if present
                setAcceptedVendors((accPrev) => {
                    const accUpdated = accPrev.filter((n) => n !== username);
                    localStorage.setItem('acceptedVendors', JSON.stringify(accUpdated));
                    return accUpdated;
                });
                localStorage.setItem('rejectedVendors', JSON.stringify(updated));
                return updated;
            });
        }
        setShowVendorStatus(false);
    };

    useEffect(() => {
        // Hide notification after 4 seconds
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 4000)
        return () => clearTimeout(timer)
    }, [])

    // Fetch PDF list on mount
    useEffect(() => {
        fetch('http://localhost:8080/api/pdflist')
            .then(res => res.json())
            .then((files: { name: string; size: number; lastModified: number }[]) => {
                setPdfFiles(files.map(f => ({
                    ...f,
                    url: `/javaserver/applicationupload/${f.name}`
                })));
            });
    }, []);

    useEffect(() => {
        // Sync acceptedVendors to localStorage if it changes (for cases where setAcceptedVendors is called elsewhere)
        localStorage.setItem('acceptedVendors', JSON.stringify(acceptedVendors));
    }, [acceptedVendors]);
    useEffect(() => {
        localStorage.setItem('rejectedVendors', JSON.stringify(rejectedVendors));
    }, [rejectedVendors]);

    type TaskRow = { name: string; contact: string; department: string; task: string };

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            {/* Notification (top-right corner) */}
            {isVisible && (
                <div className="fixed top-6 right-6 z-50">
                    <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in-out">
                        <span className="font-medium">You're logged in as an Admin!</span>
                    </div>
                </div>
            )}
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="text-center py-7">
                        <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">Admin Dashboard</h1>
                        <p className="mt-2 text-lg text-gray-800">approve vendors and track the system operations</p>
                        </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Vendor Applications Card */}
                        <Card
                            className="relative overflow-hidden group shadow-lg border-2 border-purple-600 bg-blue-50 text-black-900 transition-transform transform hover:scale-105 cursor-pointer"
                        >
                            <CardHeader className="flex flex-col items-center justify-center gap-4 pt-8 pb-4">
                                <div className="flex items-center gap-3 w-full justify-center">
                                    <span className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-2xl font-bold text-black-900 drop-shadow-lg shrink-0">
                                        <FileText className="w-8 h-8 text-black-900" />
                                    </span>
                                    <CardTitle className="text-2xl font-bold text-black-900 drop-shadow flex items-center">Vendor Applications</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center pb-8">
                                <div className="mb-6 text-lg text-black-900/90 text-center">View and download vendor application PDFs.</div>
                                <button
                                    className="px-6 py-2 rounded-lg bg-white text-green-700 font-semibold shadow hover:bg-green-100 transition-colors flex items-center gap-2"
                                    onClick={() => setShowApplications(v => !v)}
                                >
                                    {showApplications ? 'Hide Applications' : 'View Applications'}
                                    <ChevronDown className={`transition-transform duration-200 ${showApplications ? 'rotate-180' : ''}`} />
                                </button>
                            </CardContent>
                            <div className="absolute right-0 bottom-0 opacity-30 pointer-events-none select-none">
                                <span className="w-32 h-32 bg-yellow-200 rounded-full flex items-center justify-center text-6xl font-bold text-black-900">
                                    <FileText className="w-24 h-24 text-black-900 opacity-40" />
                                </span>
                            </div>
                        </Card>
                        {/* Workforce Card - move this up to be second */}
                        <Card className="relative overflow-hidden group shadow-lg border-2 border-purple-600 bg-blue-50 text-black-900 transition-transform transform hover:scale-105">
                            <CardHeader className="flex flex-col items-center justify-center gap-4 pt-8 pb-4">
                                <div className="flex items-center gap-3 w-full justify-center">
                                    <span className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-2xl font-bold text-black-900 drop-shadow-lg shrink-0">
                                        <Users className="w-8 h-8 text-black-900 opacity-40" />
                                    </span>
                                    <CardTitle className="text-2xl font-bold text-black-900 drop-shadow flex items-center">Workforce Task Assignments</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center pb-8">
                                <div className="mb-6 text-lg text-black-900/90 text-center">Assign work to company personels</div>
                                <div className="flex gap-4">
                                    <button
                                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-blue-700 font-semibold shadow hover:bg-blue-100 transition-colors"
                                        onClick={() => {
                                            if (showAssignTaskTable) {
                                                setShowAssignTaskTable(false);
                                            } else {
                                                setShowAssignTaskTable(true);
                                                setShowViewTasksTable(false);
                                            }
                                        }}
                                    >
                                        <Plus className="w-5 h-5" /> {showAssignTaskTable ? 'Hide Assign Table' : 'Assign Task'}
                                    </button>
                                    <button
                                        className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                                        onClick={() => {
                                            if (showViewTasksTable) {
                                                setShowViewTasksTable(false);
                                            } else {
                                                setShowViewTasksTable(true);
                                                setShowAssignTaskTable(false);
                                            }
                                        }}
                                    >
                                        {showViewTasksTable ? 'Hide View Table' : 'View Tasks'}
                                    </button>
                                </div>
                            </CardContent>
                            <div className="absolute right-0 bottom-0 opacity-30 pointer-events-none select-none">
                                <span className="w-32 h-32 bg-yellow-200 rounded-full flex items-center justify-center text-6xl font-bold text-black-900">
                                    <Users className="w-24 h-24 text-black-900 opacity-40" />
                                </span>
                            </div>
                        </Card>
                        {/* Assign Task Table - shown below the card */}
                        {showAssignTaskTable && !showApplications && (
                            <div className="col-span-1 md:col-span-2 mt-0">
                                <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 mb-8">
                                    <h2 className="text-2xl font-bold text-blue-700 mb-4">Assign Task to Personnel</h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-left text-sm rounded-lg overflow-hidden">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white">
                                                    <th className="py-3 px-4 font-semibold">Name</th>
                                                    <th className="py-3 px-4 font-semibold">Contact</th>
                                                    <th className="py-3 px-4 font-semibold">Department</th>
                                                    <th className="py-3 px-4 font-semibold">Assigned Task</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-gray-100 bg-gray-100">
                                                    <td className="py-2 px-4">
                                                        <input
                                                            type="text"
                                                            className="w-full rounded border px-2 py-1 text-gray-800"
                                                            placeholder="Name"
                                                            value={taskRows[0].name}
                                                            onChange={e => handleTaskInputChange(0, 'name', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <input
                                                            type="text"
                                                            className="w-full rounded border px-2 py-1 text-gray-800"
                                                            placeholder="Contact"
                                                            value={taskRows[0].contact}
                                                            onChange={e => handleTaskInputChange(0, 'contact', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <input
                                                            type="text"
                                                            className="w-full rounded border px-2 py-1 text-gray-800"
                                                            placeholder="Department"
                                                            value={taskRows[0].department}
                                                            onChange={e => handleTaskInputChange(0, 'department', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <input
                                                            type="text"
                                                            className="w-full rounded border px-2 py-1 text-gray-800"
                                                            placeholder="Assigned Task"
                                                            value={taskRows[0].task}
                                                            onChange={e => handleTaskInputChange(0, 'task', e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <button
                                            className="mt-4 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                                            onClick={handleSaveTaskRow}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showApplications && (
                            <div className="col-span-1 md:col-span-2 mt-0">
                                {/* Vendor Applications Table content here, full width */}
                                <div className="bg-orange-100/60 backdrop-blur-md rounded-xl shadow-lg border border-orange-200 p-6 mb-8">
                                    <h2 className="text-2xl font-bold text-blue-700 mb-4">Vendor Application PDFs</h2>
                                    {pdfFiles.length === 0 ? (
                                        <div className="text-gray-500">No applications available.</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-left text-sm rounded-lg overflow-hidden">
                                                <thead>
                                                    <tr className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white">
                                                        <th className="py-3 px-4 font-semibold">Username</th>
                                                        <th className="py-3 px-4 font-semibold">Feedback</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pdfFiles.map((file, idx) => {
                                                        const username = file.name.replace(/\.pdf$/i, '');
                                                        const isViewed = acceptedVendors.includes(username) || rejectedVendors.includes(username);
                                                        return (
                                                            <tr key={file.name} className={
                                                                `border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-200' : 'bg-white'} hover:bg-blue-50 transition-colors`
                                                            }>
                                                                <td className="py-3 px-4">{username}</td>
                                                                <td className="py-3 px-4">
                                                                    {isViewed ? (
                                                                        <button
                                                                            className="px-3 py-1 rounded bg-green-600 text-white font-semibold flex items-center gap-1"
                                                                            onClick={() => handleViewClick(file)}
                                                                        >
                                                                            <Check className="w-4 h-4" /> Viewed
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="px-3 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-700 transition-colors"
                                                                            onClick={() => handleViewClick(file)}
                                                                        >
                                                                            View
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {showViewTasksTable && (
                            <div className="col-span-1 md:col-span-2 mt-0">
                                <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 mb-8">
                                    <h2 className="text-2xl font-bold text-blue-700 mb-4">Saved Tasks</h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-left text-sm rounded-lg overflow-hidden">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white">
                                                    <th className="py-3 px-4 font-semibold">Name</th>
                                                    <th className="py-3 px-4 font-semibold">Contact</th>
                                                    <th className="py-3 px-4 font-semibold">Department</th>
                                                    <th className="py-3 px-4 font-semibold">Assigned Task</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {savedTasks.length === 0 ? (
                                                    <tr><td colSpan={4} className="py-4 text-center text-gray-500">No tasks saved yet.</td></tr>
                                                ) : (
                                                    (savedTasks as TaskRow[]).map((row: TaskRow, idx: number) => (
                                                        <tr key={idx} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                                                            <td className="py-2 px-4">{row.name}</td>
                                                            <td className="py-2 px-4">{row.contact}</td>
                                                            <td className="py-2 px-4">{row.department}</td>
                                                            <td className="py-2 px-4">{row.task}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        {/* Accepted Vendors Card */}
                        <Card className="relative overflow-hidden group shadow-lg border-2 border-purple-600 bg-blue-50 text-black-900 transition-transform transform hover:scale-105">
                            <CardHeader className="flex flex-col items-center justify-center gap-4 pt-8 pb-4">
                                <div className="flex items-center gap-3 w-full justify-center">
                                    <span className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-2xl font-bold text-black-900 drop-shadow-lg shrink-0">
                                        <ThumbsUp className="w-8 h-8 text-black-900" />
                                    </span>
                                    <CardTitle className="text-2xl font-bold text-black-900 drop-shadow flex items-center">Accepted Vendors</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center pb-8">
                                <div className="mb-6 text-lg text-black-900/90 text-center">The following individuals are required to visit company on the allocated date</div>
                                {acceptedVendors.length > 0 && (
                                    <div className="w-full">
                                        <div className="font-semibold text-black-900 mb-2">Vendors' Usernames and Visit Dates:</div>
                                        <ul className="list-disc list-inside text-black-900">
                                            {acceptedVendors.map((name) => (
                                                <li key={name}>
                                                    {name}
                                                    {acceptedVendorDates[name] && (
                                                        <span className="ml-2 text-pink-900 text-sm font-bold">(Visit Date: {acceptedVendorDates[name]} 10:30am)</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                            <div className="absolute right-0 bottom-0 opacity-30 pointer-events-none select-none">
                                <span className="w-32 h-32 bg-yellow-200 rounded-full flex items-center justify-center text-6xl font-bold text-black-900">
                                    <ThumbsUp className="w-24 h-24 text-black-900 opacity-40" />
                                </span>
                            </div>
                        </Card>
                        {/* Rejected Applications Card */}
                        <Card className="relative overflow-hidden group shadow-lg border-2 border-purple-600 bg-blue-50 text-black-900 transition-transform transform hover:scale-105">
                            <CardHeader className="flex flex-col items-center justify-center gap-4 pt-8 pb-4">
                                <div className="flex items-center gap-3 w-full justify-center">
                                    <span className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-2xl font-bold text-black-900 drop-shadow-lg shrink-0">
                                        <ThumbsDown className="w-8 h-8 text-black-900" />
                                    </span>
                                    <CardTitle className="text-2xl font-bold text-black-900 drop-shadow flex items-center">Rejected Applications</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center pb-8">
                                <div className="mb-6 text-lg text-black-900/90 text-center">This may be as a result of incomplete information. Thank you for showing interest</div>
                                {rejectedVendors.length > 0 && (
                                    <div className="w-full">
                                        <div className="font-semibold text-black-900 mb-2">Unqualified Vendors:</div>
                                        <ul className="list-disc list-inside text-black-900">
                                            {rejectedVendors.map((name) => (
                                                <li key={name}>{name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                            <div className="absolute right-0 bottom-0 opacity-30 pointer-events-none select-none">
                                <span className="w-32 h-32 bg-yellow-200 rounded-full flex items-center justify-center text-6xl font-bold text-black-900">
                                    <ThumbsDown className="w-24 h-24 text-black-900 opacity-40" />
                                </span>
                            </div>
                        </Card>
                        {/* Clear Lists Card */}
                        <Card className="relative overflow-hidden group shadow-lg border-2 border-purple-600 bg-blue-50 text-black-900 transition-transform transform hover:scale-105">
                            <CardHeader className="flex flex-col items-center justify-center gap-4 pt-8 pb-4">
                                <div className="flex items-center gap-3 w-full justify-center">
                                    <span className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-2xl font-bold text-black-900 drop-shadow-lg shrink-0">
                                        <Check className="w-8 h-8 text-black-900" />
                                    </span>
                                    <CardTitle className="text-2xl font-bold text-black-900 drop-shadow flex items-center">Clear Accepted & Rejected Lists</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center pb-8">
                                <div className="mb-6 text-lg text-black-900/90 text-center">Remove all accepted and rejected vendors from the lists.</div>
                                <button
                                    className="px-6 py-2 rounded-lg bg-white text-gray-700 font-semibold shadow hover:bg-gray-200 transition-colors"
                                    onClick={() => {
                                        setAcceptedVendors([]);
                                        setRejectedVendors([]);
                                        setAcceptedVendorDates({});
                                        localStorage.removeItem('acceptedVendors');
                                        localStorage.removeItem('rejectedVendors');
                                        localStorage.removeItem('acceptedVendorDates');
                                    }}
                                >
                                    Clear Lists
                                </button>
                            </CardContent>
                            <div className="absolute right-0 bottom-0 opacity-30 pointer-events-none select-none">
                                <span className="w-32 h-32 bg-yellow-200 rounded-full flex items-center justify-center text-6xl font-bold text-black-900">
                                    <Check className="w-24 h-24 text-black-900 opacity-40" />
                                </span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <Dialog open={showVendorStatus} onOpenChange={setShowVendorStatus}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Vendor Application Status</DialogTitle>
                    </DialogHeader>
                    <div className="py-6 text-lg text-center text-green-700 font-semibold">
                        The vendor passed by the restrictions and has essential requirements to become a vendor.
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                            onClick={handleAccept}
                        >
                            Accept
                        </button>
                        <button
                            className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                            onClick={handleReject}
                        >
                            Reject
                        </button>
                    </div>
                    <DialogFooter>
                        <button
                            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                            onClick={() => setShowVendorStatus(false)}
                        >
                            Close
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
} 