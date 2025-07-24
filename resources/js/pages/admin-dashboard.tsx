import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Link } from '@inertiajs/react'
import { Home as HomeIcon, FileText, ChevronDown, ThumbsUp, ThumbsDown, Check, Users, Plus } from 'lucide-react'
import { Icon } from '@/components/icon'
import { useForm, router } from '@inertiajs/react';
import axios from 'axios';
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

    const handleViewClick = async (file: { name: string; url: string }) => {
        setSelectedPdf(file);
        setShowFormData(true);
        setShowVendorStatus(true);
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
                setRejectedVendors((rejPrev) => {
                    const rejUpdated = rejPrev.filter((n) => n !== username);
                    localStorage.setItem('rejectedVendors', JSON.stringify(rejUpdated));
                    return rejUpdated;
                });
                localStorage.setItem('acceptedVendors', JSON.stringify(updated));
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
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 4000)
        return () => clearTimeout(timer)
    }, [])

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
        localStorage.setItem('acceptedVendors', JSON.stringify(acceptedVendors));
    }, [acceptedVendors]);
    useEffect(() => {
        localStorage.setItem('rejectedVendors', JSON.stringify(rejectedVendors));
    }, [rejectedVendors]);

    type TaskRow = { name: string; contact: string; department: string; task: string };

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            {isVisible && (
                <div className="fixed top-6 right-6 z-50">
                    <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in-out">
                        <span className="font-medium">You're logged in as an Admin!</span>
                    </div>
                </div>
            )}
            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center py-4">
                        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">Admin Dashboard</h1>
                        <p className="mt-2 text-md text-gray-800">Approve vendors and track system operations</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Vendor Applications Card - Compact */}
                        <Card className="relative shadow-md border border-blue-200 hover:shadow-lg transition-shadow">
                            <CardHeader className="p-4">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-700" />
                                    <CardTitle className="text-lg font-semibold">Vendor Applications</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="mb-3 text-sm text-gray-600">View and download vendor application PDFs</div>
                                <button
                                    className="px-4 py-1 text-sm rounded bg-white text-green-700 font-medium shadow hover:bg-green-50 transition-colors flex items-center gap-1"
                                    onClick={() => setShowApplications(v => !v)}
                                >
                                    {showApplications ? 'Hide' : 'View'}
                                    <ChevronDown className={`transition-transform duration-200 ${showApplications ? 'rotate-180' : ''} w-4 h-4`} />
                                </button>
                            </CardContent>
                        </Card>

                        {/* Workforce Card - Compact */}
                        <Card className="relative shadow-md border border-blue-200 hover:shadow-lg transition-shadow">
                            <CardHeader className="p-4">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-700" />
                                    <CardTitle className="text-lg font-semibold">Workforce Tasks</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="mb-3 text-sm text-gray-600">Assign work to company personnel</div>
                                <div className="flex gap-2">
                                    <button
                                        className="flex items-center gap-1 px-3 py-1 text-sm rounded bg-white text-blue-700 font-medium shadow hover:bg-blue-50"
                                        onClick={handleShowAssign}
                                    >
                                        <Plus className="w-4 h-4" /> Assign
                                    </button>
                                    <button
                                        className="px-3 py-1 text-sm rounded bg-blue-600 text-white font-medium shadow hover:bg-blue-700"
                                        onClick={handleShowView}
                                    >
                                        View
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tables Section */}
                    {showAssignTaskTable && !showApplications && (
                        <div className="mt-4 bg-white rounded-lg shadow border border-gray-200 p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Assign Task</h2>
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2">Name</th>
                                        <th className="p-2">Contact</th>
                                        <th className="p-2">Department</th>
                                        <th className="p-2">Task</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                className="w-full p-1 border rounded"
                                                value={taskRows[0].name}
                                                onChange={e => handleTaskInputChange(0, 'name', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                className="w-full p-1 border rounded"
                                                value={taskRows[0].contact}
                                                onChange={e => handleTaskInputChange(0, 'contact', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                className="w-full p-1 border rounded"
                                                value={taskRows[0].department}
                                                onChange={e => handleTaskInputChange(0, 'department', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                className="w-full p-1 border rounded"
                                                value={taskRows[0].task}
                                                onChange={e => handleTaskInputChange(0, 'task', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button
                                className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                                onClick={handleSaveTaskRow}
                            >
                                Save Task
                            </button>
                        </div>
                    )}

                    {showApplications && (
                        <div className="mt-4 bg-white rounded-lg shadow border border-gray-200 p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Vendor Applications</h2>
                            {pdfFiles.length === 0 ? (
                                <div className="text-gray-500 text-sm">No applications available</div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2 text-left">Username</th>
                                            <th className="p-2 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pdfFiles.map((file, idx) => {
                                            const username = file.name.replace(/\.pdf$/i, '');
                                            const isViewed = acceptedVendors.includes(username) || rejectedVendors.includes(username);
                                            return (
                                                <tr key={file.name} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                    <td className="p-2 text-left">{username}</td>
                                                    <td className="p-2 text-right">
                                                        {isViewed ? (
                                                            <button
                                                                className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs flex items-center gap-1 float-right"
                                                                onClick={() => handleViewClick(file)}
                                                            >
                                                                <Check className="w-3 h-3" /> Viewed
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs float-right"
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
                            )}
                        </div>
                    )}

                    {showViewTasksTable && (
                        <div className="mt-4 bg-white rounded-lg shadow border border-gray-200 p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Saved Tasks</h2>
                            {savedTasks.length === 0 ? (
                                <div className="text-gray-500 text-sm">No tasks saved yet</div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2">Name</th>
                                            <th className="p-2">Contact</th>
                                            <th className="p-2">Department</th>
                                            <th className="p-2">Task</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {savedTasks.map((row: TaskRow, idx: number) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                <td className="p-2">{row.name}</td>
                                                <td className="p-2">{row.contact}</td>
                                                <td className="p-2">{row.department}</td>
                                                <td className="p-2">{row.task}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* Status Cards - Compact */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* Accepted Vendors Card */}
                        <Card className="shadow-md border border-green-200">
                            <CardHeader className="p-4">
                                <div className="flex items-center gap-2">
                                    <ThumbsUp className="w-5 h-5 text-green-700" />
                                    <CardTitle className="text-lg font-semibold">Accepted Vendors</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                {acceptedVendors.length > 0 ? (
                                    <ul className="text-sm space-y-1">
                                        {acceptedVendors.map((name) => (
                                            <li key={name} className="flex justify-between">
                                                <span>{name}</span>
                                                {acceptedVendorDates[name] && (
                                                    <span className="text-xs text-green-700">{acceptedVendorDates[name]} 10:10am</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-sm text-gray-500">No accepted vendors</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Rejected Vendors Card */}
                        <Card className="shadow-md border border-red-200">
                            <CardHeader className="p-4">
                                <div className="flex items-center gap-2">
                                    <ThumbsDown className="w-5 h-5 text-red-700" />
                                    <CardTitle className="text-lg font-semibold">Rejected Vendors</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                {rejectedVendors.length > 0 ? (
                                    <ul className="text-sm space-y-1">
                                        {rejectedVendors.map((name) => (
                                            <li key={name}>{name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-sm text-gray-500">No rejected vendors</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Clear Lists Card */}
                        <Card className="shadow-md border border-gray-200">
                            <CardHeader className="p-4">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-blue-700" />
                                    <CardTitle className="text-lg font-semibold">Clear Lists</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <button
                                    className="w-full px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                                    onClick={() => {
                                        setAcceptedVendors([]);
                                        setRejectedVendors([]);
                                        setAcceptedVendorDates({});
                                    }}
                                >
                                    Clear All
                                </button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Dialog remains unchanged */}
            <Dialog open={showVendorStatus} onOpenChange={setShowVendorStatus}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Vendor Application Status</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-center text-green-700 font-medium">
                        The vendor passed all requirements to become a vendor.
                    </div>
                    <div className="flex justify-center gap-4">
                        <button
                            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                            onClick={handleAccept}
                        >
                            Accept
                        </button>
                        <button
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            onClick={handleReject}
                        >
                            Reject
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}